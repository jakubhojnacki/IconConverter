/**
 * @module "ArgName" class (static)
 * @description Class representing argument names
 * @version 0.0.1 (2021-02-17)
 */

/*static*/ class ArgName {
    static get sourceFolderPath() { return "SourceFolderPath"; }
    static get sourceFileMask() { return "SourceFileMask"; }
    static get minimumColourDepth() { return "MinimumColourDepth"; }
    static get destinationFolderPath() { return "DestinationFolderPath"; }
    static get destinationFolderNamePattern() { return "DestinationFolderNamePattern"; }
    static get destinationFileType() { return "DestinationFileType"; }
    static get destinationFileNamePattern() { return "DestinationFileNamePattern"; }
    static get ignoreNonSquareImages() { return "IgnoreNonSquareImages"; }
    static get createIndex() { return "CreateIndex"; }
    static get indexFileName() { return "IndexFileName"; }
    static get indexNamePattern() { return "IndexNamePattern"; }
    static get debugMode() { return "DebugMode"; }
}

module.exports = ArgName;