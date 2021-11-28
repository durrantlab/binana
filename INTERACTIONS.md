# Close contacts

BINANA begins by identifying all ligand and protein atoms that come within
`close_contacts_dist1_cutoff` angstroms of each other. These close-contact atoms
are then characterized according to their respective AutoDock atom types,
without regard for the receptor or ligand. The number of each pair of close-
contact atoms of given AutoDock atom types is then tallied. For example, the
program counts the number of times a hydrogen-bond accepting oxygen atom (atom
type OA), either on the ligand or the receptor, comes within
`close_contacts_dist1_cutoff` angstroms of a polar hydrogen atom (atom type HD)
on the corresponding binding partner, be it the receptor or the ligand. A
similar list of atom-type pairs is tallied for all ligand and receptor atoms
that come within `close_contacts_dist2_cutoff` angstroms of each other, where
`close_contacts_dist2_cutoff` > `close_contacts_dist1_cutoff`.

# Electrostatic interactions

For each atom-type pair of atoms that come within `electrostatic_dist_cutoff`
angstroms of each other, as described above, a summed electrostatic energy is
calculated using the Gasteiger partial charges assigned by AutoDockTools.

# Binding-pocket flexibility

BINANA also provides useful information about the flexibility of a binding
pocket. Each receptor atom that comes with `active_site_flexibility_dist_cutoff`
angstroms of any ligand atom is characterized according to whether or not it
belongs to a protein side chain or backbone. Additionally, the secondary
structure of the corresponding protein residue of each atom, be it alpha helix,
beta sheet, or other, is also determined. Thus, there are six possible
characterizations for each atom: alpha-sidechain, alpha-backbone, beta-
sidechain, beta-backbone, other-sidechain, other-backbone. The number of close-
contact receptor atoms falling into each of these six categories is tallied as a
metric of binding-site flexibility.

All protein atoms with the atom names "CA," "C," "O," or "N" are assumed to
belong to the backbone. All other receptor atoms are assigned side-chain status.
Determining the secondary structure of the corresponding residue of each close-
contact receptor atom is more difficult. First, preliminary secondary-structure
assignments are made based on the phi and psi angles of each residue. If phi in
(-145, -35) and psi in (-70, 50), the residue is assumed to be in the alpha-
helix conformation. If phi in [-180, -40) and psi in (90,180], or phi in
[-180,-70) and psi in [-180, -165], the residue is assumed to be in the beta-
sheet conformation. Otherwise, the secondary structure of the residue is labeled
"other."

Inspection of actual alpha-helix structures revealed that the alpha carbon of an
alpha-helix residue i is generally within 6.0 angstroms of the alpha carbon of
an alpha-helix residue three residues away (i + 3 or i - 3). Any residue that
has been preliminarily labeled "alpha helix" that fails to meet this criterion
is instead labeled "other." Additionally, the residues of any alpha helix
comprised of fewer than four consecutive residues are also labeled "other," as
these tended to belong to be small loops rather than genuine helices.

True beta strands hydrogen bond with neighboring beta strands to form beta
sheets. Inspection of actual beta strands revealed that the Calpha of a beta-
sheet residue, i, is typically within 6.0 angstroms of the Calpha of another
beta-sheet residue, usually on a different strand, when the residues [i - 2, i +
2] are excluded. Any residue labeled "beta sheet" that does not meet this
criterion is labeled "other" instead. Additionally, the residues of beta strands
that are less than three residues long are likewise labeled "other," as these
residues typically belong to loops rather than legitimate strands.

# Hydrophobic contacts

To identify hydrophobic contacts, BINANA simply tallies the number of times a
ligand carbon atom comes within `hydrophobic_dist_cutoff` angstroms of a
receptor carbon atom. These hydrophobic contacts are categorized according to
the flexibility of the receptor carbon atom. There are six possible
classifications: alpha-sidechain, alpha-backbone, beta-sidechain, beta-backbone,
other-sidechain, other-backbone. The total number of hydrophobic contacts is
simply the sum of these six counts.

