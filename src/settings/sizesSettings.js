/**
 * @module "SizesSettings" class
 * @description An array of settings containing image sizes allowed
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";
import SizeSettings from "./sizeSettings.js";

export default class SizesSettings extends Array {
    static get default() { return new SizesSettings(
        new SizeSettings(16, 16),
        new SizeSettings(24, 24),
        new SizeSettings(32, 32),
        new SizeSettings(48, 48),
        new SizeSettings(64, 64),
        new SizeSettings(96, 96),
        new SizeSettings(128, 128),
        new SizeSettings(256, 256)        
    ); }

    constructor(pItems) {
        super();
        if (Array.isArray(pItems))
            for (const item of pItems)
                if (item instanceof SizeSettings)
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
            object = new SizesSettings();
            for (const dataItem of pData) {
                const item = SizeSettings.deserialise(dataItem);
                object.push(item);
            }
        }
        return object;
    }    

    static validate(pInput) {
        let value = null;
        if (pInput instanceof SizesSettings) {
            value = pInput;
            for (let index = 0; index < value.length; index++)
                value[index] = SizeSettings.validate(value[index]);            
        } else
            value = SizesSettings.deserialise(pInput);
        return value;
    }

    containsSize(pWidth, pHeight) {
        return this.some(lItem => ((lItem.width === pWidth) && (lItem.height === pHeight)));
    }
}
