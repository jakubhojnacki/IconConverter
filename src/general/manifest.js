/**
 * @module "Manifest" class
 * @description Stores information about application manifest
 * @version 0.0.2 (2021-05-25)
 */

import FileSystem from "fs";
import Path from "path";
import "./javaScript.js";

export default class Manifest {
    get name() { return this.mName; }
    get description() { return this.mDescription; }
    get version() { return this.mVersion; } 
    get author() { return this.mAuthor; }
    get date() { return this.mDate; }

    constructor() {
        const manifestRawData = FileSystem.readFileSync(Path.join(global.theRoot, "package.json"));
        const manifestData = JSON.parse(manifestRawData);
        this.mName = String.validate(manifestData.displayName);
        this.mDescription = String.validate(manifestData.description);
        this.mVersion = String.validate(manifestData.version);
        this.mAuthor = String.validate(manifestData.author);
        this.mDate = String.validate(manifestData.date);
    }

    toString() {
        return `${this.name} version ${this.version}, ${this.author}, ${this.date}`; 
    }
}
