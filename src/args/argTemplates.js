/**
 * @module "ArgTemplates" class
 * @description Represents an array of argument templates
 * @version 0.0.2 (2021-04-06)
 */

require("../general/javaScript");

class ArgTemplates extends Array {
    constructor(pArgTemplates) {
        super();
        if (Array.isNonEmpty(pArgTemplates))
            for (const argTemplate of pArgTemplates)
                this.push(argTemplate);
    }

    reportInvalid(pArgs, pIndentation) {
        const logger = global.application.logger;
        let indentation = Number.validate(pIndentation);
        logger.writeText("Application args:", indentation);
        indentation += logger.tab;
        for (const argTemplate of this) {
            logger.writeText(argTemplate.toString(pArgs), indentation);
            const arg = pArgs.find((lArg) => { return lArg.name === argTemplate.name; });
            if (arg != null)
                logger.writeText(`Passed: ${arg.value}; Valid: ${arg.valid}.`, indentation + logger.tab);
            else
                logger.writeText("Not passed.", indentation + logger.tab);
        }
    }

    get(pTag) {
        return this.find((lArgTemplate) => { return  lArgTemplate.matches(pTag); });
    }
}

module.exports = ArgTemplates;