import {Component, Input, Output, EventEmitter, Host} from "angular2/core";

@Component({
    selector: "checkbox-group",
    template: `<div class="checkbox-group"><ng-content></ng-content></div>`
})
export class CheckboxGroup {

    @Output()
    modelChange = new EventEmitter();

    @Input()
    model: any[];

    addOrRemoveValue(value: any) {
        if (this.hasValue(value)) {
            this.model.splice(this.model.indexOf(value), 1);
        } else {
            this.model.push(value);
        }
        this.modelChange.emit(this.model);
    }

    hasValue(value: any) {
        return this.model && this.model.indexOf(value) !== -1;
    }

}

@Component({
    selector: "checkbox-item",
    template: `
<div class="checkbox-item" (click)="check()">
    <input type="checkbox" [checked]="isChecked()"/> <ng-content></ng-content>
</div>`
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