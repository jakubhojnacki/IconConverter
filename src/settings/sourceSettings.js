/**
 * @module "SourceSettings" class
 * @description A set of settings for source
 * @version 0.0.1 (2021-04-15)
 */

import "../general/javaScript.js";
import FileMask from "../logic/fileMask.js";
import SizesSettings from "./sizesSettings.js";

export default class SourceSettings {
    get fileMask() { return this.mFileMask; }
    get minimumColourDepth() { return this.mMinimumColourDepth; }
    get sizes() { return this.mSizes; }

    constructor(pFileMask, pMinimumColourDepth, pSizes) {
        this.mFileMask = new FileMask(String.validate(pFileMask));
        this.mMinimumColourDepth = String.validate(pMinimumColourDepth, 8);
        this.mSizes = SizesSettings.validate(pSizes);
    }

    serialise() {
        let data = {};
        data.fileMask = this.fileMask.toString();
        data.minimumColourDepth = this.minimumColourDepth;
        data.sizes = this.sizes.serialise();
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null) {
            const sizes = SizesSettings.deserialise(pData.sizes);
            object = new SourceSettings(pData.fileMask, pData.minimumColourDepth, sizes);
        }
        return object;
    }

    static validate(pInput) {
        let value = null;
        if (pInput != null)
            if (pInput instanceof SourceSettings)
                value = pInput
            else
                value = SourceSettings.deserialise(pInput);
        return value;
    }
}
