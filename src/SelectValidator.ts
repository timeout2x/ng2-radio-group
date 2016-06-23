import {Injectable} from "@angular/core";
import {Control, Validator} from "@angular/common";

@Injectable()
export class SelectValidator implements Validator {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    options: {
        required?: boolean;
    } = {};
    
    // -------------------------------------------------------------------------
    // Implemented from Validator
    // -------------------------------------------------------------------------

    validate(c: Control) {
        if (this.options.required && (!c.value || (c.value instanceof Array) && c.value.length === 0)) {
            return {
                required: true
            };
        }
        return null;
    }

}