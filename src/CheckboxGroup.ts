import {Component, Input, Host, Directive, HostBinding, Optional, HostListener, Provider, forwardRef} from "@angular/core";
import {NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, ControlValueAccessor, Control} from "@angular/common";

@Component({
    selector: "checkbox-group",
    template: `<div class="checkbox-group"><ng-content></ng-content></div>`,
    providers: [
        new Provider(NG_VALUE_ACCESSOR, {
            useExisting: forwardRef(() => CheckboxGroup),
            multi: true
        }),
        new Provider(NG_VALIDATORS, {
            useExisting: forwardRef(() => CheckboxGroup),
            multi: true
        })
    ]
})
export class CheckboxGroup implements ControlValueAccessor, Validator {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    required: boolean = false;
    
    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private model: any[];
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------

    writeValue(value: any[]): void {
        this.model = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // -------------------------------------------------------------------------
    // Implemented from Validator
    // -------------------------------------------------------------------------

    validate(c: Control) {
        if (this.required && (!c.value || (c.value instanceof Array) && c.value.length === 0)) {
            return {
                required: true
            };
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    addOrRemoveValue(value: any) {
        if (this.hasValue(value)) {
            this.model.splice(this.model.indexOf(value), 1);
        } else {
            this.model.push(value);
        }
        this.onChange(this.model);
    }

    hasValue(value: any) {
        if (this.model instanceof Array) {
            return this.model.indexOf(value) !== -1;
        } else {
            return this.model === value;
        }
    }

}

@Component({
    selector: "checkbox-item",
    template: `
<div class="checkbox-item" (click)="check()">
    <input class="checkbox-item-input" type="checkbox" [checked]="isChecked()"/> <ng-content></ng-content>
</div>`,
    styles: [`
.checkbox-item {
    cursor: pointer;
}
`]
})
export class CheckboxItem {

    @Input()
    value: any;

    constructor(@Host() private checkboxGroup: CheckboxGroup) {
    }

    check() {
        this.checkboxGroup.addOrRemoveValue(this.value);
    }

    isChecked() {
        return this.checkboxGroup.hasValue(this.value);
    }

}

@Directive({
    selector: "input[type=checkbox]",
    providers: [
        new Provider(NG_VALUE_ACCESSOR, {
            useExisting: forwardRef(() => CheckBox),
            multi: true
        }),
        new Provider(NG_VALIDATORS, {
            useExisting: forwardRef(() => CheckBox),
            multi: true
        })
    ],
})
export class CheckBox implements ControlValueAccessor, Validator {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    value: any = true;

    @Input()
    uncheckedValue: any = false;

    @Input()
    required: boolean = false;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Optional() @Host() private checkboxGroup: CheckboxGroup) {
    }

    // -------------------------------------------------------------------------
    // Bindings
    // -------------------------------------------------------------------------

    @HostBinding("checked")
    get checked() {
        return this.checkboxGroup ? this.checkboxGroup.hasValue(this.value) : this.hasModelValue();
    }

    @HostListener("click")
    check() {
        if (this.checkboxGroup) {
            this.checkboxGroup.addOrRemoveValue(this.value);
        } else {
            this.addOrRemoveValue();
        }
    }

    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------

    writeValue(value: any): void {
        this.model = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // -------------------------------------------------------------------------
    // Implemented from Validator
    // -------------------------------------------------------------------------

    validate(c: Control) {
        if (this.required && (!c.value || (c.value instanceof Array) && c.value.length === 0)) {
            return {
                required: true
            };
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private hasModelValue() {
        if (this.model instanceof Array) {
            return this.model.indexOf(this.value) !== -1;
        } else {
            return this.model === this.value;
        }
    }

    private addOrRemoveValue() {
        if (this.model instanceof Array) {
            if (this.hasModelValue()) {
                this.model.splice(this.model.indexOf(this.value), 1);
            } else {
                this.model.push(this.value);
            }
        } else {
            if (this.model === this.value) {
                this.model = this.uncheckedValue;
            } else {
                this.model = this.value;
            }
        }
        this.onChange(this.model);
    }

}