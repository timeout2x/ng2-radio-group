import {Component, Input, Output, EventEmitter, Host} from "angular2/core";

@Component({
    selector: "radio-group",
    template: `<div class="radio-group"><ng-content></ng-content></div>`
})
export class RadioGroup {

    @Output()
    modelChange = new EventEmitter();

    @Input()
    model: any;

    change(value: any) {
        this.model = value;
        this.modelChange.emit(value);
    }

}

@Component({
    selector: "radio-item",
    template: `
<div class="radio-item" (click)="check()">
    <input type="radio" [checked]="isChecked()"/> <ng-content></ng-content>
</div>`
})
export class RadioItem {

    @Input()
    value: any;

    constructor(@Host() private radioGroup: RadioGroup) {
    }

    check() {
        this.radioGroup.change(this.value);
    }

    isChecked() {
        return this.radioGroup.model === this.value;
    }
}