/**
 * @module "SourceSettings" class
 * @description A set of settings for source
 */

"use strict";

import { SizesSettings } from "../settings/sizesSettings.mjs";

export class SourceSettings {
    get filter() { return this.mFilter; }
    set filter(pValue) { this.mFilter = String.verify(pValue); }
    get depth() { return this.mDepth; }
    set depth(pValue) { this.mDepth = Number.verifyAsInteger(pValue, 8); }
    get sizes() { return this.mSizes; }
    set sizes(pValue) { this.mSizes = Object.verify(pValue, () => { return new SizesSettings(); }); }

    constructor(pFilter, pDepth, pSizes) {
        this.filter = pFilter;
        this.depth = pDepth;
        this.sizes = pSizes;
    }

    validate(pValidator) {
        pValidator.setComponent(SourceSettings.name);
        pValidator.testNotEmpty("depth", this.depth);
        if (this.sizes.length == 0)
            pValidator.add("sizes", "haven't been defined");
        this.sizes.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        let data = {};
        data.filter = this.filter;
        data.depth = this.depth;
        data.sizes = this.sizes.toData();
        return data;
    }

    fromData(pData) {
        if (pData != null) {
            this.filter = pData.filter;
            this.depth = pData.depth;
            this.sizes = ( new SizesSettings()).fromData(pData.sizes);
        }
        return this;
    }
}
