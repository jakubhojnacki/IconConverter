/**
 * @module "LogicFileCountEventArgs" class
 * @description Event arguments for logic and file count
 */

"use strict";

import { LogicEventArgs } from "../logic/logicEventArgs.mjs";

export class LogicFileCountEventArgs extends LogicEventArgs {
    get fileCount() { return this.mFileCount; }
    set fileCount(pValue) { this.mFileCount = Number.verifyAsInteger(pValue); }

    constructor(pLogic, pFileCount) {
        super(pLogic);
        this.fileCount = pFileCount;
    }
}