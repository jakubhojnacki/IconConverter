const Application = require("./src/application/application");

(async () => {
	const args = [ "-s", "/home/Multimedia/Icons", "-m", "*.ico", "-d", "/home/Temp", "-t", "png", "-dm", "true" ];
	global.application = new Application(__dirname, args);
	global.application.run();
})();
