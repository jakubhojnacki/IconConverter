/**
 * @module "LogicFileSystemItemEventArgs" class
 * @description Event arguments for logic and file system item (directory or file)
 */

"use strict";

import { LogicEventArgs } from "../logic/logicEventArgs.mjs";

export class LogicFileSystemItemEventArgs extends LogicEventArgs {
    get fileSystemItem() { return this.mFileSystemItem; }
    set fileSystemItem(pValue) { this.mFileSystemItem = pValue; }
    get indentation() { return this.mIndentation; }
    set indentation(pValue) { this.mIndentation = Number.verifyAsInteger(pValue); }

    constructor(pLogic, pFileSystemItem, pIndentation) {
        super(pLogic);
        this.fileSystemItem = pFileSystemItem;
        this.indentation = pIndentation;
    }
}