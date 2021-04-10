/**
 * @module "StringBuilder" class
 * @description Class used to build various strings
 * @version 0.0.1 (2021-02-20)
 */

require("./javaScript");

class StringBuilder {
    get multiLine() { return this.mMultiLine; }
    get content() { return this.mContent; }
    set content(pValue) { this.mContent = pValue; }

    constructor(pMultiLine, pContent) {
        this.mMultiLine = Boolean.validate(pMultiLine);
        this.mContent = String.validate(pContent);
    }

    static nameValue(pName, pValue) {
        return `${pName}: ${pValue != null ? pValue: "null"}`;
    }

    addText(pText) {
        if (this.content)
            if (this.multiLine)
                this.content += "\r\n";
            else
                this.content += "; ";
        this.content += pText;
    }

    addNameValue(pName, pValue) {
        this.addText(StringBuilder.nameValue(pName, pValue));
    }

    toString() {
        return this.content;
    }
}

module.exports = StringBuilder;