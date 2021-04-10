/**
 * @module "ApplicationInformation" class
 * @description Stores information about application
 * @version 0.0.2 (2021-04-06)
 */

const path = require("path");

require("../general/javaScript");

class ApplicationInformation {
    get name() { return this.mName; }
    get description() { return this.mDescription; }
    get version() { return this.mVersion; } 
    get author() { return this.mAuthor; }
    get date() { return this.mDate; }

    constructor(pName, pDescription, pVersion, pAuthor, pDate) {
        this.mName = String.validate(pName);
        this.mDescription = String.validate(pDescription);
        this.mVersion = String.validate(pVersion);
        this.mAuthor = String.validate(pAuthor);
        this.mDate = String.validate(pDate);
    }

    static read(pApplication) {
        const packageFilePath = path.join(pApplication.rootFolderPath, "package.json");
        const packageInformation = require(packageFilePath);
        const name = String.validate(packageInformation.displayName);
        const description = String.validate(packageInformation.description);
        const version = String.validate(packageInformation.version);
        const author = String.validate(packageInformation.author);
        const date = String.validate(packageInformation.date);
        return new ApplicationInformation(name, description, version, author, date);
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null)
            object = new ApplicationInformation(pData.name, pData.description, pData.version, pData.author, pData.date);
        return object;
    }

    serialise() {
        let data = {};
        data.name = this.name;
        data.description = this.description;
        data.version = this.version;
        data.author = this.author;
        data.date = this.date;
        return data;
    }

    toString() {
        return `${this.name} by ${this.author}\r\nversion ${this.version} (${this.date})`; 
    }
}

module.exports = ApplicationInformation;