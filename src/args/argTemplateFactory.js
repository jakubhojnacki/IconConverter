/** 
 * @module "ArgTemplateFactory" class (static)
 * @description Creates arg templates
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";
import ArgName from "./argName.js";
import ArgTemplate from "./argTemplate.js";
import ArgTemplates from "./argTemplates.js";
import DataType from "../general/dataType.js";

export default class ArgTemplateFactory {
    static get argTemplates() {
        return new ArgTemplates([
            new ArgTemplate(0, ArgName.sourceDirectoryPath, "Path to source directory", DataType.string, true),
            new ArgTemplate(1, ArgName.destinationDirectoryPath, "Path to destination directory", DataType.string, true),
            new ArgTemplate([ "s", "settingsFilePath" ], ArgName.settingsFilePath, "Path to settings file", DataType.string)
        ]);        
    }
}
