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
            new ArgTemplate([ "sf", "sourceFolderPath" ], ArgName.sourceFolderPath, "Path of source folder", DataType.string),
            new ArgTemplate([ "df", "destinationFolderPath" ], ArgName.destinationFolderPath, "Path of destination folder", DataType.string),
            new ArgTemplate([ "d", "debugMode" ], ArgName.debugMode, "Defines debug mode (\"true\" or \"false\")", DataType.boolean)
        ]);        
    }
}

module.exports = ArgTemplateFactory;