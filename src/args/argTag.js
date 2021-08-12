/**
 * @module "ArgTag" class
 * @description Class for manipulating tags
 * @version 0.0.3 (2021-08-12)
 */

import "../general/javaScript.js";

export default class ArgTag {
    get value() { return this.mValue; }

    constructor(pValue) {
        this.mValue = ArgTag.parse(pValue, true);
    }

    static parse(pValue, pAllowArray) {
        let parsedValue = null;
        const allowArray = Boolean.validate(pAllowArray);
        
        switch (typeof(pValue)) {
            case "string":
                parsedValue = pValue.trim().toLowerCase();
                break;
            case "number":
                parsedValue = pValue;
                break;
            case "object":
                if ((allowArray) && (Array.isArray(pValue))) {
                    parsedValue = [ ];
                    for (const valueItem of pValue) {
                        const parsedValueItem = ArgTag.parse(valueItem);
                        parsedValue.push(parsedValueItem);
                    }
                }
        }

        if (parsedValue == null)
            if (allowArray)
                throw new Error("Arg tag can be only a text, an integer number (index) or an array of any of those.");
            else
                throw new Error("Arg tag can be only a text or an integer number (index).");

        return parsedValue;
    }

    matches(pValue) {
        let result = false;
        const value = ArgTag.parse(pValue, false);
        if (Array.isArray(this.value)) {
            for (const valueItem of this.value)
                if (valueItem === value) {
                    result = true;
                    break;
                }
        } else 
            result = (this.value === value);
        return result;
    }

    toString(pName) {
        let string = "";
        switch (typeof(this.value)) {
            case "string":
                string = `-${this.value} [${pName}]`;
                break;
            case "number":
                string = `[${pName}]`;
                break;
            default:
                string = "-" + this.value.join(` [${pName}] | -`) + ` [${pName}]`; 
                break;
        }
        return string;        
    }
}
