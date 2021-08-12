/**
 * @module "Arg" class
 * @description Class representing one application argument
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";
import StringBuilder from "../general/stringBuilder.js";

export default class Arg {
    get template() { return this.mTemplate; }
    get name() { return this.mTemplate.name; }
    get dataType() { return this.mTemplate.dataType; }
    get value() { return this.mValue; }
    get valid() { return this.mValid; }
    set valid(pValue) { this.mValid = pValue; }

    constructor(pTemplate, pValue) {
        this.mTemplate = pTemplate;
        this.mValue = pValue;
        this.mValid = true;
    }

    toString() {
        return StringBuilder.nameValue(this.name, this.value);
    }
}
