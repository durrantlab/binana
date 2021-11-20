import { IFileInfo } from "../../../Common/Interfaces";
import { getFileObjContents } from "../../../Common/Utils";

/** An object containing the vue-component computed functions. */
export let fileLoaderInputComputedFunctions = {
    /** Gets and sets the file. On setting, also checks for a valid extension
     * and opens the convert modal if necessary. */
    "val": {
        get(): any {
            return this["files"];
        },

        set(vals: any): void {
            // vals is File[] or File.

            if (vals === null) {
                // Reseting the value. Nothing to do here.
                return;
            }

            if (vals.map === undefined) {
                // A single file. Convert to array.
                vals = [vals];
            }

            // Get all the information about the files.
            let contentsPromises = vals.map(v => getFileObjContents(v));
            Promise.all(contentsPromises).then((contents) => {
                let filesInfo: IFileInfo[] = vals.map((v, i) => {
                    return {
                        filename: vals[i]["name"],
                        fileContents: contents[i]
                    } as IFileInfo
                });

                let allFilesLoaded = this.onFilesLoaded(filesInfo);
                if (!allFilesLoaded) {
                    // invalid files or something.
                    this["files"] = null; 
                }
            });
        },
    },
};
