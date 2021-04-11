const Application = require("./src/application/application");

(async () => {
	const rootFolderPath = __dirname;
	const args = [ "-s", "/home/Multimedia/Icons", "-m", "Android*.ico", "-d", `${rootFolderPath}/temp`, "-t", "png", "-dm", "true" ];
	global.application = new Application(rootFolderPath, args);
	global.application.run();
})();
