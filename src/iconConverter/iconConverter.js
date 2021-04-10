/**
 * @module "IconConverter" class
 * @description Converts icons from ICO to a series of PNG files
 * @version 0.0.1 (2021-04-10)
 */

require("../general/javaScript");

class IconConverter {
    get application() { return global.application; }
    get logger() { return global.application.logger; }
    get sourceFolderPath() { return this.mSourceFolderPath; }
    get destinationFolderPath() { return this.mDestinationFolderPath; }

    constructor(pSourceFolderPath, pDestinationFolderPath) {
        this.mSourceFolderPath = String.validate(pSourceFolderPath);
        this.mDestinationFolderPath = String.validate(pDestinationFolderPath);
    }

    run() {
        this.processFolder(this.sourceFolderPath, 0);
    }

    processFolder(pFolderPath, pIndentation) {
        this.logger.writeText(pFolderPath, pIndentation);
    }  
}

module.exports = IconConverter;