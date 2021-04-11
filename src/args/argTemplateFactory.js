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
            new ArgTemplate([ "s", "sourceFolderPath" ], ArgName.sourceFolderPath, "Path of source folder", DataType.string),
            new ArgTemplate([ "m", "sourceFileMask" ], ArgName.sourceFileMask, "Mask of source files to process", DataType.string),
            new ArgTemplate([ "d", "destinationFolderPath" ], ArgName.destinationFolderPath, "Path of destination folder", DataType.string),
            new ArgTemplate([ "t", "destinationFileType" ], ArgName.destinationFileType, "Type of destination file", DataType.string),
            new ArgTemplate([ "dm", "debugMode" ], ArgName.debugMode, "Defines debug mode (\"true\" or \"false\")", DataType.boolean)
        ]);        
    }
}

module.exports = ArgTemplateFactory;