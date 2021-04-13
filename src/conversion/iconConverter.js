/**
 * @module "IconConverter" class
 * @description Converts icons from ICO to a series of PNG files
 * @version 0.0.1 (2021-04-10)
 */

const { timeStamp } = require("console");
const fs = require("fs");
const path = require("path");

const FileMask = require("./fileMask");
const IconIndex = require("./iconIndex");
const ImageMagick = require("./imageMagick");

require("../general/javaScript");

class IconConverter {
    get application() { return global.application; }
    get logger() { return global.application.logger; }
    get sourceFolderPath() { return this.mSourceFolderPath; }
    get sourceFileMask() { return this.mSourceFileMask; }
    get minimumColourDepth() { return this.mMinimumColourDepth; }
    get destinationFolderPath() { return this.mDestinationFolderPath; }
    get destinationFolderNamePattern() { return this.mDestinationFolderNamePattern; }
    get destinationFileType() { return this.mDestinationFileType; }
    get destinationFileNamePattern() { return this.mDestinationFileNamePattern; }
    get ignoreNonSquareImages() { return this.mIgnoreNonSquareImages; }
    get temporaryFolderPath() { return this.mTemporaryFolderPath; }
    get temporaryFileMask() { return this.mTemporaryFileMask; }
    get imageMagick() { return this.mImageMagick; }
    get iconIndex() { return this.mIconIndex; }

    constructor(pSourceFolderPath, pSourceFileMask, pMinimumColourDepth, pDestinationFolderPath, pDestinationFolderNamePattern, pDestinationFileType,
        pDestinationFileNamePattern, pIgnoreNonSquareImages, pCreateIndex, pIndexFileName, pIndexNamePattern) {
        this.mSourceFolderPath = String.validate(pSourceFolderPath);
        this.mSourceFileMask = new FileMask(pSourceFileMask);
        this.mMinimumColourDepth = Number.validateAsInteger(pMinimumColourDepth, 8);
        this.mDestinationFolderPath = String.validate(pDestinationFolderPath);
        this.mDestinationFolderNamePattern = String.validate(pDestinationFolderNamePattern);
        this.mDestinationFileType = String.validate(pDestinationFileType);
        this.mDestinationFileNamePattern = String.validate(pDestinationFileNamePattern);
        this.mIgnoreNonSquareImages = Boolean.validate(pIgnoreNonSquareImages);
        this.mTemporaryFolderPath = path.join(this.destinationFolderPath, "__temp");
        this.mTemporaryFileMask = new FileMask(`*.${this.destinationFileType}`);
        this.mImageMagick = new ImageMagick();
        this.mIconIndex = new IconIndex(pCreateIndex, this.destinationFolderPath, pIndexFileName, pIndexNamePattern);
    }

    async run() {
        this.iconIndex.initialise();
        this.makeSureFolderExists(this.temporaryFolderPath);
        await this.processFolder(this.sourceFolderPath, "/", "", 0);
        this.makeSureFolderIsDeleted(this.temporryFolderPath);
        this.iconIndex.finalise();
    }

    async processFolder(pSourceFolderPath, pSourceFolderName, pDestinationFolderSubPath, pIndentation) {
        this.logger.writeText(`[${pSourceFolderName}]`, pIndentation * this.logger.tab);
		const sourceFolderEntries = fs.readdirSync(pSourceFolderPath, { withFileTypes: true });
		for (const sourceFolderEntry of sourceFolderEntries) {
            if (sourceFolderEntry.isDirectory()) {
                const sourceSubFolderPath = path.join(pSourceFolderPath, sourceFolderEntry.name);
                const destinationSubFolderName = this.convertSourceToDestinationFolderName(sourceFolderEntry.name);
                const destinationSubFolderPath = path.join(pDestinationFolderSubPath, destinationSubFolderName);
                await this.processFolder(sourceSubFolderPath, sourceFolderEntry.name, destinationSubFolderPath, pIndentation + 1);
            } else if (sourceFolderEntry.isFile())
				if (this.sourceFileMask.contains(sourceFolderEntry.name)) {
                    const sourceFilePath = path.join(pSourceFolderPath, sourceFolderEntry.name);
                    await this.processFile(pSourceFolderName, sourceFilePath, sourceFolderEntry.name, pDestinationFolderSubPath, pIndentation + 1);
                }
        }
    }  

