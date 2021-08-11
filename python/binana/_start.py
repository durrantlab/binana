# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

import __future__
from binana.output import _write_main
from binana.interactions import get_all_interactions
from binana.load_ligand_receptor import from_files

import math
import binana

# __pragma__ ('skip')
# Python
import os
import textwrap
from math import fabs

# __pragma__ ('noskip')

"""?
# Transcrypt
os = binana.os
from binana._utils import shim
textwrap = shim
from binana._utils.shim import fabs
?"""

VERSION = "2.0"


def _get_all_interactions(parameters):
    """Gets all the interactions between the specified ligand and receptor
    files.

    Args:
        parameters (binana._cli_params.get_params.CommandLineParameters):
            The BINANA parameters to use.
    """

    ligand, receptor = from_files(
        parameters.params["ligand"], parameters.params["receptor"]
    )

    # This is perhaps controversial. I noticed that often a pi-cation
    # interaction or other pi interaction was only slightly off, but looking
    # at the structure, it was clearly supposed to be a pi-cation
    # interaction. I've decided then to artificially expand the radius of
    # each pi ring. Think of this as adding in a VDW radius, or accounting
    # for poor crystal-structure resolution, or whatever you want to justify
    # it.
    pi_padding = parameters.params["pi_padding_dist"]

    all_interacts = get_all_interactions(
        ligand,
        receptor,
        parameters.params["close_contacts_dist1_cutoff"],
        parameters.params["close_contacts_dist2_cutoff"],
        parameters.params["electrostatic_dist_cutoff"],
        parameters.params["active_site_flexibility_dist_cutoff"],
        parameters.params["hydrophobic_dist_cutoff"],
        parameters.params["hydrogen_bond_dist_cutoff"],
        parameters.params["hydrogen_bond_angle_cutoff"],
        parameters.params["pi_pi_interacting_dist_cutoff"],
        parameters.params["pi_stacking_angle_tolerance"],
        parameters.params["T_stacking_angle_tolerance"],
        parameters.params["T_stacking_closest_dist_cutoff"],
        parameters.params["cation_pi_dist_cutoff"],
        parameters.params["salt_bridge_dist_cutoff"],
        pi_padding,
    )

    # The original implementation merged all pi-related interactions into
    # one. Do that here too for backwards compatibility.
    for key in all_interacts["cat_pi"]["counts"].keys():
        all_interacts["pi_pi"]["counts"][key] = all_interacts["cat_pi"]["counts"][key]

    # Now save the files
    _write_main(
        parameters,
        ligand,
        receptor,
        all_interacts["closest"],
        all_interacts["close"],
        all_interacts["hydrophobics"],
        all_interacts["hydrogen_bonds"],
        all_interacts["salt_bridges"],
        all_interacts["pi_pi"],
        all_interacts["cat_pi"],
        all_interacts["electrostatic_energies"],
        all_interacts["active_site_flexibility"],
        all_interacts["ligand_atom_types"],
    )


