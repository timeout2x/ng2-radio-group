import {Component, Input, Provider, forwardRef, ViewEncapsulation, ContentChildren} from "@angular/core";
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from "@angular/forms";
import {SelectValueAccessor} from "./SelectValueAccessor";
import {SelectValidator} from "./SelectValidator";
import {CheckboxItem} from "./CheckboxItem";

@Component({
    selector: "checkbox-group",
    template: `<ng-content></ng-content>`,
    encapsulation: ViewEncapsulation.None,
    providers: [
        SelectValueAccessor,
        SelectValidator,
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectValueAccessor, multi: true },
        { provide: NG_VALIDATORS, useExisting: SelectValidator, multi: true }
    ]
})
export class CheckboxGroup {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    disabled: boolean = false;

    @Input()
    readonly: boolean = false;

    @Input()
    customToggleLogic: (options: { event: MouseEvent, valueAccessor: SelectValueAccessor, value: any }) => void;

    // -------------------------------------------------------------------------
    // Input accessors
    // -------------------------------------------------------------------------

    @Input()
    set trackBy(trackBy: string|((item: any) => string)) {
        this.valueAccessor.trackBy = trackBy;
    }

    get trackBy() {
        return this.valueAccessor.trackBy;
    }

    @Input()
    set required(required: boolean) {
        this.validator.options.required = required;
    }

    get required() {
        return this.validator.options.required;
    }
    
    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    @ContentChildren(forwardRef(() => CheckboxItem))
    checkboxItems: CheckboxItem[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public valueAccessor: SelectValueAccessor,
                private validator: SelectValidator) {
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    
    get values() {
        if (!this.checkboxItems) return [];
        return this.checkboxItems.map(checkboxItem => checkboxItem.value);
    }

}