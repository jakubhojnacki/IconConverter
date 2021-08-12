/**
 * @module "Node" class
 * @description Provides some node-specific tools
 * @version 0.0.3 (2021-08-12)
 */

import Path from 'path';
import Url from 'url';
 
 export default class Node {
     static getRoot(pMeta) {
         const filePath = Url.fileURLToPath(pMeta.url);
         const directoryPath = Path.dirname(filePath);
         return directoryPath;
     }    
 }