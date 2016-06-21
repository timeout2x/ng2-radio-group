import "rxjs/Rx";
import {Component, Input, forwardRef, Provider, ViewEncapsulation, OnInit, ViewChild} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, ControlValueAccessor, Control} from "@angular/common";
import {SelectItems} from "./SelectItems";
import {DROPDOWN_DIRECTIVES} from "ng2-dropdown";
import {Observable} from "rxjs/Rx";

@Component({
    selector: "autocomplete",
    template: `
<div class="autocomplete">
    <div class="dropdown" dropdown>
        <div>
            <div [class.input-group]="isMultiple() && persist">
                <input dropdown-open
                       class="form-control"
                       type="text"
                       [placeholder]="placeholder"
                       [disabled]="isDisabled()"
                       [(ngModel)]="term"
                       [ngFormControl]="termControl"
                       (focus)="load()"
                       (click)="load()"
                       (keydown)="onTermKeydown($event)"/>
                   <span class="input-group-btn">
                        <button *ngIf="isMultiple() && persist" 
                                (click)="addTerm()"
                                [disabled]="disabled"
                                type="button"  
                                class="btn btn-default btn-plus pull-right">
                            {{ addButtonLabel }}
                        </button>
                  </span>
            </div>
        </div>
        <div>
            <div class="clearfix"></div>
            <div class="dropdown-menu"
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
    </div>
</div>`,
    styles: [`
.autocomplete .hidden {
    display: none;
}
.autocomplete .btn-plus {
    border-left: none;
}
.autocomplete .dropdown.open .dropdown-menu {
    display: block;
}
.autocomplete .dropdown-menu .select-items .no-selection,
.autocomplete .dropdown-menu .select-items .select-all,
.autocomplete .dropdown-menu .select-items .checkbox-item,
.autocomplete .dropdown-menu .select-items .radio-item {
    padding: 3px 15px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857;
    color: #333333;
    white-space: nowrap;
    display: block;
}
.autocomplete .dropdown-menu .select-items .no-selection:hover,
.autocomplete .dropdown-menu .select-items .select-all:hover,
.autocomplete .dropdown-menu .select-items .checkbox-item:hover,
.autocomplete .dropdown-menu .select-items .radio-item:hover {
    text-decoration: none;
    color: #fff;
    background-color: #0095cc;
    cursor: pointer;
}
.autocomplete .select-items .checkbox-item.disabled:hover,
.autocomplete .select-items .radio-item.disabled:hover {
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
        new Provider(NG_VALUE_ACCESSOR, {
            useExisting: forwardRef(() => Autocomplete),
            multi: true
        }),
        new Provider(NG_VALIDATORS, {
            useExisting: forwardRef(() => Autocomplete),
            multi: true
        })
    ]
})
export class Autocomplete implements OnInit, ControlValueAccessor, Validator {

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
    addButtonLabel: string = "+";

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    termControl = new Control();
    term: string;
    lastLoadTerm: string = "";
    items: any[] = [];


    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    onChange: (m: any) => void;
    private onTouched: (m: any) => void;
    private model: any;
    private originalModel = false;

    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------

    writeValue(value: any): void {
        this.model = value;
        if (this.model) {
            this.originalModel = true;
            this.term = this.getItemLabel(this.model);
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

    onTermKeydown(event: KeyboardEvent) {
        if (event.keyCode === 13 && this.persist && this.isMultiple()) {
            this.addTerm();
        }
    }

    onModelChange() {
        this.onChange(this.model);
        if (!this.isMultiple() && this.model) {
            this.term = this.getItemLabel(this.model);
            this.lastLoadTerm = this.term;
            this.items = [];
        } else {
            this.lastLoadTerm = "";
            this.term = "";
            this.items = [];
        }
    }

    addTerm() {
        if (!this.term) return;

        if (!this.model)
            this.model = [];

        const newModel = this.itemConstructor ? this.itemConstructor(this.term) : { [this.labelBy as string]: this.term };
        this.model.push(newModel);
        this.onChange(this.model);
        this.lastLoadTerm = "";
        this.term = "";
        this.items = [];
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


}