/**
 * @module "Application" class
 * @description Represents the main application class
 * @version 0.0.2 (2021-08-12)
 */

import "./general/javaScript.js";
import ArgName from "./args/argName.js";
import Args from "./args/args.js";
import Logger from "./general/logger.js";
import Engine from "./engine/engine.js";
import Manifest from "./general/manifest.js";
import Path from "path";
import Settings from "./settings/settings.js";

export default class Application {
    get manifest() { return new Manifest(); }
    get args() { return this.mArgs; }
    get settings() { return this.mSettings; }
    get logger() { return this.mLogger; }
    get debugMode() { return this.mDebugMode; }

    constructor() {        
        this.mArgs = Args.parse();
        this.mSettings = this.initialiseSettings();
        this.mLogger = new Logger();
        this.mDebugMode = this.args.get(ArgName.debugMode, true);
    }

    initialiseSettings() {
        const settingsFilePath = this.args.get(ArgName.settingsFilePath, Path.join(global.theRoot, "settings.json"));
        return Settings.read(settingsFilePath);
    }

    async run() {
        try {
            if (this.initialise()) {
                const engine = new Engine();
                await engine.run();
            }
        } catch (error) {
            this.logger.writeError(this.debugMode ? error.stack : error.message);
        } finally {
            this.finalise();
        }
    }

    initialise() {
        this.logger.writeLine(this.manifest.toString());
        this.logger.newLine();
        const result = this.args.validate();
        return result;
    }

    finalise() {
        this.logger.newLine();
        this.logger.writeLine("Completed.");
    }    
}
