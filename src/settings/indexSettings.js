/**
 * @module "IndexSettings" class
 * @description Represents settings regarding index
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";

export default class IndexSettings {
    get create() { return this.mCreate; }
    get fileName() { return this.mFileName; }
    get namePattern() { return this.mNamePattern; }

    constructor(pCreate, pFileName, pNamePattern) {
        this.mCreate = Boolean.validate(pCreate);
        this.mFileName = String.validate(pFileName);
        this.mNamePattern = String.validate(pNamePattern);
    }

    serialise() {
        let data = {};
        data.create = this.create;
        data.fileName = this.fileName;
        data.namePattern = this.namePattern;
        return data;
    }

    static deserialise(pData) {
        let object = null;
        if (pData != null)
            object = new IndexSettings(pData.create, pData.fileName, pData.namePattern);
        return object;
    }

    static validate(pInput) {
        let value = null;
        if (pInput != null)
            if (pInput instanceof IndexSettings)
                value = pInput
            else
                value = IndexSettings.deserialise(pInput);
        return value;
    }    
}
