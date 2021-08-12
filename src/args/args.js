/**
 * @module "Args" class
 * @description Parses and manages application arguments
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";
import Arg from "./arg.js";
import ArgTemplateFactory from "./argTemplateFactory.js";

export default class Args extends Array {
    get argTemplates() { return this.mArgTemplates; }

    constructor() {
        super();
        this.mArgTemplates = ArgTemplateFactory.argTemplates;
    }

    static parse() {
        let argValues = process.argv;
        let args = new Args();
        let index = -1;
        let tag = "";
        let argTemplate = null;
        argValues.shift();
        argValues.shift();
        for (let argValue of argValues) {
            argValue = argValue.trim().removeIfStartsWith("\"").removeIfEndsWith("\"");
            if (argValue.startsWith("-")) {
                tag = argValue.substr(1);
                argTemplate = args.argTemplates.get(tag);
            } else if (argTemplate != null) {
                args.add(argTemplate, argValue);
                argTemplate = null;
            } else {
                index++;
                argTemplate = args.argTemplates.get(index);
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

    validate() {
        let result = true;
        for (const argTemplate of this.argTemplates)
            if (argTemplate.isMandatory(this)) {
                const arg = this.find((lArg) => { return lArg.name === argTemplate.name; });
                if (arg) {
                    if (!arg.value)
                        result = false;
                } else
                    result = false;
            }
        if (!result)
            this.reportInvalid();
        return result;
    }

    reportInvalid() {
        const logger = global.theApplication.logger;
        let indentation = logger.tab;
        logger.writeLine("Application args:", indentation);
        for (const argTemplate of this.argTemplates) {
            logger.writeLine(argTemplate.toString(this), indentation);
            const arg = this.find((lArg) => { return lArg.name === argTemplate.name; });
            if (arg != null)
                logger.writeLine(`Passed: ${arg.value}; Valid: ${arg.valid}.`, indentation + logger.tab);
            else
                logger.writeLine("Not passed.", indentation + logger.tab);
        }
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
        const logger = global.theApplication.logger;
        let indentation = Number.validate(pIndentation);
        logger.writeLine("Args:", indentation);
        for (const arg of this)
            logger.writeLine(arg.toString(), indentation + logger.tab);
    }
}
