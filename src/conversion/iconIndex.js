/**
 * @module "IconIndex" class
 * @description Class responsible for creating icon index
 * @version 0.0.1 (2021-04-13)
 */

const fs = require("fs");
const path = require("path");

require("../general/javaScript");

class IconIndex {
    get create() { return this.mCreate; }
    get folderPath() { return this.mFolderPath; }
    get fileName() { return this.mFileName; }
    get namePattern() { return this.mNamePattern; }
    get file() { return this.mFile; }
    set file(pValue) { this.mFile = pValue; }

    constructor(pCreate, pFolderPath, pFileName, pNamePattern) {
        this.mCreate = Boolean.validate(pCreate);
        this.mFolderPath = String.validate(pFolderPath);
        this.mFileName = String.validate(pFileName);
        this.mNamePattern = String.validate(pNamePattern);
        this.mFile = null;
    }

    initialise() {
        if (this.create) {
            const filePath = path.join(this.folderPath, this.fileName);
            this.file = fs.createWriteStream(filePath);
        }
    }

    add(pSourceFolderName, pDestinationFolderSubPath, pIconSize) {
        if (this.create) {
            this.writeLine(`[${pDestinationFolderSubPath}]`);
            this.writeLine(`Size=${pIconSize}`);
            this.writeLine(`Context=${this.createName(pSourceFolderName)}`);
            this.writeLine("Type=Threshold");
            this.writeLine("");
        }
    }

    writeLine(pLine) {
        this.file.write(pLine + "\r\n");
    }

    createName(pSourceFolderName) {
        let name =  pSourceFolderName;
        if (this.namePattern) {
            const linuxCaseFolderName = pSourceFolderName.toLowerCase().replaceAll(" ", "-");
            name = this.namePattern;
            name = name.replace("{0}", pSourceFolderName);
            name = name.replace("{1}", linuxCaseFolderName);
        }
        return name;
    }

    finalise() {
        if (this.create)
            this.file.end();
    }
}

module.exports = IconIndex;