import {
    Component,
    Input,
    forwardRef,
    Provider,
    ViewEncapsulation,
    ViewChild,
    ChangeDetectorRef,
    AfterViewInit
} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, ControlValueAccessor, Control} from "@angular/common";
import {CheckboxItem, CheckboxGroup} from "./CheckboxGroup";
import {RadioItem, RadioGroup} from "./RadioGroup";

@Component({
    selector: "select-items",
    template: `
<div class="select-items">
    <div class="select-items-search" [hidden]="!searchBy">
        <input type="text" [(ngModel)]="keyword" [placeholder]="searchLabel || ''">
    </div>
    <div *ngIf="isMultiple()">
        <div class="select-all" 
            [hidden]="(searchBy && keyword) || !selectAllLabel || !getItems().length" 
            (click)="selectAll()" 
            [class.active]="active === '--select-all'">
            <input type="checkbox" [checked]="isAllSelected(getItems())"> {{ selectAllLabel }}
        </div>
        <checkbox-group #checkboxGroup [(ngModel)]="model" (ngModelChange)="onChange(model)" [trackBy]="trackBy">
            <div *ngFor="let item of getItems()" 
                [class.active]="active === item"
                class="select-items-item">
                <span [hidden]="hideControls">
                    <checkbox-item 
                        [value]="getItemValue(item)" 
                        [disabled]="isItemDisabled(item)">
                        <span class="select-items-label">
                            {{ getItemLabel(item) }}
                        </span>
                    </checkbox-item>
                </span>
                <span class="select-items-label" [hidden]="!hideControls">
                    {{ getItemLabel(item) }}
                </span>
                <span class="remove-button" [hidden]="!removeButton" (click)="removeItem(item)">×</span>
            </div>
        </checkbox-group>
    </div>
    <div *ngIf="!isMultiple()">
        <div class="no-selection" [hidden]="!noSelectionLabel" (click)="resetModel()">
            <input type="radio" [checked]="!model"> {{ noSelectionLabel }}
        </div>
        <radio-group #radioGroup [(ngModel)]="model" (ngModelChange)="onChange(model)" [trackBy]="trackBy">
            <div *ngFor="let item of getItems()"
                [class.active]="active === item"
                class="select-items-item">
                <span [hidden]="hideControls">
                    <radio-item 
                        [value]="getItemValue(item)" 
                        [disabled]="isItemDisabled(item)">
                        <span class="select-items-label">
                            {{ getItemLabel(item) }}
                        </span>
                    </radio-item>
                </span>
                <span class="select-items-label" [hidden]="!hideControls">
                    {{ getItemLabel(item) }}
                </span>
            </div>
        </radio-group>
    </div>
    <div class="more-button" (click)="showMore()" [hidden]="isMaxLimitReached || !moreLabel || isMoreShown">
        <a>{{ moreLabel }}</a>
        <div class="caret-top"></div>
    </div>
    <div class="hide-button" (click)="hideMore()" [hidden]="isMaxLimitReached || !hideLabel || !isMoreShown">
        <a>{{ hideLabel }}</a> 
        <div class="caret-bottom"></div>
    </div>
</div>`,
    styles: [`
.select-items .select-all, .select-items .no-selection {
    cursor: pointer;
}
.select-items .remove-button {
    font-size: 12px;
    font-weight: bold;
    color: #999;
    vertical-align: text-bottom;
    cursor: pointer;
}
.select-items .checkbox-item, .select-items .radio-item {
    display: inline;
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
.select-items .caret-top {
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
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-bottom: 4px dashed;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
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
    disableBy: string;

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
        if (this.disableBy) {
            if (typeof this.disableBy === "string") {
                return !!item[this.disableBy as string];

            } else if (typeof this.disableBy === "function") {
                return !!(this.disableBy as any)(item);
            }
        }

        if (this.isMultiple() && this.checkboxGroup) {
            if (this.maxModelSize > 0 && this.model.length >= this.maxModelSize) {
                return this.checkboxGroup.hasValue(item) ? false : true;
            }
            if (this.minModelSize > 0 && this.model.length <= this.minModelSize) {
                return this.checkboxGroup.hasValue(item) ? true : false;
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
                items = items.filter(item => !this.checkboxGroup.hasValue(item));
            } else {
                items = items.filter(item => !this.radioGroup.isValue(item));
            }
        }

        this.isMaxLimitReached = false;
        if (this.limit) {
            const startFrom = items.length - this.limit;
            this.isMaxLimitReached = startFrom <= 0;
            if (startFrom > 0 && !this.isMoreShown)
                items.splice(startFrom * -1);
        }

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
        // const items = this.getItems();
        if (!this.isAllSelected(this.items)) {
            this.items.forEach(item => {
                this.checkboxGroup.addValue(this.getItemValue(item));
            });
        } else {
            this.items.forEach(item => {
                this.checkboxGroup.removeValue(this.getItemValue(item));
            });
        }
    }

    isAllSelected(items: any[]) {
        if (!this.checkboxGroup) return false;
        let has = true;
        items.forEach(item => {
            if (has)
                has = this.checkboxGroup.hasValue(this.getItemValue(item));
        });

        return has;
    }

    resetModel() {
        this.model = undefined;
        this.onChange(this.model);
    }

}