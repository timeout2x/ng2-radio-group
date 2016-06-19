import {
    Component, Input, Host, Directive, HostBinding, Optional, HostListener, Provider, forwardRef,
    Inject, ViewEncapsulation, ContentChildren
} from "@angular/core";
import {NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, ControlValueAccessor, Control} from "@angular/common";

@Component({
    selector: "checkbox-group",
    template: `<div class="checkbox-group"><ng-content></ng-content></div>`,
    encapsulation: ViewEncapsulation.None,
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

    @Input()
    disabled: boolean = false;

    @Input()
    trackBy: string;
    
    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    @ContentChildren(forwardRef(() => CheckboxItem))
    checkboxItems: CheckboxItem[];

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private model: any;
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

    addValue(value: any) {
        if (!this.hasValue(value))
            this.model.push(value);
    }

    removeValue(value: any) {
        const index = this.model.indexOf(value);
        if (index !== -1)
            this.model.splice(index, 1);
    }

    addOrRemoveValue(value: any) {
        if (this.hasValue(value)) {
            this.removeValue(value);
        } else {
            this.addValue(value);
        }
        this.onChange(this.model);
    }

    hasValue(value: any) {
        if (this.model instanceof Array) {
            if (this.trackBy) {
                return !!this.model.find((i: any) => i[this.trackBy] === value[this.trackBy]);
            } else {
                return this.model.indexOf(value) !== -1;
            }
        } else {
            if (this.trackBy) {
                return this.model[this.trackBy] === value[this.trackBy];
            } else {
                return this.model === value;
            }
        }
    }

    selectAll() {
        if (this.checkboxItems)
            this.checkboxItems.forEach(item => this.addValue(item.value));
    }

    deselectAll() {
        if (this.checkboxItems)
            this.checkboxItems.forEach(item => this.removeValue(item.value));
    }

    isAllSelected() {
        if (this.checkboxItems) {
            let has = true;
            this.checkboxItems.forEach(item => {
                if (has)
                    has = this.hasValue(item.value);
            });
            return has;
        }

        return false;
    }

}

@Component({
    selector: "checkbox-item",
    template: `
<div class="checkbox-item" (click)="toggleCheck()" [class.disabled]="isDisabled()">
    <input class="checkbox-item-input" type="checkbox" [checked]="isChecked()" [disabled]="isDisabled()"/> <ng-content></ng-content>
</div>`,
    encapsulation: ViewEncapsulation.None,
    styles: [`
.checkbox-item {
    cursor: pointer;
}
.checkbox-item.disabled {
    cursor: not-allowed;
}
`]
})
export class CheckboxItem {

    @Input()
    value: any;

    @Input()
    disabled: boolean;

    constructor(@Host() @Inject(forwardRef(() => CheckboxGroup))  private checkboxGroup: CheckboxGroup) {
    }

    toggleCheck() {
        if (this.isDisabled()) return;
        this.checkboxGroup.addOrRemoveValue(this.value);
    }

    isChecked() {
        return this.checkboxGroup.hasValue(this.value);
    }

    isDisabled() {
        return this.disabled === true || this.checkboxGroup.disabled;
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

    constructor(@Optional() @Host() @Inject(forwardRef(() => CheckboxGroup)) private checkboxGroup: CheckboxGroup) {
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