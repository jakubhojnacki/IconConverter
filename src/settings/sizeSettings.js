/**
 * @module "SizeSettings" class
 * @description Represents settings containing size of an image
 * @version 0.0.1 (2021-04-15)
 */

 require("../general/javaScript");

 class SizeSettings {
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
            object = new SizeSettings(width, height);
        }
        return object;
    }

    static validate(pInput) {
        let value = null;
        if (pInput instanceof SizeSettings)
            value = pInput;
        else
            value = SizeSettings.deserialise(pInput);
        return value;
    }
 }
 
 module.exports = SizeSettings;