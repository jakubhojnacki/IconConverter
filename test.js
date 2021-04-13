const Application = require("./src/application/application");

(async () => {
	const rootFolderPath = __dirname;
	const args = [
		"-s", "/home/Multimedia/Icons",
		"-m", "*.ico", 
		"-c", "8", 
		"-d", `${rootFolderPath}/temp`, 
		"-fo", "custom-{1}", 
		"-t", "png", 
		"-fi", "{1}",
		"-ins", "true",
		"-i", "true",
		"-if", "index.theme", 
		"-in", "{0} (Custom)",
		"-dm", "true"
	];
	global.application = new Application(rootFolderPath, args);
	global.application.run();
})();
