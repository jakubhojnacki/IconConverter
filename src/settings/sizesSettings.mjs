/**
 * @module "SizesSettings" class
 * @description An array of settings containing image sizes allowed
 */

"use strict";

import { SizeSettings } from "../settings/sizeSettings.mjs";

export class SizesSettings extends Array {
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

    validate(pValidator) {
        pValidator.setComponent(SizesSettings.name);
        for (const item of this)
            item.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = [];
        for (const item of this)
            data.push(item.serialise());
        return data;
    }

    fromData(pData) {
        if (Array.isArray(pData))
            for (const dataItem of pData) {
                const item = (new SizeSettings()).fromData(dataItem);
                this.push(item);
            }
        return this;
    }    

    containsSize(pWidth, pHeight) {
        return this.some(lItem => ((lItem.width === pWidth) && (lItem.height === pHeight)));
    }
}
