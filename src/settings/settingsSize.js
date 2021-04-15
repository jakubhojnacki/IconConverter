/**
 * @module "SettingsSize" class
 * @description Represents size of an image
 * @version 0.0.1 (2021-04-15)
 */

 require("../general/javaScript");

 class SettingsSize {
    get width() { return this.mWidth; }
    get height() { return this.mHeight; }

    constructor(pWidth, pHeight) {
        this.mWidth = Number.validateAsInteger(pWidth);
        this.mHeight = Number.validateAsInteger(pHeight);
    }

    serialise() {
        let data = {};
        data.width = this.width;
        data.height = this.height;
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null) {
            const width = pData.width;
            const height = pData.height;
            object = new SettingsSize(width, height);
        }
        return object;
    }

    static validate(pInput) {
        let value = null;
        if (pInput instanceof SettingsSize)
            value = pInput;
        else
            value = SettingsSize.deserialise(pInput);
        return value;
    }
 }
 
 module.exports = SettingsSize;