    convertSourceToDestinationFolderName(pSourceFolderName) {
        let destinationFolderName =  pSourceFolderName;
        if (this.destinationFolderNamePattern) {
            const linuxCaseFolderName = pSourceFolderName.toLowerCase().replaceAll(" ", "-");
            destinationFolderName = this.destinationFolderNamePattern;
            destinationFolderName = destinationFolderName.replace("{0}", pSourceFolderName);
            destinationFolderName = destinationFolderName.replace("{1}", linuxCaseFolderName);
        }
        return destinationFolderName;
    }

    async processFile(pSourceFolderName, pSourceFilePath, pSourceFileName, pDestinationFolderSubPath, pIndentation) {
        this.logger.writeText(pSourceFileName, pIndentation * this.logger.tab);
        this.emptyTemporaryFolder();
        await this.splitSourceFile(pSourceFilePath);
        const destinationFileName = this.convertSourceToDestinationFileName(pSourceFileName);
        await this.processTemporaryFiles(pSourceFolderName, pDestinationFolderSubPath, destinationFileName);
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

    convertSourceToDestinationFileName(pSourceFileName) {
        const sourceFileNameWithoutExtension = path.parse(pSourceFileName).name;
        let destinationFileName =  sourceFileNameWithoutExtension;
        if (this.destinationFileNamePattern) {
            const linuxCaseFileName = sourceFileNameWithoutExtension.toLowerCase().replaceAll(" ", "-");
            destinationFileName = this.destinationFileNamePattern;
            destinationFileName = destinationFileName.replace("{0}", pSourceFileName);
            destinationFileName = destinationFileName.replace("{1}", linuxCaseFileName);
        }
        return `${destinationFileName}.${this.destinationFileType}`;
    }

    async processTemporaryFiles(pSourceFolderName, pDestinationFolderSubPath, pDestinationFileName) {
		const temporaryFolderEntries = fs.readdirSync(this.temporaryFolderPath, { withFileTypes: true });
		for (const temporaryFolderEntry of temporaryFolderEntries)
            if (temporaryFolderEntry.isFile())
                if (this.temporaryFileMask.contains(temporaryFolderEntry.name)) {
                    const temporaryFilePath = path.join(this.temporaryFolderPath, temporaryFolderEntry.name);
                    const imageInformation = await this.imageMagick.getInformation(temporaryFilePath);
                    if (imageInformation.depth >= this.minimumColourDepth)
                        if ((!this.ignoreNonSquareImages) || (imageInformation.width == imageInformation.height))
                            this.copyFileToDestination(pSourceFolderName, temporaryFilePath, imageInformation, pDestinationFolderSubPath, pDestinationFileName);
                }
    }    

    copyFileToDestination(pSourceFolderName, pTemporaryFilePath, pImageInformation, pDestinationFolderSubPath, pFileName) {
        const destinationSizeSubFolder = `${pImageInformation.width}x${pImageInformation.height}`;
        const destinationFolderPath = path.join(this.destinationFolderPath, destinationSizeSubFolder, pDestinationFolderSubPath);
        this.makeSureFolderExists(destinationFolderPath);
        const destinationFilePath = path.join(destinationFolderPath, pFileName);
        fs.copyFileSync(pTemporaryFilePath, destinationFilePath);
        const indexFolder = path.join(destinationSizeSubFolder, pDestinationFolderSubPath);
        this.iconIndex.add(indexFolder, pImageInformation.width, pSourceFolderName);
    }

    makeSureFolderExists(pFolderPath) {
        if (!fs.existsSync(pFolderPath))
            fs.mkdirSync(pFolderPath, { recursive: true });
    }

    makeSureFolderIsDeleted(pFolderPath) {
        if (fs.existsSync(pFolderPath))
            fs.rmdirSync(pFolderPath);
    }
}

module.exports = IconConverter;