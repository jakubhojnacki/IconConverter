/**
 * @module Main
 * @description Main module
 */

"use strict"

import { Application } from "../application/application.mjs";
import { Node } from "core-library";

(() => {
    const rootDirectoryPath = Node.getRoot(import.meta, true);
    global.theApplication = new Application(rootDirectoryPath);
    global.theApplication.run();
})();
