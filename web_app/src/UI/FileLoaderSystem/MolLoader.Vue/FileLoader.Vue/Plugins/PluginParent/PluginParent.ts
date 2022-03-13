// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { IFileInfo, IFileLoadError, IConvert } from '../../../../Common/Interfaces';
import { commonFileLoaderProps } from '../../../../Common/CommonProps.VueFuncs';
import { processFiles } from './ProcessFiles';

declare var Vue;

/**
 * The parent class that all file-loader plugins extend.
 * @abstract
 * @class FileLoaderPluginParent
 */
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

    /**
     * How to clear the entry after a file has loaded.
     */    
    abstract clearEntryAfterLoad: Function;

    /**
     * Creates a Vue copmonent for the file-loader plugin.
     * @returns {FileLoaderPluginParent}
     */
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
            }
        };

        let dataToUse = function() {
            let data = This.data();
            data["defaultPlaceHolder"] = This.defaultPlaceHolder;
            return data;
        };

        let methodsToUse = {
            ...this.methods,
            
            /**
             * When the file is completely ready, after any conversion, error
             * handling, etc. Fires for every file loaded
             * @param {IFileInfo} fileInfo  Information related to the new file.
             * @returns {void}
             */
            onFileReady(fileInfo: IFileInfo): void {
                // When the file is completely ready, after any conversion,
                // error handling, etc. Fires for every file loaded.
                if (fileInfo.mol === undefined) {
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

            /**
             * When an error occurs, handle that as well.
             * @param {IFileLoadError} errorMsg
             */
            onError(errorMsg: IFileLoadError): void {
                this.$emit("onError", errorMsg);
            },

            /**
             * Start converting files that need to be converted.
             * @param {IConvert[]} files  A list of convert-file information.
             * @returns void
             */
            onStartConvertFiles(files: IConvert[]): void {
                if (files.length === 0) {
                    return;
                }

                let makePromise = async () => {
                    if (files.length > 0) {
                        let file = files.shift();
                        new Promise<IFileInfo>((resolve, reject) => {
                            file.onConvertDone = resolve;
                            file.onConvertCancel = reject;
                            this.$emit("onStartConvertFile",  file);
                        })
                        .then((fileInfo: IFileInfo) => {
                            // Everything coverted. Run it through standard file
                            // processing.
                            processFiles.bind(this)([fileInfo]);

                            alert("This needs to also only run after corresponding onFileReady runs.")
                            makePromise();
                        })
                        .catch((error) => {
                            this.$emit("onError", {
                                title: "Convert Error",
                                body: error.toString()
                            } as IFileLoadError);
                            makePromise();
                        });
                    } else {
                        // It's done with all promises
                    }
                }

                makePromise();
            },

            clearEntryAfterLoad: this.clearEntryAfterLoad
        }

        let computedsToUse = {
            ...this.computed,

            /**
             * Get the placeholder text. Could be the filename you should show,
             * or the default placeholder.
             * @returns {string}  The placeholder text.
             */
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

    /**
     * Get the html tag for the new file-loader plugin component.
     *
     * @param {number} [idx=0]  The index to use.
     * @returns {string}
     */
    public create(idx = 0): string {
        let str = `<${this.tag}
            ref="fileLoaderPlugin${idx}"
            :accept="accept" :convert="convert"
            @onFileReady="onFileReady"
            @onError="onError"
            @onStartConvertFile="onStartConvertFile"
            :valid="valid"
            :filenameToShow="filenameToShow"
            :multipleFiles="multipleFiles"
        >`;

        str += `</${this.tag}>`;

        return str;
    }
}