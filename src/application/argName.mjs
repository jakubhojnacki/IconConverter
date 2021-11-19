/**
 * @module "ArgName" class
 * @description 
 */

"use strict"

import { Enum } from "core-library";
import { EnumItem } from "core-library";
 
export class ArgName {
    static get sourceDirectoryPath() { return "SourceDirectoryPath"; }
    static get destinationDirectoryPath() { return "DestinationDirectoryPath"; }
    static get settingsFilePath() { return "SettingsFilePath"; }

    static get items() { return [
        new EnumItem(ArgName.sourceDirectoryPath),
        new EnumItem(ArgName.destinationDirectoryPath),
        new EnumItem(ArgName.settingsFilePath)
    ]; }


    static parse(pText) {
        return Enum.parse(pText, ArgName.values, ArgName.name);
    }

    static toString(pValue) {
        return Enum.toString(pValue, ArgName.values, ArgName.name);
    }
}
