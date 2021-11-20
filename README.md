# Git Repository Contents (Select Directories and Files)

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

# Using BINANA

## Command-Line Use

See `./python/COMMAND_LINE_USE.md` in the Git repository for detailed instructions.
Here is a simple example:

```bash
cd python
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_dir /path/to/output/directory/
```

## Python Library

The following files in the Git repository describe how to use BINANA as a Python
library that can be accessed from other Python scripts:

- `./python/example/Examples.ipynb`: A Jupyter notebook demonstrating use.
- `./python/example/Examples.ipynb.pdf`: A PDF version of the notebook, for
  those who don't use Jupyter.
- `./python/example/Examples.md`: A Markdown version of the notebook.

## JavaScript Library

These files describe how to use BINANA as a JavaScript library that can be
accessed from the web browser (e.g., from web apps).

- `./javascript/lib/Examples.ipynb`: A Jupyter notebook demonstrating use.
- `./javascript/lib/Examples.ipynb.pdf`: A PDF version of the notebook, for
  those who don't use Jupyter.
- `./javascript/lib/examples.html`: An HTML file demonstrating use.
