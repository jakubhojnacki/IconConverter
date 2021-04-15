/**
 * @module "Settings" class
 * @description Keeps application settings
 * @version 0.0.1 (2021-02-24)
 */

const fs = require("fs");

require("../general/javaScript");

const DestinationSettings = require("./destinationSettings");
const IndexSettings = require("./indexSettings");
const SourceSettings = require("./sourceSettings");

class Settings {
    get source() { return this.mSource; }
    get destination() { return this.mDestination; }
    get index() { return this.mIndex; }
    get debugMode() { return this.mDebugMode; }

    constructor(pSource, pDestination, pIndex, pDebugMode) {
        this.mSource = SourceSettings.validate(pSource);
        this.mDestination = DestinationSettings.validate(pDestination);
        this.mIndex = IndexSettings.validate(pIndex);
        this.mDebugMode = Boolean.validate(pDebugMode);
    }

    serialise() {
        let data = {};
        data.source = this.source.serialise();
        data.destination = this.destination.serialise();
        data.index = this.index.serialise();
        data.debugMode = this.debugMode;
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null) {
            const source = SourceSettings.deserialise(pData.source);
            const destination = DestinationSettings.deserialise(pData.destination);
            const index = IndexSettings.deserialise(pData.index);
            const debugMode = pData.debugMode;
            object = new Settings(source, destination, index, debugMode);
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