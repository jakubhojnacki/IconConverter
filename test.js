const Application = require("./src/application/application");

(async () => {
	const args = [ "-sf", "/home/Multimedia/Icons", "-df", "/home/Temp", "-d", "true" ];
	global.application = new Application(__dirname, args);
	global.application.run();
})();
