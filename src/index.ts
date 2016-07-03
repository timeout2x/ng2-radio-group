export * from "./CheckboxGroup";
export * from "./Checkbox";
export * from "./CheckboxItem";
export * from "./RadioGroup";
export * from "./RadioBox";
export * from "./RadioItem";
export * from "./SelectItems";
export * from "./Autocomplete";
export * from "./SelectDropdown";
export * from "./SelectTags";
export * from "./ItemTemplate";

import {Checkbox} from "./Checkbox";
import {CheckboxItem} from "./CheckboxItem";
import {CheckboxGroup} from "./CheckboxGroup";
import {RadioBox} from "./RadioBox";
import {RadioItem} from "./RadioItem";
import {RadioGroup} from "./RadioGroup";
import {SelectItems} from "./SelectItems";
import {Autocomplete, AutocompleteDropdownTemplate} from "./Autocomplete";
import {SelectDropdown} from "./SelectDropdown";
import {SelectTags, SelectTagsDropdownTemplate, SelectTagsBoxTemplate} from "./SelectTags";
import {ItemTemplate} from "./ItemTemplate";

export const SELECT_DIRECTIVES: [any] = [
    CheckboxGroup,
    CheckboxItem,
    RadioGroup,
    RadioItem, 
    RadioBox, 
    Checkbox, 
    SelectItems, 
    Autocomplete,
    SelectDropdown,
    SelectTags,
    ItemTemplate,
    SelectTagsDropdownTemplate,
    SelectTagsBoxTemplate,
    AutocompleteDropdownTemplate
];