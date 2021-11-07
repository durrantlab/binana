// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-05 16:24:09
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {r_just, round_to_thousandths_to_str} from './binana._utils.shim.js';
import {Point} from './binana._structure.point.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
var __name__ = 'binana._structure.atom';
export var Atom =  __class__ ('Atom', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.atom_name = '';
		self.residue = '';
		self.coordinates = Point (99999, 99999, 99999);
		self.element = '';
		self.pdb_index = '';
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
		var output = output + r_just (round_to_thousandths_to_str (self.coordinates.x), 18);
		var output = output + r_just (round_to_thousandths_to_str (self.coordinates.y), 8);
		var output = output + r_just (round_to_thousandths_to_str (self.coordinates.z), 8);
		var output = output + r_just (self.element, 24);
		return output;
	});},
	get number_of_neighbors () {return __get__ (this, function (self) {
		return len (self.indecies_of_atoms_connecting);
	});},
	get add_neighbor_atom_index () {return __get__ (this, function (self, index) {
		if (!(__in__ (index, self.indecies_of_atoms_connecting))) {
			self.indecies_of_atoms_connecting.append (index);
		}
	});},
	get side_chain_or_backbone () {return __get__ (this, function (self) {
		if (self.atom_name.strip () == 'CA' || self.atom_name.strip () == 'C' || self.atom_name.strip () == 'O' || self.atom_name.strip () == 'N') {
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
		else if (len (self.atom_name) == 2) {
			self.atom_name = self.atom_name + ' ';
		}
		else if (len (self.atom_name) == 3) {
			self.atom_name = self.atom_name + ' ';
		}
		self.coordinates = Point (float (line.__getslice__ (30, 38, 1)), float (line.__getslice__ (38, 46, 1)), float (line.__getslice__ (46, 54, 1)));
		self.atom_type = line.__getslice__ (77, 79, 1).strip ().upper ();
		if (line.__getslice__ (69, 76, 1).strip () != '') {
			self.charge = float (line.__getslice__ (69, 76, 1));
		}
		else {
			self.charge = 0.0;
		}
		if (self.element == '') {
			var two_letters = self.atom_name.__getslice__ (0, 2, 1).strip ().upper ();
			if (two_letters == 'BR') {
				self.element = 'BR';
			}
			else if (two_letters == 'CL') {
				self.element = 'CL';
			}
			else if (two_letters == 'BI') {
				self.element = 'BI';
			}
			else if (two_letters == 'AS') {
				self.element = 'AS';
			}
			else if (two_letters == 'AG') {
				self.element = 'AG';
			}
			else if (two_letters == 'LI') {
				self.element = 'LI';
			}
			else if (two_letters == 'MG') {
				self.element = 'MG';
			}
			else if (two_letters == 'MN') {
				self.element = 'MN';
			}
			else if (two_letters == 'RH') {
				self.element = 'RH';
			}
			else if (two_letters == 'ZN') {
				self.element = 'ZN';
			}
			else if (two_letters == 'FE') {
				self.element = 'FE';
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
		self.residue = line.__getslice__ (16, 20, 1);
		self.residue = ' ' + self.residue.__getslice__ (-(3), null, 1);
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
	});}
});

//# sourceMappingURL=binana._structure.atom.map