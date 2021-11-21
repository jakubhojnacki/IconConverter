/**
 * @module "Engine" class
 * @description Runs main application task(s)
 */

"use strict";

import Path from "path";

import { FileSystemItem } from "file-system-library";
import { FileSystemItemType } from "file-system-library";
import { FileSystemToolkit } from "file-system-library";
import { ImageProcessorFactory } from "image-library";
import { LogicEventArgs } from "../logic/logicEventArgs.mjs";
import { LogicFileCountEventArgs } from "../logic/logicFileCountEventArgs.mjs";
import { LogicFileSystemItemEventArgs } from "../logic/logicFileSystemItemEventArgs.mjs";

export class Logic {
    get application() { return this.mApplication; }
    set application(pValue) { this.mApplication = pValue; }
    get settings() { return this.application.settings; }

    get sourceDirectoryPath() { return this.mSourceDirectoryPath; }
    set sourceDirectoryPath(pValue) { this.mSourceDirectoryPath = String.verify(pValue); }
    get destinationDirectoryPath() { return this.mDestinationDirectoryPath; }
    set destinationDirectoryPath(pValue) { this.mDestinationDirectoryPath = String.verify(pValue); }
    get temporaryDirectoryPath() { return this.mTemporaryDirectoryPath; }
    set temporaryDirectoryPath(pValue) { this.mTemporaryDirectoryPath = String.verify(pValue); }

    get imageProcessor() { return this.mImageProcessor; }
    set imageProcessor(pValue) { this.mImageProcessor = pValue; }
    
    get onInitialise() { return this.mOnInitialise; }
    set onInitialise(pValue) { this.mOnInitialise = pValue; }
    get onDirectory() { return this.mOnDirectory; }
    set onDirectory(pValue) { this.mOnDirectory = pValue; }
    get onFile() { return this.mOnFile; }
    set onFile(pValue) { this.mOnFile = pValue; }
    get onFinalise() { return this.mOnFinalise; }
    set onFinalise(pValue) { this.mOnFinalise = pValue; }
    
    constructor(pApplication, pSourceDirectoryPath, pDestinationDirectoryPath) {
        this.application = pApplication;

        this.sourceDirectoryPath = pSourceDirectoryPath;
        this.destinationDirectoryPath = pDestinationDirectoryPath;
        this.temporaryDirectoryPath = Path.join(this.destinationDirectoryPath, "__Temp");

        this.imageProcessor = ( new ImageProcessorFactory()).create(this.settings.imageProcessor.type, this.settings.imageProcessor.path, this.application.rootDirectoryPath);

        this.onInitialise = null;
        this.onDirectory = null;
        this.onFile = null;
        this.onFinalise = null;
    }

    async run() {
        this.initialise();
        await this.process();
        this.finalise();
    }

    initialise() {
        let fileCount = this.countFilesInDirectory(this.sourceDirectoryPath, 0);
        if (this.onInitialise)
            this.onInitialise(new LogicFileCountEventArgs(this, fileCount));
    }

    countFilesInDirectory(pPath, pFileCount) {
        let fileCount = pFileCount;
        const items = FileSystemToolkit.readDirectory(pPath, this.settings.source.filter);
        for (const item of items) {
            switch (item.type) {
                case FileSystemItemType.directory:
                    fileCount = this.countFilesInDirectory(item.path, fileCount);
                    break;
                case FileSystemItemType.file:
                    fileCount++;
                    break;
            }
        }
        return fileCount;
    }

    async process() {
        const sourceDirectory = new FileSystemItem(FileSystemItemType.directory, this.sourceDirectoryPath);
        await this.processDirectory(sourceDirectory, "", "", 0);
    }

    async processDirectory(pSourceDirectory, pDestinationSubPath, pIndentation) {
        if (this.onDirectory)
            this.onDirectory(new LogicFileSystemItemEventArgs(this, pSourceDirectory, pIndentation));
		const sourceDirectoryItems = FileSystemToolkit.readDirectory(pSourceDirectory.path, this.settings.source.filter);
		for (const sourceDirectoryItem of sourceDirectoryItems)
            switch (sourceDirectoryItem.type) {
                case FileSystemItemType.directory: {
                    const destinationbDirectoryName = this.createDestinationDirectoryName(sourceDirectoryItem.name);
                    const destinationSubPath = Path.join(pDestinationSubPath, destinationbDirectoryName);
                    await this.processDirectory(sourceDirectoryItem, destinationSubPath, pIndentation + 1);
                } break;
                case FileSystemItemType.file:
                    await this.processFile(sourceDirectoryItem, pDestinationSubPath, pIndentation + 1);
                    break;
            }
    }  

