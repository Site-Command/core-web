import { Component, Input, ViewEncapsulation} from '@angular/core';
import { BaseComponent } from '../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../api/services/messages-service';
import { DragulaService } from 'ng2-dragula';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'content-type-layout',
    styleUrls: ['./content-types-layout.component.scss'],
    templateUrl: 'content-types-layout.component.html'
})

export class ContentTypesLayoutComponent extends BaseComponent {
    @Input() mode: string;

    constructor(messageService: MessageService) {
        super([
            'fields',
            'Permissions',
            'publisher_push_history',
        ], messageService);
    }
}
