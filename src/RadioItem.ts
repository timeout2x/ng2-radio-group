import {Component, Input, Host, forwardRef, Inject, ViewEncapsulation, Output} from "@angular/core";
import {RadioGroup} from "./RadioGroup";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";

@Component({
    selector: "radio-item",
    template: `
<div (click)="check($event)" 
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
    
    @Output()
    onSelect = new EventEmitter<{ event: Event }>();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(@Host() @Inject(forwardRef(() => RadioGroup)) private radioGroup: RadioGroup) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    check(event: MouseEvent) {
        if (this.isReadonly() || this.isDisabled()) return;
        this.radioGroup.valueAccessor.set(this.value);
        this.onSelect.emit({ event: event });
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
