/**
 * @module "SizeSettings" class
 * @description Represents settings containing size of an image
 */

"use strict";

export class SizeSettings {
    get width() { return this.mWidth; }
    set width(pValue) { this.mWidth = Number.verifyAsInteger(pValue); }
    get height() { return this.mHeight; }
    set height(pValue) { this.mHeight = Number.verifyAsInteger(pValue); }

    constructor(pWidth, pHeight) {
        this.width = pWidth;
        this.height = pHeight;
    }

    validate(pValidator) {
        pValidator.setComponent(SizeSettings.name);
        pValidator.testNotEmpty("width", this.width);
        pValidator.testNotEmpty("height", this.height);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {};
        data.width = this.width;
        data.height = this.height;
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.width = pData.width;
            this.height = pData.height;
        }
        return this;
    }
}
 