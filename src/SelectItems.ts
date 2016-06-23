import {
    Component,
    Input,
    forwardRef,
    Provider,
    ViewEncapsulation,
    ViewChild,
    ChangeDetectorRef,
    AfterViewInit, ElementRef, ViewChildren, QueryList
} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, ControlValueAccessor, Control} from "@angular/common";
import {CheckboxGroup} from "./CheckboxGroup";
import {RadioGroup} from "./RadioGroup";
import {RadioItem} from "./RadioItem";
import {CheckboxItem} from "./CheckboxItem";

@Component({
    selector: "select-items",
    template: `
<div class="select-items">
    <div [class.hidden]="!searchBy">
        <input class="select-items-search" type="text" [(ngModel)]="keyword" [placeholder]="searchLabel || ''">
    </div>
    <div class="select-items-multiple" *ngIf="isMultiple()">
        <div class="select-items-item select-all" 
            (click)="selectAll()" 
            [ngStyle]="{ display: ((searchBy && keyword) || !selectAllLabel || !getItems().length) ? 'none' : 'block' }"
            [class.active]="active === '--select-all'"
            [class.selected]="isAllSelected(getItems())">
            <input type="checkbox" [checked]="isAllSelected(getItems())">
            <span class="select-items-label">{{ selectAllLabel }}</span>
        </div>
        <checkbox-group #checkboxGroup [(ngModel)]="model" (ngModelChange)="onChange(model)" [trackBy]="trackBy">
            <div *ngFor="let item of getItems(); let last = last" 
                #itemElement
                [class.active]="active === item"
                [class.hide-controls]="hideControls === true"
                [class.selected]="checkboxItem.isChecked()"
                class="select-items-item item">
                <checkbox-item #checkboxItem
                    [value]="getItemValue(item)" 
                    [readonly]="readonly"
                    [disabled]="isItemDisabled(item)">
                    <span class="select-items-label">{{ getItemLabel(item) }}</span><span [class.hidden]="last" class="separator"></span>
                </checkbox-item>
                <span class="remove-button" 
                      [class.hidden]="!removeButton" (click)="removeItem(item)">×</span>
            </div>
        </checkbox-group>
    </div>
    <div class="select-items-single" *ngIf="!isMultiple()">
        <div class="select-items-item no-selection" 
            [class.hidden]="!noSelectionLabel"
            (click)="resetModel()"
            [class.active]="active === '--no-selection'"
            [class.selected]="!model">
            <input type="radio" [checked]="!model">
            <span class="select-items-label">{{ noSelectionLabel }}</span>
        </div>
        <radio-group #radioGroup [(ngModel)]="model" (ngModelChange)="onChange(model)" [trackBy]="trackBy">
            <div *ngFor="let item of getItems(); let last = last"
                #itemElement
                [class.active]="active === item"
                [class.hide-controls]="hideControls === true"
                [class.selected]="radioItem.isChecked()"
                class="select-items-item item">
                <radio-item #radioItem
                    [value]="getItemValue(item)" 
                    [readonly]="readonly"
                    [disabled]="isItemDisabled(item)">
                    <span class="select-items-label">{{ getItemLabel(item) }}</span><span [class.hidden]="last" class="separator"></span>
                </radio-item>
                <span class="remove-button" [class.hidden]="!removeButton" (click)="removeItem(item)">×</span>
            </div>
        </radio-group>
    </div>
    <div class="more-button" (click)="showMore()" [class.hidden]="isMaxLimitReached || !moreLabel || isMoreShown">
        <a>{{ moreLabel }}</a>
        <div class="caret-body caret-top"></div>
    </div>
    <div class="hide-button" (click)="hideMore()" [class.hidden]="isMaxLimitReached || !hideLabel || !isMoreShown">
        <a>{{ hideLabel }}</a> 
        <div class="caret-body caret-bottom"></div>
    </div>
</div>`,
    styles: [`
.select-items .hidden {
    display: none !important;
}
.select-items input.select-items-search {
    padding: 6px 12px;
    margin-bottom: 5px;

}
.select-items .select-all, .select-items .no-selection {
    cursor: pointer;
}
.select-items .select-items-item.hide-controls.selected {
    background: #337ab7;
    color: #FFF;
}
.select-items .select-items-label {
    padding-left: 3px;
}
.select-items .remove-button {
    font-size: 12px;
    font-weight: bold;
    color: #999;
    vertical-align: text-bottom;
    cursor: pointer;
}
.select-items .remove-button:hover {
    color: #333;
}
.select-items .checkbox-item, .select-items .radio-item {
    display: inline;
}
.select-items .select-items-item.hide-controls .checkbox-item input[type=checkbox], 
.select-items .select-items-item.hide-controls .radio-item input[type=radio] {
    display: none;
}
.select-items .more-button, .select-items .hide-button {
    color: #999;
    cursor: pointer;
}
.select-items .more-button a, .select-items .hide-button a {
    border-bottom: 1px dashed;
}
.select-items .more-button a:hover, .select-items .hide-button a:hover {
    text-decoration: none;
}
.select-items .caret-body {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
}
.select-items .caret-bottom {
    border-bottom: 4px dashed;
}
.select-items .caret-top {
    border-top: 4px dashed;
}
`],
    encapsulation: ViewEncapsulation.None,
    directives: [
        RadioGroup, RadioItem, CheckboxGroup, CheckboxItem
    ],
    providers: [
        new Provider(NG_VALUE_ACCESSOR, {
            useExisting: forwardRef(() => SelectItems),
            multi: true
        }),
        new Provider(NG_VALIDATORS, {
            useExisting: forwardRef(() => SelectItems),
            multi: true
        })
    ]
})
export class SelectItems implements AfterViewInit, ControlValueAccessor, Validator {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    items: any[];

