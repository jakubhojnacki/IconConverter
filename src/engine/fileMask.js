/**
 * @module "FileMask" class
 * @description Matches file system name (file / directory name) to a mask
 * @version 0.0.4 (2021-08-12)
 */

export default class FileMask {
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
