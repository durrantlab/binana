# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

CLOSE_CONTACTS_DIST1_CUTOFF = 2.5
"""float: Atom-atom distance cutoff for very-close contacts."""

CLOSE_CONTACTS_DIST2_CUTOFF = 4.0
"""float: Atom-atom distance cutoff for close contacts."""

ELECTROSTATIC_DIST_CUTOFF = 4.0
"""float: Atom-atom distance cutoff to use when summing electrostatic
energies."""

ACTIVE_SITE_FLEXIBILITY_DIST_CUTOFF = 4.0
"""float: Atom-atom distance cutoff to use when categorizing ligand-adjacent
protein atoms according to backbone vs. side chain, as well as alpha helix vs.
beta sheet vs. other."""

HYDROPHOBIC_DIST_CUTOFF = 4.0
"""float: Carbon-carbon distance cutoff for hydrophobics interactions."""

HYDROGEN_BOND_DIST_CUTOFF = 4.0
"""float: Donor/acceptor distance cutoff for hydrogen bonds."""

HYDROGEN_BOND_ANGLE_CUTOFF = 40.0
"""float: Donor-hydrogen-acceptor angle cutoff, in degrees, for hydrogen
bonds."""

PI_PADDING_DIST = 0.75
"""float: Aromatic-ring padding. For the purpose of detecting interactions, this
value is added to a given atomatic ring's actual radius."""

PI_PI_INTERACTING_DIST_CUTOFF = 7.5
"""float: Ring-center distance cutoff for detecting pi-pi stacking and T-shaped
interactions."""

PI_STACKING_ANGLE_TOLERANCE = 30.0
"""float: pi-pi stacking angle cutoff, in degrees. The angle between the two
vectors normal to the planes of each ring must be at least within this cutoff of
parallel."""

T_STACKING_ANGLE_TOLERANCE = 30.0
"""float: pi-pi T-shaped angle cutoff, in degrees. The angle between the two
vectors normal to the planes of each ring must be at least within this cutoff of
perpendicular."""

T_STACKING_CLOSEST_DIST_CUTOFF = 5.0
"""float: Atom-atom distance cutoff for detecting pi-pi T-shaped
interactions."""

CATION_PI_DIST_CUTOFF = 6.0
"""float: Charged-moiety/ring-center distance cutoff for cation-pi
interactions."""

SALT_BRIDGE_DIST_CUTOFF = 5.5
"""float: Charged-moiety/charged-moiety distance cutoff for salt-bridge
interactions."""


RECEPTOR = ""
LIGAND = ""
OUTPUT_DIR = ""
OUTPUT_FILE = ""
OUTPUT_JSON = ""
TEST = False
