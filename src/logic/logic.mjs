/**
 * @module "Engine" class
 * @description Runs main application task(s)
 * @version 0.0.2 (2021-08-12)
 */

import Path from "path";

import FileMask from "./fileMask.js";
import FileSystem from "fs";
import IconIndex from "./iconIndex.js";
import ImageMagickRunner from "./imageMagickRunner.js";
import { Validator } from "core-library";

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }
    get sourceDirectoryPath() { return this.mSourceDirectoryPath; }
    set sourceDirectoryPath(pValue) { this.mSourceDirectoryPath = String.verify(pValue); }
    get destinationDirectoryPath() { return this.mDestinationDirectoryPath; }
    set destinationDirectoryPath(pValue) { this.mDestinationDirectoryPath = String.verify(pValue); }
    get temporaryDirectoryPath() { return this.mTemporaryDirectoryPath; }
    set temporaryDirectoryPath(pValue) { this.mTemporaryDirectoryPath = String.verify(pValue); }
    
    get temporaryDirectoryPath() { return this.mTemporaryDirectoryPath; }
    get temporaryFileMask() { return this.mTemporaryFileMask; }
    get imageMagickRunner() { return this.mImageMagickRunner; }
    get iconIndex() { return this.mIconIndex; }

    constructor(pApplication, pSourceDirectoryPath, pDestinationDirectoryPath) {
        this.application = pApplication;
        this.sourceDirectoryPath = pSourceDirectoryPath;
        this.destinationDirectoryPath = pDestinationDirectoryPath;
        this.temporaryDirectoryPath = Path.join(this.destinationDirectoryPath, ".temp");

        this.mTemporaryFileMask = new FileMask(`*.${this.settings.destination.fileType}`);
        this.mImageMagickRunner = new ImageMagickRunner();
        this.mIconIndex = new IconIndex(this.settings.index.create, this.destinationDirectoryPath, this.settings.index.fileName, 
            this.settings.index.namePattern);
    }

    async run() {
        this.validate();
        this.iconIndex.initialise();
        this.makeSureDirectoryExists(this.temporaryDirectoryPath);
        await this.processDirectory(this.sourceDirectoryPath, "/", "", 0);
        this.makeSureDirectoryIsDeleted(this.temporaryDirectoryPath);
        this.iconIndex.finalise();
    }

    validate() {
        let result = false;
        const validator = new ConsoleValidator();
        validator.setComponent(Logic.name);
        validator.testNotEmpty("sourceDirectoryPath", this.sourceDirectoryPath);
        validator.testNotEmpty("destinationDirectoryPath", this.destinationDirectoryPath);
        validator.restoreComponent();
        return result;
    }    
    
    async processDirectory(pSourceDirectoryPath, pSourceDirectoryName, pDestinationDirectorySubPath, pIndentation) {
        this.logger.writeLine(`[${pSourceDirectoryName}]`, pIndentation * this.logger.tab);
		const sourceDirectoryEntries = FileSystem.readdirSync(pSourceDirectoryPath, { withFileTypes: true });
		for (const sourceDirectoryEntry of sourceDirectoryEntries) {
            if (sourceDirectoryEntry.isDirectory()) {
                const sourceSubDirectoryPath = Path.join(pSourceDirectoryPath, sourceDirectoryEntry.name);
                const destinationSubDirectoryName = this.convertSourceToDestinationDirectoryName(sourceDirectoryEntry.name);
                const destinationSubDirectoryPath = Path.join(pDestinationDirectorySubPath, destinationSubDirectoryName);
                await this.processDirectory(sourceSubDirectoryPath, sourceDirectoryEntry.name, destinationSubDirectoryPath, pIndentation + 1);
            } else if (sourceDirectoryEntry.isFile())
				if (this.settings.source.fileMask.contains(sourceDirectoryEntry.name)) {
                    const sourceFilePath = Path.join(pSourceDirectoryPath, sourceDirectoryEntry.name);
                    await this.processFile(pSourceDirectoryName, sourceFilePath, sourceDirectoryEntry.name, pDestinationDirectorySubPath, pIndentation + 1);
                }
        }
    }  

    convertSourceToDestinationDirectoryName(pSourceDirectoryName) {
        let destinationDirectoryName =  pSourceDirectoryName;
        if (this.settings.destination.directoryNamePattern) {
            const linuxCaseDirectoryName = pSourceDirectoryName.toLowerCase().replaceAll(" ", "-");
            destinationDirectoryName = this.settings.destination.directoryNamePattern;
            destinationDirectoryName = destinationDirectoryName.replace("{0}", pSourceDirectoryName);
            destinationDirectoryName = destinationDirectoryName.replace("{1}", linuxCaseDirectoryName);
        }
        return destinationDirectoryName;
    }

    async processFile(pSourceDirectoryName, pSourceFilePath, pSourceFileName, pDestinationDirectorySubPath, pIndentation) {
        this.logger.writeLine(pSourceFileName, pIndentation * this.logger.tab);
        this.emptyTemporaryDirectory();
        await this.splitSourceFile(pSourceFilePath);
        const destinationFileName = this.convertSourceToDestinationFileName(pSourceFileName);
        await this.processTemporaryFiles(pSourceDirectoryName, pDestinationDirectorySubPath, destinationFileName);
    }
    
    emptyTemporaryDirectory() {
		const temporaryDirectoryEntries = FileSystem.readdirSync(this.temporaryDirectoryPath, { withFileTypes: true });
		for (const temporaryDirectoryEntry of temporaryDirectoryEntries)
            if (temporaryDirectoryEntry.isFile())
                if (!temporaryDirectoryEntry.name.startsWith("."))
                    FileSystem.unlinkSync(Path.join(this.temporaryDirectoryPath, temporaryDirectoryEntry.name));
    }

    async splitSourceFile(pSourceFilePath) {
        await this.imageMagickRunner.split(pSourceFilePath, this.temporaryDirectoryPath, this.settings.destination.fileType);
    }

    convertSourceToDestinationFileName(pSourceFileName) {
        const sourceFileNameWithoutExtension = Path.parse(pSourceFileName).name;
        let destinationFileName =  sourceFileNameWithoutExtension;
        if (this.settings.destination.fileNamePattern) {
            const linuxCaseFileName = sourceFileNameWithoutExtension.toLowerCase().replaceAll(" ", "-");
            destinationFileName = this.settings.destination.fileNamePattern;
            destinationFileName = destinationFileName.replace("{0}", sourceFileNameWithoutExtension);
            destinationFileName = destinationFileName.replace("{1}", linuxCaseFileName);
        }
        return `${destinationFileName}.${this.settings.destination.fileType}`;
    }

    async processTemporaryFiles(pSourceDirectoryName, pDestinationDirectorySubPath, pDestinationFileName) {
		const temporaryDirectoryEntries = FileSystem.readdirSync(this.temporaryDirectoryPath, { withFileTypes: true });
		for (const temporaryDirectoryEntry of temporaryDirectoryEntries)
            if (temporaryDirectoryEntry.isFile())
                if (this.temporaryFileMask.contains(temporaryDirectoryEntry.name)) {
                    const temporaryFilePath = Path.join(this.temporaryDirectoryPath, temporaryDirectoryEntry.name);
                    const imageInformation = await this.imageMagickRunner.getInformation(temporaryFilePath);
                    if (imageInformation.depth >= this.settings.source.minimumColourDepth)
                        if (this.settings.source.sizes.containsSize(imageInformation.width, imageInformation.height))
                            this.copyFileToDestination(pSourceDirectoryName, temporaryFilePath, imageInformation, pDestinationDirectorySubPath, pDestinationFileName);
                }
    }    

    copyFileToDestination(pSourceDirectoryName, pTemporaryFilePath, pImageInformation, pDestinationDirectorySubPath, pFileName) {
        let destinationSizeSubDirectory = `${pImageInformation.width}x${pImageInformation.height}`;
        if (this.settings.destination.sizeDirectoryNamePattern) {
            destinationSizeSubDirectory = this.settings.destination.sizeDirectoryNamePattern;
            const widthText = pImageInformation.width.formatWithLeadingZeros(4);
            const heightText = pImageInformation.height.formatWithLeadingZeros(4);
            destinationSizeSubDirectory = destinationSizeSubDirectory.replace("{0}", pImageInformation.width);
            destinationSizeSubDirectory = destinationSizeSubDirectory.replace("{1}", pImageInformation.height);
            destinationSizeSubDirectory = destinationSizeSubDirectory.replace("{2}", widthText);
            destinationSizeSubDirectory = destinationSizeSubDirectory.replace("{3}", heightText);
        }
        const destinationDirectoryPath = Path.join(this.destinationDirectoryPath, destinationSizeSubDirectory, pDestinationDirectorySubPath);
        this.makeSureDirectoryExists(destinationDirectoryPath);
        const destinationFilePath = Path.join(destinationDirectoryPath, pFileName);
        FileSystem.copyFileSync(pTemporaryFilePath, destinationFilePath);
        const indexDirectoryPath = Path.join(destinationSizeSubDirectory, pDestinationDirectorySubPath);
        this.iconIndex.add(indexDirectoryPath, pImageInformation.width, pSourceDirectoryName);
    }

    makeSureDirectoryExists(pDirectoryPath) {
        if (!FileSystem.existsSync(pDirectoryPath))
            FileSystem.mkdirSync(pDirectoryPath, { recursive: true });
    }

    makeSureDirectoryIsDeleted(pDirectoryPath) {
        if (FileSystem.existsSync(pDirectoryPath))
            FileSystem.rmSync(pDirectoryPath, { recursive: true });
    }
}