# Hydrogen bonds

BINANA allows hydroxyl, amine, and thiol groups to act as hydrogen-bond donors.
Oxygen, nitrogen, and sulfur atoms can act as hydrogen-bond acceptors. Fairly
liberal cutoffs are implemented in order to accommodate low-resolution crystal
structures. A hydrogen bond is identified if the hydrogen-bond donor comes
within `hydrogen_bond_dist_cutoff` angstroms of the hydrogen-bond acceptor, and
the angle formed between the donor, the hydrogen atom, and the acceptor is no
greater than `hydrogen_halogen_bond_angle_cutoff` degrees. BINANA tallies the
number of hydrogen bonds according to the secondary structure of the receptor
atom, the side-chain/backbone status of the receptor atom, and the location
(ligand or receptor) of the hydrogen bond donor. Thus there are twelve possible
categorizations: alpha-sidechain-ligand, alpha-backbone-ligand, beta-sidechain-
ligand, beta-backbone-ligand, other-sidechain-ligand, other-backbone-ligand,
alpha-sidechain-receptor, alpha-backbone-receptor, beta-sidechain-receptor,
beta-backbone-receptor, other-sidechain-receptor, other-backbone-receptor.

# Halogen bonds

BINANA identifies halogen bonds much as it identifies hydrogen bonds. Halogen
bond donors include O-X, N-X, S-X, and C-X, where X is I, Br, Cl, or F. Oxygen,
nitrogen, and sulfur atoms can act as halogen-bond acceptors. A halogen bond is
identified if the halogen-bond donor comes within `halogen_bond_dist_cutoff`
angstroms of the halogen-bond acceptor, and the angle formed between the donor,
the halogen atom, and the acceptor is no greater than
`hydrogen_halogen_bond_angle_cutoff` degrees. 

# Salt bridges

BINANA also seeks to identify possible salt bridges binding the ligand to the
receptor. First, charged functional groups are identified and labeled with a
representative point to denote their location. For non-protein residues, BINANA
searches for common functional groups or atoms that are known to be charged.
Atoms containing the following names are assumed to be metal cations: MG, MN,
RH, ZN, FE, BI, AS, AG. The identifying coordinate is centered on the metal
cation itself. Sp3-hybridized amines (which could pick up a hydrogen atom) and
quaternary ammonium cations are also assumed to be charged; the representative
coordinate is centered on the nitrogen atom. Imidamides where both of the
constituent amines are primary, as in the guanidino group, are also fairly
common charged groups. The representative coordinate is placed between the two
constituent nitrogen atoms.

Carboxylate groups are likewise charged; the identifying coordinate is placed
between the two oxygen atoms. Any group containing a phosphorus atom bound to
two oxygen atoms that are themselves bound to no other heavy atoms (i.e., a
phosphate group) is also likely charged; the representative coordinate is
centered on the phosphorus atom. Similarly, any group containing a sulfur atom
bound to three oxygen atoms that are themselves bound to no other heavy atoms
(i.e., a sulfonate group) is also likely charged; the representative coordinate
is centered on the sulfur atom. Note that while BINANA is thorough in its
attempt to identify charged functional groups on non-protein residues, it is not
exhaustive. For example, one could imagine a protonated amine in an aromatic
ring that, though charged, would not be identified as a charged group.

Identifying the charged functional groups of protein residues is much simpler.
Functional groups are identified based on standardized protein atom names.
Lysine residues have an amine; the representative coordinate is centered on the
nitrogen atom. Arginine has a guanidino group; the coordinate is centered
between the two terminal nitrogen atoms. Histadine is always considered charged,
as it could pick up a hydrogen atom. The representative charge is placed between
the two ring nitrogen atoms. Finally, glutamate and aspartate contain charged
carboxylate groups; the representative coordinate is placed between the two
oxygen atoms.

