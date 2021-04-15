/**
 * @module "DestinationSettings" class
 * @description Represents settings containing destination properties
 * @version 0.0.1 (2021-04-15)
 */

require("../general/javaScript");

class DestinationSettings {
    get folderPath() { return this.mFolderPath; }
    get folderNamePattern() { return this.mFolderNamePattern; }
    get fileType() { return this.mFileType; }
    get fileNamePattern() { return this.mFileNamePattern; }

    constructor(pFolderPath, pFolderNamePattern, pFileType, pFileNamePattern) {
        this.mFolderPath = String.validate(pFolderPath);
        this.mFolderNamePattern = String.validate(pFolderNamePattern);
        this.mFileType = String.validate(pFileType, "png");
        this.mFileNamePattern = String.validate(pFileNamePattern);
    }

    serialise() {
        let data = {};
        data.folderPath = this.folderPath;
        data.folderNamePattern = this.folderNamePattern;
        data.fileType = this.fileType;
        data.fileNamePattern = this.fileNamePattern;
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null)
            object = new DestinationSettings(pData.folderPath, pData.folderNamePattern, pData.fileType, pData.fileNamePattern);
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

module.exports = DestinationSettings;