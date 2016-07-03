import {
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
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from "@angular/forms";
import {SelectValueAccessor} from "./SelectValueAccessor";
import {SelectValidator} from "./SelectValidator";
import {RadioGroup} from "./RadioGroup";

@Directive({
    selector: "input[type=radio]",
    providers: [
        SelectValueAccessor,
        SelectValidator,
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectValueAccessor, multi: true },
        { provide: NG_VALIDATORS, useExisting: SelectValidator, multi: true }
    ]
})
export class RadioBox {

    // -------------------------------------------------------------------------
    // Input accessors
    // -------------------------------------------------------------------------

    @Input()
    set required(required: boolean) {
        this.validator.options.required = required;
    }

    get required() {
        return this.validator.options.required;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private element: ElementRef, @Optional() @Host() private radioGroup: RadioGroup,
                private valueAccessor: SelectValueAccessor,
                private validator: SelectValidator) {
    }

    // -------------------------------------------------------------------------
    // Bindings
    // -------------------------------------------------------------------------

    @HostBinding("checked")
    get checked() {
        const element: HTMLInputElement = this.element.nativeElement;
        const valueAccessor = this.radioGroup ? this.radioGroup.valueAccessor : this.valueAccessor;
        return valueAccessor.model === element.value;
    }

    @HostListener("click")
    check() {
        const element: HTMLInputElement = this.element.nativeElement;
        const valueAccessor = this.radioGroup ? this.radioGroup.valueAccessor : this.valueAccessor;
        valueAccessor.set(element.value);
    }
    
}