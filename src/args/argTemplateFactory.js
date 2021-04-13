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
            new ArgTemplate([ "s", "sourceFolderPath" ], ArgName.sourceFolderPath, "Path of source folder", DataType.string, true),
            new ArgTemplate([ "m", "sourceFileMask" ], ArgName.sourceFileMask, "Mask of source files to process", DataType.string),
            new ArgTemplate([ "c", "minimumColourDepth" ], ArgName.minimumColourDepth, "Minimum colour depth (default: 8)", DataType.integer),
            new ArgTemplate([ "d", "destinationFolderPath" ], ArgName.destinationFolderPath, "Path of destination folder", DataType.string, true),
            new ArgTemplate([ "fo", "destinationFolderNamePattern" ], ArgName.destinationFolderNamePattern, "Destination folder name pattern (use {0} for original name, {1} for linux-cased name)", DataType.string),
            new ArgTemplate([ "t", "destinationFileType" ], ArgName.destinationFileType, "Type of destination file", DataType.string, true),
            new ArgTemplate([ "fi", "destinationFileNamePattern" ], ArgName.destinationFileNamePattern, "Destination file name pattern (use {0} for original name, {1} for linux-cased name)", DataType.string),
            new ArgTemplate([ "ins", "ignoreNonSquareImages" ], ArgName.ignoreNonSquareImages, "Flag to ignore non-square images", DataType.boolean),
            new ArgTemplate([ "i", "createIndex" ], ArgName.createIndex, "Flag to create index", DataType.boolean),
            new ArgTemplate([ "if", "indexFileName" ], ArgName.indexFileName, "Index file name", DataType.string),
            new ArgTemplate([ "in", "indexNamePattern" ], ArgName.indexNamePattern, "Index name pattern (use {0} for original name, {1} for linux-cased name)", DataType.string),
            new ArgTemplate([ "dm", "debugMode" ], ArgName.debugMode, "Defines debug mode (\"true\" or \"false\")", DataType.boolean)
        ]);        
    }
}

module.exports = ArgTemplateFactory;