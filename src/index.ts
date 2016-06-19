export * from "./CheckboxGroup";
export * from "./RadioGroup";

import {CheckboxGroup, CheckboxItem, CheckBox} from "./CheckboxGroup";
import {RadioGroup, RadioItem, RadioBox} from "./RadioGroup";
import {SelectItems} from "./SelectItems";

export const RADIO_GROUP_DIRECTIVES: [any] = [CheckboxGroup, CheckboxItem, RadioGroup, RadioItem, RadioBox, CheckBox, SelectItems];