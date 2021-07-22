from binana import shim

os = shim
textwrap = shim
sys = shim


# A few frequent functions could be more easily accessed.
r_just = shim.r_just


from binana import point
Point = point.Point

from binana import math_functions as mathfuncs

from binana import mol
Mol = mol.Mol

from binana.cli_params import command_line_parameters as cmd_params

from binana import atom
Atom = atom.Atom

from binana import output
from binana import start


# Entry point for Javascript and other functions.
run = start.main
fs = shim.fake_fs
save_to_fake_fs = start.save_to_fake_fs
load_from_fake_fs = start.load_from_fake_fs
