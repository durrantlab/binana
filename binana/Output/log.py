preface = "REMARK "

# __pragma__ ('skip')
# Python, just alias open
openFile = open
# __pragma__ ('noskip')

"""?
# Transcrypt
import binana
openFile = binana.shim.OpenFile
?"""

def center(string, length):
    while len(string) < length:
        string = " " + string
        if len(string) < length:
            string = string + " "
    return string


def get_parameters(parameters, output):
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
            output + preface + "   " + center(key, 37) + "| " + center(value, 27) + "\n"
        )

    return output


def get_close_contacts_dist1_cutoff(
    parameters,
    ligand_receptor_atom_type_pairs_closest,
    closest_contacts_labels,
    output,
):
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
    for key in ligand_receptor_atom_type_pairs_closest.keys():
        value = ligand_receptor_atom_type_pairs_closest[key]
        key = key.split("_")
        output = (
            output
            + preface
            + "   "
            + center(key[0], 11)
            + "|"
            + center(key[1], 11)
            + "|"
            + center(str(value), 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
    for atom_pairs in closest_contacts_labels:
        output = (
            output + preface + "     " + atom_pairs[0] + " - " + atom_pairs[1] + "\n"
        )
    return output


def get_close_contacts_dist2_cutoff(
    parameters, ligand_receptor_atom_type_pairs_close, close_contacts_labels, output
):
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
    for key in ligand_receptor_atom_type_pairs_close.keys():
        value = ligand_receptor_atom_type_pairs_close[key]
        key = key.split("_")
        output = (
            output
            + preface
            + "   "
            + center(key[0], 11)
            + "|"
            + center(key[1], 11)
            + "|"
            + center(str(value), 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
    for atom_pairs in close_contacts_labels:
        output = (
            output + preface + "     " + atom_pairs[0] + " - " + atom_pairs[1] + "\n"
        )

    return output


def get_ligand_atom_types(
    ligand_atom_types, ligand_receptor_atom_type_pairs_electrostatic, output
):
    output = output + preface + "" + "\n"
    output = output + preface + "Ligand atom types:" + "\n"
    output = output + preface + "    Atom Type " + "\n"
    output = output + preface + "   -----------" + "\n"
    for key in ligand_atom_types.keys():
        output = output + preface + "   " + center(key, 11) + "\n"

    output = output + preface + "" + "\n"
    output = (
        output
        + preface
        + "Summed electrostatic energy by atom-type pair, in J/mol:"
        + "\n"
    )
    output = output + preface + "    Atom Type | Atom Type | Energy (J/mol)" + "\n"
    output = output + preface + "   -----------|-----------|----------------" + "\n"
    for key in ligand_receptor_atom_type_pairs_electrostatic.keys():
        value = ligand_receptor_atom_type_pairs_electrostatic[key]
        key = key.split("_")
        output = (
            output
            + preface
            + "   "
            + center(key[0], 11)
            + "|"
            + center(key[1], 11)
            + "|"
            + center(str(value), 16)
            + "\n"
        )
    return output


def get_rotateable_bonds_count(ligand, output):
    output = output + preface + "" + "\n"
    output = (
        output
        + preface
        + "Number of rotatable bonds in the ligand: "
        + str(ligand.rotateable_bonds_count)
        + "\n"
    )
    return output


def get_active_site_flexibility(active_site_flexibility, output):
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
    for key in active_site_flexibility.keys():
        value = active_site_flexibility[key]
        key = key.split("_")
        output = (
            output
            + preface
            + "   "
            + center(key[0], 20)
            + "|"
            + center(key[1], 21)
            + "|"
            + center(str(value), 7)
            + "\n"
        )

    return output


def get_hbonds(hbonds, hbonds_labels, output):
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
    for key in hbonds.keys():
        value = hbonds[key]
        key = key.split("_")
        output = (
            output
            + preface
            + "   "
            + center(key[1], 19)
            + "|"
            + center(key[2], 20)
            + "|"
            + center(key[3], 21)
            + "|"
            + center(str(value), 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
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
    return output


def get_hydrophobics(hydrophobics, hydrophobic_labels, output):
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
    for key in hydrophobics.keys():
        value = hydrophobics[key]
        key = key.split("_")
        output = (
            output
            + preface
            + "   "
            + center(key[0], 20)
            + "|"
            + center(key[1], 21)
            + "|"
            + center(str(value), 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
    for atom_pairs in hydrophobic_labels:
        output = (
            output + preface + "     " + atom_pairs[0] + " - " + atom_pairs[1] + "\n"
        )
    return output


def get_pi_stacking(PI_interactions, pi_stacking_labels, output):
    stacking = []
    for key in PI_interactions.keys():
        value = PI_interactions[key]
        together = key + "_" + str(value)
        if "STACKING" in together:
            stacking.append(together)

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
            + center(item[1], 21)
            + "|"
            + center(item[2], 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
    for atom_pairs in pi_stacking_labels:
        output = (
            output + preface + "     " + atom_pairs[0] + " - " + atom_pairs[1] + "\n"
        )

    return output


def get_T_stacking(PI_interactions, T_stacking_labels, output):
    t_shaped = []
    for key in PI_interactions.keys():
        value = PI_interactions[key]
        together = key + "_" + str(value)
        if "SHAPED" in together:
            t_shaped.append(together)

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
            + center(item[1], 21)
            + "|"
            + center(item[2], 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
    for atom_pairs in T_stacking_labels:
        output = (
            output + preface + "     " + atom_pairs[0] + " - " + atom_pairs[1] + "\n"
        )

    return output


def get_pi_cation(PI_interactions, pi_cat_labels, output):
    pi_cation = []
    for key in PI_interactions.keys():
        value = PI_interactions[key]
        together = key + "_" + str(value)
        if "CATION" in together:
            pi_cation.append(together)

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
            + center(item2[0], 27)
            + "|"
            + center(item[2], 21)
            + "|"
            + center(item[3], 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
    for atom_pairs in pi_cat_labels:
        output = (
            output + preface + "     " + atom_pairs[0] + " - " + atom_pairs[1] + "\n"
        )

    return output


def get_salt_bridges(salt_bridges, salt_bridge_labels, output):
    output = output + preface + "" + "\n"
    output = output + preface + "Salt Bridges:" + "\n"
    output = output + preface + "    Secondary Structure | Count " + "\n"
    output = output + preface + "   ---------------------|-------" + "\n"
    for key in salt_bridges.keys():
        value = salt_bridges[key]
        key = key.split("_")
        output = (
            output
            + preface
            + "   "
            + center(key[1], 21)
            + "|"
            + center(str(value), 7)
            + "\n"
        )

    output = output + preface + "\n" + preface + "Raw data:\n"
    for atom_pairs in salt_bridge_labels:
        output = (
            output + preface + "     " + atom_pairs[0] + " - " + atom_pairs[1] + "\n"
        )
    return output


def make_log(
    parameters,
    ligand,
    ligand_atom_types,
    ligand_receptor_atom_type_pairs_closest,
    closest_contacts_labels,
    ligand_receptor_atom_type_pairs_close,
    close_contacts_labels,
    ligand_receptor_atom_type_pairs_electrostatic,
    active_site_flexibility,
    hbonds,
    hbonds_labels,
    hydrophobics,
    hydrophobic_labels,
    pi_interactions,
    pi_stacking_labels,
    t_stacking_labels,
    pi_cat_labels,
    salt_bridges,
    salt_bridge_labels,
):
    """'# old output format, for reference

    output = ""
    output = output + "Atom-type pair counts within " + str(parameters.params['close_contacts_dist1_cutoff']) + " : " + str(ligand_receptor_atom_type_pairs_closest) + "\n"
    output = output + "Atom-type pair counts within " + str(parameters.params['close_contacts_dist2_cutoff']) + " : " + str(ligand_receptor_atom_type_pairs_close) + "\n"
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

    output = get_parameters(parameters, output)

    # a description of the analysis
    output = get_close_contacts_dist1_cutoff(
        parameters,
        ligand_receptor_atom_type_pairs_closest,
        closest_contacts_labels,
        output,
    )
    output = get_close_contacts_dist2_cutoff(
        parameters,
        ligand_receptor_atom_type_pairs_close,
        close_contacts_labels,
        output,
    )
    output = get_ligand_atom_types(
        ligand_atom_types, ligand_receptor_atom_type_pairs_electrostatic, output
    )
    output = get_rotateable_bonds_count(ligand, output)
    output = get_active_site_flexibility(active_site_flexibility, output)
    output = get_hbonds(hbonds, hbonds_labels, output)
    output = get_hydrophobics(hydrophobics, hydrophobic_labels, output)

    output = get_pi_stacking(pi_interactions, pi_stacking_labels, output)
    output = get_T_stacking(pi_interactions, t_stacking_labels, output)
    output = get_pi_cation(pi_interactions, pi_cat_labels, output)
    output = get_salt_bridges(salt_bridges, salt_bridge_labels, output)

    # Output some files/to the screen.
    if parameters.params["output_dir"] != "":
        f = openFile(parameters.params["output_dir"] + "log.txt", "w")
        f.write(output.replace("REMARK ", ""))
        f.close()

    if parameters.params["output_file"] == "" and parameters.params["output_dir"] == "":
        # so you're not outputing to either a file or a directory
        print((output.replace("REMARK ", "")))

    return output
