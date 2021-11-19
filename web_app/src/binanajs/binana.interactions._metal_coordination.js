// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-19 00:20:09
var binana = {};
var math = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {angle_between_three_points} from './binana._utils._math_functions.js';
import {Mol} from './binana._structure.mol.js';
import {hashtable_entry_add_one, list_alphebetize_and_combine} from './binana._utils.utils.js';
import {_get_ligand_receptor_dists} from './binana.load_ligand_receptor.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import {METAL_COORDINATION_CUTOFF} from './binana.interactions.default_params.js';
import {_set_default} from './binana._utils.shim.js';
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
var __name__ = 'binana.interactions._metal_coordination';
export var get_metal_coordination = function (ligand, receptor, cutoff) {
	if (typeof cutoff == 'undefined' || (cutoff != null && cutoff.hasOwnProperty ("__kwargtrans__"))) {;
		var cutoff = null;
	};
	var cutoff = _set_default (cutoff, METAL_COORDINATION_CUTOFF);
	var metals = ['Ac', 'Ag', 'Al', 'Am', 'Au', 'Ba', 'Be', 'Bi', 'Bk', 'Ca', 'Cd', 'Ce', 'Cf', 'Cm', 'Co', 'Cr', 'Cs', 'Cu', 'Db', 'Dy', 'Er', 'Es', 'Eu', 'Fe', 'Fm', 'Fr', 'Ga', 'Gd', 'Ge', 'Hf', 'Hg', 'Ho', 'In', 'Ir', 'La', 'Lr', 'Lu', 'Md', 'Mg', 'Mn', 'Mo', 'Nb', 'Nd', 'Ni', 'No', 'Np', 'Os', 'Pa', 'Pb', 'Pd', 'Pm', 'Po', 'Pr', 'Pt', 'Pu', 'Ra', 'Re', 'Rf', 'Rh', 'Ru', 'Sb', 'Sc', 'Sg', 'Sm', 'Sn', 'Sr', 'Ta', 'Tb', 'Tc', 'Th', 'Ti', 'Tl', 'Tm', 'Yb', 'Zn', 'Zr'];
	for (var m of metals.__getslice__ (0, null, 1)) {
		metals.append (m.upper ());
	}
	var coord_lig_atoms = ['N', 'O', 'Cl', 'F', 'Br', 'I', 'CL', 'BR', 'S'];
	var atoms_together = metals.__getslice__ (0, null, 1);
	atoms_together.extend (coord_lig_atoms);
	var meta_coord_dists = _get_ligand_receptor_dists (ligand, receptor, cutoff, atoms_together);
	var metal_coordinations = dict ({});
	for (var [ligand_atom, receptor_atom, dist] of meta_coord_dists) {
		var metal_atom = null;
		var coord_atom = null;
		var metal_id = '';
		if (__in__ (ligand_atom.element, metals) && !__in__ (receptor_atom.element, metals)) {
			var metal_atom = ligand_atom;
			var coord_atom = receptor_atom;
			var metal_id = metal_atom.string_id ();
		}
		else if (!__in__ (ligand_atom.element, metals) && __in__ (receptor_atom.element, metals)) {
			var metal_atom = receptor_atom;
			var coord_atom = ligand_atom;
			var metal_id = metal_atom.string_id ();
		}
		if (metal_atom !== null && coord_atom !== null) {
			if (!__in__ (metal_id, metal_coordinations.py_keys ())) {
				metal_coordinations [metal_id] = [metal_atom];
			}
			metal_coordinations [metal_id].append (coord_atom);
		}
	}
	var atom_type_counts = dict ({});
	var pdb_metal_coordinations = Mol ();
	var metal_coordinations_labels = [];
	for (var metal_id of metal_coordinations.py_keys ()) {
		var atoms = metal_coordinations [metal_id];
		var metal_atom = atoms [0];
		var coord_atoms = atoms.__getslice__ (1, null, 1);
		pdb_metal_coordinations.add_new_atom (metal_atom.copy_of ());
		var coord_atoms_labels = [];
		for (var coord_atom of coord_atoms) {
			var list_metal_atom = [metal_atom.atom_type, coord_atom.atom_type];
			hashtable_entry_add_one (atom_type_counts, list_alphebetize_and_combine (list_metal_atom));
			pdb_metal_coordinations.add_new_atom (coord_atom.copy_of ());
			coord_atoms_labels.append (coord_atom.string_id ());
		}
		metal_coordinations_labels.append (tuple ([metal_atom.string_id (), coord_atoms_labels]));
	}
	return dict ({'counts': atom_type_counts, 'mol': pdb_metal_coordinations, 'labels': metal_coordinations_labels});
};

//# sourceMappingURL=binana.interactions._metal_coordination.map