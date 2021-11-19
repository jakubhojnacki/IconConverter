/**
 * @module "IconIndex" class
 * @description Class responsible for creating icon index
 * @version 0.0.2 (2021-08-12)
 */

import FileSystem from "fs";
import Path from "path";
import "../general/javaScript.js";

export default class IconIndex {
    get create() { return this.mCreate; }
    get directoryPath() { return this.mDirectoryPath; }
    get fileName() { return this.mFileName; }
    get namePattern() { return this.mNamePattern; }
    get file() { return this.mFile; }
    set file(pValue) { this.mFile = pValue; }
    get directories() { return this.mDirectories; }

    constructor(pCreate, pDirectoryPath, pFileName, pNamePattern) {
        this.mCreate = Boolean.validate(pCreate);
        this.mDirectoryPath = String.validate(pDirectoryPath);
        this.mFileName = String.validate(pFileName);
        this.mNamePattern = String.validate(pNamePattern);
        this.mFile = null;
        this.mDirectories = [];
    }

    initialise() {
        if (this.create) {
            const filePath = Path.join(this.directoryPath, this.fileName);
            this.file = FileSystem.createWriteStream(filePath);
        }
    }

    add(pDirectory, pSize, pName) {
        if (this.create)
            if (!this.directories.contains(pDirectory)) {
                this.writeLine(`[${pDirectory}]`);
                this.writeLine(`Size=${pSize}`);
                this.writeLine(`Context=${this.createName(pName)}`);
                this.writeLine("Type=Threshold");
                this.writeLine("");
                this.directories.push(pDirectory);
            }
    }

    writeLine(pLine) {
        this.file.write(pLine + "\r\n");
    }

    createName(pSourceDirectoryName) {
        let name =  pSourceDirectoryName;
        if (this.namePattern) {
            const linuxCaseDirectoryName = pSourceDirectoryName.toLowerCase().replaceAll(" ", "-");
            name = this.namePattern;
            name = name.replace("{0}", pSourceDirectoryName);
            name = name.replace("{1}", linuxCaseDirectoryName);
        }
        return name;
    }

    finalise() {
        if (this.create)
            this.file.end();
    }
}
