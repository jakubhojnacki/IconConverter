/**
 * @module "IconConverter" class
 * @description Converts icons from ICO to a series of PNG files
 * @version 0.0.1 (2021-04-10)
 */

const fs = require("fs");
const path = require("path");

const FileMask = require("./fileMask");

require("../general/javaScript");

class IconConverter {
    get application() { return global.application; }
    get logger() { return global.application.logger; }
    get sourceFolderPath() { return this.mSourceFolderPath; }
    get sourceFileMask() { return this.mSourceFileMask; }
    get destinationFolderPath() { return this.mDestinationFolderPath; }
    get destinationFileType() { return this.mDestinationFileType; }

    constructor(pSourceFolderPath, pSourceFileMask, pDestinationFolderPath, pDestinationFileType) {
        this.mSourceFolderPath = String.validate(pSourceFolderPath);
        this.mSourceFileMask = new FileMask(pSourceFileMask);
        this.mDestinationFolderPath = String.validate(pDestinationFolderPath);
        this.mDestinationFileType = String.validate(pDestinationFileType);
    }

    run() {
        this.processFolder(this.sourceFolderPath, 0);
    }

    processFolder(pFolderPath, pIndentation) {
        this.logger.writeText(`[${pFolderPath}]`, pIndentation * this.logger.tab);
		const folderEntries = fs.readdirSync(pFolderPath, { withFileTypes: true });
		for (const folderEntry of folderEntries) {
            const folderEntryPath = path.join(pFolderPath, folderEntry.name);
            if (folderEntry.isDirectory)
                this.processFolder(folderEntryPath, pIndentation + 1);
            else if (folderEntry.isFile())
				if (this.sourceFileMask.contains(folderEntry.name))
                    this.processFile(folderEntryPath, pIndentation + 1);
        }
    }  

    processFile(pFilePath, pIndentation) {
        this.logger.writeText(pFilePath, pIndentation * this.logger.tab);
        //TODO - Not implemented
    }
}

module.exports = IconConverter;