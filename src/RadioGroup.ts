import {
    Component,
    Input,
    Host,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Optional,
    Provider,
    forwardRef
} from "@angular/core";
import {Validator, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Control} from "@angular/common";

@Component({
    selector: "radio-group",
    template: `<div class="radio-group"><ng-content></ng-content></div>`,
    providers: [
        new Provider(NG_VALUE_ACCESSOR, {
            useExisting: forwardRef(() => RadioGroup),
            multi: true
        }),
        new Provider(NG_VALIDATORS, {
            useExisting: forwardRef(() => RadioGroup),
            multi: true
        })
    ]
})
export class RadioGroup {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    required: boolean = false;

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    model: any;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

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
    // Public Methods
    // -------------------------------------------------------------------------

    change(value: any) {
        this.model = value;
        this.onChange(this.model);
    }

}

@Component({
    selector: "radio-item",
    template: `
<div class="radio-item" (click)="check()">
    <input class="radio-item-input" type="radio" [checked]="isChecked()" [disabled]="disabled"/> <ng-content></ng-content>
</div>`,
    styles: [`
.radio-item {
    cursor: pointer;
}
`]
})
export class RadioItem {

    @Input()
    value: any;

    @Input()
    disabled: boolean;

    constructor(@Host() private radioGroup: RadioGroup) {
    }

    check() {
        this.radioGroup.change(this.value);
    }

    isChecked() {
        return this.radioGroup.model === this.value;
    }
}

@Directive({
    selector: "input[type=radio]",
    providers: [
        new Provider(NG_VALUE_ACCESSOR, {
            useExisting: forwardRef(() => RadioBox),
            multi: true
        }),
        new Provider(NG_VALIDATORS, {
            useExisting: forwardRef(() => RadioBox),
            multi: true
        })
    ]
})
export class RadioBox implements ControlValueAccessor, Validator {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    required: boolean = false;

    // -------------------------------------------------------------------------
    // Private variables
    // -------------------------------------------------------------------------

    private model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private element: ElementRef, @Optional() @Host() private radioGroup: RadioGroup) {
    }

    // -------------------------------------------------------------------------
    // Bindings
    // -------------------------------------------------------------------------

    @HostBinding("checked")
    get checked() {
        const element: HTMLInputElement = this.element.nativeElement;
        return this.radioGroup ? this.radioGroup.model === element.value : this.model === element.value;
    }

    @HostListener("click")
    check() {
        const element: HTMLInputElement = this.element.nativeElement;
        if (this.radioGroup) {
            this.radioGroup.change(element.value);
        } else {
            this.model = element.value;
            this.onChange(this.model);
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
    
}