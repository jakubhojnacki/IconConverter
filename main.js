import Application from "./src/application.js";
import Node from "./src/general/node.js";

(async () => {
    global.theRoot = Node.getRoot(import.meta);
	global.theApplication = new Application();
	global.theApplication.run();
})();
