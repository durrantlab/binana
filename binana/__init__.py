from binana.test import _run_test
import binana  # Leave this for javascript conversion.
from binana import _utils  # Leave
from binana import fs  # Leave
from binana._utils import shim
from binana._structure import point
from binana._structure import mol
from binana._structure import atom
from binana import output
from binana import _start
from binana._utils import math_functions as mathfuncs
from binana._cli_params import get_params as cmd_params

# __pragma__ ('skip')
# Python
os = shim
textwrap = shim
import sys
# __pragma__ ('noskip')

"""?
# Transcrypt
os = binana.os
textwrap = binana._utils.shim
sys = binana.sys
?"""

# A few frequent functions could be more easily accessed.
r_just = shim.r_just

Point = point.Point
Mol = mol.Mol
Atom = atom.Atom

# Entry point for Javascript and other functions.

def run(args=None):
    """Gets all the interactions between a ligand and receptor, per the 
    parameters specified in ``args``. If ``args`` is not ``None``, it should 
    look like this::

        [
            "-receptor", "receptor.pdb", 
            "-ligand", "ligand.pdb", 
            "-close_contacts_dist1_cutoff", "2.5", 
            "-close_contacts_dist2_cutoff", "4", 
            "-electrostatic_dist_cutoff", "4", 
            "-active_site_flexibility_dist_cutoff", "4", 
            "-hydrophobic_dist_cutoff", "4", 
            "-hydrogen_bond_dist_cutoff", "4", 
            "-hydrogen_bond_angle_cutoff", "40", 
            "-pi_padding_dist", "0.75", 
            "-pi_pi_interacting_dist_cutoff", "7.5", 
            "-pi_stacking_angle_tolerance", "30", 
            "-T_stacking_angle_tolerance", "30", 
            "-T_stacking_closest_dist_cutoff", "5", 
            "-cation_pi_dist_cutoff", "6", 
            "-salt_bridge_dist_cutoff", "5.5"
        ]

    If any of the parameters above are omitted, default values will be used.

    Args:
        args (list, optional): A list of strings corresponding to parameter 
            name/value pairs. The parameter names must start with a hyphen. 
            If None, uses sys.argv (command line arguments). Defaults to None.
    """

    _start._intro()

    if args is None:
        # If no args provided to function, assume command-line use.
        args = sys.argv[:]
    else:
        # Args provided. Make sure values are all strings (to standardize).
        for i, a in enumerate(args):
            args[i] = str(a)

    cmd_params = binana.cmd_params.CommandLineParameters(args)

    if cmd_params.params["test"]:
        # Run the tests, because `-test true` from command line.
        _run_test(cmd_params)
        return
    elif cmd_params.okay_to_proceed() == False:
        print(
            "Error: You need to specify the ligand and receptor PDBQT files to analyze using\nthe -receptor and -ligand tags from the command line.\n"
        )
        sys.exit(0)
        return  # Needed for transcrypt

    if cmd_params.error != "":
        print("Warning: The following command-line parameters were not recognized:")
        print(("   " + cmd_params.error + "\n"))
    
    _start._get_all_interactions(cmd_params)
