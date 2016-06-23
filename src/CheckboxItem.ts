import {Component, Input, Host, forwardRef, Inject, ViewEncapsulation, Output, EventEmitter} from "@angular/core";
import {CheckboxGroup} from "./CheckboxGroup";

@Component({
    selector: "checkbox-item",
    template: `
<div (click)="toggleCheck($event)"
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

    @Output()
    onSelect = new EventEmitter<{ event: Event }>();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Host() @Inject(forwardRef(() => CheckboxGroup))  private checkboxGroup: CheckboxGroup) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    toggleCheck(event: MouseEvent) {
        if (this.isReadonly() || this.isDisabled()) return;
        if (this.checkboxGroup.customToggleLogic) {
            this.checkboxGroup.customToggleLogic({
                event: event,
                valueAccessor: this.checkboxGroup.valueAccessor,
                value: this.value
            });

        } else {
            this.checkboxGroup.valueAccessor.addOrRemove(this.value);
        }

        this.onSelect.emit({ event: event });
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