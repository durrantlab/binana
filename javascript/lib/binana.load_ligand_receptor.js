// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-12 01:16:44
var binana = {};
var math = {};
var time = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_time__ from './time.js';
__nest__ (time, '', __module_time__);
import * as _math_functions from './binana._utils._math_functions.js';
import {Mol as _Mol} from './binana._structure.mol.js';
import {Point as _Point} from './binana._structure.point.js';
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
export {_Mol, _Point, _math_functions};
var __name__ = 'binana.load_ligand_receptor';
export var _ligand_receptor_dists_cache = dict ({});
export var _ligand_receptor_aromatic_dists = null;
export var from_texts = function (ligand_text, receptor_text) {
	var ligand = _Mol ();
	ligand.load_pdb_from_text (ligand_text);
	var receptor = _Mol ();
	receptor.load_pdb_from_text (receptor_text);
	receptor.assign_secondary_structure ();
	_clear_cache ();
	return tuple ([ligand, receptor]);
};
export var from_files = function (ligand_filename, receptor_filename) {
	var ligand = _Mol ();
	ligand.load_pdb_file (ligand_filename);
	var receptor = _Mol ();
	receptor.load_pdb_file (receptor_filename);
	receptor.assign_secondary_structure ();
	_clear_cache ();
	return tuple ([ligand, receptor]);
};
export var _clear_cache = function () {
	_ligand_receptor_dists_cache = dict ({});
	_ligand_receptor_aromatic_dists = null;
};
export var cum_time = 0;
export var _get_ligand_receptor_dists = function (ligand, receptor, max_dist) {
	var t1 = time.time ();
	var ligand_receptor_dists = [];
	var max_dist_sqr = max_dist * max_dist;
	var ligand_all_atoms = ligand.all_atoms;
	var receptor_all_atoms = receptor.all_atoms;
	var ligand_atom_indexes = ligand_all_atoms.py_keys ();
	var receptor_atom_indexes = receptor_all_atoms.py_keys ();
	var sqrt_func = math.sqrt;
	for (var ligand_atom_index of ligand_atom_indexes) {
		var ligand_atom = ligand_all_atoms [ligand_atom_index];
		var ligand_coor = ligand_atom.coordinates;
		for (var receptor_atom_index of receptor_atom_indexes) {
			var receptor_atom = receptor_all_atoms [receptor_atom_index];
			var receptor_coor = receptor_atom.coordinates;
			var delta_x = receptor_coor.x - ligand_coor.x;
			var summed = delta_x * delta_x;
			if (summed > max_dist_sqr) {
				continue;
			}
			var delta_y = receptor_coor.y - ligand_coor.y;
			summed += delta_y * delta_y;
			if (summed > max_dist_sqr) {
				continue;
			}
			var delta_z = receptor_coor.z - ligand_coor.z;
			summed += delta_z * delta_z;
			if (summed > max_dist_sqr) {
				continue;
			}
			var dist = sqrt_func (summed);
			var val = tuple ([ligand_atom, receptor_atom, dist]);
			ligand_receptor_dists.append (val);
		}
	}
	cum_time += time.time () - t1;
	print (cum_time);
	return ligand_receptor_dists;
};
export var _get_ligand_receptor_aromatic_dists = function (ligand, receptor, pi_pi_general_dist_cutoff) {
	if (_ligand_receptor_aromatic_dists !== null) {
		return _ligand_receptor_aromatic_dists;
	}
	_ligand_receptor_aromatic_dists = [];
	for (var ligand_aromatic of ligand.aromatic_rings) {
		for (var receptor_aromatic of receptor.aromatic_rings) {
			var dist = ligand_aromatic.center.dist_to (receptor_aromatic.center);
			if (dist < pi_pi_general_dist_cutoff) {
				var ligand_aromatic_norm_vector = _Point (ligand_aromatic.plane_coeff [0], ligand_aromatic.plane_coeff [1], ligand_aromatic.plane_coeff [2]);
				var receptor_aromatic_norm_vector = _Point (receptor_aromatic.plane_coeff [0], receptor_aromatic.plane_coeff [1], receptor_aromatic.plane_coeff [2]);
				var angle_between_planes = (_math_functions.angle_between_points (ligand_aromatic_norm_vector, receptor_aromatic_norm_vector) * 180.0) / math.pi;
				_ligand_receptor_aromatic_dists.append (tuple ([ligand_aromatic, receptor_aromatic, dist, angle_between_planes]));
			}
		}
	}
	return _ligand_receptor_aromatic_dists;
};

//# sourceMappingURL=binana.load_ligand_receptor.map