const Application = require("./src/application/application");

(async () => {
	const rootFolderPath = __dirname;
	const args = [];
	global.application = new Application(rootFolderPath, args);
	global.application.run();
})();
