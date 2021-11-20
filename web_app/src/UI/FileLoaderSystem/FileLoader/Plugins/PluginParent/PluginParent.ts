import { IFileInfo, IFileLoadError, IConvert } from '../../../Common/Interfaces';
import { processFiles } from './ProcessFiles';
declare var Vue;

export var commonFileLoaderProps = {
    "id": {
        "type": String,
        "required": false
    },
    "required": {
        "type": Boolean,
        "default": true,
    },
    "accept": {
        "type": String,
        "default": "",  // e.g., ".pdbqt, .out, .pdb"
    },
    "convert": {
        "type": String,
        "default": "",  // e.g., ".sdf, .mol2"
    },
    "valid": {
        "type": Boolean,
        "default": true
    }
}

export abstract class FileLoaderPluginParent {
    // Can be overwritten
    data = () => {return {};}
    methods = {};
    props = {};
    computed = {};
    mounted = function() {};
    defaultPlaceHolder = "";
    
    // Inherited classes must define
    protected abstract template: string;
    abstract tag: string;
    abstract tabName: string;
    abstract clearEntryAfterLoad: Function;

    public setup(): FileLoaderPluginParent {
        let This = this;

        let propsToUse = {
            ...this.props,
            ...commonFileLoaderProps, // adds accept, convert, valid, etc.

            // If only one file is allowed, this is what filename will be
            // displayed in the text box, etc. If multiple files, automatically
            // clears.
            "filenameToShow": {
                "type": String,
                "default": ""
            },
            "multipleFiles": {
                "type": Boolean,
                "default": true
            }
        };

        let dataToUse = function() {
            let data = This.data();
            data["defaultPlaceHolder"] = This.defaultPlaceHolder;
            return data;
        };

        let methodsToUse = {
            ...this.methods,
            
            // When the file is completely ready, after any conversion, error
            // handling, etc. Fires for every file loaded.
            onFileReady(fileInfo: IFileInfo): void {
                if (fileInfo.fileContents === undefined) {
                    // Didn't really load.
                    return;
                }
                this.$emit("onFileReady", fileInfo);
                this.clearEntryAfterLoad();
            },

            // When files are loaded, before any conversion, error handling,
            // etc. Fires once per batch of files loaded (where batch could
            // contain only one file).
            onFilesLoaded: processFiles,

            // When an error occurs, handle that as well.
            onError(errorMsg: IFileLoadError): void {
                this.$emit("onError", errorMsg);
            },

            // Start converting files that need to be converted.
            onStartConvertFiles(files: IConvert[]) {
                for (let i = 0; i < files.length; i++) {
                    new Promise((resolve, reject) => {
                        files[i].onConvertDone = resolve;
                        files[i].onConvertCancel = reject;
                    });
                }
                this.$emit("onStartConvertFiles",  files);
            },

            clearEntryAfterLoad: this.clearEntryAfterLoad
        }

        let computedsToUse = {
            ...this.computed,
            "placeholder"(): string {
                // Note that this["filenameToShow"] will be "" if multiple files
                // not allowed, or the last (selected) file otherwise. If no
                // previous file, will show default placeholder.
                let filenameToShowIsSet = ([undefined, ""].indexOf(this["filenameToShow"]) === -1);
                let placeholder = filenameToShowIsSet
                    ? this["filenameToShow"]
                    : this["defaultPlaceHolder"];
                return placeholder;
            }
        }

        Vue.component(this.tag, {
            /**
             * Get the data associated with this component.
             * @returns any  The data.
             */
            "data": dataToUse,
            "methods": methodsToUse,
            "template": this.template,
            "props": propsToUse,
            "computed": computedsToUse,
    
            /**
             * Runs when the vue component is mounted.
             * @returns void
             */
            "mounted": this.mounted,
        });

        return this;
    }

    // propVals: {[key: string]: string}
    public create(idx=0): string {
        
        // for (let propName in propVals) {
        //     propStr += `${propName}=${propVals[propName]} `
        // }

        let str = `<${this.tag}
            ref="fileLoaderPlugin${idx}"
            :accept="accept" :convert="convert"
            @onFileReady="onFileReady"
            @onError="onError"
            @onStartConvertFiles="onStartConvertFiles"
            :valid="valid"
            :filenameToShow="filenameToShow"
            :multipleFiles="multipleFiles"
        >`;

        // 

        str += `</${this.tag}>`;

        return str;
    }
}