Having identified the location of all charged groups, BINANA is ready to predict
potential salt bridges. First, the algorithm identifies all representative
charge coordinates within `salt_bridge_dist_cutoff` angstroms of each other.
Next, it verifies that the two identified coordinates correspond to charges that
are opposite. If so, a salt bridge is detected. These salt bridges are
characterized and tallied by the secondary structure of the associated protein
residue: alpha helix, beta sheet, or other.

# pi interactions

A number of interactions are known to involve pi systems. In order to detect the
aromatic rings of non-protein residues, a recursive subroutine identifies all
five or six member rings, aromatic or not. The dihedral angles between adjacent
ring atoms, and between adjacent ring atoms and the first atom of ring
substituents, are checked to ensure that none deviate from planarity by more
than 15 degrees. Planarity establishes aromaticity. For protein residues,
aromatic rings are identified using standardized protein-atom names.
Phenylalanine, tyrosine, and histidine all have aromatic rings. Tryptophan is
assigned two aromatic rings.

Once an aromatic ring is identified, it must be fully characterized. First, a
plane is defined that passes through three ring atoms, preferably the first,
third, and fifth atoms. The center of the ring is calculated by averaging the
coordinates of all ring atoms, and the radius is given to be the maximum
distance between the center point and any of those atoms. From this information,
a ring disk can be defined that is centered on the ring center point, oriented
along the ring plane, and has a radius equal to that of the ring plus a small
buffer (`pi_padding_dist` angstroms).

Having identified and characterized all aromatic rings, the algorithm next
attempts to identify pi-pi stacking interactions. First, every aromatic ring of
the ligand is compared to every aromatic ring of the receptor. If the centers of
two rings are within `pi_pi_interacting_dist_cutoff` angstroms of each other,
the angle between the two vectors normal to the planes of each ring is
calculated. If this angle suggests that the two planes are within
`pi_stacking_angle_tolerance` degrees of being parallel, then each of the ring
atoms is projected onto the plane of the opposite ring by identifying the
nearest point on that plane. If any of these projected points fall within the
ring disk of the opposite ring, the two aromatic rings are said to participate
in a pi-pi stacking interaction. We note that it is not sufficient to simply
project the ring center point onto the plane of the opposite ring because pi-pi
stacking interactions are often off center.

To detect T-stacking or edge-face interactions, every aromatic ring of the
ligand is again compared to every aromatic ring of the receptor. If the centers
of two rings are within `pi_pi_interacting_dist_cutoff` angstroms of each other,
the angle between the two vectors normal to the planes of each ring is again
calculated. If this angle shows that the two planes are within
`T_stacking_angle_tolerance` degrees of being perpendicular, a second distance
check is performed to verify that the two rings come within
`T_stacking_closest_dist_cutoff` angstroms at their nearest point. If so, each
of the coordinates of the ring center points is projected onto the plane of the
opposite ring by identifying the nearest point on the respective plane. If
either of the projected center points falls within the ring disk of the opposite
ring, the two aromatic rings are said to participate in a T-stacking
interaction.

Finally, BINANA also detects cation-pi interactions between the ligand and the
receptor. Each of the representative coordinates identifying charged functional
groups is compared to each of the center points of the identified aromatic
rings. If the distance between any of these pairs is less than
`cation_pi_dist_cutoff` angstroms, the coordinate identifying the charged
functional group is projected onto the plane of the aromatic ring by identifying
the nearest point on that plane. If the projected coordinate falls within the
ring disk of the aromatic ring, a cation-pi interaction is identified.

pi-pi stacking, T-stacking, and cation-pi interactions are tallied according to
the secondary structure of the receptor residue containing the associated
aromatic ring or charged functional group: alpha helix, beta sheet, or other.

# Metal coordination bonds

BINANA detects metal bonds whenever a N, O, Cl, F, Br, I, or S is located near a
metal cation (specified using the `-metal_coordination_dist_cutoff` parameter).
We note that BINANA does not account for the angles between the coordinating
atoms and the metal cation. We opted for a straightforward distance-based
approach because (1) many such molecular geometries are possible, (2) in
practice, the L-M-L angles can deviate substantially from the ideal, and (3)
some positions may be unoccupied (vacancy). Fortunately, detecting
metal-coordination bonds by distance is sufficient in almost all cases.

