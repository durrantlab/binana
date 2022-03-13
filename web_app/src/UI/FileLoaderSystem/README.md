# File Loader System

This document describes different components of the file loader system.
`DemoPanel.ts` has a working example.

## MolLoader Vue Component

The main component is `<mol-loader>`.

## props

1. `multipleFiles` (default: `true`). If `true`, accepts multiple files (not
   just one). A list of files appears below the main input, and the user can
   select them by clicking.
2. `saveMultipleFilesToDatabase` (default: `false`). If `true`, multiple files
   are saved to the browser's database, so they are available even on page
   reload.
3. `label` (default: `"Molecule"`). The main label for the `mol-loader`.
4. `description` (default: `"Primary description goes here."`). The main
   description.
5. `extraDescription` (default: `"Some extra description goes here."`). Extra
   description if you need it. In a `slot`.
6. `accept` (default: `".pdb"`). The file types to accept without requiring any
   conversion. Like `".pdbqt, .out, .pdb"`.
7. `convert` (default: `".pdbqt, .ent, .xyz, .pqr, .mcif, .mmcif"`). ***NOT YET
   IMPLEMENTED.*** A list of file types that can be converted to acceptable
   formats. Like `".pdbqt, .out, .pdb"`.
8. `required` (default: `true`). Whether the `mol-loader` is required.
9. `fileLoaderPlugins` (default: `["pdb-id-input", "file-loader-input"]`). A
    list of file loader plugins to use. See `FileLoader/Plugins/`.
10. `allowAtomExtract` (default: `false`). Whether to allow users to extract
    portions of the molecule (emitted via `@onExtractAtoms`, see below).
11. `allowAtomDelete` (default: `true`). Whether to allow users to extract
    portions of the molecule (emitted via `@onExtractAtoms`, see below).

### emits

1. `@onError`. A loading error occurred. Value is of type
   `IFileLoadError` (title, body).
2. `@onFileReady`. A file is ready because it is loaded (optionally after a
   conversion) or it has been selected from a list. Value is of type `string`.
3. `@onExtractAtoms`. Residue(s) have been extracted (e.g., removed from a
   receptor). Value is of type `IExtractInfo` (residues: ISelection[],
   residuePdbLines).
4. `@onStartConvertFile`. <span style="color:red;">***NOT YET
   IMPLEMENTED.***</span> You will need `emits` to handle conversion as well.
   Value is of type `IConvert` (filename, fileContents, onConvertDone,
   onConvertCancel)

### Externally accessed functions

Generally, it is bad practice for parent components to access children
components' methods directly, but sometimes it's just easier.

1. `loadMolFromExternal(filename, pdbContents)`. Allows the user to load a PDB
   file directly, bypassing the user interface. For example, after extracting a
   ligand residue from a protein structure, you might want to set the ligand
   atoms directly.

## Queue System


### QueueController

The component is `<queue-controller>`. It wraps around `<mol-loader>`(s), which
should be in the `<slot>`, and shows them only if there is nothing in the queue.
Otherwise, it starts processing the next item in the queue.

#### props

1. `countDownSeconds` (default: `5`). The number of seconds to count down.
2. `molLoaderIds`. A list of the ids of the associated mol-loaders. This is the
   id used to look up items in the local forage, not to access the DOM
   components themselves. Example: `['receptor', 'ligand']`. Note that the
   `<mol-loader>` must have `saveMultipleFilesToDatabase` set to `true` for this
   to work.
3. `trigger` (default: `false`). Changing this value triggers the queue
   controller. (1) Return the next item in the queue via emit `@onQueueDelivery`
   or (2) download the files if queue is now empty. Useful if you just loaded
   models into the file system and you want to trigger first item in queue (via
   "Start Calc" button, for example).
4. `outputZipFilename` (default: `output.zip`). The name of the zip file to
   download when the queue is empty.

#### emits

1. `@onQueueDelivery`. Emits to start processing next item in the queue. Payload
   is an object, where the keys are the entries of the prop `molLoaderIds` and
   the values are the corresponding file contents that have just been removed
   from the queue.

### QueueCatcher

The component is `<queue-catcher>`. Once loaded, it checks to see if there are
any items in the queue (local forage). If so, it emits `@onQueueNextItem`. This
can be used to save any output files to local forage and start the next step in
a multi-step process (next iteration).

#### props

1. `countDownSeconds` (default: `5`). The number of seconds to count down.
2. `molLoaderIds`. A list of the ids of the associated mol-loaders. This is the
   id used to look up items in the local forage, not to access the DOM
   components themselves. Example: `['receptor', 'ligand']`. Note that the
   `<mol-loader>` must have `saveMultipleFilesToDatabase` set to `true` for this
   to work.
3. `trigger` (default: `false`). Changing this value triggers the queue catcher,
   as if the page had just been (re)loaded. Assuming the necessary files have
   been previously saved to the local forage, this will either (1) start the
   countdown to the next queue item or (2) download the files if the queue is
   empty.
4. `outputZipFilename` (default: `output.zip`). The name of the zip file to
   download when the queue is empty.
5. `beforeQueueNextItemFunc` (default: `() => { return Promise.resolve(); }`).
   Runs before triggering. Use this function to save things to local forage
   before moving on to the next item in the queue. (I'd like to do this via
   emit, but then I couldn't wait for promise to resolve...)

#### emits

1. `@onQueueNextItem`. Emitted when the next item in the queue should be
   processed (timer over). Note that the payload is empty because actually
   getting the next item in the queue is handled by `<queue-controller>`. For
   example, this function might reload the page.

## LocalForageWrapper.ts

There are a few functions in this module that are worth mentioning.

1. `saveOutputToLocalForage()`: Useful for saving output files to the local
   forage for subsequent download. Good to put this in `@onQueueNextItem`.
2. `saveMetaToLocalForage(content: any)`: Useful for saving meta data (e.g.,
   program parameters that will be reused on every queue item).
3. `loadMetaFromLocalForage()`: Load the meta data.


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