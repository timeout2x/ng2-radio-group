export * from "./CheckboxGroup";
export * from "./RadioGroup";
export * from "./SelectItems";
export * from "./Autocomplete";
export * from "./SelectDropdown";

import {CheckboxGroup, CheckboxItem, CheckBox} from "./CheckboxGroup";
import {RadioGroup, RadioItem, RadioBox} from "./RadioGroup";
import {SelectItems} from "./SelectItems";
import {Autocomplete} from "./Autocomplete";
import {SelectDropdown} from "./SelectDropdown";

export const SELECT_DIRECTIVES: [any] = [CheckboxGroup, 
    CheckboxItem,
    RadioGroup,
    RadioItem, 
    RadioBox, 
    CheckBox, 
    SelectItems, 
    Autocomplete,
    SelectDropdown
];