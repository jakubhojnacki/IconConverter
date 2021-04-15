/** 
 * @module "ArgTemplateFactory" class (static)
 * @description Creates arg templates
 * @version 0.0.1 (2021-02-24)
 */

require("../general/javaScript");

const ArgName = require("./argName");
const ArgTemplate = require("./argTemplate");
const ArgTemplates = require("./argTemplates");
const DataType = require("../general/dataType");

/*static*/ class ArgTemplateFactory {
    static create() {
        return new ArgTemplates([
            new ArgTemplate([ "s", "settingsFilePath" ], ArgName.settingsFilePath, "Path to settings file", DataType.string)
        ]);        
    }
}

module.exports = ArgTemplateFactory;