# Notes

TODO: Describe all props and emits.

TODO: Comment on loadMolFromExternal


# TODO: BELOW IS OLD!

## Tips

All files, no matter how they are loaded, must be passed through
`Database.Internal.onFileLoaded()`. This function saves it to the database, etc.

## Usage

Check `FileLoader/FileLoader.Vue/` functions to see all the props and methods.
Here are a few of note (less obvious):

### General

* `id`: Used to create associated database entry. Not optional.
* `@onError`: Emitted when loading error occurs. Parameter is of type
  `IFileLoadError`.

### Loading files

* `accept`: The file types to accept without requiring any conversion. Like
  `".pdbqt, .out, .pdb"`.
* `multipleFiles`: If `true`, accepts multiple files (not just one).
* `@onFileNameChange`: Emitted when a new file name is selected. Parameter is
  `filename`.
* `@onFileLoaded`: Emitted when a file is loaded. Parameter is of type
  `IFileLoaded`.

### Converting files

* `convert`: A list of file types that can be converted to acceptable formats.
  Like `".pdbqt, .out, .pdb"`.
* `@onConvertNeeded`: Emitted when a file is loaded that must be converted.
  Parameter is of type `IConvert`. Must use `IConvert.onConvertDone(filename,
  convertedText)` and `onConvertCancel()` to resume loading after conversion
  complete.

### File-input tabs

* `allowUrlInput`: If `true`, enables url-input tab.
* `fileFromTextFields`: A list of objects of type `IFileFromTextField`, to add
  additional input tabs.

### TO USE:

countDownToNextInput
@onTimeUp