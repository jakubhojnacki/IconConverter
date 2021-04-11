/**
 * @module "ArgName" class (static)
 * @description Class representing argument names
 * @version 0.0.1 (2021-02-17)
 */

/*static*/ class ArgName {
    static get sourceFolderPath() { return "SourceFolderPath"; }
    static get sourceFileMask() { return "SourceFileMask"; }
    static get destinationFolderPath() { return "DestinationFolderPath"; }
    static get destinationFileType() { return "DestinationFileType"; }
    static get debugMode() { return "DebugMode"; }
}

module.exports = ArgName;