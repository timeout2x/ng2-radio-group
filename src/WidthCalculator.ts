import {Injectable} from "@angular/core";

@Injectable()
export class WidthCalculator {

    /**
     * Recalculates input width when input's value changes.
     *
     * @param {HTMLInputElement} input
     * @param {Event} event
     */
    recalculateInputWidth(input: HTMLInputElement, event?: any, value?: any) {
        if (event && (event.metaKey || event.altKey || !event.target)) return;
    
        value = value !== undefined ? value : input.value;
        if (event && event.type && event.type.toLowerCase() === "keydown")
            value = this.processValueAfterPressedKey(value, this.getSelection(input), event.keyCode, event.shiftKey);
    
        // if there is NO value in the input, it means that in the input there can be
        // a placeholder value. and if placeholder is not empty then use its value to measure
        let placeholder = input.getAttribute("placeholder") || "";
        if (!value.length && placeholder.length > 0) {
            value = placeholder;
        }
    
        // finally measure input value's width and update input's width
        let measureContainer = this.createInputStringMeasureContainer(input);
        let width = this.measureString(value, measureContainer) + 10;
        input.style.setProperty("width", width + "px");
    }

    /**
     * Creates and returns a container in the DOM where string can be stored to measure its length.
     *
     * @param {HTMLInputElement} parentElement Element (input box) from where properties will be copied to match
     *                               the styles (font-size, font-family, etc.) to make a proper string measurement
     * @returns {object} Created element where string can be stored to measure string length
     */
    createInputStringMeasureContainer(parentElement: HTMLInputElement) {
        let body: any = document.querySelector("body");
        let stringMeasureElement = document.getElementById("tokenInputStringMeasure");
        if (!stringMeasureElement) {
            stringMeasureElement = document.createElement("div");
            stringMeasureElement.id = "tokenInputStringMeasure";
            const styles: any = {
                position: "absolute",
                top: "-99999px",
                left: "-99999px",
                width: "auto",
                padding: 0,
                whiteSpace: "pre"
            };
            Object.keys(styles).forEach(key => {
                stringMeasureElement.style.setProperty(key, styles[key]);
            });
            body.appendChild(stringMeasureElement);
        }

        this.transferStyles(parentElement, stringMeasureElement, [
            "letterSpacing",
            "fontSize",
            "fontFamily",
            "fontWeight",
            "textTransform"
        ]);
    
        return stringMeasureElement;
    }

    /**
     * Copies CSS properties from one element to another.
     *
     * @param {HTMLElement} from
     * @param {HTMLElement} to
     * @param {string[]|Array} properties
     */
    transferStyles(from: HTMLElement, to: HTMLElement, properties: string[]) {
        let i: number, n: number, styles: any = {};
        if (properties) {
            for (i = 0, n = properties.length; i < n; i++) {
                styles[properties[i]] = this.css(from/*[0]*/, properties[i]);
            }
        } else {
            const fromStyles: any = from.style;
            Object.keys(fromStyles).filter(styleName => fromStyles[styleName] !== "").forEach(styleName => {
                styles[styleName] = fromStyles[styleName];
            });
        }
        Object.keys(styles).forEach(key => {
            (to as any).style[key] = styles[key];
        });
    }

    /**
     * Gets the proper value of the given CSS property.
     *
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {string|undefined}
     */
    css(element: any, name: string) {
        let val: string;
        if (typeof element.currentStyle !== "undefined") { // for old IE
            val = element.currentStyle[name];
        } else if (typeof window.getComputedStyle !== "undefined") { // for modern browsers
            val = element.ownerDocument.defaultView.getComputedStyle(element, null)[name];
        } else {
            val = element.style[name];
        }
        return (val === "") ? undefined : val;
    }

    /**
     * Measures the width of a string within a parent element (in pixels).
     *
     * @param {string} str String to be measured
     * @param {HTMLElement} measureContainer html element
     * @returns {int}
     */
    measureString(str: string, measureContainer: HTMLElement) {
        str = str.replace(new RegExp(" ", "g"), "_"); // replace spaces
        const textNode = document.createTextNode(str);
        measureContainer.appendChild(textNode);
        let width = measureContainer.offsetWidth;
        measureContainer.innerHTML = "";
        return width;
    }

    /**
     * Determines the current selection within a text input control.
     * Returns an object containing:
     *   - start  Where selection started
     *   - length How many characters were selected
     *
     * @param {object} inputElement
     * @returns {{start: int, length: int}}
     */
    getSelection(inputElement: any) {
        let selection = { start: 0, length: 0 };
    
        if ("selectionStart" in inputElement) {
            selection.start  = inputElement.selectionStart;
            selection.length = inputElement.selectionEnd - inputElement.selectionStart;
    
        } else if ((document as any).selection) {
            inputElement.focus();
            let sel = (document as any).selection.createRange();
            let selLen = (document as any).selection.createRange().text.length;
            sel.moveStart("character", inputElement.value.length * -1);
            selection.start  = sel.text.length - selLen;
            selection.length = selLen;
        }
    
        return selection;
    }

    /**
     * Removes value based on the cursor position. If there is something selected then
     * this selected text will be removed, otherwise if no selection, but BACKSPACE key
     * has been pressed, then previous character will be removed, or if DELETE key has
     * been pressed when next character will be removed.
     *
     * @param {string} value The input value
     * @param {object} selection Current selection in the input
     * @param {int} pressedKeyCode Key that was pressed by a user
     * @returns {string}
     */
    removeValueByCursorPosition(value: string, selection: any, pressedKeyCode: number) {
    
        if (selection.length) {
            return value.substring(0, selection.start) + value.substring(selection.start + selection.length);
    
        } else if (pressedKeyCode === 8 /* "BACKSPACE" */ && selection.start) {
            return value.substring(0, selection.start - 1) + value.substring(selection.start + 1);
    
        } else if (pressedKeyCode === 46 /* "DELETE" */ && typeof selection.start !== "undefined") {
            return value.substring(0, selection.start) + value.substring(selection.start + 1);
        }
    
        return value;
    }

    /**
     * Checks if given key code is a-z, or A-Z, or 1-9 or space.
     *
     * @param {number} keyCode
     * @returns {boolean} True if key code in the [a-zA-Z0-9 ] range or not
     */
    isPrintableKey(keyCode: number) {
        return ((keyCode >= 97 && keyCode <= 122) || // a-z
            (keyCode >= 65 && keyCode <= 90)  || // A-Z
            (keyCode >= 48 && keyCode <= 57)  || // 0-9
            keyCode === 32 // space
        );
    }

    /**
     * Checks if given key code is "removing key" (e.g. backspace or delete).
     *
     * @param {number} keyCode
     * @returns {boolean}
     */
    isRemovingKey(keyCode: number) {
        return keyCode === 46 || keyCode === 8; // "DELETE" or "BACKSPACE"
    }

    /**
     * Processes a value after some key has been pressed by a user.
     *
     * @param {string} value
     * @param {{ start: number, length: number }} selection Position where user selected a text
     * @param {number} keyCode The code of the key that has been pressed
     * @param {boolean} shiftKey Indicates if shift key has been pressed or not
     * @returns {string}
     */
    processValueAfterPressedKey(value: string, selection: { start: number, length: number }, keyCode: number, shiftKey: boolean) {
    
        if (this.isRemovingKey(keyCode))
            return this.removeValueByCursorPosition(value, selection, keyCode);

        if (this.isPrintableKey(keyCode)) {
            let character = String.fromCharCode(keyCode);
            character = shiftKey ? character.toUpperCase() : character.toLowerCase();
            return value + character;
        }
    
        return value;
    }
}