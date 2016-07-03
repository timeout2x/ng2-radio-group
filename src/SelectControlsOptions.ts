import "rxjs/Rx";
import {
    Component,
    Input,
    ViewEncapsulation,
    OnInit,
    Directive,
    ContentChildren,
    QueryList,
    ContentChild, Injectable
} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectItems} from "./SelectItems";
import {DROPDOWN_DIRECTIVES} from "ng2-dropdown";
import {Observable, Subscription} from "rxjs/Rx";
import {SelectValueAccessor} from "./SelectValueAccessor";
import {SelectValidator} from "./SelectValidator";
import {Utils} from "./Utils";
import {ItemTemplate} from "./ItemTemplate";

@Injectable()
export class SelectControlsOptions {

    searchLabel: string;
    selectAllLabel: string;
    noSelectionLabel: string;
    
}