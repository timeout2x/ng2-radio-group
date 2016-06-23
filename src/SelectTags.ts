import "rxjs/Rx";
import {Component, Input, forwardRef, Provider, ViewEncapsulation, OnInit, ViewChild, ElementRef} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, ControlValueAccessor, Control} from "@angular/common";
import {SelectItems} from "./SelectItems";
import {DROPDOWN_DIRECTIVES} from "ng2-dropdown";
import {Observable} from "rxjs/Rx";
import {WidthCalculator} from "./WidthCalculator";

@Component({
    selector: "select-tags",
    template: `
<div class="select-tags">
    <div class="select-tags-dropdown dropdown" dropdown>
        <div class="select-tags-box" (click)="selectTagsBoxInput.focus()" (focus)="selectTagsBoxInput.focus()">
            <select-items #boxSelectItems
                [hideControls]="true"
                [removeButton]="true"
                [items]="model"
                labelBy="name"
                trackBy="name"
                [readonly]="true"></select-items>
            <input #selectTagsBoxInput 
                   class="select-tags-input"
                   dropdown-open
                   type="text"
                   [placeholder]="placeholder"
                   [disabled]="isDisabled()"
                   [(ngModel)]="term"
                   [ngFormControl]="termControl"
                   (focus)="load()"
                   (click)="load()"
                   (keydown)="onInputKeydown($event)"
                   (keyup)="recalculateInputWidth($event)"
                   (blur)="recalculateInputWidth($event)"
                   (keydown.enter)="addTerm()"/>
        </div>
        <div class="select-tags-add-button" [class.hidden]="!isMultiple() || !persist || !term || !term.length">
            <a (click)="addTerm()">{{ addButtonLabel }}</a> (or press enter)
        </div>
        <div class="select-tags-dropdown-menu dropdown-menu"
            [class.hidden]="!dropdownSelectItems.getItems().length">
            <select-items #dropdownSelectItems
                [(ngModel)]="model" 
                (ngModelChange)="onModelChange()"
                [items]="items"
                [hideSelected]="true"
                [hideControls]="true"
                [multiple]="isMultiple()"
                [disabled]="disabled"
                [labelBy]="labelBy"
                [trackBy]="trackBy"
                [valueBy]="valueBy"
                [limit]="limit"
                [orderBy]="orderBy"
                [orderDirection]="orderDirection"
                [disableBy]="disableBy"></select-items>
        </div>
    </div>
</div>`,
    styles: [`
.select-tags {
}
.select-tags-add-button.hidden,
.select-tags .hidden {
    display: none !important;
}
.select-tags-add-button {
    float: right;
    font-size: 0.75em;
    color: #999;
}
.select-tags-add-button a {
    border-bottom: 1px dotted;
}
.select-tags .select-tags-dropdown .select-tags-input {
    border: none;
    outline: none;
    box-shadow: none;
    height: 25px;
    width: 4px;
    display: inline-block;
}
.select-tags .select-tags-dropdown {
    position: relative;
}
.select-tags .select-tags-dropdown-menu {
    position: absolute;
    /* position: relative; */
    top: 100%;
    width: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    /* float: left; */
    margin: 2px 0px 2px -1px;
    min-width: 160px;
    /* padding: 5px 10px 5px 0px; */
    /* margin: 5px 0 0 -6px; */
    padding: 5px 0 5px 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, .15);   
    /*position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, .15);*/
}
.select-tags .select-tags-dropdown.open .dropdown-menu {
    display: block;
}
.select-tags .select-tags-box {
    padding: 5px 5px 3px 5px;
    outline: 1px solid #CCC;
}
.select-tags .select-tags-box .select-items,
.select-tags .select-tags-box .select-items .select-items-multiple,
.select-tags .select-tags-box .select-items .select-items-single,
.select-tags .select-tags-box .select-items .radio-group,
.select-tags .select-tags-box .select-items .checkbox-group {
    display: inline;
}
.select-tags .select-tags-box .select-items .select-items-item .remove-button {
    color: #FFF;
}
.select-tags .select-tags-box .select-items .select-items-item {
    display: inline-block;
    padding: 2px 6px;
    margin: 0 3px 3px 0;
    color: #ffffff;
    cursor: pointer;
    background: #1da7ee;
    border: 1px solid #0073bb;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), inset 0 1px rgba(255, 255, 255, 0.03);
    border-radius: 3px;
    background-image: linear-gradient(to bottom, #1da7ee, #178ee9);
    background-repeat: repeat-x;
    text-shadow: 0 1px 0 rgba(0, 51, 83, 0.3);
    background-color: #1b9dec;
}
.select-tags .select-tags-dropdown-menu .select-items .no-selection,
.select-tags .select-tags-dropdown-menu .select-items .select-all,
.select-tags .select-tags-dropdown-menu .select-items .checkbox-item,
.select-tags .select-tags-dropdown-menu .select-items .radio-item {
    padding: 3px 15px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857;
    color: #333333;
    white-space: nowrap;
    display: block;
}
.select-tags .select-tags-dropdown-menu .select-items .no-selection:hover,
.select-tags .select-tags-dropdown-menu .select-items .select-all:hover,
.select-tags .select-tags-dropdown-menu .select-items .checkbox-item:hover,
.select-tags .select-tags-dropdown-menu .select-items .radio-item:hover {
    text-decoration: none;
    color: #fff;
    background-color: #0095cc;
    cursor: pointer;
}
.select-tags .select-items .checkbox-item.disabled:hover,
.select-tags .select-items .radio-item.disabled:hover {
    color: #333;
    background-color: #eeeeee;
    cursor: not-allowed;
}
`],
    encapsulation: ViewEncapsulation.None,
    directives: [
        SelectItems,
        DROPDOWN_DIRECTIVES
    ],
    providers: [
        WidthCalculator,
        new Provider(NG_VALUE_ACCESSOR, {
            useExisting: forwardRef(() => SelectTags),
            multi: true
        }),
        new Provider(NG_VALIDATORS, {
            useExisting: forwardRef(() => SelectTags),
            multi: true
        })
    ]
})
export class SelectTags implements OnInit, ControlValueAccessor, Validator {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    placeholder: string = "";

