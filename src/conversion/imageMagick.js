/**
 * @module "ImageMagick" class
 * @description Class wrapping ImageMagick functionality
 * @version 0.0.1 (2021-04-11)
 */

const path = require("path");

require("../general/javaScript");

class ImageMagick {
    constructor() {
    }
	
    async split(pSourcePath, pDestinationFolderPath) {
        const sourceFileInfo = path.parse(pSourcePath);
        await this.convert([pSourcePath, `${sourceFileInfo.dir}/${sourceFileInfo.name}_%04d.${sourceFileInfo.ext}`]);
	}    

	convert(pParameters) {
		return new Promise((lResolve, lReject) => {
			imagemagick.convert(pParameters, (lError, lStdOut) => {
				if (lError)
					lReject();
				lResolve(lStdOut);
			});
		});
	}    
}

module.exports = ImageMagick;