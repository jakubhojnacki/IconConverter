/**
 * @module "DestinationSettings" class
 * @description Represents settings containing destination properties
 */

"use strict";

export class DestinationSettings {
    get sizeDirectoryNamePattern() { return this.mSizeDirectoryNamePattern; }
    set sizeDirectoryNamePattern(pValue) { this.mSizeDirectoryNamePattern = String.verify(pValue, "{Name}"); }
    get directoryNamePattern() { return this.mDirectoryNamePattern; }
    set directoryNamePattern(pValue) { this.mDirectoryNamePattern = String.verify(pValue, "{WidthFixed}"); }
    get fileType() { return this.mFileType; }
    set fileType(pValue) { this.mFileType = String.verify(pValue, "png"); }
    get fileNamePattern() { return this.mFileNamePattern; }
    set fileNamePattern(pValue) { this.mFileNamePattern = String.verify(pValue, "{Name}"); }

    constructor(pSizeDirectoryNamePattern, pDirectoryNamePattern, pFileType, pFileNamePattern) {
        this.sizeDirectoryNamePattern = pSizeDirectoryNamePattern;
        this.directoryNamePattern = pDirectoryNamePattern;
        this.fileType = pFileType;
        this.fileNamePattern = pFileNamePattern;
    }

    validate(pValidator) {
        pValidator.setComponent(DestinationSettings.name);
        pValidator.testNotEmpty("fileType", this.fileType);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {};
        data.sizeDirectoryNamePattern = this.sizeDirectoryNamePattern;
        data.directoryNamePattern = this.directoryNamePattern;
        data.fileType = this.fileType;
        data.fileNamePattern = this.fileNamePattern;
        return data;
    }

    fromData(pData) {
        let object = null;
        if (pData != null) {
            this.sizeDirectoryNamePattern = pData.sizeDirectoryNamePattern, 
            this.directoryNamePattern =  pData.directoryNamePattern;
            this.fileType = pData.fileType;
            this.fileNamePattern = pData.fileNamePattern;
        }
        return this;
    }
}
