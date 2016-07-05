import {Injectable} from "@angular/core";

@Injectable()
export class SelectControlsOptions {

    autocomplete: {
        searchLabel?: string;
        selectAllLabel?: string;
        noSelectionLabel?: string;
        debounceTime?: number;
        minQueryLength?: number;
        addButtonLabel?: string;
        addButtonSecondaryLabel?: string;
    };

    selectItems: {
        searchLabel?: string;
        selectAllLabel?: string;
        noSelectionLabel?: string;
    };

    selectTags: {
        searchLabel?: string;
        selectAllLabel?: string;
        noSelectionLabel?: string;
        debounceTime?: number;
        minQueryLength?: number;
        addButtonLabel?: string;
        addButtonSecondaryLabel?: string;
        nonUniqueTermLabel?: string;
        maxModelSizeLabel?: string;
    };

    selectDropdown: {
        searchLabel?: string;
        selectAllLabel?: string;
        noSelectionLabel?: string;
    };


}