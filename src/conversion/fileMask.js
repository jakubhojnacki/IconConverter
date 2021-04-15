/**
 * @module "FileMask" class
 * @description Matches file system name (file / folder name) to a mask
 * @version 0.0.3 (2021-04-11)
 */

class FileMask {
	get mask() { return this.mMask; }
	get regExp() { return this.mRegExp; }

	constructor(pMask) {
		this.mMask = pMask;
		this.mRegExp = new RegExp(FileMask.parseMask(this.mask));
	}

	static parseMask(pMask) {
		let parsedMask = pMask;
		const specialCharacters = ["\\", ".", ",", "+", "!", "^", "$", "=", "<", ">", "|", "(", ")", "[", "]", "{", "}"];
		for (const specialCharacter of specialCharacters)
			parsedMask = parsedMask.replace(specialCharacter, "\\" + specialCharacter);
		parsedMask = parsedMask.replace("*", ".*");
		parsedMask = parsedMask.replace("?", ".");			
		return parsedMask;
	}

	contains(pFileName) {
		return this.regExp.test(pFileName);
	}

	toString() {
		return this.mask;
	}
}

module.exports = FileMask;