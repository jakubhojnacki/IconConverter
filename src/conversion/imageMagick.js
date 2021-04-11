/**
 * @module "ImageMagick" class
 * @description Class wrapping ImageMagick functionality
 * @version 0.0.1 (2021-04-11)
 */

const imagemagick = require("imagemagick");
const path = require("path");

require("../general/javaScript");

class ImageMagick {
    constructor() {
    }
	
    async split(pSourcePath, pDestinationFolderPath, pDestinationFileType) {
        await this.convertInt([pSourcePath, `${pDestinationFolderPath}/%02d.${pDestinationFileType}`]);
	}    

	convertInt(pParameters) {
		return new Promise((lResolve, lReject) => {
			imagemagick.convert(pParameters, (lError, lStdOut) => {
				if (lError)
					lReject();
				lResolve(lStdOut);
			});
		});
	}    

	async getInformation(pImageFilePath) {
		return await this.identifyInt(pImageFilePath);
	}

	identifyInt(pImageFilePath) {
		return new Promise((lResolve, lReject) => {
			imagemagick.identify(pImageFilePath, (lError, lImageData) => {
				if (lError)
					lReject();
				lResolve(lImageData);
			});
		});
	}
}

module.exports = ImageMagick;