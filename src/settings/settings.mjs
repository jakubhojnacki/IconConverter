/**
 * @module "Settings" class
 * @description Keeps application settings
 */

"use strict";

import { DestinationSettings } from "../settings/destinationSettings.mjs";
import { ImageProcessorSettings } from "../settings/imageProcessorSettings.mjs";
import { SettingsBase } from "core-library";
import { SourceSettings } from "../settings/sourceSettings.mjs";

export class Settings extends SettingsBase {
    get source() { return this.mSource; }
    set source(pValue) { this.mSource = Object.verify(pValue, () => { return new SourceSettings(); }); }
    get destination() { return this.mDestination; }
    set destination(pValue) { this.mDestination = Object.verify(pValue, () => { return new DestinationSettings(); }); }
    get imageProcessor() { return this.mImageProcessor; }
    set imageProcessor(pValue) { this.mImageProcessor = Object.verify(pValue, () => { return new ImageProcessorSettings(); }); }

    constructor(pSource, pDestination, pImageProcessor) {
        super();
        this.source = pSource;
        this.destination = pDestination;
        this.imageProcessor = pImageProcessor;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.source.validate(pValidator);
        this.destination.validate(pValidator);
        this.imageProcessor.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        const data = super.toData();
        data.source = this.source.toData();
        data.destination = this.destination.toData();
        data.imageProcessor = this.imageProcessor.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.source = ( new SourceSettings()).fromData(pData.source);
            this.destination = ( new DestinationSettings()).fromData(pData.destination);
            this.imageProcessor = (new ImageProcessorSettings()).fromData(pData.imageProcessor);
        }
        return this;
    }
}
