import {Injectable, EventEmitter} from "@angular/core";
import {ControlValueAccessor} from "@angular/common";

@Injectable()
export class SelectValueAccessor implements ControlValueAccessor {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    modelWrites = new EventEmitter<any>();
    trackBy: string;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private _model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------

    writeValue(value: any): void {
        this._model = value;
        this.modelWrites.emit(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get model() {
        return this._model;
    }
    
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    set(value: any) {
        this._model = value;
        this.onChange(this._model);
    }
    
    add(value: any) {
        if (!this.has(value)) {
            if (this._model instanceof Array) {
                this._model.push(value);
            } else {
                this._model = [value];
            }
            this.onChange(this._model);
        }
    }

    remove(value: any) {
        let index: number = -1;
        if (this.trackBy) {
            const item = this._model.find((i: any) => i[this.trackBy] === value[this.trackBy]);
            this.removeAt(this._model.indexOf(item));
            // filter or find?
           /* this._model
                .filter((i: any) => i[this.trackBy] === value[this.trackBy])
                .forEach((i: any) => this.removeAt(this._model.indexOf(i)));*/
        } else {
            this.removeAt(this._model.indexOf(value));
        }
        if (index !== -1) {
            this._model.splice(index, 1);
            this.onChange(this._model);
        }
    }

    removeAt(index: number): boolean {
        if (!this._model || index < 0 || (index > this._model.length - 1))
            return false;

        this._model.splice(index, 1);
        this.onChange(this._model);
    }

    clear() {
        if (this._model instanceof Array) {
            this._model.splice(0, this._model.length);
        } else {
            this._model = undefined;
        }
    }

    addAt(value: any, index: number): boolean {
        if (!this._model || index < 0)
            return false;

        this._model.splice(index, 0, value);
        this.onChange(this._model);
    }

    addOrRemove(value: any) {
        if (this.has(value)) {
            this.remove(value);
        } else {
            this.add(value);
        }
    }

    has(value: any): boolean {
        if (this._model instanceof Array) {
            if (this.trackBy) {
                return !!this._model.find((i: any) => i[this.trackBy] === value[this.trackBy]);
            } else {
                return this._model.indexOf(value) !== -1;
            }

        } else if (this._model !== null && this._model !== undefined) {
            if (this.trackBy) {
                return this._model[this.trackBy] === value[this.trackBy];
            } else {
                return this._model === value;
            }
        }
        
        return false;
    }

    addMany(values: any[]): void {
        if (!values || !values.length) return;
        values.forEach(value => this.add(value));
    }

    removeMany(values: any[]): void {
        if (!values || !values.length) return;
        values.forEach(value => this.remove(value));
    }

    hasMany(values: any[]): boolean {
        if (!values || !values.length) return false;

        let has = true;
        values.forEach(item => {
            if (has)
                has = this.has(item.value);
        });
        return has;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    /*private hasModelValue() {
        if (this.model instanceof Array) {
            return this.model.indexOf(this.value) !== -1;
        } else {
            return this.model === this.value;
        }
    }*/

    /*private addOrRemoveValue() {
        if (!this.model)
            this.model = [];

        if (this.model instanceof Array) {
            if (this.hasModelValue()) {
                this.model.splice(this.model.indexOf(this.value), 1);
            } else {
                this.model.push(this.value);
            }
        } else {
            if (this.model === this.value) {
                this.model = this.uncheckedValue;
            } else {
                this.model = this.value;
            }
        }
        // this.writeValue(this.model);
        this.onChange(this.model);
    }*/

}