    @Input()
    multiple: boolean;

    @Input()
    debounceTime = 500;

    @Input()
    minQueryLength = 2;

    @Input()
    persist: boolean = false;

    @Input()
    trackBy: string|((item: any) => string);

    @Input()
    labelBy: string|((item: any) => string);

    @Input()
    valueBy: string|((item: any) => any);

    @Input()
    disableBy: string|((item: any) => string);

    @Input()
    orderBy: string|((item1: any, item2: any) => number);

    @Input()
    orderDirection: "asc"|"desc";

    @Input()
    disabled: boolean = false;

    @Input()
    limit: number;

    @Input()
    maxModelSize: number;

    @Input()
    loader: (term: string) => Observable<any>;

    @Input()
    itemConstructor: ((term: string) => any);

    @Input()
    addButtonLabel: string = "add";

    @Input()
    removeByKey: boolean = true; // todo

    @Input()
    unqiue: boolean = true; // todo

    @Input()
    minLength: boolean = true; // todo

    @Input()
    maxLength: boolean = true; // todo

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    termControl = new Control();
    term: string;
    lastLoadTerm: string = "";
    items: any[] = [];

    @ViewChild("selectTagsBoxInput")
    selectTagsBoxInput: ElementRef;

    @ViewChild("boxSelectItems")
    boxSelectItems: SelectItems;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    onChange: (m: any) => void;
    private onTouched: (m: any) => void;
    private model: any;
    private originalModel = false;
    cursorPosition: number = 0;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private widthCalculator: WidthCalculator) {
    }

    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------

    writeValue(value: any): void {
        this.model = value;
        if (this.model) {
            this.originalModel = true;
            this.term = this.getItemLabel(this.model);
            this.recalculateInputWidth(undefined, this.term);
        }
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

    validate(c: Control): any {
      /*  if (this.required && (!c.value || (c.value instanceof Array) && c.value.length === 0)) {
            return {
                required: true
            };
        }*/
        return null;
    }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {

        // load options on term changes
        this.termControl
            .valueChanges
            .debounceTime(this.debounceTime) // make a debounced request on term change
            .filter(term => !this.originalModel && term && term.length >= this.minQueryLength)
            // .filter(term => !this.model || this.getItemLabel(this.model) !== term) // don't need to send request if in input there is a model already
            .subscribe(term => this.load());

        this.termControl
            .valueChanges
            .subscribe((term: string) => {
                // if persist mode is set then create a new object
                if (!this.isMultiple()) {
                    if (this.persist && term && (!this.model || this.getItemLabel(this.model) !== term)) {
                        this.model = this.itemConstructor ? this.itemConstructor(term) : { [this.labelBy as string]: term };
                        this.originalModel = false;
                        this.onChange(this.model);
                    }

                    // if term is empty then clean the model
                    if (this.model && term === "") {
                        this.model = undefined;
                        this.onChange(this.model);
                    }
                } else {
                    this.originalModel = false;
                }
            });
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    load() {
        if (!this.loader || this.originalModel || !this.term || this.term.length < this.minQueryLength || this.term === this.lastLoadTerm)
            return;

        return this
            .loader(this.term)
            .subscribe(items => {
                this.lastLoadTerm = this.term;
                this.items = items;
            });
    }

    onModelChange() {
        this.onChange(this.model);
        if (!this.isMultiple() && this.model) {
            this.term = this.getItemLabel(this.model);
            this.lastLoadTerm = this.term;
            this.items = [];
            this.recalculateInputWidth(undefined, this.term);
        } else {
            this.lastLoadTerm = "";
            this.term = "";
            this.recalculateInputWidth(undefined, this.term);
            this.items = [];
        }
    }

    addTerm() {
        if (!this.term || !this.persist || !this.isMultiple()) return;

        if (!this.model)
            this.model = [];

        const newModel = this.itemConstructor ? this.itemConstructor(this.term) : { [this.labelBy as string]: this.term };
        this.model.push(newModel);
        this.onChange(this.model);
        this.cursorPosition++;
        this.lastLoadTerm = "";
        this.term = "";
        this.items = [];
        this.recalculateInputWidth(undefined, this.term);
    }

    isMultiple() {
        if (this.multiple !== undefined)
            return this.multiple;

        return this.model instanceof Array;
    }

    isDisabled() {
        if (this.maxModelSize > 0 &&
            this.isMultiple() &&
            this.model.length >= this.maxModelSize)
            return true;

        return this.disabled;
    }

    getItemLabel(item: any) {// todo: duplication
        if (!item) return; 
        
        if (this.labelBy) {
            if (typeof this.labelBy === "string") {
                return item[this.labelBy as string];

            } else if (typeof this.labelBy === "function") {
                return (this.labelBy as any)(item);
            }
        }

        return item;
    }

    recalculateInputWidth(event?: Event, value?: any) {
        this.widthCalculator.recalculateInputWidth(this.selectTagsBoxInput.nativeElement, event, value);
    }

    onInputKeydown(event: KeyboardEvent) {
        this.recalculateInputWidth(event);

        // actions with tags can be done when focus inside, but no text in the input box
        if (!this.term) {
            if (event.keyCode === 37) { // left
                this.moveLeft();
                this.selectTagsBoxInput.nativeElement.focus();

            } else if (event.keyCode === 39) { // right
                this.moveRight();
                this.selectTagsBoxInput.nativeElement.focus();

            } else if (event.keyCode === 8) { // backspace
                // this.removeLast(); // todo remove all selected, or last one
                // this.removeByKey

            } else if (event.keyCode === 46) { // delete
                // this.removeLast(); // todo remove all selected, or next one
                // this.removeByKey

            } else if (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) { // Ctrl/Cmd + A
                // todo: make all selected
            }
        }
    }

    moveLeft() {
        const items = this.boxSelectItems.itemElements.toArray();
        if (this.cursorPosition === 0)
            return;

        --this.cursorPosition;
        const input = this.selectTagsBoxInput.nativeElement;
        const element = items[this.cursorPosition].nativeElement;
        element.parentElement.insertBefore(input, element);
    }

    moveRight() {
        const items = this.boxSelectItems.itemElements.toArray();
        if (this.cursorPosition >= items.length)
            return;

        const input = this.selectTagsBoxInput.nativeElement;
        const element = items[this.cursorPosition].nativeElement;
        element.parentElement.insertBefore(input, element.nextSibling);
        ++this.cursorPosition;
    }

}