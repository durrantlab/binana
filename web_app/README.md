# Binana 1.0.0 #

## Introduction ##

Webina is a JavaScript/WebAssembly library that runs AutoDock Vina, a popular
program for molecular docking, entirely in a web browser. The docking
calculations take place on the user's own computer rather than a remote
server. To encourage use, we have incorporated the Webina library into our own
Webina web app. The app includes a convenient interface so users can easily
setup their docking runs and analyze the results. A working version of the app
can be accessed free of charge from
[http://durrantlab.com/webina](http://durrantlab.com/webina).

## Compatibility ##

We have tested the Webina library on macOS 10.14.5, Windows 10 Home 1803, and
Ubuntu 18.04.3 LTS. Webina uses the SharedArrayBuffer JavaScript object to
allow multiple processes/threads to exchange data directly. This object is
currently available on Chromium-based browsers such as Google Chrome.
Additional browsers are likely to enable SharedArrayBuffer soon.

## Repository Contents ##

* `dist/`: The production (distribution) files. If you wish to run the Webina
  library or web app on your own server, these are the only files you need.
  For convenience, the `webina.zip` contains the contents of the `dist/`
  directory.
  * `dist/minimal_example.html` shows how to use the Webina library in your
    own programs.
  * `dist/index.html` starts the Webina web app (see
    [http://durrantlab.com/webina](http://durrantlab.com/webina) for a working
    example).
* `src/`: The Webina source files. You cannot use these files directly. They
  must be compiled.
* `utils/`, `package.json`, `package-lock.json`, `tsconfig.json`: Files used
  to compile the contents of the `src/` directory to the `dist/` directory.
* `CHANGELOG.md`, `CONTRIBUTORS.md`, `README.md`: Documentation files.

## Description of Use ##

### Receptor/Ligand PDBQT Input Files ###

As is the case with command-line Vina, Webina accepts input receptor and
ligand files in the PDBQT format. The latest version of the Webina app
optionally interfaces with the PDBQTConvert app (included in the git
repository) to convert these files from other formats (e.g., PDB) to PDBQT.
But some advanced users may wish to provide their own PDBQT files. Such users
include:

* Users who wish to have more fine-grained control over the input. For
  example, users who wish to specify protonation states, ring-conformational
  forms, etc.
* Users who wish to access the Webina JavaScript Library itself, independent
  of our user-friendly Webina app. The library itself is simply Vina compiled
  to WebAssembly. It cannot convert files because Vina cannot convert files,
  so users must provide their own PDBQT files.

#### Preparing the Receptor PDBQT File ####

We recommend the following steps for those who wish to provide their own
receptor PDBQT files:

* Download the PDB file from the [Protein Data Bank](https://www.rcsb.org/).
* Remove any ligands, ions, co-factors, water molecules, etc. that might
  interfere with docking. Editing the PDB file in a text editor (e.g.,
  [Notepad++](https://notepad-plus-plus.org/)) and deleting the appropriate
  `ATOM` and `HETATM` records is perhaps the easiest way to remove these
  components.
* Assign hydrogen atoms to the protein model. We recommend using the [PDB2PQR
  server](http://apbs-rest-test.westus2.cloudapp.azure.com/), an online
  website that adds hydrogen atoms per a user-specified pH.
* Convert to the PDBQT format. The PDB2PQR server will produce a PQR file that
  includes hydrogen atoms. The simplest way to convert this file to PDBQT is
  with the free program [Open Babel](http://openbabel.org/wiki/Main_Page).
  Here is an example command: `obabel -xr -ipqr my_receptor.pqr -O
  my_receptor.pdbqt`

#### Preparing the Ligand PDBQT File ####

We recommend the following steps for those who wish to provide their own
ligand PDBQT files:

* Obtain a copy of your ligand file in SMILES-string or SDF format. Many
  molecular databases provide small-molecule files in these common formats. If
  necessary, you can convert to these formats using [Open
  Babel](http://openbabel.org/wiki/Main_Page). Many [online molecular
  editors](https://pubchem.ncbi.nlm.nih.gov/edit3/index.html) also generate
  SMILES strings by letting users draw their molecules.
* Generate 3D models of your ligand. We recommend using the program
  [Gypsum-DL](https://durrantlab.pitt.edu/gypsum-dl/) to generate high-quality
  models that account for alternate ionization, tautomeric, chiral, cis/trans
  isomeric, and ring-conformational states (see [the
  documentation](https://durrantlab.pitt.edu/gypsum-dl/) for a description of
  use).
* Convert to PDBQT. Gypsum-DL will output ligand models in the SDF format. You
  can convert these to PDBQT using [Open
  Babel](http://openbabel.org/wiki/Main_Page) like this: `obabel -isdf
  gypsum_output.sdf -O gypsum_output.pdbqt`
* It is also possible to convert directly from a SMILES or SDF file using only
  Open Babel, though Open Babel lacks some of the features Gypsum-DL provides.
  Here is an example command line: `obabel --gen3d -p -ismi ligand.smi -O
  ligand.pdbqt`

### Webina JavaScript Library ###

The Webina library is built on the AutoDock Vina 1.1.2 codebase, compiled to
WebAssembly. Web-app developers can incorporate the library into their own
computer-aided drug-discovery apps. See `dist/minimal_example.html` for a
simple example of how to use the Webina library in your own programs.

All Vina command-line parameters are accessible via the Webina library, with
the exception of the parameters used to specify input files. For security
reasons, web browsers do not allow JavaScript to directly access users' file
systems. Instead, the contents of local files must be read through a file
input element, using a JavaScript FileReader object. To overcome this
limitation, the Webina library accepts text strings containing the contents of
the input PDBQT files, rather than the file paths normally specified via Vina
parameters such as `--receptor` and `--ligand`.

### Webina Web App ###

#### Input Parameters Tab ####

We have incorporated the Webina JavaScript library into a Webina web app that
includes additional tools for setting up Webina runs and visualizing docking
results. On first visiting the Webina web app, the user encounters the "Input
Parameters" tab. This tab includes several subsections that are useful for
setting up a Webina run.

__Input PDBQT Files.__ The "Input (PDBQT) Files" subsection allows the user to
select their receptor and ligand files. The user can also optionally specify a
known-pose PDB or PDBQT ligand file. This file includes the ligand in its
experimentally determined, correct bound pose (e.g., per X-ray crystallography
or NMR). The known-pose file plays no role in the docking calculation; rather,
it serves as a positive-control reference for evaluating Webina-predicted
ligand poses. In our experience, it is often helpful to first benchmark Webina
(or Vina) against a known ligand before using the program to evaluate
compounds with unknown poses and binding affinities.

The "Input (PDBQT) Files" subsection also includes several options to simplify
the process of preparing/testing protein/ligand input files.

* If users wish only to test Webina without having to provide their own files,
  they can click the "Use Example Files" button to automatically load example
  receptor, ligand, and known-pose files.
* If users specify receptor/ligand input files that are not in the required
  PDBQT format, the Webina web app will optionally attempt to convert them to
  PDBQT using the PDBQTConvert app. Interactions between the Webina and
  PDBQTConvert apps occur at "arm's length" via an iframe.
* If users' receptor files include non-protein residues that might interfere
  with docking (e.g., a co-crystallized ligand), they can remove all
  non-protein atoms.
* If users do not have a ligand file, they can use a web-based 2D molecular
  editor to draw their ligand by hand. PDBQTConvert then converts that 2D
  ligand representation to a 3D PDBQT file for docking.

__Docking Box.__ The "Docking Box" subsection allows users to specify the
region of the receptor where Webina should attempt to pose the ligand. This
box-shaped volume is typically centered on a known protein pocket or cavity
where a small-molecule ligand might reasonably bind. If the box is large
enough to encompass the whole protein, Webina will attempt full-surface
docking (though so broad a search is not recommended).

To simplify the process of selecting a docking box, the Webina web app
automatically displays 3D models of the user-specified receptor and ligand
using the [3Dmol.js JavaScript library](https://3dmol.csb.pitt.edu/). By
default, the receptor and ligand are displayed using cartoon and sticks
representations, respectively. The user can toggle a surface representation as
required to identify candidate receptor pockets. A transparent yellow box is
superimposed on the structures to indicate the docking-box region.

When the user clicks the atoms of the receptor model, the Webina web app
recenters the docking box on the selected atom. Users can also adjust the
location and dimensions of the box using text fields below the molecular
visualization.

__Other Critical Parameters.__ The "Other Critical Parameters" subsection
allows the user to specify the number of CPUs and the exhaustiveness setting.
We chose to set these two parameters apart because they are particularly
important in a browser-based setting. Users expect command-line tools to
consume substantial computer resources, but they do not expect web apps to do
so. By default, Vina uses all available CPUs and an exhaustiveness setting of
eight. Webina has the same ability to consume CPUs and memory, but many users
will wish to adjust these parameters to avoid impacting the performance of
other programs and browser tabs.

__Advanced Parameters.__ The "Advanced Parameters" subsection allows users to
specify many additional parameters that are also available via command-line
Vina. In our experience, it is rarely necessary to adjust these parameters, so
they are hidden by default.

__Run Vina from Command Line.__ The "Run Vina from Command Line" subsection
aims to help Vina users who wish to use the Webina web app to setup their
docking boxes and user parameters. A text field provides a mock example of how
to use command-line Vina with the specified parameters. Users can copy this
example, modify it as needed, and paste it into their command-line terminals
to run the desired calculation with the standard Vina executable. This
subsection also includes links that allow the user to download the
receptor/ligand PDBQT files for command-line use.

__Starting the Webina Calculation.__ Once users click the "Start Webina"
button, the Webina app will switch to the "Running Webina" tab while Webina
executes. When the calculation is complete, the Webina web app will switch to
the "Output" tab (described below) where users can visualize the docking
results.

#### Existing Vina Output Tab ####

The "Existing Vina Output" tab allows users to load and visualize the results
of previous Webina and Vina runs, without having to rerun the calculations.
Users must specify the existing receptor and Webina/Vina output file they wish
to visualize. They can also optionally specify a known-pose ligand file for
reference. Users who wish to test the web app without providing their own
files can click the "Use Example Files" button. Otherwise the "Load Files"
button will open and visualize the specified files.

#### Output Tab ####

The "Output" tab allows users to visualize their Webina docking results. The
same tab also displays the output of any previous Webina/Vina calculations
that the user specifies via the "Existing Vina Output" tab.

__Visualization.__ The "Visualization" subsection uses 3Dmol.js to display the
receptor and docked molecule in cartoon/surface and sticks representation,
respectively. If the user has specified a known-pose ligand file, that pose is
also displayed in yellow sticks. Like Vina, Webina predicts several poses per
input ligand. A table below the visualization viewport lists each pose
together with associated information such as the docking score. Clicking on a
table row updates the 3D view with the specified pose so users can easily
examine all predicted poses.

__Output Files.__ The "Output Files" subsection shows the text contents of the
Webina output files. An associated "Download" button allows users to easily
save those files.

__Run Vina from Command Line.__ Similar to the "Input Parameters" tab, the
"Output" tab also includes a "Run Vina from Command Line" subsection. This
subsection makes it easy for users to reproduce Webina's results using
stand-alone Vina. It also reminds users what parameters they selected to
generate the displayed Webina output.

#### Start Over Tab ####

The "Start Over" tab displays a simple button that allows the user to restart
the Webina app. A warning message reminds the user that they will lose the
results of the current Webina run unless they have saved their output files.

## Running Webina on Your Own Computer ##

Most users will wish to simply access the already compiled, publicly available
Webina web app at
[http://durrantlab.com/webina](http://durrantlab.com/webina). If you wish to
instead run Webina on your own UNIX-like computer (LINUX, macOS, etc.), follow
these instructions:

1. Download the `webina.zip` file
2. Uncompress the file: `unzip webina.zip`
3. Change to the new `webina/` directory: `cd webina`
4. Start a local server.
   * You can use `Node.js` and `npm`:
     * `npm install -g http-server`
     * `http-server`
   * [With some
     coding](https://curiousprog.com/2018/10/08/serving-webassembly-files-with-a-development-web-server/),
     you can also use Python 2.7's built-in server:
     * `python -m SimpleHTTPServer 8000`
5. Access the server from your web-browser (e.g., `http://localhost:8000/`,
   `http://0.0.0.0:8000/`, etc.)

Running Webina on other operating systems (e.g., Windows) should be similar.

## Compiling the Webina Web App ##

The vast majority of users will not need to compile the Webina web app on their own.
Simply use the already compiled files in `dist/` or `webina.zip`.
If you need to make modifications to the source code, these instructions
should help with re-compiling on UNIX-like systems:

1. Clone or download the git repository: `git clone https://git.durrantlab.pitt.edu/jdurrant/webina.git`
2. Change into the new `webina` directory: `cd webina`
3. Install the required `npm` packages: `npm install`
4. Fix any vulnerabilities: `npm audit fix`
5. Make sure Python is installed system wide, and that `python` works from the
   command line (tested using Python 2.7.15)
6. To deploy a dev server: `npm run start`
7. To compile the contents of `src/` to `dist/`: `npm run build`

Note: The Webina-library source code is located at `src/Webina/`. It has a
separate build system (`/src/Webina/compile.sh`). If you modify any of the
files in `/src/Webina/src/`, be sure to run `compile.sh` before building the
larger web app via `npm run build`.

## Compiling the AutoDock Vina 1.1.2 Codebase to WebAssembly ##

We used Emscripten version 1.38.48 to compile the Vina 1.1.2 codebase to
WebAssembly. As mentioned in our manuscript, the key to successful compilation
was to provide Emscripten with the required Boost include files. We used this
command to compile the Boost libraries:

`./bjam link=static variant=release threading=multi runtime-link=static thread
program_options filesystem system serialization`

The resulting binaries were written to
`<boost>/bin.v2/libs/<lib_name>/build/gcc-1.38.48/release/link-static/runtime-link-static/threading-multi`

These binaries had to be linked to `em++` during the compilation process by
modifying the Vina Makefile. Specifically, the included headers had to be
linked/copied under `<emsdk_path>/fastcomp/emscripten/system/include/`.

A detailed description of this process is beyond the scope of this README
file, though many helpful tips have been posed online.

## Notes on User Analytics ##

In some circumstances, the Webina web app may report usage statistics to
Google Analytics. These reports are useful for securing and justifying funding
for the Durrant lab. Usage statistics are only sent if the web-app URL
contains the substring "durrantlab," so installing Webina on your own server
should prevent reporting. Even when using the publicly available version of
Webina hosted at [http://durrantlab.com/webina](http://durrantlab.com/webina),
information about your specific receptor and ligand files is never transmitted
to any remote server.
