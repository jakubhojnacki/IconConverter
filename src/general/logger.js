/**
 * @module "Logger" class
 * @description Logs application messages as text
 * @version 0.0.3 (2021-08-10)
 */

import "./javaScript.js";
import StringBuilder from "./stringBuilder.js";

export default class Logger {
    get width() { return this.mWidth; }
    get tab() { return this.mTab; }
    
    constructor(pWidth, pTab) {
        this.mWidth = Number.validateAsInteger(pWidth, 80);
        this.mTab = Number.validateAsInteger(pTab, 2);
    }

    indentText(pText, pIndentation) {
        const indentation = Number.validate(pIndentation);
        const indentationText = indentation > 0 ? " ".repeat(indentation) : "";
        return indentationText + String.validate(pText);
    }

    newLine() {
        console.log();
    }

    write(pText, pIndentation) {
        process.stdout.write(this.indentText(pText, pIndentation));
    }

    writeLine(pText, pIndentation) {
        console.log(this.indentText(pText, pIndentation));
    }

    writeSeparator(pIndentation) {
        const indentation = Number.validate(pIndentation);
        this.writeLine('-'.repeat(this.width - 1 - indentation), indentation);
    }

    writeError(pText, pIndentation) {
        const text = pText.trim().toLowerCase().startsWith("error") ? pText : `Error: ${pText}`;
        this.writeLine(text, pIndentation);
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
                            this.writeLine(StringBuilder.nameValue(property, "function()"), pIndentation + this.tab);
                        break;
                    default:
                        this.writeLine(StringBuilder.nameValue(property, pObject[property]), pIndentation + this.tab);
                        break;
                }
        } else
            this.writeLine("null", pIndentation);
    }
}
