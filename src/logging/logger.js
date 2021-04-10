/**
 * @module "Logger" class (abstract)
 * @description Logs application messages as text
 * @version 0.0.1 (2021-02-17)
 */

require("../general/javaScript");

const StringBuilder = require("../general/stringBuilder");

/*abstract*/ class Logger {
    get width() { return this.mWidth; }
    get tab() { return this.mTab; }
    
    constructor(pWidth, pTab) {
        this.mWidth = Number.validate(pWidth, 80);
        this.mTab = Number.validate(pTab, 2);
    }

    newLine() {
        this.writeText();
    }

    writeText(pText, pIndentation) {
        const indentation = Number.validate(pIndentation);
        const indentationText = indentation > 0 ? " ".repeat(indentation) : "";
        this.log(indentationText + (pText ? pText : ""));
    }

    writeSeparator(pIndentation) {
        const indentation = Number.validate(pIndentation);
        this.writeText('-'.repeat(this.width - 1 - indentation), indentation);
    }

    writeError(pText, pIndentation) {
        const text = pText.trim().toLowerCase().startsWith("error") ? pText : `Error: ${pText}`;
        this.writeText(text, pIndentation);
    }

    writeObject(pObject, pIndentation, pWriteFunctions) {
        const writeFunctions = Boolean.validate(pWriteFunctions);
        if (pObject != null) {
            for (const property in pObject)
                switch (typeof(pObject[property])) {
                    case "object":
                        this.writeObject(pObject[property], pIndentation + this.tab);
                        break;
                    case "function":
                        if (writeFunctions)
                            this.writeText(StringBuilder.nameValue(property, "function()"), pIndentation + this.tab);
                        break;
                    default:
                        this.writeText(StringBuilder.nameValue(property, pObject[property]), pIndentation + this.tab);
                        break;
                }
        } else
            this.writeText("null", pIndentation);
    }
}

module.exports = Logger;