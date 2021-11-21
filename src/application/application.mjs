/**
 * @module "Application" class
 * @description Represents the main application class
 */

"use strict"

import { ArgName } from "../application/argName.mjs";
import { ArgTemplateFactory } from "../application/argTemplateFactory.mjs";
import { ConsoleApplication } from "console-library";
import { ConsoleProgress } from "console-library";
import { Logic } from "../logic/logic.mjs";
import { Settings } from "../settings/settings.mjs";

export class Application extends ConsoleApplication {
    get progress() { return this.mProgress; }
    set progress(pValue) { this.mProgress = pValue; }

    constructor(pRootDirectoryPath) {        
        super(pRootDirectoryPath, (new ArgTemplateFactory()).create(), new Settings());
        this.progress = null;        
    }

    async runLogic() {
        const __this = this;
        const sourceDirectoryPath = this.args.get(ArgName.sourceDirectoryPath);
        const destinationDirectoryPath = this.args.get(ArgName.destinationDirectoryPath);
        const logic = new Logic(this, sourceDirectoryPath, destinationDirectoryPath);
        logic.onInitialise = (lEventArgs) => { __this.onLogicInitialise(lEventArgs); };
        logic.onDirectory = (lEventArgs) => { __this.onLogicDirectory(lEventArgs); };
        logic.onFile = (lEventArgs) => { __this.onLogicFile(lEventArgs); };
        logic.onFinalise = (lEventArgs) => { __this.onLogicFinalise(lEventArgs); };
        await logic.run();
    }

    onLogicInitialise(pEventArgs) {
        const __this = this;
        this.progress = new ConsoleProgress(null, null, (lProgress) => { __this.onProgressUpdate(lProgress); }, "[", "#", "]", 40, this.console.width);
        this.progress.reset(pEventArgs.fileCount, "Extracting icons...");
        this.newLineOnError = true;
    }

    onLogicDirectory(pEventArgs) {
        this.progress.move(0, `[${pEventArgs.fileSystemItem.name}]`);
    }

    onLogicFile(pEventArgs) {
        this.progress.move(1, pEventArgs.fileSystemItem.name);
    }

    onLogicFinalise(pEventArgs) {
        this.progress.complete("Done");        
        this.console.newLine();
    }

    onProgressUpdate(pProgres) {
        pProgres.render(this.console);
    }    
}
