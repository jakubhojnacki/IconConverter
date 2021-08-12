/**
 * @module "ImageMagickRunner" class
 * @description Class wrapping ImageMagick functionality
 * @version 0.0.2 (2021-08-12)
 */

import "../general/javaScript.js";
import ImageMagick from "imagemagick";

export default class ImageMagickRunner {
    constructor() {
    }
	
    async split(pSourcePath, pDestinationDirectoryPath, pDestinationFileType) {
        await this.convertInt([pSourcePath, `${pDestinationDirectoryPath}/%02d.${pDestinationFileType}`]);
	}    

	convertInt(pParameters) {
		return new Promise((lResolve, lReject) => {
			ImageMagick.convert(pParameters, (lError, lStdOut) => {
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
			ImageMagick.identify(pImageFilePath, (lError, lImageData) => {
				if (lError)
					lReject();
				lResolve(lImageData);
			});
		});
	}
}
