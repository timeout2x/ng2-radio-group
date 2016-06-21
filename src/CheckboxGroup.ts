import {
    Component, Input, Host, Directive, HostBinding, Optional, HostListener, Provider, forwardRef,
    Inject, ViewEncapsulation, ContentChildren
} from "@angular/core";
import {NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, ControlValueAccessor, Control} from "@angular/common";

@Component({
    selector: "checkbox-group",
    template: `<ng-content></ng-content>`,
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
    readonly: boolean = false;

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

        if (!this.hasValue(value)) {
            if (!this.model)
                this.model = [];
            
            this.model.push(value);
            this.onChange(this.model);
        }
    }

    removeValue(value: any) {
        const index = this.model.indexOf(value);
        if (index !== -1) {
            this.model.splice(index, 1);
            this.onChange(this.model);
        }
    }

    addOrRemoveValue(value: any) {
        if (this.hasValue(value)) {
            this.removeValue(value);
        } else {
            this.addValue(value);
        }
    }

    hasValue(value: any) {
        // todo: duplication with tags input
        if (this.model instanceof Array) {
            if (this.trackBy) {
                return !!this.model.find((i: any) => i[this.trackBy] === value[this.trackBy]);
            } else {
                return this.model.indexOf(value) !== -1;
            }
        } else if (this.model !== null && this.model !== undefined) {
            if (this.trackBy) {
                return this.model[this.trackBy] === value[this.trackBy];
            } else {
                return this.model === value;
            }
        }
        
        return false;
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
<div (click)="toggleCheck()"
     [class.disabled]="isDisabled()"
     [class.readonly]="isReadonly()"
     class="checkbox-item" >
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
.checkbox-item.readonly {
    cursor: default;
}
`]
})
export class CheckboxItem {

    @Input()
    value: any;

    @Input()
    disabled: boolean = false;

    @Input()
    readonly: boolean = false;

    constructor(@Host() @Inject(forwardRef(() => CheckboxGroup))  private checkboxGroup: CheckboxGroup) {
    }

    toggleCheck() {
        if (this.isReadonly() || this.isDisabled()) return;
        this.checkboxGroup.addOrRemoveValue(this.value);
    }

    isChecked() {
        return this.checkboxGroup.hasValue(this.value);
    }

    isDisabled() {
        return this.disabled === true || this.checkboxGroup.disabled;
    }

    isReadonly() {
        return this.readonly || this.checkboxGroup.readonly;
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
        if (!this.model)
            this.model = [];

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
        // this.writeValue(this.model);
        this.onChange(this.model);
    }

}