# Ligand atom types and rotatable bonds

BINANA also tallies the number of atoms of each AutoDock type present in the
ligand as well as the number of ligand rotatable bonds identified by the
AutoDockTools scripts used to generate the input PDBQT files.

# Summary of parameter values

| Parameter name                      | Value  | Description
|-------------------------------------|--------|---------------------------------------
| close_contacts_dist1_cutoff         | 2.5 Å  | Atom-atom distance cutoff for very-close contacts.
| close_contacts_dist2_cutoff         | 4.0 Å  | Atom-atom distance cutoff for close contacts.
| electrostatic_dist_cutoff           | 4.0 Å  | Atom-atom distance cutoff to use when summing electrostatic energies.
| active_site_flexibility_dist_cutoff | 4.0 Å  | Atom-atom distance cutoff to use when categorizing ligand-adjacent protein atoms according to backbone vs. side chain, as well as alpha helix vs. beta sheet vs. other.
| hydrophobic_dist_cutoff             | 4.0 Å  | Carbon-carbon distance cutoff for hydrophobics interactions.
| hydrogen_bond_dist_cutoff           | 4.0 Å  | Donor/acceptor distance cutoff for hydrogen bonds.
| hydrogen_halogen_bond_angle_cutoff  | 40.0°  | Donor-hydrogen-acceptor or donor-halogen-acceptor angle cutoff, in degrees, for hydrogen and halogen bonds.
| halogen_bond_dist_cutoff            | 5.5 Å  | Donor/acceptor distance cutoff for halogen bonds.
| salt_bridge_dist_cutoff             | 5.5 Å  | Charged-moiety/charged-moiety distance cutoff for salt-bridge interactions.
| pi_padding_dist                     | 0.75 Å | Aromatic-ring padding. For the purpose of detecting interactions, this value is added to a given atomatic ring's actual radius.
| pi_pi_interacting_dist_cutoff       | 7.5 Å  | Ring-center distance cutoff for detecting pi-pi stacking and T-shaped interactions.
| pi_stacking_angle_tolerance         | 30.0°  | pi-pi stacking angle cutoff, in degrees. The angle between the two vectors normal to the planes of each ring must be at least within this cutoff of parallel.
| t_stacking_angle_tolerance          | 30.0°  | pi-pi T-shaped angle cutoff, in degrees. The angle between the two vectors normal to the planes of each ring must be at least within this cutoff of perpendicular.
| t_stacking_closest_dist_cutoff      | 5.0 Å  | Atom-atom distance cutoff for detecting pi-pi T-shaped interactions.
| cation_pi_dist_cutoff               | 6.0 Å  | Charged-moiety/ring-center distance cutoff for cation-pi interactions.
| metal_coordination_dist_cutoff      | 3.5 Å  | Metal-ligand distance cutoff for metal-coordination interactions.

# Comments on protonation

We recommend using PDBQT files as input because they include polar hydrogen
atoms and partial electric charges. PDBQT files can be generated from the more
common PDB file format using the [free converter provided with
AutoDockTools](http://mgltools.scripps.edu/downloads).

When using PDB files, we recommend adding hydrogen atoms to both the protein and
ligand structures using external tools. To add hydrogen atoms to your receptor,
consider using [MolProbity](http://molprobity.biochem.duke.edu/) or
[PDB2PQR](http://server.poissonboltzmann.org/). To add hydrogen atoms to your
ligand, consider [Gypsum-DL](http://durrantlab.com/gypsum-dl/) or
[Avogadro](https://avogadro.cc/docs/menus/build-menu/).

You can use BINANA to analyze structures that do not contain hydrogen atoms,
though the results will likely be less accurate because BINANA must make some
guesses about protonation based on geometry.