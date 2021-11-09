// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-09 00:25:33
var binana = {};
var math = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {OpenFile as openFile} from './binana._utils.shim.js';
import {fabs} from './binana._utils.shim.js';
import * as shim from './binana._utils.shim.js';
import * as __module_binana__utils__ from './binana._utils.js';
__nest__ (binana, '_utils', __module_binana__utils__);
import {_set_default} from './binana._utils.shim.js';
import {cross_product, dihedral, distance, vector_subtraction} from './binana._utils._math_functions.js';
import {Atom} from './binana._structure.atom.js';
import {Point} from './binana._structure.point.js';
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
var __name__ = 'binana._structure.mol';
export var textwrap = shim;
export var _max_donor_X_dist = dict ({'H': 1.3, 'I': 2.04 * 1.4, 'BR': 1.86 * 1.4, 'Br': 1.86 * 1.4, 'CL': 1.71 * 1.4, 'Cl': 1.71 * 1.4, 'F': 1.33 * 1.4});
export var Mol =  __class__ ('Mol', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.all_atoms = dict ({});
		self.non_protein_atoms = dict ({});
		self.max_x = -(9999.99);
		self.min_x = 9999.99;
		self.max_y = -(9999.99);
		self.min_y = 9999.99;
		self.max_z = -(9999.99);
		self.min_z = 9999.99;
		self.rotatable_bonds_count = -(1);
		self.protein_resnames = ['ALA', 'ARG', 'ASN', 'ASP', 'ASH', 'ASX', 'CYS', 'CYM', 'CYX', 'GLN', 'GLU', 'GLH', 'GLX', 'GLY', 'HIS', 'HID', 'HIE', 'HIP', 'ILE', 'LEU', 'LYS', 'LYN', 'MET', 'PHE', 'PRO', 'SER', 'THR', 'TRP', 'TYR', 'VAL'];
		self.aromatic_rings = [];
		self.charges = [];
		self.has_hydrogens = false;
	});},
	get load_pdb_from_text () {return __get__ (this, function (self, text_content, filename_to_use, min_x, max_x, min_y, max_y, min_z, max_z) {
		if (typeof filename_to_use == 'undefined' || (filename_to_use != null && filename_to_use.hasOwnProperty ("__kwargtrans__"))) {;
			var filename_to_use = null;
		};
		if (typeof min_x == 'undefined' || (min_x != null && min_x.hasOwnProperty ("__kwargtrans__"))) {;
			var min_x = null;
		};
		if (typeof max_x == 'undefined' || (max_x != null && max_x.hasOwnProperty ("__kwargtrans__"))) {;
			var max_x = null;
		};
		if (typeof min_y == 'undefined' || (min_y != null && min_y.hasOwnProperty ("__kwargtrans__"))) {;
			var min_y = null;
		};
		if (typeof max_y == 'undefined' || (max_y != null && max_y.hasOwnProperty ("__kwargtrans__"))) {;
			var max_y = null;
		};
		if (typeof min_z == 'undefined' || (min_z != null && min_z.hasOwnProperty ("__kwargtrans__"))) {;
			var min_z = null;
		};
		if (typeof max_z == 'undefined' || (max_z != null && max_z.hasOwnProperty ("__kwargtrans__"))) {;
			var max_z = null;
		};
		var filename_to_use = _set_default (filename_to_use, 'NO_FILE');
		var min_x = _set_default (min_x, -(9999.99));
		var max_x = _set_default (max_x, 9999.99);
		var min_y = _set_default (min_y, -(9999.99));
		var max_y = _set_default (max_y, 9999.99);
		var min_z = _set_default (min_z, -(9999.99));
		var max_z = _set_default (max_z, 9999.99);
		let lines = text_content.split("\n");
		var autoindex = 1;
		self.__init__ ();
		self.filename = filename_to_use;
		var atom_already_loaded = [];
		for (var t = 0; t < len (lines); t++) {
			var line = lines [t];
			if (line.__getslice__ (0, 3, 1) == 'END' && line.__getslice__ (0, 7, 1) != 'ENDROOT' && line.__getslice__ (0, 9, 1) != 'ENDBRANCH') {
				var t = textwrap.wrap (('WARNING: END or ENDMDL term found in ' + filename_to_use) + '. Everything after the first instance of this term will be ignored.                     If any of your PDBQT files have multiple frames/poses, please partition them                     into separate files using vina_split and feed each of the the single-frame files into Binana separately.', 80);
				print ('\n'.join (t) + '\n');
				print (line);
				break;
			}
			if (__in__ ('between atoms', line) && __in__ (' A ', line)) {
				if (self.rotatable_bonds_count == -(1)) {
					self.rotatable_bonds_count = 0;
				}
				self.rotatable_bonds_count = self.rotatable_bonds_count + 1;
			}
			if (len (line) >= 7 && (line.__getslice__ (0, 4, 1) == 'ATOM' || line.__getslice__ (0, 6, 1) == 'HETATM')) {
				var temp_atom = Atom ();
				temp_atom.read_pdb_line (line);
				if (temp_atom.element == 'H') {
					self.has_hydrogens = true;
				}
				if (temp_atom.coordinates.x > min_x && temp_atom.coordinates.x < max_x && temp_atom.coordinates.y > min_y && temp_atom.coordinates.y < max_y && temp_atom.coordinates.z > min_z && temp_atom.coordinates.z < max_z) {
					self.max_x = max (self.max_x, temp_atom.coordinates.x);
					self.max_y = max (self.max_y, temp_atom.coordinates.y);
					self.max_z = max (self.max_z, temp_atom.coordinates.z);
					self.min_x = min (self.min_x, temp_atom.coordinates.x);
					self.min_y = min (self.min_y, temp_atom.coordinates.y);
					self.min_z = min (self.min_z, temp_atom.coordinates.z);
					var key = (((((temp_atom.atom_name.strip () + '_') + str (temp_atom.resid)) + '_') + temp_atom.residue.strip ()) + '_') + temp_atom.chain.strip ();
					if (__in__ (key, atom_already_loaded) && __in__ (temp_atom.residue.strip (), self.protein_resnames)) {
						self.printout (('Warning: Duplicate protein atom detected: "' + temp_atom.line.strip ()) + '". Not loading this duplicate.');
						print ('');
					}
					if (!__in__ (key, atom_already_loaded) || !__in__ (temp_atom.residue.strip (), self.protein_resnames)) {
						atom_already_loaded.append (key);
						self.all_atoms [autoindex] = temp_atom;
						if (!__in__ (temp_atom.residue.__getslice__ (-(3), null, 1), self.protein_resnames)) {
							self.non_protein_atoms [autoindex] = temp_atom;
						}
						autoindex++;
					}
				}
			}
		}
		self.check_protein_format ();
		self.create_bonds_by_distance ();
		self.assign_aromatic_rings ();
		self.assign_charges ();
		if (!(self.has_hydrogens)) {
			self.printout ('WARNING: Detected molecule with no hydrogen atoms. Did you forget to add them? Adding hydrogen atoms improves salt-bridge and hydrogen-bond detection.');
			print ('');
		}
	});},
	get load_pdb_file () {return __get__ (this, function (self, filename, min_x, max_x, min_y, max_y, min_z, max_z) {
		if (typeof min_x == 'undefined' || (min_x != null && min_x.hasOwnProperty ("__kwargtrans__"))) {;
			var min_x = null;
		};
		if (typeof max_x == 'undefined' || (max_x != null && max_x.hasOwnProperty ("__kwargtrans__"))) {;
			var max_x = null;
		};
		if (typeof min_y == 'undefined' || (min_y != null && min_y.hasOwnProperty ("__kwargtrans__"))) {;
			var min_y = null;
		};
		if (typeof max_y == 'undefined' || (max_y != null && max_y.hasOwnProperty ("__kwargtrans__"))) {;
			var max_y = null;
		};
		if (typeof min_z == 'undefined' || (min_z != null && min_z.hasOwnProperty ("__kwargtrans__"))) {;
			var min_z = null;
		};
		if (typeof max_z == 'undefined' || (max_z != null && max_z.hasOwnProperty ("__kwargtrans__"))) {;
			var max_z = null;
		};
		var min_x = _set_default (min_x, -(9999.99));
		var max_x = _set_default (max_x, 9999.99);
		var min_y = _set_default (min_y, -(9999.99));
		var max_y = _set_default (max_y, 9999.99);
		var min_z = _set_default (min_z, -(9999.99));
		var max_z = _set_default (max_z, 9999.99);
		var file = openFile (filename, 'r');
		var text_content = file.read ();
		file.close ();
		self.load_pdb_from_text (text_content, filename, min_x, max_x, min_y, max_y, min_z, max_z);
	});},
	get printout () {return __get__ (this, function (self, the_string) {
		var lines = textwrap.wrap (the_string, 80);
		for (var line of lines) {
			print (line);
		}
	});},
	get save_pdb () {return __get__ (this, function (self, file_name) {
		var f = openFile (file_name, 'w');
		var towrite = self.save_pdb_string ();
		if (towrite.strip () == '') {
			var towrite = 'ATOM      1  X   XXX             0.000   0.000   0.000                       X';
		}
		f.write (towrite);
		f.close ();
	});},
	get save_pdb_string () {return __get__ (this, function (self) {
		return ''.join ((function () {
			var __accu0__ = [];
			for (var atom_index of self.all_atoms.py_keys ()) {
				__accu0__.append (self.all_atoms [atom_index].create_pdb_line (atom_index) + '\n');
			}
			return py_iter (__accu0__);
		}) ());
	});},
	get add_new_atom () {return __get__ (this, function (self, atom) {
		var t = 1;
		var all_atom_keys = list (self.all_atoms.py_keys ());
		var all_atom_keys = (function () {
			var __accu0__ = [];
			for (var k of all_atom_keys) {
				__accu0__.append (int (k));
			}
			return __accu0__;
		}) ();
		while (__in__ (t, all_atom_keys)) {
			t++;
		}
		self.all_atoms [t] = atom;
	});},
	get set_resname () {return __get__ (this, function (self, resname) {
		for (var atom_index of self.all_atoms.py_keys ()) {
			self.all_atoms [atom_index].residue = resname;
		}
	});},
	get connected_atoms_of_element () {return __get__ (this, function (self, index, connected_atom_element) {
		var atom = self.all_atoms [index];
		var connected_atoms = [];
		for (var index2 of atom.indecies_of_atoms_connecting) {
			var atom2 = self.all_atoms [index2];
			if (atom2.element == connected_atom_element) {
				connected_atoms.append (index2);
			}
		}
		return connected_atoms;
	});},
	get connected_heavy_atoms () {return __get__ (this, function (self, index) {
		var atom = self.all_atoms [index];
		var connected_atoms = [];
		for (var index2 of atom.indecies_of_atoms_connecting) {
			var atom2 = self.all_atoms [index2];
			if (atom2.element != 'H') {
				connected_atoms.append (index2);
			}
		}
		return connected_atoms;
	});},
	get check_protein_format () {return __get__ (this, function (self) {
		var curr_res = '';
		var first = true;
		var residue = [];
		var last_key = '';
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			var key = (((atom.residue + '_') + str (atom.resid)) + '_') + atom.chain;
			if (first) {
				var curr_res = key;
				var first = false;
			}
			if (key != curr_res) {
				self.check_protein_format_process_residue (residue, last_key);
				var residue = [];
				var curr_res = key;
			}
			residue.append (atom.atom_name.strip ());
			var last_key = key;
		}
		self.check_protein_format_process_residue (residue, last_key);
	});},
	get warn_bad_atom_name () {return __get__ (this, function (self, py_name, residue) {
		self.printout (((('Warning: There is no atom named "' + py_name) + '" in the protein residue ') + residue) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine secondary structure. If this residue is far from the active site, this warning may not affect the NNScore.');
		print ('');
	});},
	get check_protein_format_process_residue () {return __get__ (this, function (self, residue, last_key) {
		var temp = last_key.strip ().py_split ('_');
		var resname = temp [0];
		var real_resname = resname.__getslice__ (-(3), null, 1);
		if (__in__ (real_resname, self.protein_resnames)) {
			if (!__in__ ('N', residue)) {
				self.warn_bad_atom_name ('N', last_key);
			}
			if (!__in__ ('C', residue)) {
				self.warn_bad_atom_name ('C', last_key);
			}
			if (!__in__ ('CA', residue)) {
				self.warn_bad_atom_name ('CA', last_key);
			}
			if (__in__ (real_resname, ['GLU', 'GLH', 'GLX'])) {
				if (!__in__ ('OE1', residue)) {
					self.warn_bad_atom_name ('OE1', last_key);
				}
				if (!__in__ ('OE2', residue)) {
					self.warn_bad_atom_name ('OE2', last_key);
				}
			}
			if (__in__ (real_resname, ['ASP', 'ASH', 'ASX'])) {
				if (!__in__ ('OD1', residue)) {
					self.warn_bad_atom_name ('OD1', last_key);
				}
				if (!__in__ ('OD2', residue)) {
					self.warn_bad_atom_name ('OD2', last_key);
				}
			}
			if (__in__ (real_resname, ['LYS', 'LYN']) && !__in__ ('NZ', residue)) {
				self.warn_bad_atom_name ('NZ', last_key);
			}
			if (real_resname == 'ARG') {
				if (!__in__ ('NH1', residue)) {
					self.warn_bad_atom_name ('NH1', last_key);
				}
				if (!__in__ ('NH2', residue)) {
					self.warn_bad_atom_name ('NH2', last_key);
				}
			}
			if (__in__ (real_resname, ['HIS', 'HID', 'HIE', 'HIP'])) {
				if (!__in__ ('NE2', residue)) {
					self.warn_bad_atom_name ('NE2', last_key);
				}
				if (!__in__ ('ND1', residue)) {
					self.warn_bad_atom_name ('ND1', last_key);
				}
			}
			if (real_resname == 'PHE') {
				if (!__in__ ('CG', residue)) {
					self.warn_bad_atom_name ('CG', last_key);
				}
				if (!__in__ ('CD1', residue)) {
					self.warn_bad_atom_name ('CD1', last_key);
				}
				if (!__in__ ('CD2', residue)) {
					self.warn_bad_atom_name ('CD2', last_key);
				}
				if (!__in__ ('CE1', residue)) {
					self.warn_bad_atom_name ('CE1', last_key);
				}
				if (!__in__ ('CE2', residue)) {
					self.warn_bad_atom_name ('CE2', last_key);
				}
				if (!__in__ ('CZ', residue)) {
					self.warn_bad_atom_name ('CZ', last_key);
				}
			}
			if (real_resname == 'TYR') {
				if (!__in__ ('CG', residue)) {
					self.warn_bad_atom_name ('CG', last_key);
				}
				if (!__in__ ('CD1', residue)) {
					self.warn_bad_atom_name ('CD1', last_key);
				}
				if (!__in__ ('CD2', residue)) {
					self.warn_bad_atom_name ('CD2', last_key);
				}
				if (!__in__ ('CE1', residue)) {
					self.warn_bad_atom_name ('CE1', last_key);
				}
				if (!__in__ ('CE2', residue)) {
					self.warn_bad_atom_name ('CE2', last_key);
				}
				if (!__in__ ('CZ', residue)) {
					self.warn_bad_atom_name ('CZ', last_key);
				}
			}
			if (real_resname == 'TRP') {
				if (!__in__ ('CG', residue)) {
					self.warn_bad_atom_name ('CG', last_key);
				}
				if (!__in__ ('CD1', residue)) {
					self.warn_bad_atom_name ('CD1', last_key);
				}
				if (!__in__ ('CD2', residue)) {
					self.warn_bad_atom_name ('CD2', last_key);
				}
				if (!__in__ ('NE1', residue)) {
					self.warn_bad_atom_name ('NE1', last_key);
				}
				if (!__in__ ('CE2', residue)) {
					self.warn_bad_atom_name ('CE2', last_key);
				}
				if (!__in__ ('CE3', residue)) {
					self.warn_bad_atom_name ('CE3', last_key);
				}
				if (!__in__ ('CZ2', residue)) {
					self.warn_bad_atom_name ('CZ2', last_key);
				}
				if (!__in__ ('CZ3', residue)) {
					self.warn_bad_atom_name ('CZ3', last_key);
				}
				if (!__in__ ('CH2', residue)) {
					self.warn_bad_atom_name ('CH2', last_key);
				}
			}
			if (__in__ (real_resname, ['HIS', 'HID', 'HIE', 'HIP'])) {
				if (!__in__ ('CG', residue)) {
					self.warn_bad_atom_name ('CG', last_key);
				}
				if (!__in__ ('ND1', residue)) {
					self.warn_bad_atom_name ('ND1', last_key);
				}
				if (!__in__ ('CD2', residue)) {
					self.warn_bad_atom_name ('CD2', last_key);
				}
				if (!__in__ ('CE1', residue)) {
					self.warn_bad_atom_name ('CE1', last_key);
				}
				if (!__in__ ('NE2', residue)) {
					self.warn_bad_atom_name ('NE2', last_key);
				}
			}
		}
	});},
	get create_bonds_by_distance () {return __get__ (this, function (self) {
		for (var atom_index1 of self.non_protein_atoms.py_keys ()) {
			var atom1 = self.non_protein_atoms [atom_index1];
			if (!__in__ (atom1.residue.__getslice__ (-(3), null, 1), self.protein_resnames)) {
				for (var atom_index2 of self.non_protein_atoms.py_keys ()) {
					if (atom_index1 != atom_index2) {
						var atom2 = self.non_protein_atoms [atom_index2];
						if (!__in__ (atom2.residue.__getslice__ (-(3), null, 1), self.protein_resnames)) {
							var dist = distance (atom1.coordinates, atom2.coordinates);
							if (dist < self.bond_length (atom1.element, atom2.element) * 1.2) {
								atom1.add_neighbor_atom_index (atom_index2);
								atom2.add_neighbor_atom_index (atom_index1);
							}
						}
					}
				}
			}
		}
	});},
	get update_distance () {return __get__ (this, function (self, element1, element2, orig_distance, match) {
		var __left0__ = match;
		var match_element1 = __left0__ [0];
		var match_element2 = __left0__ [1];
		var match_dist = __left0__ [2];
		if (element1 == match_element1 && element2 == match_element2) {
			return match_dist;
		}
		if (element1 == match_element2 && element2 == match_element1) {
			return match_dist;
		}
		return orig_distance;
	});},
	get bond_length () {return __get__ (this, function (self, element1, element2) {
		var distance = 0.0;
		var distance = self.update_distance (element1, element2, distance, ['C', 'C', 1.53]);
		var distance = self.update_distance (element1, element2, distance, ['N', 'N', 1.425]);
		var distance = self.update_distance (element1, element2, distance, ['O', 'O', 1.469]);
		var distance = self.update_distance (element1, element2, distance, ['S', 'S', 2.048]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'SI', 2.359]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'H', 1.059]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'N', 1.469]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'O', 1.413]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'S', 1.819]);
		var distance = self.update_distance (element1, element2, distance, ['N', 'H', 1.009]);
		var distance = self.update_distance (element1, element2, distance, ['N', 'O', 1.463]);
		var distance = self.update_distance (element1, element2, distance, ['O', 'S', 1.577]);
		var distance = self.update_distance (element1, element2, distance, ['O', 'H', 0.967]);
		var distance = self.update_distance (element1, element2, distance, ['S', 'H', 2.025 / 1.5]);
		var distance = self.update_distance (element1, element2, distance, ['S', 'N', 1.633]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'F', 1.399]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'CL', 1.79]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'BR', 1.91]);
		var distance = self.update_distance (element1, element2, distance, ['C', 'I', 2.162]);
		var distance = self.update_distance (element1, element2, distance, ['S', 'BR', 2.321]);
		var distance = self.update_distance (element1, element2, distance, ['S', 'CL', 2.283]);
		var distance = self.update_distance (element1, element2, distance, ['S', 'F', 1.64]);
		var distance = self.update_distance (element1, element2, distance, ['S', 'I', 2.687]);
		var distance = self.update_distance (element1, element2, distance, ['P', 'BR', 2.366]);
		var distance = self.update_distance (element1, element2, distance, ['P', 'CL', 2.008]);
		var distance = self.update_distance (element1, element2, distance, ['P', 'F', 1.495]);
		var distance = self.update_distance (element1, element2, distance, ['P', 'I', 2.49]);
		var distance = self.update_distance (element1, element2, distance, ['P', 'O', 1.6]);
		var distance = self.update_distance (element1, element2, distance, ['N', 'BR', 1.843]);
		var distance = self.update_distance (element1, element2, distance, ['N', 'CL', 1.743]);
		var distance = self.update_distance (element1, element2, distance, ['N', 'F', 1.406]);
		var distance = self.update_distance (element1, element2, distance, ['N', 'I', 2.2]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'BR', 2.284]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'CL', 2.072]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'F', 1.636]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'P', 2.264]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'S', 2.145]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'C', 1.888]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'N', 1.743]);
		var distance = self.update_distance (element1, element2, distance, ['SI', 'O', 1.631]);
		return distance;
	});},
	get _categorize_donor_acceptor_with_hydrogens () {return __get__ (this, function (self, atom, hydrogen_bond) {
		if (typeof hydrogen_bond == 'undefined' || (hydrogen_bond != null && hydrogen_bond.hasOwnProperty ("__kwargtrans__"))) {;
			var hydrogen_bond = true;
		};
		var central_atom_names = (hydrogen_bond ? ['H'] : ['I', 'BR', 'Br', 'CL', 'Cl', 'F']);
		var h_or_hals = [];
		for (var atm_index of self.all_atoms.py_keys ()) {
			var central_atom = self.all_atoms [atm_index];
			var element = central_atom.element;
			if (__in__ (element, central_atom_names)) {
				var dist = central_atom.coordinates.dist_to (atom.coordinates);
				if (dist < _max_donor_X_dist [element]) {
					h_or_hals.append (central_atom);
				}
			}
		}
		var charaterizations = [['ACCEPTOR', null]];
		for (var h_or_hal of h_or_hals) {
			charaterizations.append (['DONOR', h_or_hal]);
		}
		return charaterizations;
	});},
	get _categorize_donor_acceptor_without_hydrogens () {return __get__ (this, function (self, atom) {
		var charaterizations = [];
		var num_neighbors = atom.number_of_neighbors ();
		if (atom.element == 'O') {
			charaterizations.append (['ACCEPTOR', null]);
			if (num_neighbors == 1) {
				var neighbor_idx = atom.indecies_of_atoms_connecting [0];
				var neighbor = self.all_atoms [neighbor_idx];
				var neighbor_is_sp3 = neighbor.has_sp3_geometry (self);
				if (neighbor.element == 'C' && neighbor_is_sp3) {
					charaterizations.append (['DONOR', atom]);
				}
			}
		}
		else if (atom.element == 'N') {
			charaterizations.append (['ACCEPTOR', null]);
			var num_neighbors = len (atom.indecies_of_atoms_connecting);
			var is_sp3 = (num_neighbors > 1 ? atom.has_sp3_geometry (self) : true);
			if (is_sp3 && num_neighbors < 4 || !(is_sp3) && num_neighbors < 3) {
				charaterizations.append (['DONOR', atom]);
			}
		}
		return charaterizations;
	});},
	get is_hbond_donor_acceptor () {return __get__ (this, function (self, atom, hydrogen_bond) {
		if (typeof hydrogen_bond == 'undefined' || (hydrogen_bond != null && hydrogen_bond.hasOwnProperty ("__kwargtrans__"))) {;
			var hydrogen_bond = true;
		};
		if (!(hydrogen_bond) || self.has_hydrogens) {
			return self._categorize_donor_acceptor_with_hydrogens (atom, hydrogen_bond);
		}
		else {
			return self._categorize_donor_acceptor_without_hydrogens (atom);
		}
	});},
	get charges_metals () {return __get__ (this, function (self, atom_index, atom) {
		if (__in__ (atom.element, ['MG', 'MN', 'RH', 'ZN', 'FE', 'BI', 'AS', 'AG'])) {
			var chrg = self.Charged (atom.coordinates, [atom_index], true);
			self.charges.append (chrg);
		}
	});},
	get charges_arginine_like () {return __get__ (this, function (self, atom_index, atom) {
		if (atom.element != 'C' || atom.number_of_neighbors () != 3) {
			return ;
		}
		var nitrogens = self.connected_atoms_of_element (atom_index, 'N');
		if (len (nitrogens) >= 2) {
			var nitros_to_use = [];
			var no_term_nitros = atom.indecies_of_atoms_connecting.__getslice__ (0, null, 1);
			for (var atmindex of nitrogens) {
				if (len (self.connected_heavy_atoms (atmindex)) == 1) {
					nitros_to_use.append (atmindex);
					no_term_nitros.remove (atmindex);
				}
			}
			var no_term_nitro_idx = (len (no_term_nitros) > 0 ? no_term_nitros [0] : -(1));
			if (len (nitros_to_use) == 2 && no_term_nitro_idx != -(1)) {
				var no_term_atm = self.all_atoms [no_term_nitro_idx];
				var no_term_elem = no_term_atm.element;
				var no_term_neigh = no_term_atm.number_of_neighbors ();
				if (!(self.has_hydrogens) || (no_term_elem == 'C' && no_term_neigh == 4 || no_term_elem == 'O' && no_term_neigh == 2 || __in__ (no_term_elem, ['N', 'S', 'P']))) {
					var pt = self.all_atoms [nitros_to_use [0]].coordinates.copy_of ();
					var coor_to_use2 = self.all_atoms [nitros_to_use [1]].coordinates;
					pt.x = pt.x + coor_to_use2.x;
					pt.y = pt.y + coor_to_use2.y;
					pt.z = pt.z + coor_to_use2.z;
					pt.x = pt.x / 2.0;
					pt.y = pt.y / 2.0;
					pt.z = pt.z / 2.0;
					var indexes = [atom_index];
					indexes.extend (nitros_to_use);
					indexes.extend (self.connected_atoms_of_element (nitros_to_use [0], 'H'));
					indexes.extend (self.connected_atoms_of_element (nitros_to_use [1], 'H'));
					var chrg = self.Charged (pt, indexes, true);
					self.charges.append (chrg);
				}
			}
		}
	});},
	get charges_amines () {return __get__ (this, function (self, atom_index, atom) {
		if (atom.element != 'N') {
			return ;
		}
		var num_neighors = atom.number_of_neighbors ();
		if (num_neighors == 4) {
			var indexes = [atom_index];
			indexes.extend (atom.indecies_of_atoms_connecting);
			var chrg = self.Charged (atom.coordinates, indexes, true);
			self.charges.append (chrg);
		}
		if (self.has_hydrogens) {
			if (num_neighors == 3 && atom.has_sp3_geometry (self)) {
				var indexes = [atom_index];
				indexes.extend (atom.indecies_of_atoms_connecting);
				var chrg = self.Charged (atom.coordinates, indexes, true);
				self.charges.append (chrg);
			}
		}
		else if (num_neighors == 1 || atom.has_sp3_geometry (self)) {
			var chrg = self.Charged (atom.coordinates, [atom_index], true);
			self.charges.append (chrg);
		}
	});},
	get charges_carboxylate () {return __get__ (this, function (self, atom_index, atom) {
		if (atom.element != 'C') {
			return ;
		}
		if (atom.number_of_neighbors () == 3) {
			var oxygens = self.connected_atoms_of_element (atom_index, 'O');
			if (len (oxygens) == 2 && (len (self.connected_heavy_atoms (oxygens [0])) == 1 && len (self.connected_heavy_atoms (oxygens [1])) == 1)) {
				var pt = self.all_atoms [oxygens [0]].coordinates.copy_of ();
				var pt2 = self.all_atoms [oxygens [1]].coordinates;
				pt.x = pt.x + pt2.x;
				pt.y = pt.y + pt2.y;
				pt.z = pt.z + pt2.z;
				pt.x = pt.x / 2.0;
				pt.y = pt.y / 2.0;
				pt.z = pt.z / 2.0;
				var chrg = self.Charged (pt, [oxygens [0], atom_index, oxygens [1]], false);
				self.charges.append (chrg);
			}
		}
	});},
	get charges_phosphrous_compounds () {return __get__ (this, function (self, atom_index, atom) {
		if (atom.element != 'P') {
			return ;
		}
		var oxygens = self.connected_atoms_of_element (atom_index, 'O');
		if (len (oxygens) >= 2) {
			var count = sum ((function () {
				var __accu0__ = [];
				for (var oxygen_index of oxygens) {
					__accu0__.append (len (self.connected_heavy_atoms (oxygen_index)) == 1);
				}
				return py_iter (__accu0__);
			}) ());
			if (count >= 2) {
				var indexes = [atom_index];
				indexes.extend (oxygens);
				var chrg = self.Charged (atom.coordinates, indexes, false);
				self.charges.append (chrg);
			}
		}
	});},
	get charges_sulfur_compounds () {return __get__ (this, function (self, atom_index, atom) {
		if (atom.element != 'S') {
			return ;
		}
		var oxygens = self.connected_atoms_of_element (atom_index, 'O');
		if (len (oxygens) >= 3) {
			var count = sum ((function () {
				var __accu0__ = [];
				for (var oxygen_index of oxygens) {
					__accu0__.append (len (self.connected_heavy_atoms (oxygen_index)) == 1);
				}
				return py_iter (__accu0__);
			}) ());
			if (count >= 3) {
				var indexes = [atom_index];
				indexes.extend (oxygens);
				var chrg = self.Charged (atom.coordinates, indexes, false);
				self.charges.append (chrg);
			}
		}
	});},
	get assign_charges () {return __get__ (this, function (self) {
		for (var atom_index of self.non_protein_atoms.py_keys ()) {
			var atom = self.non_protein_atoms [atom_index];
			self.charges_metals (atom_index, atom);
			self.charges_arginine_like (atom_index, atom);
			self.charges_amines (atom_index, atom);
			self.charges_carboxylate (atom_index, atom);
			self.charges_phosphrous_compounds (atom_index, atom);
			self.charges_sulfur_compounds (atom_index, atom);
		}
		var curr_res = '';
		var first = true;
		var residue = [];
		var last_key = '';
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			var key = (((atom.residue + '_') + str (atom.resid)) + '_') + atom.chain;
			if (first) {
				var curr_res = key;
				var first = false;
			}
			if (key != curr_res) {
				self.assign_charged_from_protein_residue (residue, last_key);
				var residue = [];
				var curr_res = key;
			}
			residue.append (atom_index);
			var last_key = key;
		}
		self.assign_charged_from_protein_residue (residue, last_key);
	});},
	get assign_charged_from_protein_residue () {return __get__ (this, function (self, residue, last_key) {
		var temp = last_key.strip ().py_split ('_');
		var resname = temp [0];
		var real_resname = resname.__getslice__ (-(3), null, 1);
		if (__in__ (real_resname, ['LYS', 'LYN'])) {
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'NZ') {
					var indexes = [index];
					for (var index2 of residue) {
						var atom2 = self.all_atoms [index2];
						if (__in__ (atom2.atom_name.strip (), ['HZ1', 'HZ2', 'HZ3'])) {
							indexes.append (index2);
						}
					}
					var chrg = self.Charged (atom.coordinates, indexes, true);
					self.charges.append (chrg);
					break;
				}
			}
		}
		if (real_resname == 'ARG') {
			var charge_pt = Point (0.0, 0.0, 0.0);
			var count = 0.0;
			var indices = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				var atm_name = atom.atom_name.strip ();
				if (__in__ (atm_name, ['NH1', 'NH2'])) {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					count++;
				}
				if (__in__ (atm_name, ['2HH2', '1HH2', 'CZ', '2HH1', '1HH1'])) {
					indices.append (index);
				}
			}
			if (count != 0.0) {
				charge_pt.x = charge_pt.x / count;
				charge_pt.y = charge_pt.y / count;
				charge_pt.z = charge_pt.z / count;
				if (charge_pt.x != 0.0 || charge_pt.y != 0.0 || charge_pt.z != 0.0) {
					var chrg = self.Charged (charge_pt, indices, true);
					self.charges.append (chrg);
				}
			}
		}
		if (__in__ (real_resname, ['HIS', 'HID', 'HIE', 'HIP'])) {
			var charge_pt = Point (0.0, 0.0, 0.0);
			var count = 0.0;
			var indices = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				var atm_name = atom.atom_name.strip ();
				if (__in__ (atm_name, ['NE2', 'ND1'])) {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					count++;
				}
				if (__in__ (atm_name, ['HE2', 'HD1', 'CE1', 'CD2', 'CG'])) {
					indices.append (index);
				}
			}
			if (count != 0.0) {
				charge_pt.x = charge_pt.x / count;
				charge_pt.y = charge_pt.y / count;
				charge_pt.z = charge_pt.z / count;
				if (charge_pt.x != 0.0 || charge_pt.y != 0.0 || charge_pt.z != 0.0) {
					var chrg = self.Charged (charge_pt, indices, true);
					self.charges.append (chrg);
				}
			}
		}
		if (__in__ (real_resname, ['GLU', 'GLH', 'GLX'])) {
			var charge_pt = Point (0.0, 0.0, 0.0);
			var count = 0.0;
			var indices = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				var atm_name = atom.atom_name.strip ();
				if (__in__ (atm_name, ['OE1', 'OE2'])) {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					count++;
				}
				if (atm_name == 'CD') {
					indices.append (index);
				}
			}
			if (count != 0.0) {
				charge_pt.x = charge_pt.x / count;
				charge_pt.y = charge_pt.y / count;
				charge_pt.z = charge_pt.z / count;
				if (charge_pt.x != 0.0 || charge_pt.y != 0.0 || charge_pt.z != 0.0) {
					var chrg = self.Charged (charge_pt, indices, false);
					self.charges.append (chrg);
				}
			}
		}
		if (__in__ (real_resname, ['ASP', 'ASH', 'ASX'])) {
			var charge_pt = Point (0.0, 0.0, 0.0);
			var count = 0.0;
			var indices = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				var atm_name = atom.atom_name.strip ();
				if (__in__ (atm_name, ['OD1', 'OD2'])) {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					count++;
				}
				if (atm_name == 'CG') {
					indices.append (index);
				}
			}
			if (count != 0.0) {
				charge_pt.x = charge_pt.x / count;
				charge_pt.y = charge_pt.y / count;
				charge_pt.z = charge_pt.z / count;
				if (charge_pt.x != 0.0 || charge_pt.y != 0.0 || charge_pt.z != 0.0) {
					var chrg = self.Charged (charge_pt, indices, false);
					self.charges.append (chrg);
				}
			}
		}
	});},
	Charged: __class__ ('Charged', [object], {
		__module__: __name__,
		get __init__ () {return __get__ (this, function (self, coordinates, indices, positive) {
			self.coordinates = coordinates;
			self.indices = indices;
			self.positive = positive;
		});}
	}),
	get add_aromatic_marker () {return __get__ (this, function (self, indicies_of_ring) {
		var points_list = [];
		var total = len (indicies_of_ring);
		var x_sum = 0.0;
		var y_sum = 0.0;
		var z_sum = 0.0;
		for (var index of indicies_of_ring) {
			var atom = self.all_atoms [index];
			points_list.append (atom.coordinates);
			var x_sum = x_sum + atom.coordinates.x;
			var y_sum = y_sum + atom.coordinates.y;
			var z_sum = z_sum + atom.coordinates.z;
		}
		if (total == 0) {
			return ;
		}
		var center = Point (x_sum / total, y_sum / total, z_sum / total);
		var radius = 0.0;
		for (var index of indicies_of_ring) {
			var atom = self.all_atoms [index];
			var dist = center.dist_to (atom.coordinates);
			if (dist > radius) {
				var radius = dist;
			}
		}
		if (len (indicies_of_ring) < 3) {
			return ;
		}
		else if (len (indicies_of_ring) == 3) {
			var A = self.all_atoms [indicies_of_ring [0]].coordinates;
			var B = self.all_atoms [indicies_of_ring [1]].coordinates;
			var C = self.all_atoms [indicies_of_ring [2]].coordinates;
		}
		else if (len (indicies_of_ring) == 4) {
			var A = self.all_atoms [indicies_of_ring [0]].coordinates;
			var B = self.all_atoms [indicies_of_ring [1]].coordinates;
			var C = self.all_atoms [indicies_of_ring [3]].coordinates;
		}
		else {
			var A = self.all_atoms [indicies_of_ring [0]].coordinates;
			var B = self.all_atoms [indicies_of_ring [2]].coordinates;
			var C = self.all_atoms [indicies_of_ring [4]].coordinates;
		}
		var AB = vector_subtraction (B, A);
		var AC = vector_subtraction (C, A);
		var ABXAC = cross_product (AB, AC);
		var x1 = self.all_atoms [indicies_of_ring [0]].coordinates.x;
		var y1 = self.all_atoms [indicies_of_ring [0]].coordinates.y;
		var z1 = self.all_atoms [indicies_of_ring [0]].coordinates.z;
		var a = ABXAC.x;
		var b = ABXAC.y;
		var c = ABXAC.z;
		var d = (a * x1 + b * y1) + c * z1;
		var ar_ring = self.AromaticRing (center, indicies_of_ring, [a, b, c, d], radius);
		self.aromatic_rings.append (ar_ring);
	});},
	AromaticRing: __class__ ('AromaticRing', [object], {
		__module__: __name__,
		get __init__ () {return __get__ (this, function (self, center, indices, plane_coeff, radius) {
			self.center = center;
			self.indices = indices;
			self.plane_coeff = plane_coeff;
			self.radius = radius;
		});}
	}),
	get assign_aromatic_rings () {return __get__ (this, function (self) {
		var all_rings = [];
		for (var atom_index of self.non_protein_atoms.py_keys ()) {
			all_rings.extend (self.all_rings_containing_atom (atom_index));
		}
		for (var ring_index_1 = 0; ring_index_1 < len (all_rings); ring_index_1++) {
			var ring1 = all_rings [ring_index_1];
			if (len (ring1) != 0) {
				for (var ring_index_2 = 0; ring_index_2 < len (all_rings); ring_index_2++) {
					if (ring_index_1 != ring_index_2) {
						var ring2 = all_rings [ring_index_2];
						if (len (ring2) != 0) {
							if (self.set1_is_subset_of_set2 (ring1, ring2) == true) {
								all_rings [ring_index_2] = [];
							}
						}
					}
				}
			}
		}
		while (__in__ ([], all_rings)) {
			all_rings.remove ([]);
		}
		for (var ring_index = 0; ring_index < len (all_rings); ring_index++) {
			var ring = all_rings [ring_index];
			var is_flat = true;
			for (var t = -(3); t < len (ring) - 3; t++) {
				while (t < 0) {
					var t = t + len (ring);
				}
				var pt1 = self.non_protein_atoms [ring [__mod__ (t, len (ring))]].coordinates;
				var pt2 = self.non_protein_atoms [ring [__mod__ (t + 1, len (ring))]].coordinates;
				var pt3 = self.non_protein_atoms [ring [__mod__ (t + 2, len (ring))]].coordinates;
				var pt4 = self.non_protein_atoms [ring [__mod__ (t + 3, len (ring))]].coordinates;
				var cur_atom = self.non_protein_atoms [ring [__mod__ (t + 3, len (ring))]];
				if (cur_atom.element == 'C' && cur_atom.number_of_neighbors () == 4) {
					var is_flat = false;
					break;
				}
				var angle = (dihedral (pt1, pt2, pt3, pt4) * 180) / math.pi;
				if (angle > -(165) && angle < -(15) || angle > 15 && angle < 165) {
					var is_flat = false;
					break;
				}
				for (var substituent_atom_index of cur_atom.indecies_of_atoms_connecting) {
					var pt_sub = self.non_protein_atoms [substituent_atom_index].coordinates;
					var angle = (dihedral (pt2, pt3, pt4, pt_sub) * 180) / math.pi;
					if (angle > -(165) && angle < -(15) || angle > 15 && angle < 165) {
						var is_flat = false;
						break;
					}
				}
			}
			if (is_flat == false) {
				all_rings [ring_index] = [];
			}
			if (len (ring) < 5) {
				all_rings [ring_index] = [];
			}
			if (len (ring) > 6) {
				all_rings [ring_index] = [];
			}
		}
		while (__in__ ([], all_rings)) {
			all_rings.remove ([]);
		}
		for (var ring of all_rings) {
			self.add_aromatic_marker (ring);
		}
		var curr_res = '';
		var first = true;
		var residue = [];
		var last_key = '';
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			var key = (((atom.residue + '_') + str (atom.resid)) + '_') + atom.chain;
			if (first == true) {
				var curr_res = key;
				var first = false;
			}
			if (key != curr_res) {
				self.assign_aromatic_rings_from_protein_process_residue (residue, last_key);
				var residue = [];
				var curr_res = key;
			}
			residue.append (atom_index);
			var last_key = key;
		}
		self.assign_aromatic_rings_from_protein_process_residue (residue, last_key);
	});},
	get assign_aromatic_rings_from_protein_process_residue () {return __get__ (this, function (self, residue, last_key) {
		var temp = last_key.strip ().py_split ('_');
		var resname = temp [0];
		var real_resname = resname.__getslice__ (-(3), null, 1);
		if (real_resname == 'PHE') {
			var indicies_of_ring = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CG') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CZ') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE2') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD2') {
					indicies_of_ring.append (index);
				}
			}
			self.add_aromatic_marker (indicies_of_ring);
		}
		if (real_resname == 'TYR') {
			var indicies_of_ring = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CG') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CZ') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE2') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD2') {
					indicies_of_ring.append (index);
				}
			}
			self.add_aromatic_marker (indicies_of_ring);
		}
		if (__in__ (real_resname, ['HIS', 'HID', 'HIE', 'HIP'])) {
			var indicies_of_ring = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CG') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'ND1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'NE2') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD2') {
					indicies_of_ring.append (index);
				}
			}
			self.add_aromatic_marker (indicies_of_ring);
		}
		if (real_resname == 'TRP') {
			var indicies_of_ring = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CG') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'NE1') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE2') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD2') {
					indicies_of_ring.append (index);
				}
			}
			self.add_aromatic_marker (indicies_of_ring);
			var indicies_of_ring = [];
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE2') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CD2') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CE3') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CZ3') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CH2') {
					indicies_of_ring.append (index);
				}
			}
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'CZ2') {
					indicies_of_ring.append (index);
				}
			}
			self.add_aromatic_marker (indicies_of_ring);
		}
	});},
	get set1_is_subset_of_set2 () {return __get__ (this, function (self, set1, set2) {
		var is_subset = true;
		for (var item of set1) {
			if (!__in__ (item, set2)) {
				var is_subset = false;
				break;
			}
		}
		return is_subset;
	});},
	get all_rings_containing_atom () {return __get__ (this, function (self, index) {
		var all_rings = [];
		var atom = self.all_atoms [index];
		for (var connected_atom of atom.indecies_of_atoms_connecting) {
			self.ring_recursive (connected_atom, [index], index, all_rings);
		}
		return all_rings;
	});},
	get ring_recursive () {return __get__ (this, function (self, index, already_crossed, orig_atom, all_rings) {
		if (len (already_crossed) > 6) {
			return ;
		}
		var atom = self.all_atoms [index];
		var temp = already_crossed.__getslice__ (0, null, 1);
		temp.append (index);
		for (var connected_atom of atom.indecies_of_atoms_connecting) {
			if (!(__in__ (connected_atom, already_crossed))) {
				self.ring_recursive (connected_atom, temp, orig_atom, all_rings);
			}
			if (connected_atom == orig_atom && orig_atom != already_crossed [len (already_crossed) - 1]) {
				all_rings.append (temp);
			}
		}
	});},
	get assign_secondary_structure () {return __get__ (this, function (self) {
		var resids = [];
		var last_key = '-99999_Z';
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			var key = (str (atom.resid) + '_') + atom.chain;
			if (key != last_key) {
				var last_key = key;
				resids.append (last_key);
			}
		}
		var structure = dict ({});
		for (var resid of resids) {
			structure [resid] = 'OTHER';
		}
		var atoms = [];
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			if (atom.side_chain_or_backbone () == 'BACKBONE') {
				if (len (atoms) < 8) {
					atoms.append (atom);
				}
				else {
					atoms.py_pop (0);
					atoms.append (atom);
					if (atoms [0].resid == atoms [1].resid && atoms [0].resid == atoms [2].resid && atoms [0].resid == atoms [3].resid && atoms [0].resid != atoms [4].resid && atoms [4].resid == atoms [5].resid && atoms [4].resid == atoms [6].resid && atoms [4].resid == atoms [7].resid && atoms [0].resid + 1 == atoms [7].resid && atoms [0].chain == atoms [7].chain) {
						var resid1 = atoms [0].resid;
						var resid2 = atoms [7].resid;
						for (var atom of atoms) {
							if (atom.resid == resid1 && atom.atom_name.strip () == 'N') {
								var first_n = atom;
							}
							if (atom.resid == resid1 && atom.atom_name.strip () == 'C') {
								var first_c = atom;
							}
							if (atom.resid == resid1 && atom.atom_name.strip () == 'CA') {
								var first_ca = atom;
							}
							if (atom.resid == resid2 && atom.atom_name.strip () == 'N') {
								var second_n = atom;
							}
							if (atom.resid == resid2 && atom.atom_name.strip () == 'C') {
								var second_c = atom;
							}
							if (atom.resid == resid2 && atom.atom_name.strip () == 'CA') {
								var second_ca = atom;
							}
						}
						var phi = (dihedral (first_c.coordinates, second_n.coordinates, second_ca.coordinates, second_c.coordinates) * 180.0) / math.pi;
						var psi = (dihedral (first_n.coordinates, first_ca.coordinates, first_c.coordinates, second_n.coordinates) * 180.0) / math.pi;
						if (phi > -(145) && phi < -(35) && psi > -(70) && psi < 50) {
							var key1 = (str (first_c.resid) + '_') + first_c.chain;
							var key2 = (str (second_c.resid) + '_') + second_c.chain;
							structure [key1] = 'ALPHA';
							structure [key2] = 'ALPHA';
						}
						if (phi >= -(180) && phi < -(40) && psi <= 180 && psi > 90 || phi >= -(180) && phi < -(70) && psi <= -(165)) {
							var key1 = (str (first_c.resid) + '_') + first_c.chain;
							var key2 = (str (second_c.resid) + '_') + second_c.chain;
							structure [key1] = 'BETA';
							structure [key2] = 'BETA';
						}
					}
				}
			}
		}
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			var key = (str (atom.resid) + '_') + atom.chain;
			atom.structure = structure [key];
		}
		var ca_list = [];
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			if (__in__ (atom.residue.strip (), self.protein_resnames) && atom.atom_name.strip () == 'CA') {
				ca_list.append (atom_index);
			}
		}
		var change = true;
		while (change == true) {
			var change = false;
			for (var CA_atom_index of ca_list) {
				var CA_atom = self.all_atoms [CA_atom_index];
				if (CA_atom.structure == 'ALPHA') {
					var another_alpha_is_close = false;
					for (var other_CA_atom_index of ca_list) {
						var other_CA_atom = self.all_atoms [other_CA_atom_index];
						if (other_CA_atom.structure == 'ALPHA') {
							if (other_CA_atom.resid - 3 == CA_atom.resid || other_CA_atom.resid + 3 == CA_atom.resid) {
								if (other_CA_atom.coordinates.dist_to (CA_atom.coordinates) < 6.0) {
									var another_alpha_is_close = true;
									break;
								}
							}
						}
					}
					if (another_alpha_is_close == false) {
						self.set_structure_of_residue (CA_atom.chain, CA_atom.resid, 'OTHER');
						var change = true;
					}
				}
			}
			for (var index_in_list = 0; index_in_list < len (ca_list) - 5; index_in_list++) {
				var index_in_pdb1 = ca_list [index_in_list];
				var index_in_pdb2 = ca_list [index_in_list + 1];
				var index_in_pdb3 = ca_list [index_in_list + 2];
				var index_in_pdb4 = ca_list [index_in_list + 3];
				var index_in_pdb5 = ca_list [index_in_list + 4];
				var index_in_pdb6 = ca_list [index_in_list + 5];
				var atom1 = self.all_atoms [index_in_pdb1];
				var atom2 = self.all_atoms [index_in_pdb2];
				var atom3 = self.all_atoms [index_in_pdb3];
				var atom4 = self.all_atoms [index_in_pdb4];
				var atom5 = self.all_atoms [index_in_pdb5];
				var atom6 = self.all_atoms [index_in_pdb6];
				if (atom1.resid + 1 == atom2.resid && atom2.resid + 1 == atom3.resid && atom3.resid + 1 == atom4.resid && atom4.resid + 1 == atom5.resid && atom5.resid + 1 == atom6.resid) {
					if (atom1.structure != 'ALPHA' && atom2.structure == 'ALPHA' && atom3.structure != 'ALPHA') {
						self.set_structure_of_residue (atom2.chain, atom2.resid, 'OTHER');
						var change = true;
					}
					if (atom2.structure != 'ALPHA' && atom3.structure == 'ALPHA' && atom4.structure != 'ALPHA') {
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						var change = true;
					}
					if (atom3.structure != 'ALPHA' && atom4.structure == 'ALPHA' && atom5.structure != 'ALPHA') {
						self.set_structure_of_residue (atom4.chain, atom4.resid, 'OTHER');
						var change = true;
					}
					if (atom4.structure != 'ALPHA' && atom5.structure == 'ALPHA' && atom6.structure != 'ALPHA') {
						self.set_structure_of_residue (atom5.chain, atom5.resid, 'OTHER');
						var change = true;
					}
					if (atom1.structure != 'ALPHA' && atom2.structure == 'ALPHA' && atom3.structure == 'ALPHA' && atom4.structure != 'ALPHA') {
						self.set_structure_of_residue (atom2.chain, atom2.resid, 'OTHER');
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						var change = true;
					}
					if (atom2.structure != 'ALPHA' && atom3.structure == 'ALPHA' && atom4.structure == 'ALPHA' && atom5.structure != 'ALPHA') {
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						self.set_structure_of_residue (atom4.chain, atom4.resid, 'OTHER');
						var change = true;
					}
					if (atom3.structure != 'ALPHA' && atom4.structure == 'ALPHA' && atom5.structure == 'ALPHA' && atom6.structure != 'ALPHA') {
						self.set_structure_of_residue (atom4.chain, atom4.resid, 'OTHER');
						self.set_structure_of_residue (atom5.chain, atom5.resid, 'OTHER');
						var change = true;
					}
					if (atom1.structure != 'ALPHA' && atom2.structure == 'ALPHA' && atom3.structure == 'ALPHA' && atom4.structure == 'ALPHA' && atom5.structure != 'ALPHA') {
						self.set_structure_of_residue (atom2.chain, atom2.resid, 'OTHER');
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						self.set_structure_of_residue (atom4.chain, atom4.resid, 'OTHER');
						var change = true;
					}
					if (atom2.structure != 'ALPHA' && atom3.structure == 'ALPHA' && atom4.structure == 'ALPHA' && atom5.structure == 'ALPHA' && atom6.structure != 'ALPHA') {
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						self.set_structure_of_residue (atom4.chain, atom4.resid, 'OTHER');
						self.set_structure_of_residue (atom5.chain, atom5.resid, 'OTHER');
						var change = true;
					}
					if (atom1.structure != 'ALPHA' && atom2.structure == 'ALPHA' && atom3.structure == 'ALPHA' && atom4.structure == 'ALPHA' && atom5.structure == 'ALPHA' && atom6.structure != 'ALPHA') {
						self.set_structure_of_residue (atom2.chain, atom2.resid, 'OTHER');
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						self.set_structure_of_residue (atom4.chain, atom4.resid, 'OTHER');
						self.set_structure_of_residue (atom5.chain, atom5.resid, 'OTHER');
						var change = true;
					}
				}
			}
			for (var CA_atom_index of ca_list) {
				var CA_atom = self.all_atoms [CA_atom_index];
				if (CA_atom.structure == 'BETA') {
					var another_beta_is_close = false;
					for (var other_CA_atom_index of ca_list) {
						if (other_CA_atom_index != CA_atom_index) {
							var other_CA_atom = self.all_atoms [other_CA_atom_index];
							if (other_CA_atom.structure == 'BETA') {
								if (other_CA_atom.chain == CA_atom.chain) {
									if (fabs (other_CA_atom.resid - CA_atom.resid) > 2) {
										if (CA_atom.coordinates.dist_to (other_CA_atom.coordinates) < 6.0) {
											var another_beta_is_close = true;
											break;
										}
									}
								}
							}
						}
					}
					if (another_beta_is_close == false) {
						self.set_structure_of_residue (CA_atom.chain, CA_atom.resid, 'OTHER');
						var change = true;
					}
				}
			}
			for (var index_in_list = 0; index_in_list < len (ca_list) - 3; index_in_list++) {
				var index_in_pdb1 = ca_list [index_in_list];
				var index_in_pdb2 = ca_list [index_in_list + 1];
				var index_in_pdb3 = ca_list [index_in_list + 2];
				var index_in_pdb4 = ca_list [index_in_list + 3];
				var atom1 = self.all_atoms [index_in_pdb1];
				var atom2 = self.all_atoms [index_in_pdb2];
				var atom3 = self.all_atoms [index_in_pdb3];
				var atom4 = self.all_atoms [index_in_pdb4];
				if (atom1.resid + 1 == atom2.resid && atom2.resid + 1 == atom3.resid && atom3.resid + 1 == atom4.resid) {
					if (atom1.structure != 'BETA' && atom2.structure == 'BETA' && atom3.structure != 'BETA') {
						self.set_structure_of_residue (atom2.chain, atom2.resid, 'OTHER');
						var change = true;
					}
					if (atom2.structure != 'BETA' && atom3.structure == 'BETA' && atom4.structure != 'BETA') {
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						var change = true;
					}
					if (atom1.structure != 'BETA' && atom2.structure == 'BETA' && atom3.structure == 'BETA' && atom4.structure != 'BETA') {
						self.set_structure_of_residue (atom2.chain, atom2.resid, 'OTHER');
						self.set_structure_of_residue (atom3.chain, atom3.resid, 'OTHER');
						var change = true;
					}
				}
			}
		}
	});},
	get set_structure_of_residue () {return __get__ (this, function (self, chain, resid, structure) {
		for (var atom_index of self.all_atoms.py_keys ()) {
			var atom = self.all_atoms [atom_index];
			if (atom.chain == chain && atom.resid == resid) {
				atom.structure = structure;
			}
		}
	});}
});

//# sourceMappingURL=binana._structure.mol.map