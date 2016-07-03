import "rxjs/Rx";
import {
    Component,
    Input,
    ViewEncapsulation,
    OnInit,
    Directive,
    ContentChildren,
    QueryList,
    ContentChild
} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectItems} from "./SelectItems";
import {DROPDOWN_DIRECTIVES} from "ng2-dropdown";
import {Observable, Subscription} from "rxjs/Rx";
import {SelectValueAccessor} from "./SelectValueAccessor";
import {SelectValidator} from "./SelectValidator";
import {Utils} from "./Utils";
import {ItemTemplate} from "./ItemTemplate";

@Directive({
    selector: "autocomplete-dropdown-template"
})
export class AutocompleteDropdownTemplate {

    @ContentChildren(ItemTemplate)
    itemTemplates: QueryList<ItemTemplate>;

}

@Component({
    selector: "autocomplete",
    template: `
<div class="autocomplete">
    <div class="autocomplete-dropdown dropdown" dropdown [dropdownToggle]="false">
        <div class="autocomplete-input" [class.autocomplete-input-group]="isMultiple() && persist">
            <input dropdown-open
                   type="text"
                   [placeholder]="placeholder"
                   [disabled]="isDisabled()"
                   [(ngModel)]="term"
                   (ngModelChange)="onTermChange(term)"
                   (focus)="load()"
                   (click)="load()"
                   (keydown.enter)="addTerm()"/>
            <div class="autocomplete-add-button" [class.hidden]="!isMultiple() || !persist || !term || !term.length">
                <a (click)="addTerm()">{{ addButtonLabel }}</a> {{ addButtonSecondaryLabel }}
            </div>
        </div>
        <div class="autocomplete-dropdown-menu dropdown-menu"
            [class.hidden]="!dropdownSelectItems.getItems().length">
            <select-items #dropdownSelectItems
                [(ngModel)]="valueAccessor.model" 
                (ngModelChange)="onModelChange($event)"
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
                [disableBy]="disableBy"
                [customItemTemplates]="dropdownTemplate?.itemTemplates"></select-items>
        </div>
    </div>
</div>`,
    styles: [`
.autocomplete .hidden {
    display: none !important;
}
.autocomplete .autocomplete-dropdown {
    position: relative;
}
.autocomplete .autocomplete-input input {
    width: 100%;
}
.autocomplete .autocomplete-dropdown-menu {
    position: absolute;
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
    border: 1px solid rgba(0, 0, 0, .15);
}
.autocomplete .autocomplete-dropdown.open .dropdown-menu {
    display: block;
}
.autocomplete .autocomplete-dropdown-menu .select-items .no-selection,
.autocomplete .autocomplete-dropdown-menu .select-items .select-all,
.autocomplete .autocomplete-dropdown-menu .select-items .checkbox-item,
.autocomplete .autocomplete-dropdown-menu .select-items .radio-item {
    padding: 3px 15px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857;
    color: #333333;
    white-space: nowrap;
    display: block;
}
.autocomplete .autocomplete-dropdown-menu .select-items .no-selection:hover,
.autocomplete .autocomplete-dropdown-menu .select-items .select-all:hover,
.autocomplete .autocomplete-dropdown-menu .select-items .checkbox-item:hover,
.autocomplete .autocomplete-dropdown-menu .select-items .radio-item:hover {
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
.autocomplete .autocomplete-add-button {
    float: right;
    font-size: 0.75em;
    color: #999;
}
.autocomplete .autocomplete-add-button a {
    border-bottom: 1px dotted;
}
`],
    encapsulation: ViewEncapsulation.None,
    directives: [
        SelectItems,
        DROPDOWN_DIRECTIVES
    ],
    providers: [
        Utils,
        SelectValueAccessor,
        SelectValidator,
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectValueAccessor, multi: true },
        { provide: NG_VALIDATORS, useExisting: SelectValidator, multi: true }
    ]
})
export class Autocomplete implements OnInit {

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
    itemLabelBy: string|((item: any) => string);

