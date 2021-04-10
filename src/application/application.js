/**
 * @module "Application" class
 * @description Represents the main application class
 * @version 0.0.1 (2021-04-06)
 */

const ApplicationInformation = require("./applicationInformation");
const ArgName = require("../args/argName");
const Args = require("../args/args");
const ArgTemplateFactory = require("../args/argTemplateFactory");
const ConsoleLogger = require("../logging/consoleLogger");
const IconConverter = require("../iconConverter/iconConverter");

require("../general/javaScript");

class Application {
    get information() { return ApplicationInformation.read(this); }
    get rootFolderPath() { return this.mRootFolderPath; }
    get args() { return this.mArgs; }
    get logger() { return this.mLogger; }
    get debugMode() { return this.mDebugMode; }

    constructor(pRootFolderPath, pArgValues) {        
        this.mRootFolderPath = String.validate(pRootFolderPath);
        this.mArgs = this.initialiseArgs(pArgValues);
        this.mLogger = this.initialiseLogger();
        this.mDebugMode = this.initialiseDebugMode();
    }

    initialiseArgs(pArgValues) {
        const argTemplates = ArgTemplateFactory.create();
        return Args.parse(pArgValues, argTemplates);
    }

    initialiseLogger() {
        return new ConsoleLogger();
    }

    initialiseDebugMode() {
        return this.args.get(ArgName.debugMode, false);
    }

    run() {
        try {
            if (this.initialise()) {
                const sourceFolderPath = this.args.get(ArgName.sourceFolderPath);
                const destinationFolderPath = this.args.get(ArgName.destinationFolderPath);
                const iconConverter = new IconConverter(sourceFolderPath, destinationFolderPath);
                iconConverter.run();
            }
        } catch (error) {
            this.logger.writeError(this.debugMode ? error.stack : error.message);
        } finally {
            this.finalise();
        }
    }

    initialise() {
        this.logger.writeText(this.information.toString());
        this.logger.writeText((new Date()).toFriendlyDateTimeString());
        this.logger.newLine();
        const __this = this;
        const result = this.args.validate(ArgTemplateFactory.create(), (lArgTemplates, lArgs) => { __this.args_onInvalid(lArgTemplates, lArgs); });
        if ((result) && (this.debugMode)) {
            this.args.log();
            this.logger.newLine();
        }
        return result;
    }

    args_onInvalid(pArgTepmlates, pArgs) {
        pArgTepmlates.reportInvalid(pArgs);
    }
    
    finalise() {
        this.logger.newLine();
        this.logger.writeText("Completed.");
        this.logger.dispose();
    }    
}

module.exports = Application;