def _intro():
    # TODO: If you ever change below, be sure to update COMMAND_LINE_USE.md with
    # this file too!

    version = "2.0"
    citation = "BINANA: A Novel Algorithm for Ligand-Binding Characterization. Durrant JD, McCammon JA. J Mol Graph Model. 2011 Apr; 29(6): 888-893. doi: 10.1016/j.jmgm.2011.01.004"
    lines = [
        "",
        "BINANA " + version,
        "============",
        "",
        "BINANA is released under the GNU General Public License (see http://www.gnu.org/licenses/gpl.html). If you use BINANA in your work, please cite:",
        "",
        citation,
        "",
        "Introduction, Examples of Use",
        "=============================",
        "",
        "BINANA (BINding ANAlyzer) is a python-implemented algorithm for analyzing ligand binding. The program identifies key binding characteristics like hydrogen bonds, salt bridges, and pi interactions. As input, BINANA accepts receptor and ligand files in the PDBQT format. PDBQT files can be generated from the more common PDB file format using the free converter provided with AutoDockTools, available at http://mgltools.scripps.edu/downloads",
        "",
        "As output, BINANA describes ligand binding. Here's a simple example of how to run the program:",
        "",
        "```bash",
        "python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt",
        "```",
        "",
        "To create a single PDB file showing the different binding characteristics with those characteristics described in the PDB header:",
        "",
        "```bash",
        "python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb",
        "```",
        "",
        "Note that in the above example, errors and warnings are not written to the output file. To save these to a file, try:",
        "",
        "```bash",
        "python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb > errors.txt",
        "```",
        "",
        "To additionally output a JSON file with all the characterized interactions between the protein and ligand:",
        "",
        "```bash",
        "python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_json /path/to/output.json",
        "```",
        "",
        "You can also send the program output to a directory, which will be created if it does not already exist. If a directory is specified, the program automatically separates the output PDB file into separate files for each interaction analyzed, and a description of the interactions is written to a file called `log.txt`. Additionally, a VMD state file is created so the results can be easily visualized in VMD, a free program available for download at http://www.ks.uiuc.edu/Development/Download/download.cgi?PackageName=VMD Again, to save warnings and errors, append something like `> errors.txt` to the end of your command:",
        "",
        "```bash",
        "python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_dir /path/to/output/directory/ > errors.txt",
        "```",
        "",
        "Though we recommend using program defaults, the following command-line tags can also be specified: `-close_contacts_dist1_cutoff` `-close_contacts_dist2_cutoff` `-electrostatic_dist_cutoff` `-active_site_flexibility_dist_cutoff` `-hydrophobic_dist_cutoff` `-hydrogen_bond_dist_cutoff` `-hydrogen_bond_angle_cutoff` `-pi_padding_dist` `-pi_pi_interacting_dist_cutoff` `-pi_stacking_angle_tolerance` `-T_stacking_angle_tolerance` `-T_stacking_closest_dist_cutoff` `-cation_pi_dist_cutoff` `-salt_bridge_dist_cutoff`",
        "",
        "For example, if you want to tell BINANA to detect only hydrogen bonds where the donor and acceptor are less than 3.0 angstroms distant, run:",
        "",
        "```bash",
        "python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -hydrogen_bond_dist_cutoff 3.0",
        "```",
        "",
        "What follows is a detailed description of the BINANA algorithm and a further explaination of the optional parameters described above. Parameter names are enclosed in braces.",
        "",
        "Close Contacts",
        "==============",
        "",
        "BINANA begins by identifying all ligand and protein atoms that come within `close_contacts_dist1_cutoff` angstroms of each other. These close-contact atoms are then characterized according to their respective AutoDock atom types, without regard for the receptor or ligand. The number of each pair of close-contact atoms of given AutoDock atom types is then tallied. For example, the program counts the number of times a hydrogen-bond accepting oxygen atom (atom type OA), either on the ligand or the receptor, comes within `close_contacts_dist1_cutoff` angstroms of a polar hydrogen atom (atom type HD) on the corresponding binding partner, be it the receptor or the ligand. A similar list of atom-type pairs is tallied for all ligand and receptor atoms that come within `close_contacts_dist2_cutoff` angstroms of each other, where `close_contacts_dist2_cutoff` > `close_contacts_dist1_cutoff`.",
        "",
        "Electrostatic Interactions",
        "==========================",
        "",
        "For each atom-type pair of atoms that come within `electrostatic_dist_cutoff` angstroms of each other, as described above, a summed electrostatic energy is calculated using the Gasteiger partial charges assigned by AutoDockTools.",
        "",
        "Binding-Pocket Flexibility",
        "==========================",
        "",
        "BINANA also provides useful information about the flexibility of a binding pocket. Each receptor atom that comes with `active_site_flexibility_dist_cutoff` angstroms of any ligand atom is characterized according to whether or not it belongs to a protein side chain or backbone. Additionally, the secondary structure of the corresponding protein residue of each atom, be it alpha helix, beta sheet, or other, is also determined. Thus, there are six possible characterizations for each atom: alpha-sidechain, alpha-backbone, beta-sidechain, beta-backbone, other-sidechain, other-backbone. The number of close-contact receptor atoms falling into each of these six categories is tallied as a metric of binding-site flexibility.",
        "",
        'All protein atoms with the atom names "CA," "C," "O," or "N" are assumed to belong to the backbone. All other receptor atoms are assigned side-chain status. Determining the secondary structure of the corresponding residue of each close-contact receptor atom is more difficult. First, preliminary secondary-structure assignments are made based on the phi and psi angles of each residue. If phi in (-145, -35) and psi in (-70, 50), the residue is assumed to be in the alpha-helix conformation. If phi in [-180, -40) and psi in (90,180], or phi in [-180,-70) and psi in [-180, -165], the residue is assumed to be in the beta-sheet conformation. Otherwise, the secondary structure of the residue is labeled "other."',
        "",
        'Inspection of actual alpha-helix structures revealed that the alpha carbon of an alpha-helix residue i is generally within 6.0 angstroms of the alpha carbon of an alpha-helix residue three residues away (i + 3 or i - 3). Any residue that has been preliminarily labeled "alpha helix" that fails to meet this criteria is instead labeled "other." Additionally, the residues of any alpha helix comprised of fewer than four consecutive residues are also labeled "other," as these tended belong to be small loops rather than genuine helices.',
        "",
        'True beta strands hydrogen bond with neighboring beta strands to form beta sheets. Inspection of actual beta strands revealed that the Calpha of a beta-sheet residue, i, is typically within 6.0 angstroms of the Calpha of another beta-sheet residue, usually on a different strand, when the residues [i - 2, i + 2] are excluded. Any residue labeled "beta sheet" that does not meet this criteria is labeled "other" instead. Additionally, the residues of beta strands that are less than three residues long are likewise labeled "other," as these residues typically belong to loops rather than legitimate strands.',
        "",
        "Hydrophobic Contacts",
        "====================",
        "",
        "To identify hydrophobic contacts, BINANA simply tallies the number of times a ligand carbon atom comes within `hydrophobic_dist_cutoff` angstroms of a receptor carbon atom. These hydrophobic contacts are categorized according to the flexibility of the receptor carbon atom. There are six possible classifications: alpha-sidechain, alpha-backbone, beta-sidechain, beta-backbone, other-sidechain, other-backbone. The total number of hydrophobic contacts is simply the sum of these six counts.",
        "",
        "Hydrogen Bonds",
        "==============",
        "",
        "BINANA allows hydroxyl and amine groups to act as hydrogen-bond donors. Oxygen and nitrogen atoms can act as hydrogen-bond acceptors. Fairly liberal cutoffs are implemented in order to accommodate low-resolution crystal structures. A hydrogen bond is identified if the hydrogen-bond donor comes within `hydrogen_bond_dist_cutoff` angstroms of the hydrogen-bond acceptor, and the angle formed between the donor, the hydrogen atom, and the acceptor is no greater than `hydrogen_bond_angle_cutoff` degrees. BINANA tallies the number of hydrogen bonds according to the secondary structure of the receptor atom, the side-chain/backbone status of the receptor atom, and the location (ligand or receptor) of the hydrogen bond donor. Thus there are twelve possible categorizations: alpha-sidechain-ligand, alpha-backbone-ligand, beta-sidechain-ligand, beta-backbone-ligand, other-sidechain-ligand, other-backbone-ligand, alpha-sidechain-receptor, alpha-backbone-receptor, beta-sidechain-receptor, beta-backbone-receptor, other-sidechain-receptor, other-backbone-receptor.",
        "",
        "Salt Bridges",
        "============",
        "",
        "BINANA also seeks to identify possible salt bridges binding the ligand to the receptor. First, charged functional groups are identified and labeled with a representative point to denote their location. For non-protein residues, BINANA searches for common functional groups or atoms that are known to be charged. Atoms containing the following names are assumed to be metal cations: MG, MN, RH, ZN, FE, BI, AS, AG. The identifying coordinate is centered on the metal cation itself. Sp3-hybridized amines (which could pick up a hydrogen atom) and quaternary ammonium cations are also assumed to be charged; the representative coordinate is centered on the nitrogen atom. Imidamides where both of the constituent amines are primary, as in the guanidino group, are also fairly common charged groups. The representative coordinate is placed between the two constituent nitrogen atoms. ",
        "",
        "Carboxylate groups are likewise charged; the identifying coordinate is placed between the two oxygen atoms. Any group containing a phosphorus atom bound to two oxygen atoms that are themselves bound to no other heavy atoms (i.e., a phosphate group) is also likely charged; the representative coordinate is centered on the phosphorus atom. Similarly, any group containing a sulfur atom bound to three oxygen atoms that are themselves bound to no other heavy atoms (i.e., a sulfonate group) is also likely charged; the representative coordinate is centered on the sulfur atom. Note that while BINANA is thorough in its attempt to identify charged functional groups on non-protein residues, it is not exhaustive. For example, one could imagine a protonated amine in an aromatic ring that, though charged, would not be identified as a charged group.",
        "",
        "Identifying the charged functional groups of protein residues is much simpler. Functional groups are identified based on standardized protein atom names. Lysine residues have an amine; the representative coordinate is centered on the nitrogen atom. Arginine has a guanidino group; the coordinate is centered between the two terminal nitrogen atoms. Histadine is always considered charged, as it could pick up a hydrogen atom. The representative charge is placed between the two ring nitrogen atoms. Finally, glutamate and aspartate contain charged carboxylate groups; the representative coordinate is placed between the two oxygen atoms.",
        "",
        "Having identified the location of all charged groups, BINANA is ready to predict potential salt bridges. First, the algorithm identifies all representative charge coordinates within `salt_bridge_dist_cutoff` angstroms of each other. Next, it verifies that the two identified coordinates correspond to charges that are opposite. If so, a salt bridge is detected. These salt bridges are characterized and tallied by the secondary structure of the associated protein residue: alpha helix, beta sheet, or other.",
        "",
        "pi Interactions",
        "===============",
        "",
        "A number of interactions are known to involve pi systems. In order to detect the aromatic rings of non-protein residues, a recursive subroutine identifies all five or six member rings, aromatic or not. The dihedral angles between adjacent ring atoms, and between adjacent ring atoms and the first atom of ring substituents, are checked to ensure that none deviate from planarity by more than 15 degrees. Planarity establishes aromaticity. For protein residues, aromatic rings are identified using standardized protein-atom names. Phenylalanine, tyrosine, and histidine all have aromatic rings. Tryptophan is assigned two aromatic rings. ",
        "",
        "Once an aromatic ring is identified, it must be fully characterized. First, a plane is defined that passes through three ring atoms, preferably the first, third, and fifth atoms. The center of the ring is calculated by averaging the coordinates of all ring atoms, and the radius is given to be the maximum distance between the center point and any of those atoms. From this information, a ring disk can be defined that is centered on the ring center point, oriented along the ring plane, and has a radius equal to that of the ring plus a small buffer (`pi_padding_dist` angstroms).",
        "",
        "Having identified and characterized all aromatic rings, the algorithm next attempts to identify pi-pi stacking interactions. First, every aromatic ring of the ligand is compared to every aromatic ring of the receptor. If the centers of two rings are within `pi_pi_interacting_dist_cutoff` angstroms of each other, the angle between the two vectors normal to the planes of each ring is calculated. If this angle suggests that the two planes are within `pi_stacking_angle_tolerance` degrees of being parallel, then each of the ring atoms is projected onto the plane of the opposite ring by identifying the nearest point on that plane. If any of these projected points fall within the ring disk of the opposite ring, the two aromatic rings are said to participate in a pi-pi stacking interaction. We note that it is not sufficient to simply project the ring center point onto the plane of the opposite ring because pi-pi stacking interactions are often off center.",
        "",
        "To detect T-stacking or edge-face interactions, every aromatic ring of the ligand is again compared to every aromatic ring of the receptor. If the centers of two rings are within `pi_pi_interacting_dist_cutoff` angstroms of each other, the angle between the two vectors normal to the planes of each ring is again calculated. If this angle shows that the two planes are within `T_stacking_angle_tolerance` degrees of being perpendicular, a second distance check is performed to verify that the two rings come within `T_stacking_closest_dist_cutoff` angstroms at their nearest point. If so, each of the coordinates of the ring center points is projected onto the plane of the opposite ring by identifying the nearest point on the respective plane. If either of the projected center points falls within the ring disk of the opposite ring, the two aromatic rings are said to participate in a T-stacking interaction.",
        "",
        "Finally, BINANA also detects cation-pi interactions between the ligand and the receptor. Each of the representative coordinates identifying charged functional groups is compared to each of the center points of the identified aromatic rings. If the distance between any of these pairs is less than `cation_pi_dist_cutoff` angstroms, the coordinate identifying the charged functional group is projected onto the plane of the aromatic ring by identifying the nearest point on that plane. If the projected coordinate falls within the ring disk of the aromatic ring, a cation-pi interaction is identified. ",
        "",
        "pi-pi stacking, T-stacking, and cation-pi interactions are tallied according to the secondary structure of the receptor residue containing the associated aromatic ring or charged functional group: alpha helix, beta sheet, or other.",
        "",
        "Ligand Atom Types and Rotatable Bonds",
        "=====================================",
        "",
        "   BINANA also tallies the number of atoms of each AutoDock type present in the ligand as well as the number of ligand rotatable bonds identified by the AutoDockTools scripts used to generate the input PDBQT files.",
        "",
        "                            [- END INTRO -]",
        "",
    ]
    wrapped = []
    for line in lines:
        if line == "":
            wrapped.append("")
        elif "python3 run_binana.py" in line:
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
