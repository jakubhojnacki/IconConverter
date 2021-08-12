/**
 * @module "EnumItem" class
 * @description Representing one enum item
 * @version 0.0.3 (2021-08-12)
 */

import "./javaScript.js";

export default class EnumItem {
    get value() { return this.mValue; }
    get default() { return this.mDefault; }
    get inputs() { return this.mInputs; }
    get output() { return this.mOutput; }

    constructor(pValue, pDefault, pInputs, pOutput) {
        this.mValue = String.validate(pValue);
        this.mDefault = Boolean.validate(pDefault);
        this.mInputs = EnumItem.parseInputs(pInputs);
        this.mOutput = String.validate(pOutput);
    }

    static parseInputs(pInputs) {
        const inputs = Array.isNonEmpty(pInputs) ? pInputs : (pInputs ? [ pInputs ] : [ ]);
        const parsedInputs = [ ];
        for (const input of inputs)
            parsedInputs.push(String.validate(input).trim().toLowerCase());
        return parsedInputs;
    }

    matches(pString) {
        const string = String.validate(pString).trim().toLowerCase();
        let result = (this.value.trim().toLowerCase() === string);
        if ((!result) && (Array.isNonEmpty(this.inputs)))
            result = this.inputs.contains(string);
        if ((!result) && (this.output))
            result = (this.output.trim().toLowerCase() === string);
        return result;
    }
}
