/**
 * @module "IconConverter" class
 * @description Converts icons from ICO to a series of PNG files
 * @version 0.0.1 (2021-04-10)
 */

const fs = require("fs");
const path = require("path");

const FileMask = require("./fileMask");
const ImageMagick = require("./imageMagick");

require("../general/javaScript");

class IconConverter {
    get application() { return global.application; }
    get logger() { return global.application.logger; }
    get sourceFolderPath() { return this.mSourceFolderPath; }
    get sourceFileMask() { return this.mSourceFileMask; }
    get destinationFolderPath() { return this.mDestinationFolderPath; }
    get destinationFileType() { return this.mDestinationFileType; }
    get temporaryFolderPath() { return this.mTemporaryFolderPath; }
    get temporaryFileMask() { return this.mTemporaryFileMask; }
    get imageMagick() { return this.mImageMagick; }

    constructor(pSourceFolderPath, pSourceFileMask, pDestinationFolderPath, pDestinationFileType) {
        this.mSourceFolderPath = String.validate(pSourceFolderPath);
        this.mSourceFileMask = new FileMask(pSourceFileMask);
        this.mDestinationFolderPath = String.validate(pDestinationFolderPath);
        this.mDestinationFileType = String.validate(pDestinationFileType);
        this.mTemporaryFolderPath = path.join(this.destinationFolderPath, "__temp");
        this.mTemporaryFileMask = new FileMask(`*.${this.destinationFileType}`);
        this.mImageMagick = new ImageMagick();
    }

    async run() {
        this.makeSureTemporaryFolderExists();
        await this.processFolder(this.sourceFolderPath, "/", this.destinationFolderPath, 0);
    }

    makeSureTemporaryFolderExists() {
        if (!fs.existsSync(this.temporaryFolderPath))
            fs.mkdirSync(this.temporaryFolderPath);
    }

    async processFolder(pSourceFolderPath, pSourceFolderName, pDestinationFolderPath, pIndentation) {
        this.logger.writeText(`[${pSourceFolderName}]`, pIndentation * this.logger.tab);
		const sourceFolderEntries = fs.readdirSync(pSourceFolderPath, { withFileTypes: true });
		for (const sourceFolderEntry of sourceFolderEntries) {
            if (sourceFolderEntry.isDirectory()) {
                const sourceSubFolderPath = path.join(pSourceFolderPath, sourceFolderEntry.name);
                const destinationSubFolderName = this.convertSourceToDestinationFolderName(sourceFolderEntry.name);
                const destinationSubFolderPath = path.join(pDestinationFolderPath, destinationSubFolderName);
                this.processFolder(sourceSubFolderPath, sourceFolderEntry.name, destinationSubFolderPath, pIndentation + 1);
            } else if (sourceFolderEntry.isFile())
				if (this.sourceFileMask.contains(sourceFolderEntry.name)) {
                    const sourceFilePath = path.join(pSourceFolderPath, sourceFolderEntry.name);
                    await this.processFile(sourceFilePath, sourceFolderEntry.name, pDestinationFolderPath, pIndentation + 1);
                }
        }
    }  

    convertSourceToDestinationFolderName(pSourceFolderName) {
        return pSourceFolderName.toLowerCase().replace(" ", "-");
    }

    async processFile(pSourceFilePath, pSourceFileName, pDestinationFolderPath, pIndentation) {
        this.logger.writeText(pSourceFileName, pIndentation * this.logger.tab);
        this.emptyTemporaryFolder();
        await this.splitSourceFile(pSourceFilePath);
        await this.processTemporaryFiles();
    }

    emptyTemporaryFolder() {
		const temporaryFolderEntries = fs.readdirSync(this.temporaryFolderPath, { withFileTypes: true });
		for (const temporaryFolderEntry of temporaryFolderEntries)
            if (temporaryFolderEntry.isFile())
                if (!temporaryFolderEntry.name.startsWith("."))
                    fs.unlinkSync(path.join(this.temporaryFolderPath, temporaryFolderEntry.name));
    }

    async splitSourceFile(pSourceFilePath) {
        await this.imageMagick.split(pSourceFilePath, this.temporaryFolderPath, this.destinationFileType);
    }

    async processTemporaryFiles() {
		const temporaryFolderEntries = fs.readdirSync(this.temporaryFolderPath, { withFileTypes: true });
		for (const temporaryFolderEntry of temporaryFolderEntries)
            if (temporaryFolderEntry.isFile())
                if (this.temporaryFileMask.contains(temporaryFolderEntry.name)) {
                    const temporaryFilePath = path.join(this.temporaryFolderPath, temporaryFolderEntry.name);
                    const imageInformation = await this.imageMagick.getInformation(temporaryFilePath);
                    this.logger.writeText(imageInformation);
                }
    }    

    /* 
    makeSureDestinationFolderExists(pSourceSubFolderName, pDestinationFolderPath) {
        const destinationSubFolderName = ;
        const destinationSubFolderPath = path.join(pDestinationFolderPath, destinationSubFolderName);
        if (fs.existsSync(destinationSubFolderPath))
            fs.mkdirSync(destinationSubFolderPath);
        return destinationSubFolderPath;
    }
    */
}

module.exports = IconConverter;