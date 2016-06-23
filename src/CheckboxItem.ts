import {Component, Input, Host, forwardRef, Inject, ViewEncapsulation} from "@angular/core";
import {CheckboxGroup} from "./CheckboxGroup";

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

    constructor(@Host() @Inject(forwardRef(() => CheckboxGroup))  private checkboxGroup: CheckboxGroup) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    toggleCheck() {
        if (this.isReadonly() || this.isDisabled()) return;
        this.checkboxGroup.valueAccessor.addOrRemove(this.value);
    }

    isChecked() {
        return this.checkboxGroup.valueAccessor.has(this.value);
    }

    isDisabled() {
        return this.disabled === true || this.checkboxGroup.disabled;
    }

    isReadonly() {
        return this.readonly || this.checkboxGroup.readonly;
    }

}