# BINANA is released under the GNU General Public License (see
# http://www.gnu.org/licenses/gpl.html). If you have any questions, comments,
# or suggestions, please don't hesitate to contact me, Jacob Durrant, at
# jdurrant [at] ucsd [dot] edu. If you use BINANA in your work, please cite
# Durrant, J. D. and J. A. McCammon (2011). "BINANA: A novel algorithm for
# ligand-binding characterization." J Mol Graph Model 29(6): 888-893.

import __future__

import math
import os
import sys
import textwrap
import json
import re  # split on multiple delimiters

VERSION = "1.3"


# import commands from other modules
from point import Point
from atom import Atom
from pdb import PDB
from math_functions import MathFunctions
from command_line_parameters import CommandLineParameters


"""
Class Binana
"""


class Binana:

    functions = MathFunctions()

    # supporting functions
    def list_alphebetize_and_combine(self, list_obj):
        list_obj.sort()
        return "_".join(list_obj)

    def hashtable_entry_add_one(self, hashtable, key, toadd=1):
        # note that dictionaries (hashtables) are passed by reference in
        # python
        if key in hashtable:
            hashtable[key] = hashtable[key] + toadd
        else:
            hashtable[key] = toadd

    def center(self, string, length):
        while len(string) < length:
            string = " " + string
            if len(string) < length:
                string = string + " "
        return string

    # The meat of the class
    def __init__(self, ligand_pdbqt_filename, receptor_pdbqt_filename, parameters):
        # JY- giving Binana filename attributes so json_file() can name the output file
        self.ligfi = ligand_pdbqt_filename
        self.recfi = receptor_pdbqt_filename
        # JY
        ligand = PDB()
        ligand.load_PDB(ligand_pdbqt_filename)

        receptor = PDB()
        receptor.load_PDB(receptor_pdbqt_filename)
        receptor.assign_secondary_structure()

        # Get distance measurements between protein and ligand atom types, as
        # well as some other measurements

        ligand_receptor_atom_type_pairs_less_than_two_half = {}
        ligand_receptor_atom_type_pairs_less_than_four = {}
        ligand_receptor_atom_type_pairs_electrostatic = {}
        active_site_flexibility = {}
        hbonds = {}
        hydrophobics = {}

        functions = MathFunctions()

        pdb_close_contacts = PDB()
        pdb_contacts = PDB()
        pdb_contacts_alpha_helix = PDB()
        pdb_contacts_beta_sheet = PDB()
        pdb_contacts_other_2nd_structure = PDB()
        pdb_side_chain = PDB()
        pdb_back_bone = PDB()
        pdb_hydrophobic = PDB()
        pdb_hbonds = PDB()

        close_contacts_labels = []
        contacts_labels = []
        hydrophobic_labels = []
        hbonds_labels = []

        for ligand_atom_index in ligand.all_atoms:
            for receptor_atom_index in receptor.all_atoms:
                ligand_atom = ligand.all_atoms[ligand_atom_index]
                receptor_atom = receptor.all_atoms[receptor_atom_index]

                dist = ligand_atom.coordinates.dist_to(receptor_atom.coordinates)
                if dist < parameters.params["close_contacts_dist1_cutoff"]:
                    # less than 2.5 A
                    list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type]
                    self.hashtable_entry_add_one(
                        ligand_receptor_atom_type_pairs_less_than_two_half,
                        self.list_alphebetize_and_combine(list_ligand_atom),
                    )
                    pdb_close_contacts.add_new_atom(ligand_atom.copy_of())
                    pdb_close_contacts.add_new_atom(receptor_atom.copy_of())

                    close_contacts_labels.append(
                        (ligand_atom.string_id(), receptor_atom.string_id())
                    )

                elif dist < parameters.params["close_contacts_dist2_cutoff"]:
                    # less than 4 A
                    list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type]
                    self.hashtable_entry_add_one(
                        ligand_receptor_atom_type_pairs_less_than_four,
                        self.list_alphebetize_and_combine(list_ligand_atom),
                    )
                    pdb_contacts.add_new_atom(ligand_atom.copy_of())
                    pdb_contacts.add_new_atom(receptor_atom.copy_of())

                    contacts_labels.append(
                        (ligand_atom.string_id(), receptor_atom.string_id())
                    )

                if dist < parameters.params["electrostatic_dist_cutoff"]:
                    # calculate electrostatic energies for all less than 4 A
                    ligand_charge = ligand_atom.charge
                    receptor_charge = receptor_atom.charge
                    coulomb_energy = (
                        ligand_charge * receptor_charge / dist
                    ) * 138.94238460104697e4  # to convert into J/mol # might be nice to double check this
                    list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type]
                    self.hashtable_entry_add_one(
                        ligand_receptor_atom_type_pairs_electrostatic,
                        self.list_alphebetize_and_combine(list_ligand_atom),
                        coulomb_energy,
                    )

                if dist < parameters.params["active_site_flexibility_dist_cutoff"]:
                    # Now get statistics to judge active-site flexibility
                    flexibility_key = (
                        receptor_atom.side_chain_or_backbone()
                        + "_"
                        + receptor_atom.structure
                    )  # first can be sidechain or backbone, second back be alpha, beta, or other, so six catagories
                    if receptor_atom.structure == "ALPHA":
                        pdb_contacts_alpha_helix.add_new_atom(receptor_atom.copy_of())
                    elif receptor_atom.structure == "BETA":
                        pdb_contacts_beta_sheet.add_new_atom(receptor_atom.copy_of())
                    elif receptor_atom.structure == "OTHER":
                        pdb_contacts_other_2nd_structure.add_new_atom(
                            receptor_atom.copy_of()
                        )

                    if receptor_atom.side_chain_or_backbone() == "BACKBONE":
                        pdb_back_bone.add_new_atom(receptor_atom.copy_of())
                    elif receptor_atom.side_chain_or_backbone() == "SIDECHAIN":
                        pdb_side_chain.add_new_atom(receptor_atom.copy_of())

                    self.hashtable_entry_add_one(
                        active_site_flexibility, flexibility_key
                    )

                if dist < parameters.params["hydrophobic_dist_cutoff"]:
                    # Now see if there's hydrophobic contacts (C-C contacts)
                    if ligand_atom.element == "C" and receptor_atom.element == "C":
                        hydrophobic_key = (
                            receptor_atom.side_chain_or_backbone()
                            + "_"
                            + receptor_atom.structure
                        )
                        pdb_hydrophobic.add_new_atom(ligand_atom.copy_of())
                        pdb_hydrophobic.add_new_atom(receptor_atom.copy_of())

                        self.hashtable_entry_add_one(hydrophobics, hydrophobic_key)

                        hydrophobic_labels.append(
                            (ligand_atom.string_id(), receptor_atom.string_id())
                        )

                if dist < parameters.params["hydrogen_bond_dist_cutoff"]:
                    # Now see if there's some sort of hydrogen bond between
                    # these two atoms. distance cutoff = 4, angle cutoff = 40.
                    # Note that this is liberal.
                    if (ligand_atom.element == "O" or ligand_atom.element == "N") and (
                        receptor_atom.element == "O" or receptor_atom.element == "N"
                    ):

                        # now build a list of all the hydrogens close to these
                        # atoms
                        hydrogens = []

                        for atm_index in ligand.all_atoms:
                            if ligand.all_atoms[atm_index].element == "H":
                                # so it's a hydrogen
                                if (
                                    ligand.all_atoms[atm_index].coordinates.dist_to(
                                        ligand_atom.coordinates
                                    )
                                    < 1.3
                                ):
                                    # O-H distance is 0.96 A, N-H is 1.01 A.
                                    # See
                                    # http://www.science.uwaterloo.ca/~cchieh/cact/c120/bondel.html
                                    ligand.all_atoms[atm_index].comment = "LIGAND"
                                    hydrogens.append(ligand.all_atoms[atm_index])

                        for atm_index in receptor.all_atoms:
                            if receptor.all_atoms[atm_index].element == "H":
                                # so it's a hydrogen
                                if (
                                    receptor.all_atoms[atm_index].coordinates.dist_to(
                                        receptor_atom.coordinates
                                    )
                                    < 1.3
                                ):
                                    # O-H distance is 0.96 A, N-H is 1.01 A.
                                    # See
                                    # http://www.science.uwaterloo.ca/~cchieh/cact/c120/bondel.html
                                    receptor.all_atoms[atm_index].comment = "RECEPTOR"
                                    hydrogens.append(receptor.all_atoms[atm_index])

                        # now we need to check the angles
                        for hydrogen in hydrogens:
                            if (
                                math.fabs(
                                    180
                                    - functions.angle_between_three_points(
                                        ligand_atom.coordinates,
                                        hydrogen.coordinates,
                                        receptor_atom.coordinates,
                                    )
                                    * 180.0
                                    / math.pi
                                )
                                <= parameters.params["hydrogen_bond_angle_cutoff"]
                            ):
                                hbonds_key = (
                                    "HDONOR_"
                                    + hydrogen.comment
                                    + "_"
                                    + receptor_atom.side_chain_or_backbone()
                                    + "_"
                                    + receptor_atom.structure
                                )
                                pdb_hbonds.add_new_atom(ligand_atom.copy_of())
                                pdb_hbonds.add_new_atom(hydrogen.copy_of())
                                pdb_hbonds.add_new_atom(receptor_atom.copy_of())
                                self.hashtable_entry_add_one(hbonds, hbonds_key)

                                hbonds_labels.append(
                                    (
                                        ligand_atom.string_id(),
                                        hydrogen.string_id(),
                                        receptor_atom.string_id(),
                                    )
                                )

        # Get the total number of each atom type in the ligand
        ligand_atom_types = {}
        for ligand_atom_index in ligand.all_atoms:
            ligand_atom = ligand.all_atoms[ligand_atom_index]
            self.hashtable_entry_add_one(ligand_atom_types, ligand_atom.atom_type)

        # This is perhaps controversial. I noticed that often a pi-cation
        # interaction or other pi interaction was only slightly off, but
        # looking at the structure, it was clearly supposed to be a pi-cation
        # interaction. I've decided then to artificially expand the radius of
        # each pi ring. Think of this as adding in a VDW radius, or accounting
        # for poor crystal-structure resolution, or whatever you want to
        # justify it.
        pi_padding = parameters.params[
            "pi_padding_dist"
        ]

        # Count pi-pi stacking and pi-T stacking interactions
        PI_interactions = {}
        pdb_pistack = PDB()
        pdb_pi_T = PDB()
        pi_stacking_labels = []
        T_stacking_labels = []

        # "PI-Stacking Interactions ALIVE AND WELL IN PROTEINS" says distance
        # of 7.5 A is good cutoff. This seems really big to me, except that
        # pi-pi interactions (parallel) are actuall usually off centered.
        # Interesting paper. Note that adenine and tryptophan count as two
        # aromatic rings. So, for example, an interaction between these two,
        # if positioned correctly, could count for 4 pi-pi interactions.
        for aromatic1 in ligand.aromatic_rings:
            for aromatic2 in receptor.aromatic_rings:
                dist = aromatic1.center.dist_to(aromatic2.center)
                if dist < parameters.params["pi_pi_interacting_dist_cutoff"]:
                    # so there could be some pi-pi interactions. first, let's
                    # check for stacking interactions. Are the two pi's
                    # roughly parallel?
                    aromatic1_norm_vector = Point(
                        aromatic1.plane_coeff[0],
                        aromatic1.plane_coeff[1],
                        aromatic1.plane_coeff[2],
                    )

                    aromatic2_norm_vector = Point(
                        aromatic2.plane_coeff[0],
                        aromatic2.plane_coeff[1],
                        aromatic2.plane_coeff[2],
                    )

                    angle_between_planes = (
                        self.functions.angle_between_points(
                            aromatic1_norm_vector, aromatic2_norm_vector
                        )
                        * 180.0
                        / math.pi
                    )

                    if (
                        math.fabs(angle_between_planes - 0)
                        < parameters.params["pi_stacking_angle_tolerance"]
                        or math.fabs(angle_between_planes - 180)
                        < parameters.params["pi_stacking_angle_tolerance"]
                    ):
                        # so they're more or less parallel, it's probably
                        # pi-pi stackingoutput_dir now, pi-pi are not usually
                        # right on top of each other. They're often staggared.
                        # So I don't want to just look at the centers of the
                        # rings and compare. Let's look at each of the atoms.
                        # do atom of the atoms of one ring, when projected
                        # onto the plane of the other, fall within that other
                        # ring?

                        # start by assuming it's not a pi-pi stacking interaction
                        pi_pi = False

                        for ligand_ring_index in aromatic1.indices:
                            # project the ligand atom onto the plane of the
                            # receptor ring
                            pt_on_receptor_plane = self.functions.project_point_onto_plane(
                                ligand.all_atoms[ligand_ring_index].coordinates,
                                aromatic2.plane_coeff,
                            )
                            if (
                                pt_on_receptor_plane.dist_to(aromatic2.center)
                                <= aromatic2.radius + pi_padding
                            ):
                                pi_pi = True
                                break

                        if pi_pi == False:
                            # if you've already determined it's a pi-pi
                            # stacking interaction, no need to keep trying
                            for receptor_ring_index in aromatic2.indices:
                                # project the ligand atom onto the plane of the receptor ring
                                pt_on_ligand_plane = self.functions.project_point_onto_plane(
                                    receptor.all_atoms[receptor_ring_index].coordinates,
                                    aromatic1.plane_coeff,
                                )
                                if (
                                    pt_on_ligand_plane.dist_to(aromatic1.center)
                                    <= aromatic1.radius + pi_padding
                                ):
                                    pi_pi = True
                                    break

                        if pi_pi == True:
                            structure = receptor.all_atoms[
                                aromatic2.indices[0]
                            ].structure
                            if structure == "":
                                # since it could be interacting with a
                                # cofactor or something
                                structure = "OTHER"
                            key = "STACKING_" + structure

                            for index in aromatic1.indices:
                                pdb_pistack.add_new_atom(
                                    ligand.all_atoms[index].copy_of()
                                )
                            for index in aromatic2.indices:
                                pdb_pistack.add_new_atom(
                                    receptor.all_atoms[index].copy_of()
                                )

                            self.hashtable_entry_add_one(PI_interactions, key)

                            pi_stacking_labels.append(
                                (
                                    "["
                                    + " / ".join(
                                        [
                                            ligand.all_atoms[index].string_id()
                                            for index in aromatic1.indices
                                        ]
                                    )
                                    + "]",
                                    "["
                                    + " / ".join(
                                        [
                                            receptor.all_atoms[index].string_id()
                                            for index in aromatic2.indices
                                        ]
                                    )
                                    + "]",
                                )
                            )

                    elif (
                        math.fabs(angle_between_planes - 90)
                        < parameters.params["T_stacking_angle_tolerance"]
                        or math.fabs(angle_between_planes - 270)
                        < parameters.params["T_stacking_angle_tolerance"]
                    ):
                        # so they're more or less perpendicular, it's probably
                        # a pi-edge interaction

                        # having looked at many structures, I noticed the
                        # algorithm was identifying T-pi reactions when the
                        # two rings were in fact quite distant, often with
                        # other atoms in between. Eye-balling it, requiring
                        # that at their closest they be at least 5 A apart
                        # seems to separate the good T's from the bad
                        min_dist = 100.0
                        for ligand_ind in aromatic1.indices:
                            ligand_at = ligand.all_atoms[ligand_ind]
                            for receptor_ind in aromatic2.indices:
                                receptor_at = receptor.all_atoms[receptor_ind]
                                dist = ligand_at.coordinates.dist_to(
                                    receptor_at.coordinates
                                )
                                if dist < min_dist:
                                    min_dist = dist

                        if (
                            min_dist
                            <= parameters.params["T_stacking_closest_dist_cutoff"]
                        ):
                            # so at their closest points, the two rings come
                            # within 5 A of each other.

                            # okay, is the ligand pi pointing into the
                            # receptor pi, or the other way around? first,
                            # project the center of the ligand pi onto the
                            # plane of the receptor pi, and vs. versa

                            # This could be directional somehow, like a
                            # hydrogen bond.

                            pt_on_receptor_plane = self.functions.project_point_onto_plane(
                                aromatic1.center, aromatic2.plane_coeff
                            )
                            pt_on_lignad_plane = self.functions.project_point_onto_plane(
                                aromatic2.center, aromatic1.plane_coeff
                            )

                            # now, if it's a true pi-T interaction, this
                            # projected point should fall within the ring
                            # whose plane it's been projected into.
                            if (
                                pt_on_receptor_plane.dist_to(aromatic2.center)
                                <= aromatic2.radius + pi_padding
                            ) or (
                                pt_on_lignad_plane.dist_to(aromatic1.center)
                                <= aromatic1.radius + pi_padding
                            ):
                                # so it is in the ring on the projected plane.
                                structure = receptor.all_atoms[
                                    aromatic2.indices[0]
                                ].structure
                                if structure == "":
                                    # since it could be interacting with a
                                    # cofactor or something
                                    structure = "OTHER"

                                key = "T-SHAPED_" + structure

                                for index in aromatic1.indices:
                                    pdb_pi_T.add_new_atom(
                                        ligand.all_atoms[index].copy_of()
                                    )
                                for index in aromatic2.indices:
                                    pdb_pi_T.add_new_atom(
                                        receptor.all_atoms[index].copy_of()
                                    )

                                self.hashtable_entry_add_one(PI_interactions, key)

                                T_stacking_labels.append(
                                    (
                                        "["
                                        + " / ".join(
                                            [
                                                ligand.all_atoms[index].string_id()
                                                for index in aromatic1.indices
                                            ]
                                        )
                                        + "]",
                                        "["
                                        + " / ".join(
                                            [
                                                receptor.all_atoms[index].string_id()
                                                for index in aromatic2.indices
                                            ]
                                        )
                                        + "]",
                                    )
                                )

        # Now identify pi-cation interactions
        pdb_pi_cat = PDB()
        pi_cat_labels = []

        for aromatic in receptor.aromatic_rings:
            for charged in ligand.charges:
                if charged.positive == True:
                    # so only consider positive charges
                    if (
                        charged.coordinates.dist_to(aromatic.center)
                        < parameters.params["cation_pi_dist_cutoff"]
                    ):
                        # distance cutoff based on "Cation-pi interactions in
                        # structural biology." project the charged onto the
                        # plane of the aromatic
                        charge_projected = self.functions.project_point_onto_plane(
                            charged.coordinates, aromatic.plane_coeff
                        )

                        if (
                            charge_projected.dist_to(aromatic.center)
                            < aromatic.radius + pi_padding
                        ):
                            structure = receptor.all_atoms[
                                aromatic.indices[0]
                            ].structure
                            if structure == "":
                                # since it could be interacting with a
                                # cofactor or something
                                structure = "OTHER"

                            key = "PI-CATION_LIGAND-CHARGED_" + structure

                            for index in aromatic.indices:
                                pdb_pi_cat.add_new_atom(
                                    receptor.all_atoms[index].copy_of()
                                )
                            for index in charged.indices:
                                pdb_pi_cat.add_new_atom(
                                    ligand.all_atoms[index].copy_of()
                                )

                            self.hashtable_entry_add_one(PI_interactions, key)

                            pi_cat_labels.append(
                                (
                                    "["
                                    + " / ".join(
                                        [
                                            ligand.all_atoms[index].string_id()
                                            for index in charged.indices
                                        ]
                                    )
                                    + "]",
                                    "["
                                    + " / ".join(
                                        [
                                            receptor.all_atoms[index].string_id()
                                            for index in aromatic.indices
                                        ]
                                    )
                                    + "]",
                                )
                            )

        for aromatic in ligand.aromatic_rings:
            # now it's the ligand that has the aromatic group
            for charged in receptor.charges:
                if charged.positive == True:
                    # so only consider positive charges
                    if (
                        charged.coordinates.dist_to(aromatic.center)
                        < parameters.params["cation_pi_dist_cutoff"]
                    ):
                        # distance cutoff based on "Cation-pi interactions in
                        # structural biology." project the charged onto the
                        # plane of the aromatic
                        charge_projected = self.functions.project_point_onto_plane(
                            charged.coordinates, aromatic.plane_coeff
                        )

                        if (
                            charge_projected.dist_to(aromatic.center)
                            < aromatic.radius + pi_padding
                        ):
                            structure = receptor.all_atoms[charged.indices[0]].structure
                            if structure == "":
                                # since it could be interacting with a
                                # cofactor or something
                                structure = "OTHER"

                            key = "PI-CATION_RECEPTOR-CHARGED_" + structure

                            for index in aromatic.indices:
                                pdb_pi_cat.add_new_atom(
                                    ligand.all_atoms[index].copy_of()
                                )
                            for index in charged.indices:
                                pdb_pi_cat.add_new_atom(
                                    receptor.all_atoms[index].copy_of()
                                )

                            self.hashtable_entry_add_one(PI_interactions, key)

                            pi_cat_labels.append(
                                (
                                    "["
                                    + " / ".join(
                                        [
                                            ligand.all_atoms[index].string_id()
                                            for index in aromatic.indices
                                        ]
                                    )
                                    + "]",
                                    "["
                                    + " / ".join(
                                        [
                                            receptor.all_atoms[index].string_id()
                                            for index in charged.indices
                                        ]
                                    )
                                    + "]",
                                )
                            )

        # now count the number of salt bridges
        pdb_salt_bridges = PDB()
        salt_bridges = {}
        salt_bridge_labels = []
        for receptor_charge in receptor.charges:
            for ligand_charge in ligand.charges:
                if ligand_charge.positive != receptor_charge.positive:
                    # so they have oppositve charges
                    if (
                        ligand_charge.coordinates.dist_to(receptor_charge.coordinates)
                        < parameters.params["salt_bridge_dist_cutoff"]
                    ):
                        # 4  is good cutoff for salt bridges according to
                        # "Close-Range Electrostatic Interactions in
                        # Proteins", but looking at complexes, I decided to go
                        # with 5.5 A
                        structure = receptor.all_atoms[
                            receptor_charge.indices[0]
                        ].structure
                        if structure == "":
                            # since it could be interacting with a cofactor or
                            # something
                            structure = "OTHER"

                        key = "SALT-BRIDGE_" + structure

                        for index in receptor_charge.indices:
                            pdb_salt_bridges.add_new_atom(
                                receptor.all_atoms[index].copy_of()
                            )
                        for index in ligand_charge.indices:
                            pdb_salt_bridges.add_new_atom(
                                ligand.all_atoms[index].copy_of()
                            )

                        self.hashtable_entry_add_one(salt_bridges, key)

                        salt_bridge_labels.append(
                            (
                                "["
                                + " / ".join(
                                    [
                                        ligand.all_atoms[index].string_id()
                                        for index in ligand_charge.indices
                                    ]
                                )
                                + "]",
                                "["
                                + " / ".join(
                                    [
                                        receptor.all_atoms[index].string_id()
                                        for index in receptor_charge.indices
                                    ]
                                )
                                + "]",
                            )
                        )

        # Now save the files
        preface = "REMARK "

        # if an output directory is specified, and it doesn't exist, create it
        if parameters.params["output_dir"] != "":
            if not os.path.exists(parameters.params["output_dir"]):
                os.mkdir(parameters.params["output_dir"])
        
        # call json_file 
        # have it return the dictionary and dump to a json file
        json_output = self.json_file(close_contacts_labels, contacts_labels, hbonds_labels, hydrophobic_labels, pi_stacking_labels, T_stacking_labels, pi_cat_labels, salt_bridge_labels)
        print("json output:")
        print(json_output)
        """'# old output format
        output = ""
        output = output + "Atom-type pair counts within " + str(parameters.params['close_contacts_dist1_cutoff']) + " : " + str(ligand_receptor_atom_type_pairs_less_than_two_half) + "\n"
        output = output + "Atom-type pair counts within " + str(parameters.params['close_contacts_dist2_cutoff']) + " : " + str(ligand_receptor_atom_type_pairs_less_than_four) + "\n"
        output = output + "Ligand atom types: " + str(ligand_atom_types) + "\n"
        output = output + "Electrostatic energy by atom-type pair, in J/mol: " + str(ligand_receptor_atom_type_pairs_electrostatic) + "\n"
        output = output + "Number of rotatable bonds in ligand: " + str(ligand.rotateable_bonds_count) + "\n"
        output = output + "Active-site flexibility: " + str(active_site_flexibility) + "\n"
        output = output + "HBonds: " + str(hbonds) + "\n"
        output = output + "Hydrophobic contacts (C-C): " + str(hydrophobics) + "\n"
        output = output + "pi interactions: " + str(PI_interactions) + "\n"
        output = output + "Salt bridges: " + str(salt_bridges) + "\n"

        print output"""

        output = ""

        # restate the parameters
        output = output + preface + "Command-line parameters used:" + "\n"
        output = (
            output
            + preface
            + "                 Parameter              |            Value           "
            + "\n"
        )
        output = (
            output
            + preface
            + "   -------------------------------------|----------------------------"
            + "\n"
        )

        for key in list(parameters.params.keys()):
            value = str(parameters.params[key])
            output = (
                output
                + preface
                + "   "
                + self.center(key, 37)
                + "| "
                + self.center(value, 27)
                + "\n"
            )

        # a description of the analysis

        output = output + preface + "" + "\n"
        output = (
            output
            + preface
            + "Atom-type pair counts within "
            + str(parameters.params["close_contacts_dist1_cutoff"])
            + " angstroms:"
            + "\n"
        )
        output = output + preface + "    Atom Type | Atom Type | Count" + "\n"
        output = output + preface + "   -----------|-----------|-------" + "\n"
        for key in ligand_receptor_atom_type_pairs_less_than_two_half:
            value = ligand_receptor_atom_type_pairs_less_than_two_half[key]
            key = key.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(key[0], 11)
                + "|"
                + self.center(key[1], 11)
                + "|"
                + self.center(str(value), 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in close_contacts_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + "\n"
            )

        output = output + preface + "\n\n"
        output = (
            output
            + preface
            + "Atom-type pair counts within "
            + str(parameters.params["close_contacts_dist2_cutoff"])
            + " angstroms:"
            + "\n"
        )
        output = output + preface + "    Atom Type | Atom Type | Count" + "\n"
        output = output + preface + "   -----------|-----------|-------" + "\n"
        for key in ligand_receptor_atom_type_pairs_less_than_four:
            value = ligand_receptor_atom_type_pairs_less_than_four[key]
            key = key.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(key[0], 11)
                + "|"
                + self.center(key[1], 11)
                + "|"
                + self.center(str(value), 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in contacts_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + "\n"
            )

        output = output + preface + "" + "\n"
        output = output + preface + "Ligand atom types:" + "\n"
        output = output + preface + "    Atom Type " + "\n"
        output = output + preface + "   -----------" + "\n"
        for key in ligand_atom_types:
            output = output + preface + "   " + self.center(key, 11) + "\n"

        output = output + preface + "" + "\n"
        output = (
            output
            + preface
            + "Summed electrostatic energy by atom-type pair, in J/mol:"
            + "\n"
        )
        output = output + preface + "    Atom Type | Atom Type | Energy (J/mol)" + "\n"
        output = output + preface + "   -----------|-----------|----------------" + "\n"
        for key in ligand_receptor_atom_type_pairs_electrostatic:
            value = ligand_receptor_atom_type_pairs_electrostatic[key]
            key = key.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(key[0], 11)
                + "|"
                + self.center(key[1], 11)
                + "|"
                + self.center(str(value), 16)
                + "\n"
            )

        output = output + preface + "" + "\n"
        output = (
            output
            + preface
            + "Number of rotatable bonds in the ligand: "
            + str(ligand.rotateable_bonds_count)
            + "\n"
        )

        output = output + preface + "" + "\n"
        output = output + preface + "Active-site flexibility:" + "\n"
        output = (
            output
            + preface
            + "    Sidechain/Backbone | Secondary Structure | Count "
            + "\n"
        )
        output = (
            output
            + preface
            + "   --------------------|---------------------|-------"
            + "\n"
        )
        for key in active_site_flexibility:
            value = active_site_flexibility[key]
            key = key.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(key[0], 20)
                + "|"
                + self.center(key[1], 21)
                + "|"
                + self.center(str(value), 7)
                + "\n"
            )

        output = output + preface + "" + "\n"
        output = output + preface + "Hydrogen bonds:" + "\n"
        output = (
            output
            + preface
            + "    Location of Donor | Sidechain/Backbone | Secondary Structure | Count "
            + "\n"
        )
        output = (
            output
            + preface
            + "   -------------------|--------------------|---------------------|-------"
            + "\n"
        )
        for key in hbonds:
            value = hbonds[key]
            key = key.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(key[1], 19)
                + "|"
                + self.center(key[2], 20)
                + "|"
                + self.center(key[3], 21)
                + "|"
                + self.center(str(value), 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in hbonds_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + " - "
                + atom_pairs[2]
                + "\n"
            )

        output = output + preface + "" + "\n"
        output = output + preface + "Hydrophobic contacts (C-C):" + "\n"
        output = (
            output
            + preface
            + "    Sidechain/Backbone | Secondary Structure | Count "
            + "\n"
        )
        output = (
            output
            + preface
            + "   --------------------|---------------------|-------"
            + "\n"
        )
        for key in hydrophobics:
            value = hydrophobics[key]
            key = key.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(key[0], 20)
                + "|"
                + self.center(key[1], 21)
                + "|"
                + self.center(str(value), 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in hydrophobic_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + "\n"
            )

        stacking = []
        t_shaped = []
        pi_cation = []
        for key in PI_interactions:
            value = PI_interactions[key]
            together = key + "_" + str(value)
            if "STACKING" in together:
                stacking.append(together)
            if "CATION" in together:
                pi_cation.append(together)
            if "SHAPED" in together:
                t_shaped.append(together)

        output = output + preface + "" + "\n"
        output = output + preface + "pi-pi stacking interactions:" + "\n"
        output = output + preface + "    Secondary Structure | Count " + "\n"
        output = output + preface + "   ---------------------|-------" + "\n"
        for item in stacking:
            item = item.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(item[1], 21)
                + "|"
                + self.center(item[2], 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in pi_stacking_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + "\n"
            )

        output = output + preface + "" + "\n"
        output = output + preface + "T-stacking (face-to-edge) interactions:" + "\n"
        output = output + preface + "    Secondary Structure | Count " + "\n"
        output = output + preface + "   ---------------------|-------" + "\n"
        for item in t_shaped:
            # need to check
            item = item.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(item[1], 21)
                + "|"
                + self.center(item[2], 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in T_stacking_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + "\n"
            )

        output = output + preface + "" + "\n"
        output = output + preface + "Cation-pi interactions:" + "\n"
        output = (
            output
            + preface
            + "    Which residue is charged? | Secondary Structure | Count "
            + "\n"
        )
        output = (
            output
            + preface
            + "   ---------------------------|---------------------|-------"
            + "\n"
        )
        for item in pi_cation:
            # need to check
            item = item.split("_")
            item2 = item[1].split("-")
            output = (
                output
                + preface
                + "   "
                + self.center(item2[0], 27)
                + "|"
                + self.center(item[2], 21)
                + "|"
                + self.center(item[3], 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in pi_cat_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + "\n"
            )

        output = output + preface + "" + "\n"
        output = output + preface + "Salt Bridges:" + "\n"
        output = output + preface + "    Secondary Structure | Count " + "\n"
        output = output + preface + "   ---------------------|-------" + "\n"
        for key in salt_bridges:
            value = salt_bridges[key]
            key = key.split("_")
            output = (
                output
                + preface
                + "   "
                + self.center(key[1], 21)
                + "|"
                + self.center(str(value), 7)
                + "\n"
            )

        output = output + preface + "\nRaw data:\n"
        for atom_pairs in salt_bridge_labels:
            output = (
                output
                + preface
                + "     "
                + atom_pairs[0]
                + " - "
                + atom_pairs[1]
                + "\n"
            )

        pdb_close_contacts.set_resname("CCN")
        pdb_contacts.set_resname("CON")
        pdb_contacts_alpha_helix.set_resname("ALP")
        pdb_contacts_beta_sheet.set_resname("BET")
        pdb_contacts_other_2nd_structure.set_resname("OTH")
        pdb_back_bone.set_resname("BAC")
        pdb_side_chain.set_resname("SID")
        pdb_hydrophobic.set_resname("HYD")
        pdb_hbonds.set_resname("HBN")
        pdb_pistack.set_resname("PIS")
        pdb_pi_T.set_resname("PIT")
        pdb_pi_cat.set_resname("PIC")
        pdb_salt_bridges.set_resname("SAL")
        ligand.set_resname("LIG")

        if parameters.params["output_dir"] != "":
            # so an output directory has been specified. Write the pdb files
            # out separately

            pdb_close_contacts.save_PDB(
                parameters.params["output_dir"] + "/close_contacts.pdb"
            )
            pdb_contacts.save_PDB(parameters.params["output_dir"] + "/contacts.pdb")
            pdb_contacts_alpha_helix.save_PDB(
                parameters.params["output_dir"] + "/contacts_alpha_helix.pdb"
            )
            pdb_contacts_beta_sheet.save_PDB(
                parameters.params["output_dir"] + "/contacts_beta_sheet.pdb"
            )
            pdb_contacts_other_2nd_structure.save_PDB(
                parameters.params["output_dir"]
                + "/contacts_other_secondary_structure.pdb"
            )
            pdb_back_bone.save_PDB(parameters.params["output_dir"] + "/back_bone.pdb")
            pdb_side_chain.save_PDB(parameters.params["output_dir"] + "/side_chain.pdb")
            pdb_hydrophobic.save_PDB(
                parameters.params["output_dir"] + "/hydrophobic.pdb"
            )
            pdb_hbonds.save_PDB(parameters.params["output_dir"] + "/hydrogen_bonds.pdb")
            pdb_pistack.save_PDB(
                parameters.params["output_dir"] + "/pi_pi_stacking.pdb"
            )
            pdb_pi_T.save_PDB(parameters.params["output_dir"] + "/T_stacking.pdb")
            pdb_pi_cat.save_PDB(parameters.params["output_dir"] + "/cat_pi.pdb")
            pdb_salt_bridges.save_PDB(
                parameters.params["output_dir"] + "/salt_bridges.pdb"
            )
            ligand.save_PDB(parameters.params["output_dir"] + "/ligand.pdb")
            receptor.save_PDB(parameters.params["output_dir"] + "/receptor.pdb")

            f = open(parameters.params["output_dir"] + "log.txt", "w")
            f.write(output.replace("REMARK ", ""))
            f.close()

            f = open(parameters.params["output_dir"] + "state.vmd", "w")
            f.write(self.vmd_state_file())
            f.close()
        
        if (
            parameters.params["output_file"] == ""
            and parameters.params["output_dir"] == ""
        ):
            # so you're not outputing to either a file or a directory
            print((output.replace("REMARK ", "")))

        if parameters.params["output_file"] != "":
            # so it's writing to a single file.

            # first, make an explaination.

            explain = (
                'The residue named "CCN" illustrates close contacts where the protein and ligand atoms come within '
                + str(parameters.params["close_contacts_dist1_cutoff"])
                + ' of each other. "CON" illustrates close contacts where the protein and ligand atoms come within '
                + str(parameters.params["close_contacts_dist2_cutoff"])
                + ' of each other. "ALP", "BET", and "OTH" illustrates receptor contacts whose respective protein residues have the alpha-helix, beta-sheet, or "other" secondary structure. "BAC" and "SID" illustrate receptor contacts that are part of the protein backbone and sidechain, respectively. "HYD" illustrates hydrophobic contacts between the protein and ligand. "HBN" illustrates hydrogen bonds. "SAL" illustrates salt bridges. "PIS" illustrates pi-pi stacking interactions, "PIT" illustrates T-stacking interactions, and "PIC" illustrates cation-pi interactions. Protein residue names are unchanged, but the ligand residue is now named "LIG".'
            )

            output = output + "REMARK\n"

            lines = textwrap.wrap(explain, 71)
            for line in lines:
                output = output + "REMARK " + line + "\n"

            output = output + "REMARK\n"

            output = (
                output
                + receptor.save_PDB_String()
                + "TER\n"
                + ligand.save_PDB_String()
                + "TER\n"
                + pdb_close_contacts.save_PDB_String()
                + "TER\n"
            )
            output = (
                output
                + pdb_contacts.save_PDB_String()
                + "TER\n"
                + pdb_contacts_alpha_helix.save_PDB_String()
                + "TER\n"
                + pdb_contacts_beta_sheet.save_PDB_String()
                + "TER\n"
            )
            output = (
                output
                + pdb_contacts_other_2nd_structure.save_PDB_String()
                + "TER\n"
                + pdb_back_bone.save_PDB_String()
                + "TER\n"
                + pdb_side_chain.save_PDB_String()
                + "TER\n"
            )
            output = (
                output
                + pdb_hydrophobic.save_PDB_String()
                + "TER\n"
                + pdb_hbonds.save_PDB_String()
                + "TER\n"
                + pdb_pistack.save_PDB_String()
                + "TER\n"
                + pdb_pi_T.save_PDB_String()
                + "TER\n"
            )
            output = (
                output
                + pdb_pi_cat.save_PDB_String()
                + "TER\n"
                + pdb_salt_bridges.save_PDB_String()
                + "TER\n"
            )
            """# call json_file 
            # have it return the dictionary and dump to a json file
            json_output = self.json_file(close_contacts_labels, contacts_labels, hbonds_labels, hydrophobic_labels, pi_stacking_labels, T_stacking_labels, pi_cat_labels, salt_bridge_labels)
            print(json_output)"""

            f = open(parameters.params["output_file"], "w")
            f.write(output)
            f.close()

    def vmd_state_file(self):
        vmd = []
        vmd.append("set viewplist {}")
        vmd.append("set fixedlist {}")
        vmd.append("# Display settings")
        vmd.append("display projection   Orthographic")
        vmd.append("display depthcue   on")
        vmd.append("display cuestart   0.500000")
        vmd.append("display cueend     10.000000")
        vmd.append("display cuedensity 0.200000")
        vmd.append("display cuemode    Exp2")

        vmd.append(
            "mol new back_bone.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 1.000000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top back_bone.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new side_chain.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 1.000000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top side_chain.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new close_contacts.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 1.000000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top close_contacts.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new contacts.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 0.500000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top contacts.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new contacts_alpha_helix.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 1.000000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top contacts_alpha_helix.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new contacts_beta_sheet.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 1.000000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top contacts_beta_sheet.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new contacts_other_secondary_structure.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 1.000000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top contacts_other_secondary_structure.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new hydrophobic.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation VDW 0.500000 8.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top hydrophobic.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new hydrogen_bonds.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation Licorice 0.300000 10.000000 10.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top hydrogen_bonds.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new salt_bridges.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation Licorice 0.300000 10.000000 10.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top salt_bridges.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new cat_pi.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation Licorice 0.300000 10.000000 10.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top cat_pi.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new pi_pi_stacking.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation Licorice 0.300000 10.000000 10.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top pi_pi_stacking.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new T_stacking.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation Licorice 0.300000 10.000000 10.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top T_stacking.pdb")
        vmd.append("molinfo top set drawn 0")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append(
            "mol new ligand.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation CPK 1.000000 0.300000 8.000000 6.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top ligand.pdb")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")
        vmd.append("set topmol [molinfo top]")

        vmd.append(
            "mol new receptor.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all"
        )
        vmd.append("mol delrep 0 top")
        vmd.append("mol representation Lines 3.000000")
        vmd.append("mol color Name")
        vmd.append("mol selection {all}")
        vmd.append("mol material Opaque")
        vmd.append("mol addrep top")
        vmd.append("mol selupdate 0 top 0")
        vmd.append("mol colupdate 0 top 0")
        vmd.append("mol scaleminmax top 0 0.000000 0.000000")
        vmd.append("mol smoothrep top 0 0")
        vmd.append("mol drawframes top 0 {now}")
        vmd.append("mol rename top receptor.pdb")
        vmd.append(
            "set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}"
        )
        vmd.append("lappend viewplist [molinfo top]")

        vmd.append("foreach v $viewplist {")
        vmd.append(
            "  molinfo $v set {center_matrix rotate_matrix scale_matrix global_matrix} $viewpoints($v)"
        )
        vmd.append("}")
        vmd.append("foreach v $fixedlist {")
        vmd.append("  molinfo $v set fixed 1")
        vmd.append("}")
        vmd.append("unset viewplist")
        vmd.append("unset fixedlist")
        vmd.append("mol top $topmol")
        vmd.append("unset topmol")
        vmd.append("color Display {Background} white")
        return "\n".join(vmd)


    # takes care of pairwise interactions 
    # interaction_name: string
    # interaction_labels: list containind raw data to be parsed into the dictionary
    # returns list
    def json_helper(self, interaction_labels):
        # set counter for interaction 
        i = 0
        interaction_list = []

        for atom_pairs in interaction_labels:
            # add new dictionary to interaction list
            #json_output[interaction_name].append({})
            interaction_list.append({})
            # parse atom_pairs
            ligand_atom_details = re.split(r'[():]', atom_pairs[0])
            receptor_atom_details = re.split(r'[():]', atom_pairs[1])
            # remove whitespace
            for detail in ligand_atom_details:
                if detail == "":
                    ligand_atom_details.remove(detail)
            for detail in receptor_atom_details:
                if detail == "":
                    receptor_atom_details.remove(detail)
            
            # add each detail to the appropriate key in ligand_atoms and receptor_atoms
            #json_output[interaction_name][i] = {
            interaction_list[i] = {
                "ligandAtoms": [
                    {
                        "chain": "A",
                        "resID": int(ligand_atom_details[1]),
                        "resName": ligand_atom_details[0],
                        "atomName": ligand_atom_details[2],
                        "atomIndex": int(ligand_atom_details[3])
                    }
                ],
                "receptorAtoms": [
                    {
                        "chain": receptor_atom_details[0],
                        "resID": int(receptor_atom_details[2]),
                        "resName": receptor_atom_details[1],
                        "atomName": receptor_atom_details[3],
                        "atomIndex": int(receptor_atom_details[4])
                    }
                ]
            }   
            # increment counter
            i += 1
        return interaction_list

    # json output
    def json_file(
        self,
        close_contact_interactions,
        contact_interactions,
        hydrogen_bonds,
        hydrophobic_interactions,
        pi_stacking_interactions,
        t_stacking_interactions,
        cat_pi_interactions,
        salt_bridge_interactions
        ):
        json_output = {}
        # first level keys
        json_output["contactsWithin2.5A"] = []
        json_output["contactsWithin4.0A"] = []
        json_output["hydrogenBonds"] = []
        json_output["hydrophobicContacts"] = []
        json_output["piPiStackingInteractions"] = []
        json_output["tStackingInteractions"] = []
        json_output["cationPiInteractions"] = []
        json_output["saltBridges"] = []
        
        # populate the lists
        # use helper function to populate lists for pairwise interactions
        json_output["contactsWithin2.5A"] = self.json_helper(close_contact_interactions)
        json_output["contactsWithin4.0A"] = self.json_helper(contact_interactions)
        json_output["hydrophobicContacts"] = self.json_helper(hydrophobic_interactions)

        # reset counter for interaction 
        i = 0
        # hydrogen bonds
        for atom_pairs in hydrogen_bonds:
            # add new dictionary to hydrogen_bonds list
            json_output["hydrogenBonds"].append({})
            # parse atom_trios
            ligand_and_receptor = [
                re.split(r'[():]', atom_pairs[0]),
                re.split(r'[():]', atom_pairs[1]),
                re.split(r'[():]', atom_pairs[2])
            ]
            ligand_atom_details = []
            receptor_atom_details = []
            # put atoms in appropriate group
            for atom in ligand_and_receptor:
                if len(atom[0]) > 1: # ligand ("ATP")
                    ligand_atom_details.append(atom)
                else: # receptor ("A")
                    receptor_atom_details.append(atom)
            # remove whitespace
            for atom in ligand_atom_details:
                for detail in atom:
                    if detail == "":
                        atom.remove(detail)
            for atom in receptor_atom_details:
                for detail in atom:
                    if detail == "":
                        atom.remove(detail)
            # add each detail to the appropriate key in ligand_atoms and receptor_atoms
            # add "ligandAtoms" and "receptorAtoms" keys to dictionary
            json_output["hydrogenBonds"][i] = {"ligandAtoms": [], "receptorAtoms": []}
            for detail in ligand_atom_details:
                json_output["hydrogenBonds"][i]["ligandAtoms"].append(
                    {
                        "chain": "A",
                        "resID": int(detail[1]),
                        "resName": detail[0],
                        "atomName": detail[2],
                        "atomIndex": int(detail[3])
                    }
                )
            for detail in receptor_atom_details:
                json_output["hydrogenBonds"][i]["receptorAtoms"].append(
                    {
                        "chain": detail[0],
                        "resID": int(detail[2]),
                        "resName": detail[1],
                        "atomName": detail[3],
                        "atomIndex": detail[4]
                    }
                )
            # increment counter
            i += 1

        # reset counter for interaction 
        i = 0
        # pi-pi stacking interactions
        for atom_pair in pi_stacking_interactions:
            # add new dictionary to pi_stacking list
            json_output["piPiStackingInteractions"].append({})
            # parse atom_pairs into individual atoms
            individual_ligand_atoms = atom_pair[0].split("/")
            individual_receptor_atoms = atom_pair[1].split("/")
            # parse individual atoms into details
            individual_ligand_atoms_details = []
            for atom in individual_ligand_atoms:
                if atom != "":
                    individual_ligand_atoms_details.append(re.split(r'[\[\]():]', atom))
            individual_receptor_atoms_details = []
            for atom in individual_receptor_atoms:
                if atom != "":
                    individual_receptor_atoms_details.append(re.split(r'[\[\]():]', atom))
            # remove whitespace
            for detail_list in individual_ligand_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            for detail_list in individual_receptor_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            # add each detail to the appropriate key in ligand_atoms and receptor_atoms
            # add "ligandAtoms" and "receptorAtoms" keys to dictionary
            json_output["piPiStackingInteractions"][i] = {"ligandAtoms": [], "receptorAtoms": []}
            for detail in individual_ligand_atoms_details:
                json_output["piPiStackingInteractions"][i]["ligandAtoms"].append(
                    {
                        "chain": "A",
                        "resID": int(detail[1]),
                        "resName": detail[0],
                        "atomName": detail[2],
                        "atomIndex": int(detail[3])
                    }
                )
            for detail in individual_receptor_atoms_details:
                json_output["piPiStackingInteractions"][i]["receptorAtoms"].append(
                    {
                        "chain": detail[0],
                        "resID": int(detail[2]),
                        "resName": detail[1],
                        "atomName": detail[3],
                        "atomIndex": detail[4]
                    }
                )
            # increment counter 
            i += 1

        # reset counter for interaction  
        i = 0
        # t stacking interactions
        for atom_pair in t_stacking_interactions:
            # add new dictionary to t_stacking list
            json_output["tStackingInteractions"].append({})
            # parse atom_pairs into individual atoms
            individual_ligand_atoms = atom_pair[0].split("/")
            individual_receptor_atoms = atom_pair[1].split("/")
            # parse individual atoms into details
            individual_ligand_atoms_details = []
            for atom in individual_ligand_atoms:
                if atom != "":
                    individual_ligand_atoms_details.append(re.split(r'[\[\]():]', atom))
            individual_receptor_atoms_details = []
            for atom in individual_receptor_atoms:
                if atom != "":
                    individual_receptor_atoms_details.append(re.split(r'[\[\]():]', atom))
            # remove whitespace
            for detail_list in individual_ligand_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            for detail_list in individual_receptor_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            # add each detail to the appropriate key in ligand_atoms and receptor_atoms
            # add "ligandAtoms" and "receptorAtoms" keys to dictionary
            json_output["tStackingInteractions"][i] = {"ligandAtoms": [], "receptorAtoms": []}
            for detail in individual_ligand_atoms_details:
                json_output["tStackingInteractions"][i]["ligandAtoms"].append(
                    {
                        "chain": "A",
                        "resID": int(detail[1]),
                        "resName": detail[0],
                        "atomName": detail[2],
                        "atomIndex": int(detail[3])
                    }
                )
            for detail in individual_receptor_atoms_details:
                json_output["tStackingInteractions"][i]["receptorAtoms"].append(
                    {
                        "chain": detail[0],
                        "resID": int(detail[2]),
                        "resName": detail[1],
                        "atomName": detail[3],
                        "atomIndex": detail[4]
                    }
                )
            # increment counter 
            i += 1
        
        # reset counter for interaction 
        i = 0
        # cat-pi stacking interactions
        for atom_pair in cat_pi_interactions:
            # add new dictionary to cation-pi_stacking list
            json_output["cationPiInteractions"].append({})
            # parse atom_pairs into individual atoms
            individual_ligand_atoms = atom_pair[0].split("/")
            individual_receptor_atoms = atom_pair[1].split("/")
            # parse individual atoms into details
            individual_ligand_atoms_details = []
            for atom in individual_ligand_atoms:
                if atom != "":
                    individual_ligand_atoms_details.append(re.split(r'[\[\]():]', atom))
            individual_receptor_atoms_details = []
            for atom in individual_receptor_atoms:
                if atom != "":
                    individual_receptor_atoms_details.append(re.split(r'[\[\]():]', atom))
            # remove whitespace
            for detail_list in individual_ligand_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            for detail_list in individual_receptor_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            # add each detail to the appropriate key in ligand_atoms and receptor_atoms
            # add "ligandAtoms" and "receptorAtoms" keys to dictionary
            json_output["cationPiInteractions"][i] = {"ligandAtoms": [], "receptorAtoms": []}
            for detail in individual_ligand_atoms_details:
                json_output["cationPiInteractions"][i]["ligandAtoms"].append(
                    {
                        "chain": "A",
                        "resID": int(detail[1]),
                        "resName": detail[0],
                        "atomName": detail[2],
                        "atomIndex": int(detail[3])
                    }
                )
            for detail in individual_receptor_atoms_details:
                json_output["cationPiInteractions"][i]["receptorAtoms"].append(
                    {
                        "chain": detail[0],
                        "resID": int(detail[2]),
                        "resName": detail[1],
                        "atomName": detail[3],
                        "atomIndex": detail[4]
                    }
                )
            # increment counter 
            i += 1
            
        # reset counter for interaction 
        i = 0
        # salt bridge interactions
        for atom_pair in salt_bridge_interactions:
            # add new dictionary to salt_bridges list
            json_output["saltBridges"].append({})
            # parse atom_pairs into individual atoms
            individual_ligand_atoms = atom_pair[0].split("/")
            individual_receptor_atoms = atom_pair[1].split("/")
            # parse individual atoms into details
            individual_ligand_atoms_details = []
            for atom in individual_ligand_atoms:
                if atom != "":
                    individual_ligand_atoms_details.append(re.split(r'[\[\]():]', atom))
            individual_receptor_atoms_details = []
            for atom in individual_receptor_atoms:
                if atom != "":
                    individual_receptor_atoms_details.append(re.split(r'[\[\]():]', atom))
            # remove whitespace
            for detail_list in individual_ligand_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            for detail_list in individual_receptor_atoms_details:
                for detail in detail_list:
                    if detail == "":
                        detail_list.remove(detail)
            # add each detail to the appropriate key in ligand_atoms and receptor_atoms
            # add "ligandAtoms" and "receptorAtoms" keys to dictionary
            json_output["saltBridges"][i] = {"ligandAtoms": [], "receptorAtoms": []}
            for detail in individual_ligand_atoms_details:
                json_output["saltBridges"][i]["ligandAtoms"].append(
                    {
                        "chain": "A",
                        "resID": int(detail[1]),
                        "resName": detail[0],
                        "atomName": detail[2],
                        "atomIndex": int(detail[3])
                    }
                )
            for detail in individual_receptor_atoms_details:
                json_output["saltBridges"][i]["receptorAtoms"].append(
                    {
                        "chain": detail[0],
                        "resID": int(detail[2]),
                        "resName": detail[1],
                        "atomName": detail[3],
                        "atomIndex": detail[4]
                    }
                )
            # increment counter 
            i += 1

        # dump to json file

        outputFileName = self.ligfi[:-6] + "_" + self.recfi[:-6] + "_output.json"
        #with open('output.json', 'w') as jfile:
        with open(outputFileName, 'w') as jfile: 
                json.dump(json_output, jfile)
        # return json object
        return json_output



def intro():
    version = "1.2.1"
    lines = []
    lines.append("")
    lines.append("BINANA " + version)
    lines.append("============")
    lines.append(
        "   BINANA is released under the GNU General Public License (see http://www.gnu.org/licenses/gpl.html). If you have any questions, comments, or suggestions, please don't hesitate to contact me, Jacob Durrant, at jdurrant [at] ucsd [dot] edu. If you use BINANA in your work, please cite [REFERENCE HERE]."
    )
    lines.append("")
    lines.append("Introduction")
    lines.append("============")
    lines.append(
        "   BINANA (BINding ANAlyzer) is a python-implemented algorithm for analyzing ligand binding. The program identifies key binding characteristics like hydrogen bonds, salt bridges, and pi interactions. As input, BINANA accepts receptor and ligand files in the PDBQT format. PDBQT files can be generated from the more common PDB file format using the free converter provided with AutoDockTools, available at http://mgltools.scripps.edu/downloads"
    )
    lines.append(
        "   As output, BINANA describes ligand binding. Here's a simple example of how to run the program:"
    )
    lines.append("")
    lines.append(
        "python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt"
    )
    lines.append("")
    lines.append(
        "   To create a single PDB file showing the different binding characteristics with those characteristics described in the PDB header:"
    )
    lines.append("")
    lines.append(
        "python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb"
    )
    lines.append("")
    lines.append(
        "   Note that in the above example, errors and warnings are not written to the output file. To save these to a file, try:"
    )
    lines.append("")
    lines.append(
        "python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb > errors.txt"
    )
    lines.append("")
    lines.append(
        "   You can also send the program output to a directory, which will be created if it does not already exist. If a directory is specified, the program automatically separates the output PDB file into separate files for each interaction analyzed, and a description of the interactions is written to a file called 'log.txt'. Additionally, a VMD state file is created so the results can be easily visualized in VMD, a free program available for download at http://www.ks.uiuc.edu/Development/Download/download.cgi?PackageName=VMD Again, to save warnings and errors, append something like \"> errors.txt\" to the end of your command:"
    )
    lines.append("")
    lines.append(
        "python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_dir /path/to/output/directory/ > errors.txt"
    )
    lines.append("")
    lines.append(
        "   Though we recommend using program defaults, the following command-line tags can also be specified: -close_contacts_dist1_cutoff -close_contacts_dist2_cutoff -electrostatic_dist_cutoff -active_site_flexibility_dist_cutoff -hydrophobic_dist_cutoff -hydrogen_bond_dist_cutoff -hydrogen_bond_angle_cutoff -pi_padding_dist -pi_pi_interacting_dist_cutoff -pi_stacking_angle_tolerance -T_stacking_angle_tolerance -T_stacking_closest_dist_cutoff -cation_pi_dist_cutoff -salt_bridge_dist_cutoff"
    )
    lines.append(
        "   For example, if you want to tell BINANA to detect only hydrogen bonds where the donor and acceptor are less than 3.0 angstroms distant, run:"
    )
    lines.append("")
    lines.append(
        "python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -hydrogen_bond_dist_cutoff 3.0"
    )
    lines.append("")
    lines.append(
        "   What follows is a detailed description of the BINANA algorithm and a further explaination of the optional parameters described above. Parameter names are enclosed in braces."
    )
    lines.append("")
    lines.append("Close Contacts")
    lines.append("==============")
    lines.append(
        "   BINANA begins by identifying all ligand and protein atoms that come within {close_contacts_dist1_cutoff} angstroms of each other. These close-contact atoms are then characterized according to their respective AutoDock atom types, without regard for the receptor or ligand. The number of each pair of close-contact atoms of given AutoDock atom types is then tallied. For example, the program counts the number of times a hydrogen-bond accepting oxygen atom (atom type OA), either on the ligand or the receptor, comes within {close_contacts_dist1_cutoff} angstroms of a polar hydrogen atom (atom type HD) on the corresponding binding partner, be it the receptor or the ligand. A similar list of atom-type pairs is tallied for all ligand and receptor atoms that come within {close_contacts_dist2_cutoff} angstroms of each other, where {close_contacts_dist2_cutoff} > {close_contacts_dist1_cutoff}."
    )
    lines.append("")
    lines.append("Electrostatic Interactions")
    lines.append("==========================")
    lines.append(
        "   For each atom-type pair of atoms that come within {electrostatic_dist_cutoff} angstroms of each other, as described above, a summed electrostatic energy is calculated using the Gasteiger partial charges assigned by AutoDockTools."
    )
    lines.append("")
    lines.append("Binding-Pocket Flexibility")
    lines.append("==========================")
    lines.append(
        "   BINANA also provides useful information about the flexibility of a binding pocket. Each receptor atom that comes with {active_site_flexibility_dist_cutoff} angstroms of any ligand atom is characterized according to whether or not it belongs to a protein side chain or backbone. Additionally, the secondary structure of the corresponding protein residue of each atom, be it alpha helix, beta sheet, or other, is also determined. Thus, there are six possible characterizations for each atom: alpha-sidechain, alpha-backbone, beta-sidechain, beta-backbone, other-sidechain, other-backbone. The number of close-contact receptor atoms falling into each of these six categories is tallied as a metric of binding-site flexibility."
    )
    lines.append(
        '   All protein atoms with the atom names "CA," "C," "O," or "N" are assumed to belong to the backbone. All other receptor atoms are assigned side-chain status. Determining the secondary structure of the corresponding residue of each close-contact receptor atom is more difficult. First, preliminary secondary-structure assignments are made based on the phi and psi angles of each residue. If phi in (-145, -35) and psi in (-70, 50), the residue is assumed to be in the alpha-helix conformation. If phi in [-180, -40) and psi in (90,180], or phi in [-180,-70) and psi in [-180, -165], the residue is assumed to be in the beta-sheet conformation. Otherwise, the secondary structure of the residue is labeled "other."'
    )
    lines.append(
        '   Inspection of actual alpha-helix structures revealed that the alpha carbon of an alpha-helix residue i is generally within 6.0 angstroms of the alpha carbon of an alpha-helix residue three residues away (i + 3 or i - 3). Any residue that has been preliminarily labeled "alpha helix" that fails to meet this criteria is instead labeled "other." Additionally, the residues of any alpha helix comprised of fewer than four consecutive residues are also labeled "other," as these tended belong to be small loops rather than genuine helices.'
    )
    lines.append(
        '   True beta strands hydrogen bond with neighboring beta strands to form beta sheets. Inspection of actual beta strands revealed that the Calpha of a beta-sheet residue, i, is typically within 6.0 angstroms of the Calpha of another beta-sheet residue, usually on a different strand, when the residues [i - 2, i + 2] are excluded. Any residue labeled "beta sheet" that does not meet this criteria is labeled "other" instead. Additionally, the residues of beta strands that are less than three residues long are likewise labeled "other," as these residues typically belong to loops rather than legitimate strands.'
    )
    lines.append("")
    lines.append("Hydrophobic Contacts")
    lines.append("====================")
    lines.append(
        "   To identify hydrophobic contacts, BINANA simply tallies the number of times a ligand carbon atom comes within {hydrophobic_dist_cutoff} angstroms of a receptor carbon atom. These hydrophobic contacts are categorized according to the flexibility of the receptor carbon atom. There are six possible classifications: alpha-sidechain, alpha-backbone, beta-sidechain, beta-backbone, other-sidechain, other-backbone. The total number of hydrophobic contacts is simply the sum of these six counts."
    )
    lines.append("")
    lines.append("Hydrogen Bonds")
    lines.append("==============")
    lines.append(
        "   BINANA allows hydroxyl and amine groups to act as hydrogen-bond donors. Oxygen and nitrogen atoms can act as hydrogen-bond acceptors. Fairly liberal cutoffs are implemented in order to accommodate low-resolution crystal structures. A hydrogen bond is identified if the hydrogen-bond donor comes within {hydrogen_bond_dist_cutoff} angstroms of the hydrogen-bond acceptor, and the angle formed between the donor, the hydrogen atom, and the acceptor is no greater than {hydrogen_bond_angle_cutoff} degrees. BINANA tallies the number of hydrogen bonds according to the secondary structure of the receptor atom, the side-chain/backbone status of the receptor atom, and the location (ligand or receptor) of the hydrogen bond donor. Thus there are twelve possible categorizations: alpha-sidechain-ligand, alpha-backbone-ligand, beta-sidechain-ligand, beta-backbone-ligand, other-sidechain-ligand, other-backbone-ligand, alpha-sidechain-receptor, alpha-backbone-receptor, beta-sidechain-receptor, beta-backbone-receptor, other-sidechain-receptor, other-backbone-receptor."
    )
    lines.append("")
    lines.append("Salt Bridges")
    lines.append("============")
    lines.append(
        "   BINANA also seeks to identify possible salt bridges binding the ligand to the receptor. First, charged functional groups are identified and labeled with a representative point to denote their location. For non-protein residues, BINANA searches for common functional groups or atoms that are known to be charged. Atoms containing the following names are assumed to be metal cations: MG, MN, RH, ZN, FE, BI, AS, AG. The identifying coordinate is centered on the metal cation itself. Sp3-hybridized amines (which could pick up a hydrogen atom) and quaternary ammonium cations are also assumed to be charged; the representative coordinate is centered on the nitrogen atom. Imidamides where both of the constituent amines are primary, as in the guanidino group, are also fairly common charged groups. The representative coordinate is placed between the two constituent nitrogen atoms. "
    )
    lines.append(
        "   Carboxylate groups are likewise charged; the identifying coordinate is placed between the two oxygen atoms. Any group containing a phosphorus atom bound to two oxygen atoms that are themselves bound to no other heavy atoms (i.e., a phosphate group) is also likely charged; the representative coordinate is centered on the phosphorus atom. Similarly, any group containing a sulfur atom bound to three oxygen atoms that are themselves bound to no other heavy atoms (i.e., a sulfonate group) is also likely charged; the representative coordinate is centered on the sulfur atom. Note that while BINANA is thorough in its attempt to identify charged functional groups on non-protein residues, it is not exhaustive. For example, one could imagine a protonated amine in an aromatic ring that, though charged, would not be identified as a charged group."
    )
    lines.append(
        "   Identifying the charged functional groups of protein residues is much simpler. Functional groups are identified based on standardized protein atom names. Lysine residues have an amine; the representative coordinate is centered on the nitrogen atom. Arginine has a guanidino group; the coordinate is centered between the two terminal nitrogen atoms. Histadine is always considered charged, as it could pick up a hydrogen atom. The representative charge is placed between the two ring nitrogen atoms. Finally, glutamate and aspartate contain charged carboxylate groups; the representative coordinate is placed between the two oxygen atoms."
    )
    lines.append(
        "   Having identified the location of all charged groups, BINANA is ready to predict potential salt bridges. First, the algorithm identifies all representative charge coordinates within {salt_bridge_dist_cutoff} angstroms of each other. Next, it verifies that the two identified coordinates correspond to charges that are opposite. If so, a salt bridge is detected. These salt bridges are characterized and tallied by the secondary structure of the associated protein residue: alpha helix, beta sheet, or other."
    )
    lines.append("")
    lines.append("pi Interactions")
    lines.append("===============")
    lines.append(
        "   A number of interactions are known to involve pi systems. In order to detect the aromatic rings of non-protein residues, a recursive subroutine identifies all five or six member rings, aromatic or not. The dihedral angles between adjacent ring atoms, and between adjacent ring atoms and the first atom of ring substituents, are checked to ensure that none deviate from planarity by more than 15 degrees. Planarity establishes aromaticity. For protein residues, aromatic rings are identified using standardized protein-atom names. Phenylalanine, tyrosine, and histidine all have aromatic rings. Tryptophan is assigned two aromatic rings. "
    )
    lines.append(
        "   Once an aromatic ring is identified, it must be fully characterized. First, a plane is defined that passes through three ring atoms, preferably the first, third, and fifth atoms. The center of the ring is calculated by averaging the coordinates of all ring atoms, and the radius is given to be the maximum distance between the center point and any of those atoms. From this information, a ring disk can be defined that is centered on the ring center point, oriented along the ring plane, and has a radius equal to that of the ring plus a small buffer ({pi_padding_dist} angstroms)."
    )
    lines.append(
        "   Having identified and characterized all aromatic rings, the algorithm next attempts to identify pi-pi stacking interactions. First, every aromatic ring of the ligand is compared to every aromatic ring of the receptor. If the centers of two rings are within {pi_pi_interacting_dist_cutoff} angstroms of each other, the angle between the two vectors normal to the planes of each ring is calculated. If this angle suggests that the two planes are within {pi_stacking_angle_tolerance} degrees of being parallel, then each of the ring atoms is projected onto the plane of the opposite ring by identifying the nearest point on that plane. If any of these projected points fall within the ring disk of the opposite ring, the two aromatic rings are said to participate in a pi-pi stacking interaction. We note that it is not sufficient to simply project the ring center point onto the plane of the opposite ring because pi-pi stacking interactions are often off center."
    )
    lines.append(
        "   To detect T-stacking or edge-face interactions, every aromatic ring of the ligand is again compared to every aromatic ring of the receptor. If the centers of two rings are within {pi_pi_interacting_dist_cutoff} angstroms of each other, the angle between the two vectors normal to the planes of each ring is again calculated. If this angle shows that the two planes are within {T_stacking_angle_tolerance} degrees of being perpendicular, a second distance check is performed to verify that the two rings come within {T_stacking_closest_dist_cutoff} angstroms at their nearest point. If so, each of the coordinates of the ring center points is projected onto the plane of the opposite ring by identifying the nearest point on the respective plane. If either of the projected center points falls within the ring disk of the opposite ring, the two aromatic rings are said to participate in a T-stacking interaction."
    )
    lines.append(
        "   Finally, BINANA also detects cation-pi interactions between the ligand and the receptor. Each of the representative coordinates identifying charged functional groups is compared to each of the center points of the identified aromatic rings. If the distance between any of these pairs is less than {cation_pi_dist_cutoff} angstroms, the coordinate identifying the charged functional group is projected onto the plane of the aromatic ring by identifying the nearest point on that plane. If the projected coordinate falls within the ring disk of the aromatic ring, a cation-pi interaction is identified. "
    )
    lines.append(
        "   pi-pi stacking, T-stacking, and cation-pi interactions are tallied according to the secondary structure of the receptor residue containing the associated aromatic ring or charged functional group: alpha helix, beta sheet, or other."
    )
    lines.append("")
    lines.append("Ligand Atom Types and Rotatable Bonds")
    lines.append("=====================================")
    lines.append(
        "   BINANA also tallies the number of atoms of each AutoDock type present in the ligand as well as the number of ligand rotatable bonds identified by the AutoDockTools scripts used to generate the input PDBQT files."
    )
    lines.append("")
    lines.append("                            [- END INTRO -]")
    lines.append("")
    wrapped = []
    for line in lines:
        if line == "":
            wrapped.append("")
        elif "python binana.py" in line:
            wrapped.append(line)
        else:
            wrapped.extend(textwrap.wrap(line, 80))

    print("")
    print("                                                             |[]{};")
    print("                                                            .|[]{}")
    print("                                                            .|  {}")
    print("                                                             |   }")
    print("                                                             |   }")
    print("                                                             |   }")
    print("                                                            .|   };")
    print("                                                            .|     :'\"")
    print('                                                           +.        "')
    print('                                                          =+         "/')
    print('                                                         _=          "/')
    print('                                                        -_           "/')
    print('                                                       ,-            "/')
    print('                                                     <>              "/')
    print('                                                   |\                "')
    print("                                               :'\"/                 '\"")
    print("                                        .|[]{};                    :'")
    print("               ,-_=+.|[]{};:'\"/|\<>,-_=+                           :'")
    print("           |\<>                                                   ;:")
    print("          /|                                                    {};")
    print("          /|                                                   ]{}")
    print("          /|                                                  []")
    print("           |\                                               .|[")
    print("            \<                                            =+.")
    print("              >,                                        -_=")
    print("               ,-_=                                  <>,-")
    print('                  =+.|[]                         "/|\<')
    print("                       ]{};:'\"/|\         []{};:'\"")
    print("                                \<>,-_=+.|")

    for i in wrapped:
        print(i)

if __name__ == '__main__':
    intro()

    cmd_params = CommandLineParameters(sys.argv[:])

    if cmd_params.okay_to_proceed() == False:
        print(
            "Error: You need to specify the ligand and receptor PDBQT files to analyze using\nthe -receptor and -ligand tags from the command line.\n"
        )
        sys.exit(0)

    if cmd_params.error != "":
        print("Warning: The following command-line parameters were not recognized:")
        print(("   " + cmd_params.error + "\n"))

    lig = cmd_params.params["ligand"]
    rec = cmd_params.params["receptor"]

    # ligand = PDB()
    # receptor = PDB()
    # ligand.LoadPDB(lig)
    # receptor.LoadPDB(rec)

    d = Binana(lig, rec, cmd_params)
