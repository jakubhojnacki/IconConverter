/**
 * @module "LogicEventArgs" class
 * @description Event arguments for logic
 */

"use strict";

export class LogicEventArgs {
    get logic() { return this.mLogic; }
    set logic(pValue) { this.mLogic = pValue; }

    constructor(pLogic) {
        this.logic = pLogic;
    }
}