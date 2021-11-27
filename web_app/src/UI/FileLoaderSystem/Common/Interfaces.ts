// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

export interface IVueXVar {
    name: string;
    val: any;
}

export interface IConvert extends IFileInfo{
    onConvertDone: Function;
    onConvertCancel: Function;
}

export interface IFileInfo {
    filename: string;
    fileContents: string;
    // onConvertDone: IConvert;
    // convertedResolveFunc?: Function;
    // convertedRejectFunc?: Function;
    // id?: string;  // associated component id
}

export interface IFileLoadError {
    title: string;
    body: string;
}

// export interface IFileFromTextField {
//     placeholder: string;
//     tabName: string;
//     loadFunc: Function
//     onSuccess: Function;
//     onError: Function;
// }

export interface IAllFiles {
    selectedFilename: string;
    allFiles: {[key: string]: string};  // filename => contents
}

export interface IResidueInfo {
    residueId: string[],
    residuePdbLines: string
}