    @Input()
    multiple: boolean;
    
    @Input()
    trackBy: string;

    @Input()
    disableBy: string|((item: any) => string);

    @Input()
    labelBy: string|((item: any) => string);

    @Input()
    valueBy: string|((item: any) => any);

    @Input()
    searchBy: string|((item: any, keyword: string) => boolean);

    @Input()
    orderBy: string|((item1: any, item2: any) => number);

    @Input()
    orderDirection: "asc"|"desc";

    @Input()
    limit: number;

    @Input()
    disabled: boolean = false;

    @Input()
    readonly: boolean = false;

    @Input()
    hideSelected: boolean;

    @Input()
    removeButton: boolean;

    @Input()
    hideControls: boolean;

    @Input()
    searchLabel: string;

    @Input()
    moreLabel: string;

    @Input()
    hideLabel: string;

    @Input()
    selectAllLabel: string;

    @Input()
    noSelectionLabel: string;

    @Input()
    maxModelSize: number;

    @Input()
    minModelSize: number;

    @Input()
    filter: (items: any[]) => any[];

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    keyword: string;
    isMoreShown: boolean = false;
    isMaxLimitReached: boolean = false;

    @ViewChild(RadioGroup)
    radioGroup: RadioGroup;

    @ViewChild(CheckboxGroup)
    checkboxGroup: CheckboxGroup;

    @ViewChildren("itemElement")
    itemElements: QueryList<ElementRef>;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    onChange: (m: any) => void;
    private onTouched: (m: any) => void;
    private model: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private cdr: ChangeDetectorRef) {
    }

    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------

    writeValue(value: any[]): void {
        this.model = value;
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

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    
    isMultiple() {
        if (this.multiple === undefined)
            return this.model instanceof Array;
        
        return this.multiple;
    }

    isItemDisabled(item: any) {
        if (this.disabled)
            return true;

        if (this.disableBy) {
            if (typeof this.disableBy === "string") {
                return !!item[this.disableBy as string];

            } else if (typeof this.disableBy === "function") {
                return !!(this.disableBy as any)(item);
            }
        }

        if (this.isMultiple() && this.checkboxGroup) {
            if (this.maxModelSize > 0 && this.model.length >= this.maxModelSize) {
                return this.checkboxGroup.valueAccessor.has(item) ? false : true;
            }
            if (this.minModelSize > 0 && this.model.length <= this.minModelSize) {
                return this.checkboxGroup.valueAccessor.has(item) ? true : false;
            }

        }

        return false;
    }

    getItemLabel(item: any) {
        if (this.labelBy) {
            if (typeof this.labelBy === "string") {
                return item[this.labelBy as string];

            } else if (typeof this.labelBy === "function") {
                return (this.labelBy as any)(item);
            }
        }

        return item;
    }

    getItemValue(item: any) {
        if (this.valueBy) {
            if (typeof this.valueBy === "string") {
                return item[this.valueBy as string];

            } else if (typeof this.valueBy === "function") {
                return (this.valueBy as any)(item);
            }
        }

        return item;
    }

    getItems() {
        if (!this.items) return [];
        
        let items = this.items.map(item => item);
        if (this.searchBy && this.keyword) {
            items = items.filter(item => {
                if (typeof this.searchBy === "string") {
                    if (typeof item[this.searchBy as string] === "string")
                        return item[this.searchBy as string].toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1;

                } else {
                    return (this.searchBy as any)(item, this.keyword);
                }
                return false;
            });
        }

        if (this.orderBy) {
            if (typeof this.orderBy === "string") {
                items.sort((item1, item2) => {
                    const a = item1[this.orderBy as string];
                    const b = item2[this.orderBy as string];

                    if (typeof a === "string" && typeof b === "string") { // order logic for strings
                        const aLower = a.toLowerCase();
                        const bLower = b.toLowerCase();
                        if (aLower < bLower)
                            return -1;
                        if (aLower > bLower)
                            return 1;
                        return 0;

                    } else if (typeof a === "number" && typeof b === "number") { // order logic for numbers
                        return a - b;
                    }

                    return 0; // else simply don't order
                });
            } else {
                items.sort(this.orderBy as any);
            }

            if (this.orderDirection === "desc")
                items = items.reverse();
        }

        if (this.hideSelected && (this.checkboxGroup || this.radioGroup)) {
            if (this.isMultiple()) {
                items = items.filter(item => !this.checkboxGroup.valueAccessor.has(item));
            } else {
                items = items.filter(item => !this.radioGroup.valueAccessor.has(item));
            }
        }

        this.isMaxLimitReached = false;
        if (this.limit) {
            const startFrom = items.length - this.limit;
            this.isMaxLimitReached = startFrom <= 0;
            if (startFrom > 0 && !this.isMoreShown)
                items.splice(startFrom * -1);
        }
        
        if (this.filter)
            this.filter(items);

        return items;
    }

    removeItem(item: any) {
        this.items.splice(this.items.indexOf(item), 1);
    }

    showMore() {
        this.isMoreShown = true;
    }

    hideMore() {
        this.isMoreShown = false;
    }

    selectAll() {
        if (!this.isAllSelected(this.items)) {
            this.items.forEach(item => {
                this.checkboxGroup.valueAccessor.add(this.getItemValue(item));
            });
        } else {
            this.items.forEach(item => {
                this.checkboxGroup.valueAccessor.remove(this.getItemValue(item));
            });
        }
    }

    isAllSelected(items: any[]): boolean {
        if (!this.checkboxGroup) return false;
        let has = true;
        items.forEach(item => {
            if (has)
                has = this.checkboxGroup.valueAccessor.has(this.getItemValue(item));
        });

        return has;
    }

    resetModel() {
        this.model = undefined;
        this.onChange(this.model);
    }

}