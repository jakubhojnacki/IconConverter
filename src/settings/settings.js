/**
 * @module "Settings" class
 * @description Keeps application settings
 * @version 0.0.1 (2021-02-24)
 */

const fs = require("fs");

require("../general/javaScript");

const SettingsSizes = require("./settingsSizes");

class Settings {
    get sourceFolderPath() { return this.mSourceFolderPath; }
    set sourceFolderPath(pValue) { this.mSourceFolderPath = String.validate(pValue); }
    get sourceFileMask() { return this.mSourceFileMask; }
    set sourceFileMask(pValue) { this.mSourceFileMask = String.validate(pValue); }
    get minimumColourDepth() { return this.mMinimumColourDepth; }
    set minimumColourDepth(pValue) { this.mMinimumColourDepth = Number.validateAsInteger(pValue); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = SettingsSizes.validate(pValue); }
    get destinationFolderPath() { return this.mDestinationFolderPath; }
    set destinationFolderPath(pValue) { this.mDestinationFolderPath = String.validate(pValue); }
    get destinationFolderNamePattern() { return this.mDestinationFolderNamePattern; }
    set destinationFolderNamePattern(pValue) { this.mDestinationFolderNamePattern = String.validate(pValue); }
    get destinationFileType() { return this.mDestinationFileType; }
    set destinationFileType(pValue) { this.mDestinationFileType = String.validate(pValue); }
    get destinationFileNamePattern() { return this.mDestinationFileNamePattern; }
    set destinationFileNamePattern(pValue) { this.mDestinationFileNamePattern = String.validate(pValue); }
    get createIndex() { return this.mCreateIndex; }
    set createIndex(pValue) { this.mCreateIndex = Boolean.validate(pValue); }
    get indexFileName() { return this.mIndexFileName; }
    set indexFileName(pValue) { this.mIndexFileName = String.validate(pValue); }
    get indexNamePattern() { return this.mIndexNamePattern; }
    set indexNamePattern(pValue) { this.mIndexNamePattern = String.validate(pValue); }
    get debugMode() { return this.mDebugMode; }
    set debugMode(pValue) { this.mDebugMode = Boolean.validate(pValue); }

    constructor() {
        this.mSourceFolderPath = "";
        this.mSourceFileMask = "";
        this.mMinimumColourDepth = 8;
        this.mSizes = SettingsSizes.default;
        this.mDestinationFolderPath = "";
        this.mDestinationFolderNamePattern = "";
        this.mDestinationFileType = "png";
        this.mDestinationFileNamePattern = "";
        this.mCreateIndex = true;
        this.mIndexFileName = "index.theme";
        this.mIndexNamePattern = "";
        this.mDebugMode = false;
    }

    serialise() {
        let data = {};
        data.sourceFolderPath = this.sourceFolderPath;
        data.sourceFileMask = this.sourceFolderPath;
        data.minimumColourDepth = this.minimumColourDepth;
        data.sizes = this.sizes.serialise();
        data.destinationFolderPath = this.destinationFolderPath;
        data.destinationFolderNamePattern = this.destinationFolderNamePattern;
        data.destinationFileType = this.destinationFileType;
        data.destinationFileNamePattern = this.destinationFileNamePattern;
        data.createIndex = this.createIndex;
        data.indexFileName = this.indexFileName;
        data.indexNamePattern = this.indexNamePattern;
        data.debugMode = this.debugMode;
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null) {
            object = new Settings();
            object.sourceFolderPath = pData.sourceFolderPath;
            object.sourceFileMask = pData.sourceFolderPath;
            object.minimumColourDepth = pData.minimumColourDepth;
            object.sizes = SettingsSizes.deserialise(pData.sizes);
            object.destinationFolderPath = pData.destinationFolderPath;
            object.destinationFolderNamePattern = pData.destinationFolderNamePattern;
            object.destinationFileType = pData.destinationFileType;
            object.destinationFileNamePattern = pData.destinationFileNamePattern;
            object.createIndex = pData.createIndex;
            object.indexFileName = pData.indexFileName;
            object.indexNamePattern = pData.indexNamePattern;
            object.debugMode = pData.debugMode;
        }
        return object;
    }

    static read(pSettingsFilePath) {
        const rawData = fs.readFileSync(pSettingsFilePath);
        const data = JSON.parse(rawData);
        return Settings.deserialise(data);
    }    
}

module.exports = Settings;