    createDestinationDirectoryName(pSourceDirectory) {
        let destinationDirectoryName =  pSourceDirectory.name;
        if (this.settings.destination.directoryNamePattern) {
            const linuxCaseDirectoryName = pSourceDirectory.name.toLowerCase().replaceAll(" ", "-");
            destinationDirectoryName = this.settings.destination.directoryNamePattern;
            destinationDirectoryName = destinationDirectoryName.replace("{0}", pSourceDirectory.name);
            destinationDirectoryName = destinationDirectoryName.replace("{Name}", pSourceDirectory.name);
            destinationDirectoryName = destinationDirectoryName.replace("{1}", linuxCaseDirectoryName);
            destinationDirectoryName = destinationDirectoryName.replace("{LinuxName}", linuxCaseDirectoryName);
        }
        return destinationDirectoryName;
    }

    async processFile(pSourceFile, pDestinationSubPath, pIndentation) {
        if (this.onFile)
            this.onFile(new LogicFileSystemItemEventArgs(this, pSourceFile, pIndentation));
        for (const size of this.settings.source.sizes) {
            const sourceImageInformation = this.imageProcessor.getInformation(pSourceFile.path);
            const sourceImagePage = sourceImageInformation.findPage(size.width, size.height, this.settings.source.depth);
            if (sourceImagePage) {
                const destinationSizeDirectoryName = this.createDestinationSizeDirectoryName(sourceImagePage);
                const destinationFolderPath = Path.join(this.destinationDirectoryPath, destinationSizeDirectoryName, pDestinationSubPath);
                FileSystemToolkit.createDirectoryIfDoesntExist(destinationFolderPath);
                const destinationFileName = this.createDestinationFileName(pSourceFile);
                const destinationFilePath = Path.join(destinationFolderPath, destinationFileName);
                if (sourceImagePage.index)
                    await this.imageProcessor.extract(pSourceFile.path, sourceImagePage.index, destinationFilePath);
                else
                    FileSystem.copyFileSync(pSourceFile.path, destinationFilePath);
            }
        }
    }

    createDestinationSizeDirectoryName(pImageInformation) {
        let destinationSizeDirectoryName = `${pImageInformation.width}x${pImageInformation.height}`;
        if (this.settings.destination.sizeDirectoryNamePattern) {
            destinationSizeDirectoryName = this.settings.destination.sizeDirectoryNamePattern;
            const widthFixed = pImageInformation.width.formatWithLeadingZeros(4);
            const heightFixed = pImageInformation.height.formatWithLeadingZeros(4);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{0}", pImageInformation.width);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{Width}", pImageInformation.width);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{1}", pImageInformation.height);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{Height}", pImageInformation.height);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{2}", widthFixed);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{WidthFixed}", widthFixed);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{3}", heightFixed);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{HeightFixed}", heightFixed);
        }
        return destinationSizeDirectoryName;
    }

    createDestinationFileName(pSourceFile) {
        const sourceFileNameWithoutExtension = Path.parse(pSourceFile.path).name;
        let destinationFileName =  sourceFileNameWithoutExtension;
        if (this.settings.destination.fileNamePattern) {
            const linuxCaseFileName = sourceFileNameWithoutExtension.toLowerCase().replaceAll(" ", "-");
            destinationFileName = this.settings.destination.fileNamePattern;
            destinationFileName = destinationFileName.replace("{0}", sourceFileNameWithoutExtension);
            destinationFileName = destinationFileName.replace("{Name}", sourceFileNameWithoutExtension);
            destinationFileName = destinationFileName.replace("{1}", linuxCaseFileName);
            destinationFileName = destinationFileName.replace("{LinuxName}", linuxCaseFileName);
        }
        return `${destinationFileName}.${this.settings.destination.fileType}`;
    }

    finalise() {
        FileSystemToolkit.emptyDirectory(this.temporaryDirectoryPath);
        FileSystemToolkit.deleteDirectoryIfExists(this.temporaryDirectoryPath);
        if (this.onFinalise)
            this.onFinalise(new LogicEventArgs(this));
    }
}
