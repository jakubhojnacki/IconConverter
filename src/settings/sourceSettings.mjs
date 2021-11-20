/**
 * @module "SourceSettings" class
 * @description A set of settings for source
 */

"use strict";

import { SizesSettings } from "../settings/sizesSettings.mjs";

export class SourceSettings {
    get filter() { return this.mFilter; }
    set filter(pValue) { this.mFilter = String.verify(pValue); }
    get minimumColourDepth() { return this.mMinimumColourDepth; }
    set minimumColourDepth(pValue) { this.mMinimumColourDepth = Number.verifyAsInteger(pValue, 8); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = Object.verify(pValue, () => { return new SizesSettings(); }); }

    constructor(pFilter, pMinimumColourDepth, pSizes) {
        this.filter = pFilter;
        this.minimumColourDepth = pMinimumColourDepth;
        this.sizes = pSizes;
    }

    validate(pValidator) {
        pValidator.setComponent(SourceSettings.name);
        pValidator.testNotEmpty("minimumColourDepth", this.minimumColourDepth);
        if (this.sizes.length == 0)
            pValidator.add("sizes", "haven't been defined");
        this.sizes.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {};
        data.filter = this.filter;
        data.minimumColourDepth = this.minimumColourDepth;
        data.sizes = this.sizes.toData();
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.filter = pData.filter;
            this.minimumColourDepth = pData.minimumColourDepth;
            this.sizes = ( new SizesSettings()).fromData(pData.sizes);
        }
        return this;
    }
}
