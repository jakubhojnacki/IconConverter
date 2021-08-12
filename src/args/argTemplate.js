/**
 * @module "ArgTemplate" class
 * @description Class defaining a template for one application argument
 * @version 0.0.3 (2021-08-12)
 */

import "../general/javaScript.js";
import ArgTag from "./argTag.js";
import DataType from "../general/dataType.js";

export default class ArgTemplate {
    get tag() { return this.mTag; }
    get name() { return this.mName; }
    get description() { return this.mDescription; }
    get dataType() { return this.mDataType; }
    get mandatory() { return this.mMandatory; }

    constructor(pTag, pName, pDescription, pDataType, pMandatory) {
        this.mTag = new ArgTag(pTag);
        this.mName = String.validate(pName);
        this.mDescription = String.validate(pDescription);
        this.mDataType = typeof(pDataType) === "function" ? pDataType : DataType.parse(pDataType);
        this.mMandatory = typeof(pMandatory) === "function" ? pMandatory : Boolean.validate(pMandatory);
    }

    toString(pArgs) {
        let string = `${this.tag.toString(this.name)} = ${this.description}`;
        if (pArgs)
            if (this.isMandatory(pArgs))
                string += " (Mandatory)";        
        return string;
    }

    isMandatory(pArgs) {
        let mandatory = false;
        switch (typeof(this.mandatory))
        {
            case "boolean":
                mandatory = this.mandatory;
                break;
            case "function":
                mandatory = this.mandatory(pArgs);
                break;
        }
        return mandatory;
    }    

    matches(pValue) {
        return this.tag.matches(pValue);
    }

    parse(pValue) {
        let parsedValue = null;
        if (typeof(this.dataType) === "function")
            parsedValue = this.dataType(pValue)
        else
            parsedValue = DataType.validateValue(pValue, this.dataType);
        return parsedValue;
    }
}
