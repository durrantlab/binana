# BINANA 1.3

BINANA (BINding ANAlyzer) is a python-implemented algorithm for analyzing
ligand binding. The program identifies key binding characteristics like
hydrogen bonds, salt bridges, and pi interactions.

## 0. License: GNU General Public License version 3

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
details.

You should have received a copy of the GNU General Public License along with
this program. If not, see
[https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## 1. Download BINANA 1.3

Begin by downloading BINANA 1.3. An example input file is included with the
download (in the 'example/' directory). Running BINANA without any parameters
also prints out an extensive description of proper use: `python binana.py`

BINANA is released under the GNU General Public License. If you have any
questions, comments, or suggestions, please don't hesitate to contact me,
[Jacob Durrant](http://durrantlab.com), at durrantj [at] pitt [dot] edu.

If you use BINANA in your work, please cite:

1. Durrant JD, McCammon JA. BINANA: a novel algorithm for ligand-binding
   characterization. J Mol Graph Model. 2011;29(6):888–893.

## 2. Preparing Input Files

As input, BINANA accepts receptor and ligand files in the PDBQT format. PDBQT
files can be generated from the more common PDB file format using the free
converter provided with
[AutoDockTools](http://mgltools.scripps.edu/downloads). [Open
Babel](http://openbabel.org/wiki/Main_Page) can also convert PDB files to
PDBQT.

## 3. Running BINANA

### Simplest Example

The simplest way to run BINANA prints all program output to the terminal:

```bash
python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt
```

From a Unix-like command line, you can also direct this output to a text file,
which can in turn be parsed by other programs:

```bash
python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt > output.txt
```

### Saving the Analysis to an Output PDB File

BINANA can also create a single PDB file, making it easy to visualize the
different protein/ligand interactions in a third-party program such as VMD.

```bash
python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb
```

The interactions are tallied in the PDB header, like this:

```text
REMARK Command-line parameters used:
REMARK                  Parameter              |            Value
REMARK    -------------------------------------|----------------------------
REMARK        pi_pi_interacting_dist_cutoff    |             7.5
REMARK            cation_pi_dist_cutoff        |             6.0
REMARK                    ligand               |        ./ligand.pdbqt
REMARK         close_contacts_dist1_cutoff     |             2.5
REMARK     active_site_flexibility_dist_cutoff |             4.0
REMARK                 output_file             |         ./output.pdb
REMARK               pi_padding_dist           |             0.75
REMARK           hydrophobic_dist_cutoff       |             4.0
REMARK        T_stacking_closest_dist_cutoff   |             5.0
REMARK          T_stacking_angle_tolerance     |             30.0
REMARK         close_contacts_dist2_cutoff     |             4.0
REMARK                   receptor              |       ./receptor.pdbqt
REMARK                  output_dir             |
REMARK         pi_stacking_angle_tolerance     |             30.0
REMARK          hydrogen_bond_angle_cutoff     |             40.0
REMARK          hydrogen_bond_dist_cutoff      |             4.0
REMARK           salt_bridge_dist_cutoff       |             5.5
REMARK          electrostatic_dist_cutoff      |             4.0
```

The PDB file then lists:

1. the protein atoms;
2. the ligand atoms (residue name LIG); and
3. atoms involved in the various interactions, with residue names
   corresponding to the interaction type (e.g., SAL for salt bridges).

### Saving the Analysis to an Output Directory

BINANA can also save its output to a directory. This directory will be created
if it does not already exist. When a directory is specified, BINANA:

1. creates separate PDB files containing the atoms involved in each
   interaction type,
2. writes a description of the interactions to a file called `log.txt`,
3. creates a VMD state file so the results can be easily visualized in VMD, a
   free program available for download at
   http://www.ks.uiuc.edu/Development/Download/download.cgi?PackageName=VMD

```bash
python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_dir /path/to/output/directory/
```

You can load the VMD state within VMD itself, or from the command line like
this:

```bash
cd /path/to/output/directory/
/path/to/executable/vmd -e state.vmd
```

Note that once the VMD state file is loaded, you may need to press the "=" key
to recenter the viewport around the ligand.

## 4. Using Custom Parameters

Though we recommend using program defaults, the following command-line tags
can also be explicitly specified:

- `-close_contacts_dist1_cutoff`
- `-close_contacts_dist2_cutoff`
- `-electrostatic_dist_cutoff`
- `-active_site_flexibility_dist_cutoff`
- `-hydrophobic_dist_cutoff`
- `-hydrogen_bond_dist_cutoff`
- `-hydrogen_bond_angle_cutoff`
- `-pi_padding_dist`
- `-pi_pi_interacting_dist_cutoff`
- `-pi_stacking_angle_tolerance`
- `-T_stacking_angle_tolerance`
- `-T_stacking_closest_dist_cutoff`
- `-cation_pi_dist_cutoff`
- `-salt_bridge_dist_cutoff`

For example, if you want to tell BINANA to detect only hydrogen bonds where
the donor and acceptor are less than 3.0 angstroms distant, run:

```bash
python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -hydrogen_bond_dist_cutoff 3.0
```

For a full description of each of these parameters, run:

```bash
python binana.py
```
