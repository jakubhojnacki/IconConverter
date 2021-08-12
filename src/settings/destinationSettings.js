/**
 * @module "DestinationSettings" class
 * @description Represents settings containing destination properties
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";

export default class DestinationSettings {
    get sizeDirectoryNamePattern() { return this.mSizeDirectoryNamePattern; }
    get directoryNamePattern() { return this.mDirectoryNamePattern; }
    get fileType() { return this.mFileType; }
    get fileNamePattern() { return this.mFileNamePattern; }

    constructor(pSizeDirectoryNamePattern, pDirectoryNamePattern, pFileType, pFileNamePattern) {
        this.mSizeDirectoryNamePattern = String.validate(pSizeDirectoryNamePattern);
        this.mDirectoryNamePattern = String.validate(pDirectoryNamePattern);
        this.mFileType = String.validate(pFileType, "png");
        this.mFileNamePattern = String.validate(pFileNamePattern);
    }

    serialise() {
        let data = {};
        data.sizeDirectoryNamePattern = this.sizeDirectoryNamePattern;
        data.directoryNamePattern = this.directoryNamePattern;
        data.fileType = this.fileType;
        data.fileNamePattern = this.fileNamePattern;
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null)
            object = new DestinationSettings(pData.sizeDirectoryNamePattern, pData.directoryNamePattern, pData.fileType, pData.fileNamePattern);
        return object;
    }

    static validate(pInput) {
        let value = null;
        if (pInput != null)
            if (pInput instanceof DestinationSettings)
                value = pInput
            else
                value = DestinationSettings.deserialise(pInput);
        return value;
    }
}
