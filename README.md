# Introduction

BINANA (BINding ANAlyzer) is a python-implemented algorithm for analyzing ligand
binding. The program identifies key binding characteristics like hydrogen bonds,
salt bridges, and pi interactions. As input, BINANA accepts receptor and ligand
files in the PDBQT (preferred) or PDB formats. PDBQT files can be generated from
the more common PDB file format using the [free converter provided with
AutoDockTools](http://mgltools.scripps.edu/downloads). As output, BINANA
identifies and describes key protein/ligand interactions.

# Citation

If you use BINANA in your work, please cite:

BINANA: A Novel Algorithm for Ligand-Binding Characterization. Durrant JD,
McCammon JA. J Mol Graph Model. 2011 Apr; 29(6): 888-893. doi:
10.1016/j.jmgm.2011.01.004

# License

BINANA 2.1 is released under the [Apache License, Version
2.0](https://opensource.org/licenses/Apache-2.0). 

# Description of select directories and files

The BINANA Git repository is hosted at
[http://git.durrantlab.com/jdurrant/binana](http://git.durrantlab.com/jdurrant/binana).

| Directory/File                    | Description
|-----------------------------------|------------------------------------------
| `./python/`                       | All Python code
| `./python/run_binana.py`          | Script for command-line use
| `./python/binana/`                | Python library (e.g., `import binana`)
| `./python/example/Examples.ipynb` | Jupyter notebook, Python-library demo
| `./javascript/lib/`               | JavaScript library
| `./javascript/lib/Examples.ipynb` | Jupyter notebook, JavaScript-library demo
| `./javascript/lib/examples.html`  | HTML file, JavaScript-library demo
| `./web_app/`                      | Web app
| `./web_app/src/`                  | Web-app source code
| `./INTERACTIONS.md`               | Descriptions of the detected interactions.

# Locations of BINANA tutorials

## Command-line use

See `./python/COMMAND_LINE_USE.md` in the Git repository for detailed instructions.
Here is a simple example:

```bash
cd python
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_dir /path/to/output/directory/
```

## Python library

The following files in the Git repository describe how to use BINANA as a Python
library that can be accessed from other Python scripts:

- `./python/example/Examples.ipynb`: A Jupyter notebook demonstrating use.
- `./python/example/Examples.ipynb.pdf`: A PDF version of the notebook, for
  those who don't use Jupyter.
- `./python/example/Examples.md`: A Markdown version of the notebook.

## JavaScript library

These files describe how to use BINANA as a JavaScript library that can be
accessed from the web browser (e.g., from web apps).

- `./javascript/lib/Examples.ipynb`: A Jupyter notebook demonstrating use.
- `./javascript/lib/Examples.ipynb.pdf`: A PDF version of the notebook, for
  those who don't use Jupyter.
- `./javascript/lib/examples.html`: An HTML file demonstrating use.

## Web-browser app

A [video tutorial](https://youtu.be/BMnSYvH4Qwg) describes how to use the
[BINANA web-browser app](http://durrantlab.com/binana).