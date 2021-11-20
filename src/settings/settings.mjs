/**
 * @module "Settings" class
 * @description Keeps application settings
 */

"use strict";

import { DestinationSettings } from "../settings/destinationSettings.mjs";
import { SettingsBase } from "core-library";
import { SourceSettings } from "../settings/sourceSettings.mjs";

export class Settings extends SettingsBase {
    get source() { return this.mSource; }
    set source(pValue) { this.mSource = Object.verify(pValue, () => { return new SourceSettings(); }); }
    get destination() { return this.mDestination; }
    set destination(pValue) { this.mDestination = Object.verify(pValue, () => { return new DestinationSettings(); }); }

    constructor(pSource, pDestination) {
        this.source = pSource;
        this.destination = pDestination;
    }

    validate(pValidator) {
        pValidator.setComponent(Settings.name);
        this.source.validate(pValidator);
        this.destination.validate(pValidator);
        pValidator.restoreComponent();
    }

    toData() {
        const data = super.toData();
        data.source = this.source.toData();
        data.destination = this.destination.toData();
        return data;
    }

    fromData(pData) {
        super.fromData(pData);
        if (pData != null) {
            this.source = ( new SourceSettings()).fromData(pData.source);
            this.destination = ( new DestinationSettings()).fromData(pData.destination);
        }
        return this;
    }
}
