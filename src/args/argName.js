/**
 * @module "ArgName" class (static)
 * @description Class representing argument names
 * @version 0.0.2 (2021-08-12)
 */

export default class ArgName {
    static get sourceDirectoryPath() { return "SourceDirectoryPath"; }
    static get destinationDirectoryPath() { return "DestinationDirectoryPath"; }
    static get settingsFilePath() { return "SettingsFilePath"; }

    static get items() { return [
        new EnumItem(ArgName.sourceDirectoryPath),
        new EnumItem(ArgName.destinationDirectoryPath),
        new EnumItem(ArgName.settingsFilePath)
    ]; }

    static parse(pString) {
        return Enum.parse(pString, ArgName.items, ArgName.name);
    }    
}
