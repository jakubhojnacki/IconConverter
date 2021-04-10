/**
 * @module "Enum" class
 * @description Enum helper class (static)
 * @version 0.0.3 (2021-04-06)
 */

require("./javaScript");

/*static*/ class Enum {
    static findItem(pString, pEnumItems, pEnumName) {
        const string = String.validate(pString, false).trim().toLowerCase();
        let enumItem = null;
        if (string)
            enumItem = pEnumItems.find((lEnumItem) => { return lEnumItem.matches(string); });
        else
            enumItem = pEnumItems.find((lEnumItem) => { return lEnumItem.default; });
        if (!enumItem)
            throw new Error(`Value ${pString} cannot be parsed into ${pEnumName}.`);
        return enumItem;
    }

    static parse(pString, pEnumItems, pEnumName) {
        const enumItem = Enum.findItem(pString, pEnumItems, pEnumName);
        return enumItem.value;
    }

    static getOutput(pString, pEnumItems, pEnumName) {
        const enumItem = Enum.findItem(pString, pEnumItems, pEnumName);
        return Object.validate(enumItem.output, enumItem.value);
    }
}

module.exports = Enum;