// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-23 00:01:20
var binana = {};
var math = {};
var re = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {fabs} from './binana._utils.shim.js';
import * as shim from './binana._utils.shim.js';
import * as __module_binana__utils__ from './binana._utils.js';
__nest__ (binana, '_utils', __module_binana__utils__);
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
import {protein_resnames, to_deg, two_leter_atom_names} from './binana._structure.consts.js';
import {angle_between_three_points} from './binana._utils._math_functions.js';
import {r_just, round_to_thousandths_to_str} from './binana._utils.shim.js';
import {Point} from './binana._structure.point.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
var __name__ = 'binana._structure.atom';
export var Atom =  __class__ ('Atom', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.atom_name = '';
		self.residue = '';
		self.coordinates = Point (99999, 99999, 99999);
		self.element = '';
		self.pdb_index = '';
		self.all_atoms_index = -(1);
		self.line = '';
		self.atom_type = '';
		self.indecies_of_atoms_connecting = [];
		self.charge = 0;
		self.resid = 0;
		self.chain = '';
		self.structure = '';
		self.comment = '';
	});},
	get copy_of () {return __get__ (this, function (self) {
		var theatom = Atom ();
		theatom.atom_name = self.atom_name;
		theatom.residue = self.residue;
		theatom.coordinates = self.coordinates.copy_of ();
		theatom.element = self.element;
		theatom.pdb_index = self.pdb_index;
		theatom.line = self.line;
		theatom.atom_type = self.atom_type;
		theatom.indecies_of_atoms_connecting = self.indecies_of_atoms_connecting.__getslice__ (0, null, 1);
		theatom.charge = self.charge;
		theatom.resid = self.resid;
		theatom.chain = self.chain;
		theatom.structure = self.structure;
		theatom.comment = self.comment;
		theatom.all_atoms_index = self.all_atoms_index;
		return theatom;
	});},
	get string_id () {return __get__ (this, function (self) {
		var to_return = '';
		if (self.chain.strip () != '') {
			var to_return = (to_return + self.chain.strip ()) + ':';
		}
		var to_return = (((((((to_return + self.residue.strip ()) + '(') + str (self.resid)) + '):') + self.atom_name.strip ()) + '(') + str (self.pdb_index)) + ')';
		return to_return;
	});},
	get create_pdb_line () {return __get__ (this, function (self, index) {
		var output = 'ATOM ';
		var output = ((output + r_just (str (index), 6)) + r_just (self.atom_name, 5)) + r_just (self.residue, 4);
		output += r_just (round_to_thousandths_to_str (self.coordinates.x), 18);
		output += r_just (round_to_thousandths_to_str (self.coordinates.y), 8);
		output += r_just (round_to_thousandths_to_str (self.coordinates.z), 8);
		output += r_just (self.element, 24);
		return output;
	});},
	get number_of_neighbors () {return __get__ (this, function (self) {
		return len (self.indecies_of_atoms_connecting);
	});},
	get add_neighbor_atom_index () {return __get__ (this, function (self, index) {
		if (!__in__ (index, self.indecies_of_atoms_connecting)) {
			self.indecies_of_atoms_connecting.append (index);
		}
	});},
	get side_chain_or_backbone () {return __get__ (this, function (self) {
		if (__in__ (self.atom_name.strip (), ['CA', 'C', 'O', 'N'])) {
			return 'BACKBONE';
		}
		else {
			return 'SIDECHAIN';
		}
	});},
	get read_pdb_line () {return __get__ (this, function (self, line) {
		self.line = line;
		self.atom_name = line.__getslice__ (11, 16, 1).strip ();
		if (len (self.atom_name) == 1) {
			self.atom_name = self.atom_name + '  ';
		}
		else if (__in__ (len (self.atom_name), [2, 3])) {
			self.atom_name = self.atom_name + ' ';
		}
		self.coordinates = Point (float (line.__getslice__ (30, 38, 1)), float (line.__getslice__ (38, 46, 1)), float (line.__getslice__ (46, 54, 1)));
		self.atom_type = line.__getslice__ (76, 79, 1).strip ().upper ();
		self.charge = (line.__getslice__ (69, 76, 1).strip () != '' ? float (line.__getslice__ (69, 76, 1)) : 0.0);
		self.residue = line.__getslice__ (16, 20, 1);
		self.residue = ' ' + self.residue.__getslice__ (-(3), null, 1);
		if (self.element == '') {
			var element = line.__getslice__ (76, null, 1).strip ().upper ();
			if (element != '') {
				var two_letters = re.sub ('[^A-Z]', '', element).__getslice__ (0, 2, 1);
			}
			else {
				var two_letters = self.atom_name.__getslice__ (0, 2, 1).strip ().upper ();
			}
			if (__in__ (two_letters, two_leter_atom_names) && !__in__ (self.residue.__getslice__ (-(3), null, 1), protein_resnames)) {
				self.element = two_letters;
			}
			else {
				self.element = self.atom_name;
				self.element = self.element.py_replace ('0', '');
				self.element = self.element.py_replace ('1', '');
				self.element = self.element.py_replace ('2', '');
				self.element = self.element.py_replace ('3', '');
				self.element = self.element.py_replace ('4', '');
				self.element = self.element.py_replace ('5', '');
				self.element = self.element.py_replace ('6', '');
				self.element = self.element.py_replace ('7', '');
				self.element = self.element.py_replace ('8', '');
				self.element = self.element.py_replace ('9', '');
				self.element = self.element.py_replace ('@', '');
				self.element = self.element.__getslice__ (0, 1, 1).strip ().upper ();
			}
		}
		self.pdb_index = line.__getslice__ (6, 12, 1).strip ();
		try {
			self.resid = int (line.__getslice__ (23, 26, 1));
		}
		catch (__except0__) {
			// pass;
		}
		self.chain = line.__getslice__ (21, 22, 1);
		if (self.chain == ' ') {
			self.chain = 'X';
		}
		if (self.residue.strip () == '') {
			self.residue = ' MOL';
		}
	});},
	get _has_sp3_geometry_if_protein () {return __get__ (this, function (self, resname) {
		var atomname = self.atom_name.strip ();
		if (__in__ (atomname, ['C', 'O', 'N'])) {
			return false;
		}
		if (resname == 'ARG') {
			if (__in__ (atomname, ['NE', 'NH1', 'NH2'])) {
				return false;
			}
		}
		else if (resname == 'ASN') {
			if (__in__ (atomname, ['CG', 'OD1', 'ND2'])) {
				return false;
			}
		}
		else if (resname == 'ASP') {
			if (__in__ (atomname, ['CG', 'OD1'])) {
				return false;
			}
		}
		else if (resname == 'GLN') {
			if (__in__ (atomname, ['CD', 'OE1', 'NE2'])) {
				return false;
			}
		}
		else if (resname == 'GLU') {
			if (__in__ (atomname, ['CD', 'OE1'])) {
				return false;
			}
		}
		else if (resname == 'HIS') {
			if (__in__ (atomname, ['CG', 'CD2', 'NE2', 'CE1', 'ND1'])) {
				return false;
			}
		}
		else if (__in__ (resname, ['PHE', 'TYR'])) {
			if (__in__ (atomname, ['CE1', 'CZ', 'CE2', 'CD2', 'CG', 'CD1'])) {
				return false;
			}
		}
		else if (resname == 'TRP') {
			if (__in__ (atomname, ['CG', 'CD1', 'NE1', 'CE2', 'CD2', 'CE3', 'CZ2', 'CZ3', 'CH2'])) {
				return false;
			}
		}
		return true;
	});},
	get has_sp3_geometry () {return __get__ (this, function (self, parent_mol) {
		var resname = self.residue.__getslice__ (-(3), null, 1);
		if (__in__ (resname, protein_resnames)) {
			return self._has_sp3_geometry_if_protein (resname);
		}
		var ncrs = (function () {
			var __accu0__ = [];
			for (var i of self.indecies_of_atoms_connecting) {
				__accu0__.append (parent_mol.all_atoms [i].coordinates);
			}
			return __accu0__;
		}) ();
		var ncrs_len = len (ncrs);
		if (ncrs_len <= 1) {
			return true;
		}
		var ccr = self.coordinates;
		var angles = [angle_between_three_points (ncrs [0], ccr, ncrs [1]) * to_deg];
		if (ncrs_len > 2) {
			angles.append (angle_between_three_points (ncrs [0], ccr, ncrs [2]) * to_deg);
			angles.append (angle_between_three_points (ncrs [1], ccr, ncrs [2]) * to_deg);
		}
		if (ncrs_len > 3) {
			angles.append (angle_between_three_points (ncrs [0], ccr, ncrs [3]) * to_deg);
			angles.append (angle_between_three_points (ncrs [1], ccr, ncrs [3]) * to_deg);
			angles.append (angle_between_three_points (ncrs [2], ccr, ncrs [3]) * to_deg);
		}
		var average_angle = sum (angles) / float (len (angles));
		return fabs (average_angle - 109.0) < 5.0;
	});},
	get belongs_to_protein () {return __get__ (this, function (self) {
		return __in__ (self.residue.__getslice__ (-(3), null, 1), protein_resnames);
	});}
});

//# sourceMappingURL=binana._structure.atom.map