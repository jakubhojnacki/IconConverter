/**
 * @module "Engine" class
 * @description Runs main application task(s)
 */

"use strict";

import FileSystem from "fs";
import Path from "path";

import { FileSystemItem } from "file-system-library";
import { FileSystemItemType } from "file-system-library";
import { FileSystemMatcher } from "file-system-library";
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

    get fileMatcher() { return this.mFileMatcher; }
    set fileMatcher(pValue) { this.mFileMatcher = pValue; }
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

        this.fileMatcher = this.settings.source.filter ? new FileSystemMatcher(this.settings.source.filter) : null;
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
        const items = FileSystemToolkit.readDirectory(pPath);
        for (const item of items) {
            switch (item.type) {
                case FileSystemItemType.directory:
                    fileCount = this.countFilesInDirectory(item.path, fileCount);
                    break;
                case FileSystemItemType.file: {
                    const countFile = this.fileMatcher ? this.fileMatcher.matches(item.name) : true;
                    if (countFile)
                        fileCount++;
                } break;
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
		const sourceDirectoryItems = FileSystemToolkit.readDirectory(pSourceDirectory.path);
		for (const sourceDirectoryItem of sourceDirectoryItems)
            switch (sourceDirectoryItem.type) {
                case FileSystemItemType.directory: {
                    const destinationbDirectoryName = this.createDestinationDirectoryName(sourceDirectoryItem);
                    const destinationSubPath = Path.join(pDestinationSubPath, destinationbDirectoryName);
                    await this.processDirectory(sourceDirectoryItem, destinationSubPath, pIndentation + 1);
                } break;
                case FileSystemItemType.file: {
                    const processFile = this.fileMatcher ? this.fileMatcher.matches(sourceDirectoryItem.name) : true;
                    if (processFile)
                        await this.processFile(sourceDirectoryItem, pDestinationSubPath, pIndentation + 1);
                } break;
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
        let sourceImageInformation = null;
        for (const size of this.settings.source.sizes) {
            const destinationSizeDirectoryName = this.createDestinationSizeDirectoryName(size);
            const destinationFolderPath = Path.join(this.destinationDirectoryPath, destinationSizeDirectoryName, pDestinationSubPath);
            FileSystemToolkit.createDirectoryIfDoesntExist(destinationFolderPath);
            const destinationFileName = this.createDestinationFileName(pSourceFile);
            const destinationFilePath = Path.join(destinationFolderPath, destinationFileName);
            if (!FileSystem.existsSync(destinationFilePath)) {
                if (sourceImageInformation == null)
                    sourceImageInformation = await this.imageProcessor.getInformation(pSourceFile.path);
                const sourceImagePage = sourceImageInformation.findPage(size.width, size.height, this.settings.source.depth);
                if (sourceImagePage)
                    if (sourceImagePage.index)
                        await this.imageProcessor.extract(pSourceFile.path, sourceImagePage.index, destinationFilePath);
                    else
                        FileSystem.copyFileSync(pSourceFile.path, destinationFilePath);
            }
        }
    }

    createDestinationSizeDirectoryName(pSize) {
        let destinationSizeDirectoryName = `${pSize.width}x${pSize.height}`;
        if (this.settings.destination.sizeDirectoryNamePattern) {
            destinationSizeDirectoryName = this.settings.destination.sizeDirectoryNamePattern;
            const widthFixed = pSize.width.pad(4);
            const heightFixed = pSize.height.pad(4);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{0}", pSize.width);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{Width}", pSize.width);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{1}", pSize.height);
            destinationSizeDirectoryName = destinationSizeDirectoryName.replace("{Height}", pSize.height);
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
        if (this.onFinalise)
            this.onFinalise(new LogicEventArgs(this));
    }
}