    @Input()
    labelBy: string|((item: any) => string);

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
    addButtonSecondaryLabel: string = "(or press enter)";

    // -------------------------------------------------------------------------
    // Input accessors
    // -------------------------------------------------------------------------

    @Input()
    set valueBy(valueBy: string|((item: any) => string)) {
        this.valueAccessor.valueBy = valueBy;
    }

    get valueBy() {
        return this.valueAccessor.valueBy;
    }

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

    term: string;
    lastLoadTerm: string = "";
    items: any[] = [];

    @ContentChild(AutocompleteDropdownTemplate)
    dropdownTemplate: AutocompleteDropdownTemplate;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private originalModel = false;
    private initialized: boolean = false;
    private loadDenounce: Function;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public valueAccessor: SelectValueAccessor,
                private validator: SelectValidator,
                private utils: Utils) {
        this.valueAccessor.modelWrites.subscribe((model: any) => {
            if (model)
                this.originalModel = true;
            if (this.initialized)
                this.term = this.getItemLabel(model);
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.initialized = true;
        this.term = this.getItemLabel(this.valueAccessor.model);

        this.loadDenounce = this.utils.debounce(() => {
            if (!this.originalModel && typeof this.term === "string" && this.term.trim().length >= this.minQueryLength) {
                this.load();
            }
        }, this.debounceTime);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    get dropdownItems() {
        return this.items;
    }
    
    onTermChange(term: string) {

        // if persist mode is set then create a new object
        if (!this.isMultiple()) {
            if (this.persist && term && (!this.valueAccessor.model || this.getItemLabel(this.valueAccessor.model) !== term)) {
                const value = this.itemConstructor ? this.itemConstructor(term) : { [this.labelBy as string]: term };
                this.valueAccessor.set(value);
                this.originalModel = false;
            }

            // if term is empty then clean the model
            if (this.valueAccessor.model && term === "") {
                this.valueAccessor.set(undefined);
            }
        } else {
            this.originalModel = false;
        }

        this.loadDenounce();
    }

    load(): Subscription {
        if (!this.loader || this.originalModel || !this.term || this.term.length < this.minQueryLength || this.term === this.lastLoadTerm)
            return;

        return this
            .loader(this.term)
            .subscribe(items => {
                this.lastLoadTerm = this.term;
                this.items = items;
            });
    }

    onModelChange(model: any) {
        this.valueAccessor.set(model);
        if (!this.isMultiple() && model) {
            this.term = this.getItemLabel(model);
            this.lastLoadTerm = this.term;
            this.items = [];
        } else {
            this.lastLoadTerm = "";
            this.term = "";
            this.items = [];
        }
    }

    addTerm() {
        if (!this.term || !this.persist || !this.isMultiple()) return;

        // if (!this.valueAccessor.model)
        //     this.valueAccessor.set([]);

        const newModel = this.itemConstructor ? this.itemConstructor(this.term) : { [this.labelBy as string]: this.term };
        this.valueAccessor.add(newModel);
        this.lastLoadTerm = "";
        this.term = "";
        this.items = [];
    }

    isMultiple() {
        if (this.multiple !== undefined)
            return this.multiple;

        return this.valueAccessor.model instanceof Array;
    }

    isDisabled() {
        if (this.maxModelSize > 0 &&
            this.isMultiple() &&
            this.valueAccessor.model.length >= this.maxModelSize)
            return true;

        return this.disabled;
    }

    getItemLabel(item: any) {
        if (!item) return "";
        const labelBy = this.valueBy ? this.itemLabelBy : (this.itemLabelBy || this.labelBy);

        if (labelBy) {
            if (typeof labelBy === "string") {
                return item[labelBy as string];

            } else if (typeof labelBy === "function") {
                return (labelBy as any)(item);
            }
        }

        return item;
    }


}