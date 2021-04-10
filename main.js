const Application = require("./src/application/application");

(async () => {
	global.application = new Application(__dirname, process.argv);
	global.application.run();
})();
