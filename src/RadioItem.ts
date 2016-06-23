import {Component, Input, Host, forwardRef, Inject, ViewEncapsulation} from "@angular/core";
import {RadioGroup} from "./RadioGroup";

@Component({
    selector: "radio-item",
    template: `
<div (click)="check()" 
     [class.disabled]="isDisabled()"
     [class.readonly]="isReadonly()"
     class="radio-item" >
    <input class="radio-item-input" type="radio" [checked]="isChecked()" [disabled]="isDisabled()"/> <ng-content></ng-content>
</div>`,
    styles: [`
.radio-item {
    cursor: pointer;
}
.radio-item.disabled {
    cursor: not-allowed;
}
.radio-item.readonly {
    cursor: default;
}
`],
    encapsulation: ViewEncapsulation.None
})
export class RadioItem {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    value: any;

    @Input()
    disabled: boolean = false;

    @Input()
    readonly: boolean = false;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Host() @Inject(forwardRef(() => RadioGroup)) private radioGroup: RadioGroup) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    check() {
        if (this.isReadonly() || this.isDisabled()) return;
        this.radioGroup.valueAccessor.set(this.value);
    }

    isChecked() {
        return this.radioGroup.valueAccessor.has(this.value);
    }

    isDisabled() {
        return this.disabled === true || this.radioGroup.disabled;
    }

    isReadonly() {
        return this.readonly || this.radioGroup.readonly;
    }
    
}
