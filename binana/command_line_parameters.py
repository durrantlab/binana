# this file contains the CommandLineParameters class
# for binana.py

# __pragma__ ('skip')
# Python
import os
# __pragma__ ('noskip')

"""?
# Transcrypt
import binana
os = binana.os
?"""

"""
Class CommmandLineParameters
"""


class CommandLineParameters:
    params = {}

    def is_num(self, num):
        try:
            t = float(num)
            return t
        except ValueError:
            return num

    def __init__(self, parameters):

        # first, set defaults
        self.params["close_contacts_dist1_cutoff"] = 2.5
        self.params["close_contacts_dist2_cutoff"] = 4.0
        self.params["electrostatic_dist_cutoff"] = 4.0
        self.params["active_site_flexibility_dist_cutoff"] = 4.0
        self.params["hydrophobic_dist_cutoff"] = 4.0
        self.params["hydrogen_bond_dist_cutoff"] = 4.0
        self.params["hydrogen_bond_angle_cutoff"] = 40.0
        self.params["pi_padding_dist"] = 0.75
        self.params["pi_pi_interacting_dist_cutoff"] = 7.5
        self.params["pi_stacking_angle_tolerance"] = 30.0
        self.params["T_stacking_angle_tolerance"] = 30.0
        self.params["T_stacking_closest_dist_cutoff"] = 5.0
        self.params["cation_pi_dist_cutoff"] = 6.0
        self.params["salt_bridge_dist_cutoff"] = 5.5
        self.params["receptor"] = ""
        self.params["ligand"] = ""
        self.params["output_dir"] = ""
        self.params["output_file"] = ""

        # now get user inputed values

        for index in range(len(parameters)):
            item = parameters[index]
            if len(item) > 0 and item[0] == "-":
                # so it's a parameter key value
                key = item.replace("-", "")
                value = self.is_num(parameters[index + 1])
                if key in list(self.params.keys()):
                    self.params[key] = value
                    parameters[index] = ""
                    parameters[index + 1] = ""

        # make a list of all the command-line parameters not used
        self.error = ""
        for index in range(1, len(parameters)):
            item = parameters[index]
            if item != "":
                self.error = self.error + item + " "

        # Make sure the output directory, if specified, ends in a /
        if self.params["output_dir"] != "":
            if self.params["output_dir"][-1:] != os.sep:
                self.params["output_dir"] = self.params["output_dir"] + os.sep

        # If an output directory is specified but a log file isn't, set a
        # default logfile
        if self.params["output_dir"] != "" and self.params["output_file"] == "":
            self.params["output_file"] = self.params["output_dir"] + "output.pdb"

    def okay_to_proceed(self):
        # at the very least, you need the ligand and the receptor
        if self.params["receptor"] != "" and self.params["ligand"] != "":
            return True
        else:
            return False
