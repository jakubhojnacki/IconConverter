/**
 * @module "Args" class
 * @description Parses and manages application arguments
 * @version 0.0.1 (2021-02-17)
 */

require("../general/javaScript");

const Arg = require("./arg");
const DataType = require("../general/dataType");

class Args extends Array {
    constructor() {
        super();
    }

    static parse(pArgValues, pArgTemplates) {
        let args = new Args();
        let index = -1;
        let tag = "";
        let argTemplate = null;
        for (let argValue of pArgValues) {
            argValue = argValue.trim().removeIfStartsWith("\"").removeIfEndsWith("\"");
            if (argValue.startsWith("-")) {
                tag = argValue.substr(1);
                argTemplate = pArgTemplates.get(tag);
            } else if (argTemplate != null) {
                args.add(argTemplate, argValue);
                argTemplate = null;
            } else {
                index++;
                argTemplate = pArgTemplates.get(index);
                if (argTemplate != null) {
                    args.add(argTemplate, argValue);
                    argTemplate = null;
                }
            }
        }
        return args;
    }

    add(pArgTemplate, pArgValue) {
        const argValue = pArgTemplate.parse(pArgValue);
        this.push(new Arg(pArgTemplate, argValue));
    }

    validate(pArgTemplates, pOnInvalid) {
        let result = true;
        for (const argTemplate of pArgTemplates)
            if (argTemplate.isMandatory(this)) {
                const arg = this.find((lArg) => { return lArg.name === argTemplate.name; });
                if (arg) {
                    if (!arg.value)
                        result = false;
                } else
                    result = false;
            }
        if (!result)
            pOnInvalid(pArgTemplates, this);
        return result;
    }

    get(pName, pDefaultValue) {
        const item = this.find((lArg) => { return lArg.name === pName; });
        let value = null;
        if (item != null)
            value = item.value;
        else
            if (pDefaultValue != null)
                value = pDefaultValue;
            else
                throw new Error(`Unknown arg: ${pName}.`);
        return value;
    }

    log(pIndentation) {
        const logger = global.application.logger;
        let indentation = Number.validate(pIndentation);
        logger.writeText("Args:", indentation);
        for (const arg of this)
            logger.writeText(arg.toString(), indentation + logger.tab);
    }
}

module.exports = Args;