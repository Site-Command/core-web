import { Component, Prop, State, Element, Event, EventEmitter } from '@stencil/core';
import { DotKeyValueField } from '../../../models';

const DEFAULT_VALUE = { key: '', value: '' };

@Component({
    tag: 'key-value-form',
    styleUrl: 'key-value-form.scss'
})
export class DotKeyValueComponent {
    @Element() el: HTMLElement;

    /** (optional) Disables all form interaction */
    @Prop({ reflectToAttr: true }) disabled = false;

    /** (optional) Label for the add item button */
    @Prop({
        reflectToAttr: true
    })
    addButtonLabel = 'Add';

    /** (optional) Placeholder for the key input text */
    @Prop({
        reflectToAttr: true
    })
    keyPlaceholder = '';

    /** (optional) Placeholder for the value input text */
    @Prop({
        reflectToAttr: true
    })
    valuePlaceholder = '';

    /** (optional) The string to use in the key input label */
    @Prop({
        reflectToAttr: true
    })
    keyLabel = 'Key';

    /** (optional) The string to use in the value input label */
    @Prop({
        reflectToAttr: true
    })
    valueLabel = 'Value';

    /** Emit the added value, key/value pair */
    @Event() add: EventEmitter<DotKeyValueField>;

    @State() inputs: DotKeyValueField = { ...DEFAULT_VALUE };

    render() {
        const buttonDisabled = this.isButtonDisabled();
        return (
            <form onSubmit={this.addKey.bind(this)}>
                <label>
                    {this.keyLabel}
                    <input
                        disabled={this.disabled}
                        name="key"
                        onInput={(event: Event) => this.setValue(event)}
                        placeholder={this.keyPlaceholder}
                        type="text"
                        value={this.inputs.key}
                    />
                </label>
                <label>
                    {this.valueLabel}
                    <input
                        disabled={this.disabled}
                        name="value"
                        onInput={(event: Event) => this.setValue(event)}
                        placeholder={this.valuePlaceholder}
                        type="text"
                        value={this.inputs.value}
                    />
                </label>
                <button
                    class="key-value-form__save__button"
                    type="submit"
                    disabled={buttonDisabled}
                >
                    {this.addButtonLabel}
                </button>
            </form>
        );
    }

    private isButtonDisabled(): boolean {
        return !this.isFormValid() || (this.disabled || null);
    }

    private isFormValid(): boolean {
        return !!(this.inputs.key.length && this.inputs.value.length);
    }

    private setValue(event: Event): void {
        event.stopImmediatePropagation();

        const target = event.target as HTMLInputElement;
        this.inputs = {
            ...this.inputs,
            [target.name]: target.value.toString()
        };
    }

    private addKey(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (this.inputs.key && this.inputs.value) {
            this.add.emit(this.inputs);
            this.clearForm();
            this.focusKeyInputField();
        }
    }

    private clearForm(): void {
        this.inputs = { ...DEFAULT_VALUE };
    }

    private focusKeyInputField(): void {
        const input: HTMLInputElement = this.el.querySelector('input[name="key"]');
        input.focus();
    }
}
