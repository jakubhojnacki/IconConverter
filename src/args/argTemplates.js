/**
 * @module "ArgTemplates" class
 * @description Represents an array of argument templates
 * @version 0.0.3 (2021-08-12)
 */

import "../general/javaScript.js";

export default class ArgTemplates extends Array {
    constructor(pArgTemplates) {
        super();
        if (Array.isNonEmpty(pArgTemplates))
            for (const argTemplate of pArgTemplates)
                this.push(argTemplate);
    }

    get(pTag) {
        return this.find((lArgTemplate) => { return  lArgTemplate.matches(pTag); });
    }
}
