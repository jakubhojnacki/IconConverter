/**
 * @module "LoggerType" class (static)
 * @description Enumerates logger types
 * @version 0.0.1 (2021-02-17)
 */

require("../general/javaScript");

const Enum = require("../general/enum");
const EnumItem = require("../general/enumItem");

/*static*/ class LoggerType {
    static get console() { return "Console"; }
    static get file() { return "File"; }

    static get items() { return [
        new EnumItem(LoggerType.console, true),
        new EnumItem(LoggerType.file)
    ]; }

    static parse(pString) {
        return Enum.parse(pString, LoggerType.items, LoggerType.name);
    }
}

module.exports = LoggerType;