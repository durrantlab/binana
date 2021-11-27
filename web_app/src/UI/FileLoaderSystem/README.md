# MolLoader Vue Component

The main component is `<mol-loader>`. The others are sub-components.

## props

1. `multipleFiles` (default: `true`). If `true`, accepts multiple files (not
   just one). A list of files appears below the main input, and the user can
   select them by clicking.
2. `allowDeleteHeteroAtoms` (default: `false`). Whether the user can delete
   non-protein residues.
3. `allowExtractHeteroAtoms` (default: `false`). Whether the user can extract
   non-protein residues (e.g., from a receptor `mol-loader` to a ligand
   `mol-loader`).
4. `label` (default: `"Molecule"`). The main label for the `mol-loader`.
5. `description` (default: `"Primary description goes here."`). The main
   description.
6. `extraDescription` (default: `"Some extra description goes here."`). Extra
   description if you need it. In a `slot`.
7. `accept` (default: `".pdb"`). The file types to accept without requiring any
   conversion. Like `".pdbqt, .out, .pdb"`.
8. `convert` (default: `".pdbqt, .ent, .xyz, .pqr, .mcif, .mmcif"`). ***NOT YET
   IMPLEMENTED.*** A list of file types that can be converted to acceptable
   formats. Like `".pdbqt, .out, .pdb"`.
9. `required` (default: `true`). Whether the `mol-loader` is required.
10. `fileLoaderPlugins` (default: `["pdb-id-input", "file-loader-input"]`). A
    list of file loader plugins to use. See `FileLoader/Plugins/`.

## emits

1. `@onError`. A loading error occurred. Value is of type
   `IFileLoadError` (title, body).
2. `@onFileReady`. A file is ready because it is loaded (optionally after a
   conversion). Value is of type `IFileInfo` (filename, fileContents).
3. `@onExtractAtoms`. Residue(s) have been extracted (e.g., removed from a
   receptor). Value is of type `IResidueInfo` (residueId, residuePdbLines).
4. `@onStartConvertFiles`. ***NOT YET IMPLEMENTED.*** You will need `emits` to
   handle conversion as well.

## Externally accessed functions

Generally, it is bad practice for parent components to access children
components' methods directly, but sometimes it's just easier.

1. `loadMolFromExternal(filename, pdbContents)`. Allows the user to load a PDB
   file directly, bypassing the user interface. For example, after extracting a
   ligand residue from a protein structure, you might want to set the ligand
   atoms directly.

<!-- 

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

* `accept`: 
* `multipleFiles`: 
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
@onTimeUp -->