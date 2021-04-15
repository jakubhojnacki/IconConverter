/**
 * @module "SettingsSizes" class
 * @description An array of image sizes allowed
 * @version 0.0.1 (2021-04-15)
 */

const SettingsSize = require("./settingsSize");

require("../general/javaScript");

class SettingsSizes extends Array {
    static get default() { return new SettingsSizes(
        new SettingsSize(16, 16),
        new SettingsSize(24, 24),
        new SettingsSize(32, 32),
        new SettingsSize(48, 48),
        new SettingsSize(64, 64),
        new SettingsSize(96, 96),
        new SettingsSize(128, 128),
        new SettingsSize(256, 256)        
    ); }

    constructor(pItems) {
        super();
        if (Array.isArray(pItems))
            for (const item of pItems)
                if (item instanceof SettingsSize)
                    this.push(item);
    }

    serialise() {
        let data = [];
        for (const item of this)
            data.push(item.serialise());
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (Array.isArray(pData)) {
            object = new SettingsSizes();
            for (const dataItem of pData) {
                const item = SettingsSize.deserialise(dataItem);
                object.push(item);
            }
        }
        return object;
    }    

    static validate(pInput) {
        let value = null;
        if (pInput instanceof SettingsSizes) {
            value = pInput;
            for (let index = 0; index < value.length; index++)
                value[index] = SettingsSize.validate(value[index]);            
        } else
            value = SettingsSizes.deserialise(pInput);
        return value;
    }

    containsSize(pWidth, pHeight) {
        return this.some(lItem => ((lItem.pWidth === pWidth) && (lItem.height === pHeight)));
    }
}

module.exports = SettingsSizes;