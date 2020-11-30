import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { DotContainer } from '@shared/models/container/dot-container.model';
import { DotTemplateItem, DotTemplateStore } from '../store/dot-template.store';
import { DotPortletToolbarActions } from '@models/dot-portlet-toolbar.model/dot-portlet-toolbar-actions.model';

@Component({
    selector: 'dot-template-advanced',
    templateUrl: './dot-template-advanced.component.html',
    styleUrls: ['./dot-template-advanced.scss']
})
export class DotTemplateAdvancedComponent implements OnInit, OnDestroy {
    @Output() save = new EventEmitter<DotTemplateItem>();
    @Output() cancel = new EventEmitter();

    // `any` because the type of the editor in the ngx-monaco-editor package is not typed
    editor: any;
    form: FormGroup;
    actions$: Observable<DotPortletToolbarActions>;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private store: DotTemplateStore, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.store.vm$.pipe(take(1)).subscribe(({ original }) => {
            if (original.type === 'advanced') {
                this.form = this.fb.group({
                    title: original.title,
                    body: original.body,
                    identifier: original.identifier,
                    friendlyName: original.friendlyName
                });
            }
        });

        this.form
            .get('body')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(({ body }: { body: string }) => {
                this.store.updateBody(body);
            });

        this.actions$ = this.store.didTemplateChanged$.pipe(
            map((templateChange: boolean) => this.getActions(!templateChange))
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * This method initializes the monaco editor
     *
     * @param {*} editor
     * @memberof DotTemplateComponent
     */
    initEditor(editor: any): void {
        this.editor = editor;
    }

    /**
     * This method handles the change event of the searchable selector and
     * inserts the container to the editor
     *
     * @param {DotContainer} container
     * @memberof DotTemplateComponent
     */
    containerChange(container: DotContainer): void {
        const selection = this.editor.getSelection();

        const id = this.setContainerId(container);

        const text = `## Container: ${
            container.name
        }\n## This is autogenerated code that cannot be changed\n#parseContainer('${id}','${Date.now()}')\n`;
        const operation = { range: selection, text: text, forceMoveMarkers: true };
        this.editor.executeEdits('source', [operation]);
    }

    private setContainerId({ identifier, parentPermissionable }: DotContainer): string {
        const regex = new RegExp('//' + parentPermissionable.hostname);
        return identifier?.includes(parentPermissionable.hostname)
            ? identifier.replace(regex, '')
            : identifier;
    }

    private getActions(disabled = true): DotPortletToolbarActions {
        return {
            primary: [
                {
                    label: 'Save',
                    disabled: disabled,
                    command: () => {
                        this.save.emit(this.form.value);
                    }
                }
            ],
            cancel: () => {
                this.cancel.emit();
            }
        };
    }
}