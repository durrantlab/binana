// Transcrypt'ed from Python, 2020-03-20 18:24:57
var __future__ = {};
var math = {};
var re = {};
var sys = {};
var textwrap = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
import * as __module_textwrap__ from './textwrap.js';
__nest__ (textwrap, '', __module_textwrap__);
import * as __module_sys__ from './sys.js';
__nest__ (sys, '', __module_sys__);
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
import * as __module___future____ from './__future__.js';
__nest__ (__future__, '', __module___future____);
var __name__ = '__main__';
export var VERSION = '1.3';
export var Point =  __class__ ('Point', [object], {
	__module__: __name__,
	x: 99999.0,
	y: 99999.0,
	z: 99999.0,
	get __init__ () {return __get__ (this, function (self, x, y, z) {
		self.x = x;
		self.y = y;
		self.z = z;
	});},
	get copy_of () {return __get__ (this, function (self) {
		return Point (self.x, self.y, self.z);
	});},
	get print_coors () {return __get__ (this, function (self) {
		print ((((str (self.x) + '\t') + str (self.y)) + '\t') + str (self.z));
	});},
	get snap () {return __get__ (this, function (self, reso) {
		self.x = round (self.x / reso) * reso;
		self.y = round (self.y / reso) * reso;
		self.z = round (self.z / reso) * reso;
	});},
	get dist_to () {return __get__ (this, function (self, apoint) {
		return math.sqrt ((math.pow (self.x - apoint.x, 2) + math.pow (self.y - apoint.y, 2)) + math.pow (self.z - apoint.z, 2));
	});},
	get description () {return __get__ (this, function (self) {
		return (((str (self.x) + ' ') + str (self.y)) + ' ') + str (self.z);
	});},
	get magnitude () {return __get__ (this, function (self) {
		return self.dist_to (Point (0, 0, 0));
	});},
	get create_PDB_line () {return __get__ (this, function (self, index) {
		var output = 'ATOM ';
		var output = ((output + str (index).rjust (6)) + 'X'.rjust (5)) + 'XXX'.rjust (4);
		var output = output + (__mod__ ('%.3f', self.x)).rjust (18);
		var output = output + (__mod__ ('%.3f', self.y)).rjust (8);
		var output = output + (__mod__ ('%.3f', self.z)).rjust (8);
		var output = output + 'X'.rjust (24);
		return output;
	});}
});
export var Atom =  __class__ ('Atom', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.atom_name = '';
		self.residue = '';
		self.coordinates = Point (99999, 99999, 99999);
		self.element = '';
		self.PDB_index = '';
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
		theatom.PDB_index = self.PDB_index;
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
		var to_return = (((((((to_return + self.residue.strip ()) + '(') + str (self.resid)) + '):') + self.atom_name.strip ()) + '(') + str (self.PDB_index)) + ')';
		return to_return;
	});},
	get create_PDB_line () {return __get__ (this, function (self, index) {
		var output = 'ATOM ';
		var output = (output + str (index).rjust (6)) + self.atom_name.rjust (5);
		+(self.residue.rjust (4));
		var output = output + (__mod__ ('%.3f', self.coordinates.x)).rjust (18);
		var output = output + (__mod__ ('%.3f', self.coordinates.y)).rjust (8);
		var output = output + (__mod__ ('%.3f', self.coordinates.z)).rjust (8);
		var output = output + self.element.rjust (24);
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
	get read_PDB_line () {return __get__ (this, function (self, line) {
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
		self.PDB_index = line.__getslice__ (6, 12, 1).strip ();
		self.residue = line.__getslice__ (16, 20, 1);
		self.residue = ' ' + self.residue.__getslice__ (-(3), null, 1);
		try {
			self.resid = int (line.__getslice__ (23, 26, 1));
		}
		catch (__except0__) {
			// pass;
		}
		self.chain = line.__getslice__ (21, 22, 1);
		if (self.residue.strip () == '') {
			self.residue = ' MOL';
		}
	});}
});
export var PDB =  __class__ ('PDB', [object], {
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
		self.rotateable_bonds_count = 0;
		self.functions = MathFunctions ();
		self.protein_resnames = ['ALA', 'ARG', 'ASN', 'ASP', 'ASH', 'ASX', 'CYS', 'CYM', 'CYX', 'GLN', 'GLU', 'GLH', 'GLX', 'GLY', 'HIS', 'HID', 'HIE', 'HIP', 'ILE', 'LEU', 'LYS', 'LYN', 'MET', 'PHE', 'PRO', 'SER', 'THR', 'TRP', 'TYR', 'VAL'];
		self.aromatic_rings = [];
		self.charges = [];
	});},
	get load_PDB () {return __get__ (this, function (self, file_name, min_x, max_x, min_y, max_y, min_z, max_z) {
		if (typeof min_x == 'undefined' || (min_x != null && min_x.hasOwnProperty ("__kwargtrans__"))) {;
			var min_x = -(9999.99);
		};
		if (typeof max_x == 'undefined' || (max_x != null && max_x.hasOwnProperty ("__kwargtrans__"))) {;
			var max_x = 9999.99;
		};
		if (typeof min_y == 'undefined' || (min_y != null && min_y.hasOwnProperty ("__kwargtrans__"))) {;
			var min_y = -(9999.99);
		};
		if (typeof max_y == 'undefined' || (max_y != null && max_y.hasOwnProperty ("__kwargtrans__"))) {;
			var max_y = 9999.99;
		};
		if (typeof min_z == 'undefined' || (min_z != null && min_z.hasOwnProperty ("__kwargtrans__"))) {;
			var min_z = -(9999.99);
		};
		if (typeof max_z == 'undefined' || (max_z != null && max_z.hasOwnProperty ("__kwargtrans__"))) {;
			var max_z = 9999.99;
		};
		var autoindex = 1;
		self.__init__ ();
		var file = open (file_name, 'r');
		var lines = file.readlines ();
		file.close ();
		var atom_already_loaded = [];
		for (var t = 0; t < len (lines); t++) {
			var line = lines [t];
			if (line.__getslice__ (0, 3, 1) == 'END' && line.__getslice__ (0, 7, 1) != 'ENDROOT' && line.__getslice__ (0, 9, 1) != 'ENDBRANCH') {
				var t = textwrap.wrap (('WARNING: END or ENDMDL term found in ' + file_name) + '. Everything after the first instance of this term will be ignored.                     If any of your PDBQT files have multiple frames/poses, please partition them                     into separate files using vina_split and feed each of the the single-frame files into Binana separately.', 80);
				print ('\n'.join (t) + '\n');
				print (line);
				break;
			}
			if (__in__ ('between atoms', line) && __in__ (' A ', line)) {
				self.rotateable_bonds_count = self.rotateable_bonds_count + 1;
			}
			if (len (line) >= 7) {
				if (line.__getslice__ (0, 4, 1) == 'ATOM' || line.__getslice__ (0, 6, 1) == 'HETATM') {
					var TempAtom = Atom ();
					TempAtom.read_PDB_line (line);
					if (TempAtom.coordinates.x > min_x && TempAtom.coordinates.x < max_x && TempAtom.coordinates.y > min_y && TempAtom.coordinates.y < max_y && TempAtom.coordinates.z > min_z && TempAtom.coordinates.z < max_z) {
						if (self.max_x < TempAtom.coordinates.x) {
							self.max_x = TempAtom.coordinates.x;
						}
						if (self.max_y < TempAtom.coordinates.y) {
							self.max_y = TempAtom.coordinates.y;
						}
						if (self.max_z < TempAtom.coordinates.z) {
							self.max_z = TempAtom.coordinates.z;
						}
						if (self.min_x > TempAtom.coordinates.x) {
							self.min_x = TempAtom.coordinates.x;
						}
						if (self.min_y > TempAtom.coordinates.y) {
							self.min_y = TempAtom.coordinates.y;
						}
						if (self.min_z > TempAtom.coordinates.z) {
							self.min_z = TempAtom.coordinates.z;
						}
						var key = (((((TempAtom.atom_name.strip () + '_') + str (TempAtom.resid)) + '_') + TempAtom.residue.strip ()) + '_') + TempAtom.chain.strip ();
						if (__in__ (key, atom_already_loaded) && __in__ (TempAtom.residue.strip (), self.protein_resnames)) {
							self.printout (('Warning: Duplicate protein atom detected: "' + TempAtom.line.strip ()) + '". Not loading this duplicate.');
							print ('');
						}
						if (!__in__ (key, atom_already_loaded) || !(__in__ (TempAtom.residue.strip (), self.protein_resnames))) {
							atom_already_loaded.append (key);
							self.all_atoms [autoindex] = TempAtom;
							if (!__in__ (TempAtom.residue.__getslice__ (-(3), null, 1), self.protein_resnames)) {
								self.non_protein_atoms [autoindex] = TempAtom;
							}
							var autoindex = autoindex + 1;
						}
					}
				}
			}
		}
		self.check_protein_format ();
		self.create_bonds_by_distance ();
		self.assign_aromatic_rings ();
		self.assign_charges ();
	});},
	get printout () {return __get__ (this, function (self, the_string) {
		var lines = textwrap.wrap (the_string, 80);
		for (var line of lines) {
			print (line);
		}
	});},
	get save_PDB () {return __get__ (this, function (self, file_name) {
		var f = open (file_name, 'w');
		var towrite = self.save_PDB_String ();
		if (towrite.strip () == '') {
			var towrite = 'ATOM      1  X   XXX             0.000   0.000   0.000                       X';
		}
		f.write (towrite);
		f.close ();
	});},
	get save_PDB_String () {return __get__ (this, function (self) {
		var to_output = '';
		for (var atom_index of self.all_atoms) {
			var to_output = (to_output + self.all_atoms [atom_index].create_PDB_line (atom_index)) + '\n';
		}
		return to_output;
	});},
	get add_new_atom () {return __get__ (this, function (self, atom) {
		var t = 1;
		while (__in__ (t, list (self.all_atoms.py_keys ()))) {
			var t = t + 1;
		}
		self.all_atoms [t] = atom;
	});},
	get set_resname () {return __get__ (this, function (self, resname) {
		for (var atom_index of self.all_atoms) {
			self.all_atoms [atom_index].residue = resname;
		}
	});},
	get connected_atoms_of_given_element () {return __get__ (this, function (self, index, connected_atom_element) {
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
		for (var atom_index of self.all_atoms) {
			var atom = self.all_atoms [atom_index];
			var key = (((atom.residue + '_') + str (atom.resid)) + '_') + atom.chain;
			if (first === true) {
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
	get check_protein_format_process_residue () {return __get__ (this, function (self, residue, last_key) {
		var temp = last_key.strip ().py_split ('_');
		var resname = temp [0];
		var real_resname = resname.__getslice__ (-(3), null, 1);
		var resid = temp [1];
		var chain = temp [2];
		if (__in__ (real_resname, self.protein_resnames)) {
			if (!__in__ ('N', residue)) {
				self.printout (('Warning: There is no atom named "N" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine secondary structure. If this residue is far from the active site, this warning may not affect the NNScore.');
				print ('');
			}
			if (!__in__ ('C', residue)) {
				self.printout (('Warning: There is no atom named "C" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine secondary structure. If this residue is far from the active site, this warning may not affect the NNScore.');
				print ('');
			}
			if (!__in__ ('CA', residue)) {
				self.printout (('Warning: There is no atom named "CA" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine secondary structure. If this residue is far from the active site, this warning may not affect the NNScore.');
				print ('');
			}
			if (real_resname == 'GLU' || real_resname == 'GLH' || real_resname == 'GLX') {
				if (!__in__ ('OE1', residue)) {
					self.printout (('Warning: There is no atom named "OE1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('OE2', residue)) {
					self.printout (('Warning: There is no atom named "OE2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'ASP' || real_resname == 'ASH' || real_resname == 'ASX') {
				if (!__in__ ('OD1', residue)) {
					self.printout (('Warning: There is no atom named "OD1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('OD2', residue)) {
					self.printout (('Warning: There is no atom named "OD2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'LYS' || real_resname == 'LYN') {
				if (!__in__ ('NZ', residue)) {
					self.printout (('Warning: There is no atom named "NZ" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'ARG') {
				if (!__in__ ('NH1', residue)) {
					self.printout (('Warning: There is no atom named "NH1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('NH2', residue)) {
					self.printout (('Warning: There is no atom named "NH2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'HIS' || real_resname == 'HID' || real_resname == 'HIE' || real_resname == 'HIP') {
				if (!__in__ ('NE2', residue)) {
					self.printout (('Warning: There is no atom named "NE2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('ND1', residue)) {
					self.printout (('Warning: There is no atom named "ND1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'PHE') {
				if (!__in__ ('CG', residue)) {
					self.printout (('Warning: There is no atom named "CG" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CD1', residue)) {
					self.printout (('Warning: There is no atom named "CD1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CD2', residue)) {
					self.printout (('Warning: There is no atom named "CD2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CE1', residue)) {
					self.printout (('Warning: There is no atom named "CE1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CE2', residue)) {
					self.printout (('Warning: There is no atom named "CE2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CZ', residue)) {
					self.printout (('Warning: There is no atom named "CZ" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'TYR') {
				if (!__in__ ('CG', residue)) {
					self.printout (('Warning: There is no atom named "CG" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CD1', residue)) {
					self.printout (('Warning: There is no atom named "CD1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CD2', residue)) {
					self.printout (('Warning: There is no atom named "CD2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CE1', residue)) {
					self.printout (('Warning: There is no atom named "CE1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CE2', residue)) {
					self.printout (('Warning: There is no atom named "CE2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CZ', residue)) {
					self.printout (('Warning: There is no atom named "CZ" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'TRP') {
				if (!__in__ ('CG', residue)) {
					self.printout (('Warning: There is no atom named "CG" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CD1', residue)) {
					self.printout (('Warning: There is no atom named "CD1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CD2', residue)) {
					self.printout (('Warning: There is no atom named "CD2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('NE1', residue)) {
					self.printout (('Warning: There is no atom named "NE1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CE2', residue)) {
					self.printout (('Warning: There is no atom named "CE2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CE3', residue)) {
					self.printout (('Warning: There is no atom named "CE3" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CZ2', residue)) {
					self.printout (('Warning: There is no atom named "CZ2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CZ3', residue)) {
					self.printout (('Warning: There is no atom named "CZ3" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CH2', residue)) {
					self.printout (('Warning: There is no atom named "CH2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
			if (real_resname == 'HIS' || real_resname == 'HID' || real_resname == 'HIE' || real_resname == 'HIP') {
				if (!__in__ ('CG', residue)) {
					self.printout (('Warning: There is no atom named "CG" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('ND1', residue)) {
					self.printout (('Warning: There is no atom named "ND1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CD2', residue)) {
					self.printout (('Warning: There is no atom named "CD2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('CE1', residue)) {
					self.printout (('Warning: There is no atom named "CE1" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
				if (!__in__ ('NE2', residue)) {
					self.printout (('Warning: There is no atom named "NE2" in the protein residue ' + last_key) + '. Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore.');
					print ('');
				}
			}
		}
	});},
	get create_bonds_by_distance () {return __get__ (this, function (self) {
		for (var AtomIndex1 of self.non_protein_atoms) {
			var atom1 = self.non_protein_atoms [AtomIndex1];
			if (!__in__ (atom1.residue.__getslice__ (-(3), null, 1), self.protein_resnames)) {
				for (var AtomIndex2 of self.non_protein_atoms) {
					if (AtomIndex1 != AtomIndex2) {
						var atom2 = self.non_protein_atoms [AtomIndex2];
						if (!(__in__ (atom2.residue.__getslice__ (-(3), null, 1), self.protein_resnames))) {
							var dist = self.functions.distance (atom1.coordinates, atom2.coordinates);
							if (dist < self.bond_length (atom1.element, atom2.element) * 1.2) {
								atom1.add_neighbor_atom_index (AtomIndex2);
								atom2.add_neighbor_atom_index (AtomIndex1);
							}
						}
					}
				}
			}
		}
	});},
	get bond_length () {return __get__ (this, function (self, element1, element2) {
		var distance = 0.0;
		if (element1 == 'C' && element2 == 'C') {
			var distance = 1.53;
		}
		if (element1 == 'N' && element2 == 'N') {
			var distance = 1.425;
		}
		if (element1 == 'O' && element2 == 'O') {
			var distance = 1.469;
		}
		if (element1 == 'S' && element2 == 'S') {
			var distance = 2.048;
		}
		if (element1 == 'C' && element2 == 'H' || element1 == 'H' && element2 == 'C') {
			var distance = 1.059;
		}
		if (element1 == 'C' && element2 == 'N' || element1 == 'N' && element2 == 'C') {
			var distance = 1.469;
		}
		if (element1 == 'C' && element2 == 'O' || element1 == 'O' && element2 == 'C') {
			var distance = 1.413;
		}
		if (element1 == 'C' && element2 == 'S' || element1 == 'S' && element2 == 'C') {
			var distance = 1.819;
		}
		if (element1 == 'N' && element2 == 'H' || element1 == 'H' && element2 == 'N') {
			var distance = 1.009;
		}
		if (element1 == 'N' && element2 == 'O' || element1 == 'O' && element2 == 'N') {
			var distance = 1.463;
		}
		if (element1 == 'O' && element2 == 'S' || element1 == 'S' && element2 == 'O') {
			var distance = 1.577;
		}
		if (element1 == 'O' && element2 == 'H' || element1 == 'H' && element2 == 'O') {
			var distance = 0.967;
		}
		if (element1 == 'S' && element2 == 'H' || element1 == 'H' && element2 == 'S') {
			var distance = 2.025 / 1.5;
		}
		if (element1 == 'S' && element2 == 'N' || element1 == 'H' && element2 == 'N') {
			var distance = 1.633;
		}
		if (element1 == 'C' && element2 == 'F' || element1 == 'F' && element2 == 'C') {
			var distance = 1.399;
		}
		if (element1 == 'C' && element2 == 'CL' || element1 == 'CL' && element2 == 'C') {
			var distance = 1.79;
		}
		if (element1 == 'C' && element2 == 'BR' || element1 == 'BR' && element2 == 'C') {
			var distance = 1.91;
		}
		if (element1 == 'C' && element2 == 'I' || element1 == 'I' && element2 == 'C') {
			var distance = 2.162;
		}
		if (element1 == 'S' && element2 == 'BR' || element1 == 'BR' && element2 == 'S') {
			var distance = 2.321;
		}
		if (element1 == 'S' && element2 == 'CL' || element1 == 'CL' && element2 == 'S') {
			var distance = 2.283;
		}
		if (element1 == 'S' && element2 == 'F' || element1 == 'F' && element2 == 'S') {
			var distance = 1.64;
		}
		if (element1 == 'S' && element2 == 'I' || element1 == 'I' && element2 == 'S') {
			var distance = 2.687;
		}
		if (element1 == 'P' && element2 == 'BR' || element1 == 'BR' && element2 == 'P') {
			var distance = 2.366;
		}
		if (element1 == 'P' && element2 == 'CL' || element1 == 'CL' && element2 == 'P') {
			var distance = 2.008;
		}
		if (element1 == 'P' && element2 == 'F' || element1 == 'F' && element2 == 'P') {
			var distance = 1.495;
		}
		if (element1 == 'P' && element2 == 'I' || element1 == 'I' && element2 == 'P') {
			var distance = 2.49;
		}
		if (element1 == 'P' && element2 == 'O' || element1 == 'O' && element2 == 'P') {
			var distance = 1.6;
		}
		if (element1 == 'N' && element2 == 'BR' || element1 == 'BR' && element2 == 'N') {
			var distance = 1.843;
		}
		if (element1 == 'N' && element2 == 'CL' || element1 == 'CL' && element2 == 'N') {
			var distance = 1.743;
		}
		if (element1 == 'N' && element2 == 'F' || element1 == 'F' && element2 == 'N') {
			var distance = 1.406;
		}
		if (element1 == 'N' && element2 == 'I' || element1 == 'I' && element2 == 'N') {
			var distance = 2.2;
		}
		if (element1 == 'SI' && element2 == 'BR' || element1 == 'BR' && element2 == 'SI') {
			var distance = 2.284;
		}
		if (element1 == 'SI' && element2 == 'CL' || element1 == 'CL' && element2 == 'SI') {
			var distance = 2.072;
		}
		if (element1 == 'SI' && element2 == 'F' || element1 == 'F' && element2 == 'SI') {
			var distance = 1.636;
		}
		if (element1 == 'SI' && element2 == 'P' || element1 == 'P' && element2 == 'SI') {
			var distance = 2.264;
		}
		if (element1 == 'SI' && element2 == 'S' || element1 == 'S' && element2 == 'SI') {
			var distance = 2.145;
		}
		if (element1 == 'SI' && element2 == 'SI' || element1 == 'SI' && element2 == 'SI') {
			var distance = 2.359;
		}
		if (element1 == 'SI' && element2 == 'C' || element1 == 'C' && element2 == 'SI') {
			var distance = 1.888;
		}
		if (element1 == 'SI' && element2 == 'N' || element1 == 'N' && element2 == 'SI') {
			var distance = 1.743;
		}
		if (element1 == 'SI' && element2 == 'O' || element1 == 'O' && element2 == 'SI') {
			var distance = 1.631;
		}
		return distance;
	});},
	get assign_charges () {return __get__ (this, function (self) {
		var all_charged = [];
		for (var atom_index of self.non_protein_atoms) {
			var atom = self.non_protein_atoms [atom_index];
			if (atom.element == 'MG' || atom.element == 'MN' || atom.element == 'RH' || atom.element == 'ZN' || atom.element == 'FE' || atom.element == 'BI' || atom.element == 'AS' || atom.element == 'AG') {
				var chrg = self.Charged (atom.coordinates, [atom_index], true);
				self.charges.append (chrg);
			}
			if (atom.element == 'N') {
				if (atom.number_of_neighbors () == 4) {
					var indexes = [atom_index];
					indexes.extend (atom.indecies_of_atoms_connecting);
					var chrg = self.Charged (atom.coordinates, indexes, true);
					self.charges.append (chrg);
				}
				else if (atom.number_of_neighbors () == 3) {
					var nitrogen = atom;
					var atom1 = self.all_atoms [atom.indecies_of_atoms_connecting [0]];
					var atom2 = self.all_atoms [atom.indecies_of_atoms_connecting [1]];
					var atom3 = self.all_atoms [atom.indecies_of_atoms_connecting [2]];
					var angle1 = (self.functions.angle_between_three_points (atom1.coordinates, nitrogen.coordinates, atom2.coordinates) * 180.0) / math.pi;
					var angle2 = (self.functions.angle_between_three_points (atom1.coordinates, nitrogen.coordinates, atom3.coordinates) * 180.0) / math.pi;
					var angle3 = (self.functions.angle_between_three_points (atom2.coordinates, nitrogen.coordinates, atom3.coordinates) * 180.0) / math.pi;
					var average_angle = ((angle1 + angle2) + angle3) / 3;
					if (math.fabs (average_angle - 109.0) < 5.0) {
						var indexes = [atom_index];
						indexes.extend (atom.indecies_of_atoms_connecting);
						var chrg = self.Charged (nitrogen.coordinates, indexes, true);
						self.charges.append (chrg);
					}
				}
			}
			if (atom.element == 'C') {
				if (atom.number_of_neighbors () == 3) {
					var nitrogens = self.connected_atoms_of_given_element (atom_index, 'N');
					if (len (nitrogens) >= 2) {
						var nitrogens_to_use = [];
						var all_connected = atom.indecies_of_atoms_connecting.__getslice__ (0, null, 1);
						var not_isolated = -(1);
						for (var atmindex of nitrogens) {
							if (len (self.connected_heavy_atoms (atmindex)) == 1) {
								nitrogens_to_use.append (atmindex);
								all_connected.remove (atmindex);
							}
						}
						if (len (all_connected) > 0) {
							var not_isolated = all_connected [0];
						}
						if (len (nitrogens_to_use) == 2 && not_isolated != -(1)) {
							var not_isolated_atom = self.all_atoms [not_isolated];
							if (not_isolated_atom.element == 'C' && not_isolated_atom.number_of_neighbors () == 4 || not_isolated_atom.element == 'O' && not_isolated_atom.number_of_neighbors () == 2 || not_isolated_atom.element == 'N' || not_isolated_atom.element == 'S' || not_isolated_atom.element == 'P') {
								var pt = self.all_atoms [nitrogens_to_use [0]].coordinates.copy_of ();
								pt.x = pt.x + self.all_atoms [nitrogens_to_use [1]].coordinates.x;
								pt.y = pt.y + self.all_atoms [nitrogens_to_use [1]].coordinates.y;
								pt.z = pt.z + self.all_atoms [nitrogens_to_use [1]].coordinates.z;
								pt.x = pt.x / 2.0;
								pt.y = pt.y / 2.0;
								pt.z = pt.z / 2.0;
								var indexes = [atom_index];
								indexes.extend (nitrogens_to_use);
								indexes.extend (self.connected_atoms_of_given_element (nitrogens_to_use [0], 'H'));
								indexes.extend (self.connected_atoms_of_given_element (nitrogens_to_use [1], 'H'));
								var chrg = self.Charged (pt, indexes, true);
								self.charges.append (chrg);
							}
						}
					}
				}
			}
			if (atom.element == 'C') {
				if (atom.number_of_neighbors () == 3) {
					var oxygens = self.connected_atoms_of_given_element (atom_index, 'O');
					if (len (oxygens) == 2) {
						if (len (self.connected_heavy_atoms (oxygens [0])) == 1 && len (self.connected_heavy_atoms (oxygens [1])) == 1) {
							var pt = self.all_atoms [oxygens [0]].coordinates.copy_of ();
							pt.x = pt.x + self.all_atoms [oxygens [1]].coordinates.x;
							pt.y = pt.y + self.all_atoms [oxygens [1]].coordinates.y;
							pt.z = pt.z + self.all_atoms [oxygens [1]].coordinates.z;
							pt.x = pt.x / 2.0;
							pt.y = pt.y / 2.0;
							pt.z = pt.z / 2.0;
							var chrg = self.Charged (pt, [oxygens [0], atom_index, oxygens [1]], false);
							self.charges.append (chrg);
						}
					}
				}
			}
			if (atom.element == 'P') {
				var oxygens = self.connected_atoms_of_given_element (atom_index, 'O');
				if (len (oxygens) >= 2) {
					var count = 0;
					for (var oxygen_index of oxygens) {
						if (len (self.connected_heavy_atoms (oxygen_index)) == 1) {
							var count = count + 1;
						}
					}
					if (count >= 2) {
						var indexes = [atom_index];
						indexes.extend (oxygens);
						var chrg = self.Charged (atom.coordinates, indexes, false);
						self.charges.append (chrg);
					}
				}
			}
			if (atom.element == 'S') {
				var oxygens = self.connected_atoms_of_given_element (atom_index, 'O');
				if (len (oxygens) >= 3) {
					var count = 0;
					for (var oxygen_index of oxygens) {
						if (len (self.connected_heavy_atoms (oxygen_index)) == 1) {
							var count = count + 1;
						}
					}
					if (count >= 3) {
						var indexes = [atom_index];
						indexes.extend (oxygens);
						var chrg = self.Charged (atom.coordinates, indexes, false);
						self.charges.append (chrg);
					}
				}
			}
		}
		var curr_res = '';
		var first = true;
		var residue = [];
		for (var atom_index of self.all_atoms) {
			var atom = self.all_atoms [atom_index];
			var key = (((atom.residue + '_') + str (atom.resid)) + '_') + atom.chain;
			if (first == true) {
				var curr_res = key;
				var first = false;
			}
			if (key != curr_res) {
				self.assign_charged_from_protein_process_residue (residue, last_key);
				var residue = [];
				var curr_res = key;
			}
			residue.append (atom_index);
			var last_key = key;
		}
		self.assign_charged_from_protein_process_residue (residue, last_key);
	});},
	get assign_charged_from_protein_process_residue () {return __get__ (this, function (self, residue, last_key) {
		var temp = last_key.strip ().py_split ('_');
		var resname = temp [0];
		var real_resname = resname.__getslice__ (-(3), null, 1);
		var resid = temp [1];
		var chain = temp [2];
		if (real_resname == 'LYS' || real_resname == 'LYN') {
			for (var index of residue) {
				var atom = self.all_atoms [index];
				if (atom.atom_name.strip () == 'NZ') {
					var indexes = [index];
					for (var index2 of residue) {
						var atom2 = self.all_atoms [index2];
						if (atom2.atom_name.strip () == 'HZ1') {
							indexes.append (index2);
						}
						if (atom2.atom_name.strip () == 'HZ2') {
							indexes.append (index2);
						}
						if (atom2.atom_name.strip () == 'HZ3') {
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
				if (atom.atom_name.strip () == 'NH1') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == 'NH2') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == '2HH2') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == '1HH2') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == 'CZ') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == '2HH1') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == '1HH1') {
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
				if (atom.atom_name.strip () == 'NE2') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == 'ND1') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == 'HE2') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == 'HD1') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == 'CE1') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == 'CD2') {
					indices.append (index);
				}
				if (atom.atom_name.strip () == 'CG') {
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
				if (atom.atom_name.strip () == 'OE1') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == 'OE2') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == 'CD') {
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
				if (atom.atom_name.strip () == 'OD1') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == 'OD2') {
					charge_pt.x = charge_pt.x + atom.coordinates.x;
					charge_pt.y = charge_pt.y + atom.coordinates.y;
					charge_pt.z = charge_pt.z + atom.coordinates.z;
					indices.append (index);
					var count = count + 1.0;
				}
				if (atom.atom_name.strip () == 'CG') {
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
		var AB = self.functions.vector_subtraction (B, A);
		var AC = self.functions.vector_subtraction (C, A);
		var ABXAC = self.functions.cross_product (AB, AC);
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
		for (var atom_index of self.non_protein_atoms) {
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
				var pt1 = self.non_protein_atoms [ring [t]].coordinates;
				var pt2 = self.non_protein_atoms [ring [t + 1]].coordinates;
				var pt3 = self.non_protein_atoms [ring [t + 2]].coordinates;
				var pt4 = self.non_protein_atoms [ring [t + 3]].coordinates;
				var cur_atom = self.non_protein_atoms [ring [t + 3]];
				if (cur_atom.element == 'C' && cur_atom.number_of_neighbors () == 4) {
					var is_flat = false;
					break;
				}
				var angle = (self.functions.dihedral (pt1, pt2, pt3, pt4) * 180) / math.pi;
				if (angle > -(165) && angle < -(15) || angle > 15 && angle < 165) {
					var is_flat = false;
					break;
				}
				for (var substituent_atom_index of cur_atom.indecies_of_atoms_connecting) {
					var pt_sub = self.non_protein_atoms [substituent_atom_index].coordinates;
					var angle = (self.functions.dihedral (pt2, pt3, pt4, pt_sub) * 180) / math.pi;
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
		for (var atom_index of self.all_atoms) {
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
		var resid = temp [1];
		var chain = temp [2];
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
		if (real_resname == 'HIS' || real_resname == 'HID' || real_resname == 'HIE' || real_resname == 'HIP') {
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
		for (var conneceted_atom of atom.indecies_of_atoms_connecting) {
			self.ring_recursive (conneceted_atom, [index], index, all_rings);
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
		for (var conneceted_atom of atom.indecies_of_atoms_connecting) {
			if (!(__in__ (conneceted_atom, already_crossed))) {
				self.ring_recursive (conneceted_atom, temp, orig_atom, all_rings);
			}
			if (conneceted_atom == orig_atom && orig_atom != already_crossed [-(1)]) {
				all_rings.append (temp);
			}
		}
	});},
	get assign_secondary_structure () {return __get__ (this, function (self) {
		var resids = [];
		var last_key = '-99999_Z';
		for (var atom_index of self.all_atoms) {
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
		for (var atom_index of self.all_atoms) {
			var atom = self.all_atoms [atom_index];
			if (atom.side_chain_or_backbone () == 'BACKBONE') {
				if (len (atoms) < 8) {
					atoms.append (atom);
				}
				else {
					atoms.py_pop (0);
					atoms.append (atom);
					if (atoms [0].resid == atoms [1].resid && atoms [0].resid == atoms [2].resid && atoms [0].resid == atoms [3].resid && atoms [0] != atoms [4].resid && atoms [4].resid == atoms [5].resid && atoms [4].resid == atoms [6].resid && atoms [4].resid == atoms [7].resid && atoms [0].resid + 1 == atoms [7].resid && atoms [0].chain == atoms [7].chain) {
						var resid1 = atoms [0].resid;
						var resid2 = atoms [7].resid;
						for (var atom of atoms) {
							if (atom.resid == resid1 && atom.atom_name.strip () == 'N') {
								var first_N = atom;
							}
							if (atom.resid == resid1 && atom.atom_name.strip () == 'C') {
								var first_C = atom;
							}
							if (atom.resid == resid1 && atom.atom_name.strip () == 'CA') {
								var first_CA = atom;
							}
							if (atom.resid == resid2 && atom.atom_name.strip () == 'N') {
								var second_N = atom;
							}
							if (atom.resid == resid2 && atom.atom_name.strip () == 'C') {
								var second_C = atom;
							}
							if (atom.resid == resid2 && atom.atom_name.strip () == 'CA') {
								var second_CA = atom;
							}
						}
						var phi = (self.functions.dihedral (first_C.coordinates, second_N.coordinates, second_CA.coordinates, second_C.coordinates) * 180.0) / math.pi;
						var psi = (self.functions.dihedral (first_N.coordinates, first_CA.coordinates, first_C.coordinates, second_N.coordinates) * 180.0) / math.pi;
						if (phi > -(145) && phi < -(35) && psi > -(70) && psi < 50) {
							var key1 = (str (first_C.resid) + '_') + first_C.chain;
							var key2 = (str (second_C.resid) + '_') + second_C.chain;
							structure [key1] = 'ALPHA';
							structure [key2] = 'ALPHA';
						}
						if (phi >= -(180) && phi < -(40) && psi <= 180 && psi > 90 || phi >= -(180) && phi < -(70) && psi <= -(165)) {
							var key1 = (str (first_C.resid) + '_') + first_C.chain;
							var key2 = (str (second_C.resid) + '_') + second_C.chain;
							structure [key1] = 'BETA';
							structure [key2] = 'BETA';
						}
					}
				}
			}
		}
		for (var atom_index of self.all_atoms) {
			var atom = self.all_atoms [atom_index];
			var key = (str (atom.resid) + '_') + atom.chain;
			atom.structure = structure [key];
		}
		var CA_list = [];
		for (var atom_index of self.all_atoms) {
			var atom = self.all_atoms [atom_index];
			if (__in__ (atom.residue.strip (), self.protein_resnames) && atom.atom_name.strip () == 'CA') {
				CA_list.append (atom_index);
			}
		}
		var change = true;
		while (change == true) {
			var change = false;
			for (var CA_atom_index of CA_list) {
				var CA_atom = self.all_atoms [CA_atom_index];
				if (CA_atom.structure == 'ALPHA') {
					var another_alpha_is_close = false;
					for (var other_CA_atom_index of CA_list) {
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
			for (var index_in_list = 0; index_in_list < len (CA_list) - 5; index_in_list++) {
				var index_in_pdb1 = CA_list [index_in_list];
				var index_in_pdb2 = CA_list [index_in_list + 1];
				var index_in_pdb3 = CA_list [index_in_list + 2];
				var index_in_pdb4 = CA_list [index_in_list + 3];
				var index_in_pdb5 = CA_list [index_in_list + 4];
				var index_in_pdb6 = CA_list [index_in_list + 5];
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
			for (var CA_atom_index of CA_list) {
				var CA_atom = self.all_atoms [CA_atom_index];
				if (CA_atom.structure == 'BETA') {
					var another_beta_is_close = false;
					for (var other_CA_atom_index of CA_list) {
						if (other_CA_atom_index != CA_atom_index) {
							var other_CA_atom = self.all_atoms [other_CA_atom_index];
							if (other_CA_atom.structure == 'BETA') {
								if (other_CA_atom.chain == CA_atom.chain) {
									if (math.fabs (other_CA_atom.resid - CA_atom.resid) > 2) {
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
			for (var index_in_list = 0; index_in_list < len (CA_list) - 3; index_in_list++) {
				var index_in_pdb1 = CA_list [index_in_list];
				var index_in_pdb2 = CA_list [index_in_list + 1];
				var index_in_pdb3 = CA_list [index_in_list + 2];
				var index_in_pdb4 = CA_list [index_in_list + 3];
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
		for (var atom_index of self.all_atoms) {
			var atom = self.all_atoms [atom_index];
			if (atom.chain == chain && atom.resid == resid) {
				atom.structure = structure;
			}
		}
	});}
});
export var MathFunctions =  __class__ ('MathFunctions', [object], {
	__module__: __name__,
	get planrity () {return __get__ (this, function (self, point1, point2, point3, point4) {
		var x1 = point1.x;
		var y1 = point1.y;
		var z1 = point1.z;
		var x2 = point2.x;
		var y2 = point2.y;
		var z2 = point2.z;
		var x3 = point3.x;
		var y3 = point3.y;
		var z3 = point3.z;
		var x4 = point4.x;
		var y4 = point4.y;
		var z4 = point4.z;
		var A = (y1 * (z2 - z3) + y2 * (z3 - z1)) + y3 * (z1 - z2);
		var B = (z1 * (x2 - x3) + z2 * (x3 - x1)) + z3 * (x1 - x2);
		var C = (x1 * (y2 - y3) + x2 * (y3 - y1)) + x3 * (y1 - y2);
		var D = (-(x1) * (y2 * z3 - y3 * z2) + -(x2) * (y3 * z1 - y1 * z3)) + -(x3) * (y1 * z2 - y2 * z1);
		var distance = math.fabs (((A * x4 + B * y4) + C * z4) + D) / math.sqrt ((math.pow (A, 2) + math.pow (B, 2)) + math.pow (C, 2));
		var A1 = (y1 * (z2 - z4) + y2 * (z4 - z1)) + y4 * (z1 - z2);
		var B1 = (z1 * (x2 - x4) + z2 * (x4 - x1)) + z4 * (x1 - x2);
		var C1 = (x1 * (y2 - y4) + x2 * (y4 - y1)) + x4 * (y1 - y2);
		var D1 = (-(x1) * (y2 * z4 - y4 * z2) + -(x2) * (y4 * z1 - y1 * z4)) + -(x4) * (y1 * z2 - y2 * z1);
		var distance1 = math.fabs (((A1 * x3 + B1 * y3) + C1 * z3) + D1) / math.sqrt ((math.pow (A1, 2) + math.pow (B1, 2)) + math.pow (C1, 2));
		var A2 = (y1 * (z4 - z3) + y4 * (z3 - z1)) + y3 * (z1 - z4);
		var B2 = (z1 * (x4 - x3) + z4 * (x3 - x1)) + z3 * (x1 - x4);
		var C2 = (x1 * (y4 - y3) + x4 * (y3 - y1)) + x3 * (y1 - y4);
		var D2 = (-(x1) * (y4 * z3 - y3 * z4) + -(x4) * (y3 * z1 - y1 * z3)) + -(x3) * (y1 * z4 - y4 * z1);
		var distance2 = math.fabs (((A2 * x2 + B2 * y2) + C2 * z2) + D2) / math.sqrt ((math.pow (A2, 2) + math.pow (B2, 2)) + math.pow (C2, 2));
		var A3 = (y4 * (z2 - z3) + y2 * (z3 - z4)) + y3 * (z4 - z2);
		var B3 = (z4 * (x2 - x3) + z2 * (x3 - x4)) + z3 * (x4 - x2);
		var C3 = (x4 * (y2 - y3) + x2 * (y3 - y4)) + x3 * (y4 - y2);
		var D3 = (-(x4) * (y2 * z3 - y3 * z2) + -(x2) * (y3 * z4 - y4 * z3)) + -(x3) * (y4 * z2 - y2 * z4);
		var distance3 = math.fabs (((A3 * x1 + B3 * y1) + C3 * z1) + D3) / math.sqrt ((math.pow (A3, 2) + math.pow (B3, 2)) + math.pow (C3, 2));
		var final_dist = -(1);
		if (distance < distance1 && distance < distance2 && distance < distance3) {
			var final_dist = distance;
		}
		else if (distance1 < distance && distance1 < distance2 && distance1 < distance3) {
			var final_dist = distance1;
		}
		else if (distance2 < distance && distance2 < distance1 && distance2 < distance3) {
			var final_dist = distance2;
		}
		else if (distance3 < distance && distance3 < distance1 && distance3 < distance2) {
			var final_dist = distance3;
		}
		return final_dist;
	});},
	get vector_subtraction () {return __get__ (this, function (self, vector1, vector2) {
		return Point (vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
	});},
	get cross_product () {return __get__ (this, function (self, Pt1, Pt2) {
		var response = Point (0, 0, 0);
		response.x = Pt1.y * Pt2.z - Pt1.z * Pt2.y;
		response.y = Pt1.z * Pt2.x - Pt1.x * Pt2.z;
		response.z = Pt1.x * Pt2.y - Pt1.y * Pt2.x;
		return response;
	});},
	get vector_scalar_multiply () {return __get__ (this, function (self, vector, scalar) {
		return Point (vector.x * scalar, vector.y * scalar, vector.z * scalar);
	});},
	get dot_product () {return __get__ (this, function (self, point1, point2) {
		return (point1.x * point2.x + point1.y * point2.y) + point1.z * point2.z;
	});},
	get dihedral () {return __get__ (this, function (self, point1, point2, point3, point4) {
		var b1 = self.vector_subtraction (point2, point1);
		var b2 = self.vector_subtraction (point3, point2);
		var b3 = self.vector_subtraction (point4, point3);
		var b2Xb3 = self.cross_product (b2, b3);
		var b1Xb2 = self.cross_product (b1, b2);
		var b1XMagb2 = self.vector_scalar_multiply (b1, b2.magnitude ());
		var radians = math.atan2 (self.dot_product (b1XMagb2, b2Xb3), self.dot_product (b1Xb2, b2Xb3));
		return radians;
	});},
	get angle_between_three_points () {return __get__ (this, function (self, point1, point2, point3) {
		var vector1 = self.vector_subtraction (point1, point2);
		var vector2 = self.vector_subtraction (point3, point2);
		return self.angle_between_points (vector1, vector2);
	});},
	get angle_between_points () {return __get__ (this, function (self, point1, point2) {
		var new_point1 = self.return_normalized_vector (point1);
		var new_point2 = self.return_normalized_vector (point2);
		var dot_prod = self.dot_product (new_point1, new_point2);
		if (dot_prod > 1.0) {
			var dot_prod = 1.0;
		}
		if (dot_prod < -(1.0)) {
			var dot_prod = -(1.0);
		}
		return math.acos (dot_prod);
	});},
	get return_normalized_vector () {return __get__ (this, function (self, vector) {
		var dist = self.distance (Point (0, 0, 0), vector);
		return Point (vector.x / dist, vector.y / dist, vector.z / dist);
	});},
	get distance () {return __get__ (this, function (self, point1, point2) {
		var deltax = point1.x - point2.x;
		var deltay = point1.y - point2.y;
		var deltaz = point1.z - point2.z;
		return math.sqrt ((math.pow (deltax, 2) + math.pow (deltay, 2)) + math.pow (deltaz, 2));
	});},
	get project_point_onto_plane () {return __get__ (this, function (self, a_point, plane_coefficients) {
		var a = plane_coefficients [0];
		var b = plane_coefficients [1];
		var c = plane_coefficients [2];
		var d = plane_coefficients [3];
		var s = a_point.x;
		var u = a_point.y;
		var v = a_point.z;
		var t = (((d - a * s) - b * u) - c * v) / ((a * a + b * b) + c * c);
		var x = s + a * t;
		var y = u + b * t;
		var z = v + c * t;
		return Point (x, y, z);
	});}
});
export var Binana =  __class__ ('Binana', [object], {
	__module__: __name__,
	functions: MathFunctions (),
	get list_alphebetize_and_combine () {return __get__ (this, function (self, list_obj) {
		list_obj.py_sort ();
		return '_'.join (list_obj);
	});},
	get hashtable_entry_add_one () {return __get__ (this, function (self, hashtable, key, toadd) {
		if (typeof toadd == 'undefined' || (toadd != null && toadd.hasOwnProperty ("__kwargtrans__"))) {;
			var toadd = 1;
		};
		if (__in__ (key, hashtable)) {
			hashtable [key] = hashtable [key] + toadd;
		}
		else {
			hashtable [key] = toadd;
		}
	});},
	get center () {return __get__ (this, function (self, string, length) {
		while (len (string) < length) {
			var string = ' ' + string;
			if (len (string) < length) {
				var string = string + ' ';
			}
		}
		return string;
	});},
	get __init__ () {return __get__ (this, function (self, ligand_pdbqt_filename, receptor_pdbqt_filename, parameters) {
		self.ligfi = ligand_pdbqt_filename;
		self.recfi = receptor_pdbqt_filename;
		var ligand = PDB ();
		ligand.load_PDB (ligand_pdbqt_filename);
		var receptor = PDB ();
		receptor.load_PDB (receptor_pdbqt_filename);
		receptor.assign_secondary_structure ();
		var ligand_receptor_atom_type_pairs_less_than_two_half = dict ({});
		var ligand_receptor_atom_type_pairs_less_than_four = dict ({});
		var ligand_receptor_atom_type_pairs_electrostatic = dict ({});
		var active_site_flexibility = dict ({});
		var hbonds = dict ({});
		var hydrophobics = dict ({});
		var functions = MathFunctions ();
		var pdb_close_contacts = PDB ();
		var pdb_contacts = PDB ();
		var pdb_contacts_alpha_helix = PDB ();
		var pdb_contacts_beta_sheet = PDB ();
		var pdb_contacts_other_2nd_structure = PDB ();
		var pdb_side_chain = PDB ();
		var pdb_back_bone = PDB ();
		var pdb_hydrophobic = PDB ();
		var pdb_hbonds = PDB ();
		var close_contacts_labels = [];
		var contacts_labels = [];
		var hydrophobic_labels = [];
		var hbonds_labels = [];
		for (var ligand_atom_index of ligand.all_atoms) {
			for (var receptor_atom_index of receptor.all_atoms) {
				var ligand_atom = ligand.all_atoms [ligand_atom_index];
				var receptor_atom = receptor.all_atoms [receptor_atom_index];
				var dist = ligand_atom.coordinates.dist_to (receptor_atom.coordinates);
				if (dist < parameters.params ['close_contacts_dist1_cutoff']) {
					var list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type];
					self.hashtable_entry_add_one (ligand_receptor_atom_type_pairs_less_than_two_half, self.list_alphebetize_and_combine (list_ligand_atom));
					pdb_close_contacts.add_new_atom (ligand_atom.copy_of ());
					pdb_close_contacts.add_new_atom (receptor_atom.copy_of ());
					close_contacts_labels.append (tuple ([ligand_atom.string_id (), receptor_atom.string_id ()]));
				}
				else if (dist < parameters.params ['close_contacts_dist2_cutoff']) {
					var list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type];
					self.hashtable_entry_add_one (ligand_receptor_atom_type_pairs_less_than_four, self.list_alphebetize_and_combine (list_ligand_atom));
					pdb_contacts.add_new_atom (ligand_atom.copy_of ());
					pdb_contacts.add_new_atom (receptor_atom.copy_of ());
					contacts_labels.append (tuple ([ligand_atom.string_id (), receptor_atom.string_id ()]));
				}
				if (dist < parameters.params ['electrostatic_dist_cutoff']) {
					var ligand_charge = ligand_atom.charge;
					var receptor_charge = receptor_atom.charge;
					var coulomb_energy = ((ligand_charge * receptor_charge) / dist) * 1389423.8460104696;
					var list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type];
					self.hashtable_entry_add_one (ligand_receptor_atom_type_pairs_electrostatic, self.list_alphebetize_and_combine (list_ligand_atom), coulomb_energy);
				}
				if (dist < parameters.params ['active_site_flexibility_dist_cutoff']) {
					var flexibility_key = (receptor_atom.side_chain_or_backbone () + '_') + receptor_atom.structure;
					if (receptor_atom.structure == 'ALPHA') {
						pdb_contacts_alpha_helix.add_new_atom (receptor_atom.copy_of ());
					}
					else if (receptor_atom.structure == 'BETA') {
						pdb_contacts_beta_sheet.add_new_atom (receptor_atom.copy_of ());
					}
					else if (receptor_atom.structure == 'OTHER') {
						pdb_contacts_other_2nd_structure.add_new_atom (receptor_atom.copy_of ());
					}
					if (receptor_atom.side_chain_or_backbone () == 'BACKBONE') {
						pdb_back_bone.add_new_atom (receptor_atom.copy_of ());
					}
					else if (receptor_atom.side_chain_or_backbone () == 'SIDECHAIN') {
						pdb_side_chain.add_new_atom (receptor_atom.copy_of ());
					}
					self.hashtable_entry_add_one (active_site_flexibility, flexibility_key);
				}
				if (dist < parameters.params ['hydrophobic_dist_cutoff']) {
					if (ligand_atom.element == 'C' && receptor_atom.element == 'C') {
						var hydrophobic_key = (receptor_atom.side_chain_or_backbone () + '_') + receptor_atom.structure;
						pdb_hydrophobic.add_new_atom (ligand_atom.copy_of ());
						pdb_hydrophobic.add_new_atom (receptor_atom.copy_of ());
						self.hashtable_entry_add_one (hydrophobics, hydrophobic_key);
						hydrophobic_labels.append (tuple ([ligand_atom.string_id (), receptor_atom.string_id ()]));
					}
				}
				if (dist < parameters.params ['hydrogen_bond_dist_cutoff']) {
					if ((ligand_atom.element == 'O' || ligand_atom.element == 'N') && (receptor_atom.element == 'O' || receptor_atom.element == 'N')) {
						var hydrogens = [];
						for (var atm_index of ligand.all_atoms) {
							if (ligand.all_atoms [atm_index].element == 'H') {
								if (ligand.all_atoms [atm_index].coordinates.dist_to (ligand_atom.coordinates) < 1.3) {
									ligand.all_atoms [atm_index].comment = 'LIGAND';
									hydrogens.append (ligand.all_atoms [atm_index]);
								}
							}
						}
						for (var atm_index of receptor.all_atoms) {
							if (receptor.all_atoms [atm_index].element == 'H') {
								if (receptor.all_atoms [atm_index].coordinates.dist_to (receptor_atom.coordinates) < 1.3) {
									receptor.all_atoms [atm_index].comment = 'RECEPTOR';
									hydrogens.append (receptor.all_atoms [atm_index]);
								}
							}
						}
						for (var hydrogen of hydrogens) {
							if (math.fabs (180 - (functions.angle_between_three_points (ligand_atom.coordinates, hydrogen.coordinates, receptor_atom.coordinates) * 180.0) / math.pi) <= parameters.params ['hydrogen_bond_angle_cutoff']) {
								var hbonds_key = (((('HDONOR_' + hydrogen.comment) + '_') + receptor_atom.side_chain_or_backbone ()) + '_') + receptor_atom.structure;
								pdb_hbonds.add_new_atom (ligand_atom.copy_of ());
								pdb_hbonds.add_new_atom (hydrogen.copy_of ());
								pdb_hbonds.add_new_atom (receptor_atom.copy_of ());
								self.hashtable_entry_add_one (hbonds, hbonds_key);
								hbonds_labels.append (tuple ([ligand_atom.string_id (), hydrogen.string_id (), receptor_atom.string_id ()]));
							}
						}
					}
				}
			}
		}
		var ligand_atom_types = dict ({});
		for (var ligand_atom_index of ligand.all_atoms) {
			var ligand_atom = ligand.all_atoms [ligand_atom_index];
			self.hashtable_entry_add_one (ligand_atom_types, ligand_atom.atom_type);
		}
		var pi_padding = parameters.params ['pi_padding_dist'];
		var PI_interactions = dict ({});
		var pdb_pistack = PDB ();
		var pdb_pi_T = PDB ();
		var pi_stacking_labels = [];
		var T_stacking_labels = [];
		for (var aromatic1 of ligand.aromatic_rings) {
			for (var aromatic2 of receptor.aromatic_rings) {
				var dist = aromatic1.center.dist_to (aromatic2.center);
				if (dist < parameters.params ['pi_pi_interacting_dist_cutoff']) {
					var aromatic1_norm_vector = Point (aromatic1.plane_coeff [0], aromatic1.plane_coeff [1], aromatic1.plane_coeff [2]);
					var aromatic2_norm_vector = Point (aromatic2.plane_coeff [0], aromatic2.plane_coeff [1], aromatic2.plane_coeff [2]);
					var angle_between_planes = (self.functions.angle_between_points (aromatic1_norm_vector, aromatic2_norm_vector) * 180.0) / math.pi;
					if (math.fabs (angle_between_planes - 0) < parameters.params ['pi_stacking_angle_tolerance'] || math.fabs (angle_between_planes - 180) < parameters.params ['pi_stacking_angle_tolerance']) {
						var pi_pi = false;
						for (var ligand_ring_index of aromatic1.indices) {
							var pt_on_receptor_plane = self.functions.project_point_onto_plane (ligand.all_atoms [ligand_ring_index].coordinates, aromatic2.plane_coeff);
							if (pt_on_receptor_plane.dist_to (aromatic2.center) <= aromatic2.radius + pi_padding) {
								var pi_pi = true;
								break;
							}
						}
						if (pi_pi == false) {
							for (var receptor_ring_index of aromatic2.indices) {
								var pt_on_ligand_plane = self.functions.project_point_onto_plane (receptor.all_atoms [receptor_ring_index].coordinates, aromatic1.plane_coeff);
								if (pt_on_ligand_plane.dist_to (aromatic1.center) <= aromatic1.radius + pi_padding) {
									var pi_pi = true;
									break;
								}
							}
						}
						if (pi_pi == true) {
							var structure = receptor.all_atoms [aromatic2.indices [0]].structure;
							if (structure == '') {
								var structure = 'OTHER';
							}
							var key = 'STACKING_' + structure;
							for (var index of aromatic1.indices) {
								pdb_pistack.add_new_atom (ligand.all_atoms [index].copy_of ());
							}
							for (var index of aromatic2.indices) {
								pdb_pistack.add_new_atom (receptor.all_atoms [index].copy_of ());
							}
							self.hashtable_entry_add_one (PI_interactions, key);
							pi_stacking_labels.append (tuple ([('[' + ' / '.join ((function () {
								var __accu0__ = [];
								for (var index of aromatic1.indices) {
									__accu0__.append (ligand.all_atoms [index].string_id ());
								}
								return __accu0__;
							}) ())) + ']', ('[' + ' / '.join ((function () {
								var __accu0__ = [];
								for (var index of aromatic2.indices) {
									__accu0__.append (receptor.all_atoms [index].string_id ());
								}
								return __accu0__;
							}) ())) + ']']));
						}
					}
					else if (math.fabs (angle_between_planes - 90) < parameters.params ['T_stacking_angle_tolerance'] || math.fabs (angle_between_planes - 270) < parameters.params ['T_stacking_angle_tolerance']) {
						var min_dist = 100.0;
						for (var ligand_ind of aromatic1.indices) {
							var ligand_at = ligand.all_atoms [ligand_ind];
							for (var receptor_ind of aromatic2.indices) {
								var receptor_at = receptor.all_atoms [receptor_ind];
								var dist = ligand_at.coordinates.dist_to (receptor_at.coordinates);
								if (dist < min_dist) {
									var min_dist = dist;
								}
							}
						}
						if (min_dist <= parameters.params ['T_stacking_closest_dist_cutoff']) {
							var pt_on_receptor_plane = self.functions.project_point_onto_plane (aromatic1.center, aromatic2.plane_coeff);
							var pt_on_lignad_plane = self.functions.project_point_onto_plane (aromatic2.center, aromatic1.plane_coeff);
							if (pt_on_receptor_plane.dist_to (aromatic2.center) <= aromatic2.radius + pi_padding || pt_on_lignad_plane.dist_to (aromatic1.center) <= aromatic1.radius + pi_padding) {
								var structure = receptor.all_atoms [aromatic2.indices [0]].structure;
								if (structure == '') {
									var structure = 'OTHER';
								}
								var key = 'T-SHAPED_' + structure;
								for (var index of aromatic1.indices) {
									pdb_pi_T.add_new_atom (ligand.all_atoms [index].copy_of ());
								}
								for (var index of aromatic2.indices) {
									pdb_pi_T.add_new_atom (receptor.all_atoms [index].copy_of ());
								}
								self.hashtable_entry_add_one (PI_interactions, key);
								T_stacking_labels.append (tuple ([('[' + ' / '.join ((function () {
									var __accu0__ = [];
									for (var index of aromatic1.indices) {
										__accu0__.append (ligand.all_atoms [index].string_id ());
									}
									return __accu0__;
								}) ())) + ']', ('[' + ' / '.join ((function () {
									var __accu0__ = [];
									for (var index of aromatic2.indices) {
										__accu0__.append (receptor.all_atoms [index].string_id ());
									}
									return __accu0__;
								}) ())) + ']']));
							}
						}
					}
				}
			}
		}
		var pdb_pi_cat = PDB ();
		var pi_cat_labels = [];
		for (var aromatic of receptor.aromatic_rings) {
			for (var charged of ligand.charges) {
				if (charged.positive == true) {
					if (charged.coordinates.dist_to (aromatic.center) < parameters.params ['cation_pi_dist_cutoff']) {
						var charge_projected = self.functions.project_point_onto_plane (charged.coordinates, aromatic.plane_coeff);
						if (charge_projected.dist_to (aromatic.center) < aromatic.radius + pi_padding) {
							var structure = receptor.all_atoms [aromatic.indices [0]].structure;
							if (structure == '') {
								var structure = 'OTHER';
							}
							var key = 'PI-CATION_LIGAND-CHARGED_' + structure;
							for (var index of aromatic.indices) {
								pdb_pi_cat.add_new_atom (receptor.all_atoms [index].copy_of ());
							}
							for (var index of charged.indices) {
								pdb_pi_cat.add_new_atom (ligand.all_atoms [index].copy_of ());
							}
							self.hashtable_entry_add_one (PI_interactions, key);
							pi_cat_labels.append (tuple ([('[' + ' / '.join ((function () {
								var __accu0__ = [];
								for (var index of charged.indices) {
									__accu0__.append (ligand.all_atoms [index].string_id ());
								}
								return __accu0__;
							}) ())) + ']', ('[' + ' / '.join ((function () {
								var __accu0__ = [];
								for (var index of aromatic.indices) {
									__accu0__.append (receptor.all_atoms [index].string_id ());
								}
								return __accu0__;
							}) ())) + ']']));
						}
					}
				}
			}
		}
		for (var aromatic of ligand.aromatic_rings) {
			for (var charged of receptor.charges) {
				if (charged.positive == true) {
					if (charged.coordinates.dist_to (aromatic.center) < parameters.params ['cation_pi_dist_cutoff']) {
						var charge_projected = self.functions.project_point_onto_plane (charged.coordinates, aromatic.plane_coeff);
						if (charge_projected.dist_to (aromatic.center) < aromatic.radius + pi_padding) {
							var structure = receptor.all_atoms [charged.indices [0]].structure;
							if (structure == '') {
								var structure = 'OTHER';
							}
							var key = 'PI-CATION_RECEPTOR-CHARGED_' + structure;
							for (var index of aromatic.indices) {
								pdb_pi_cat.add_new_atom (ligand.all_atoms [index].copy_of ());
							}
							for (var index of charged.indices) {
								pdb_pi_cat.add_new_atom (receptor.all_atoms [index].copy_of ());
							}
							self.hashtable_entry_add_one (PI_interactions, key);
							pi_cat_labels.append (tuple ([('[' + ' / '.join ((function () {
								var __accu0__ = [];
								for (var index of aromatic.indices) {
									__accu0__.append (ligand.all_atoms [index].string_id ());
								}
								return __accu0__;
							}) ())) + ']', ('[' + ' / '.join ((function () {
								var __accu0__ = [];
								for (var index of charged.indices) {
									__accu0__.append (receptor.all_atoms [index].string_id ());
								}
								return __accu0__;
							}) ())) + ']']));
						}
					}
				}
			}
		}
		var pdb_salt_bridges = PDB ();
		var salt_bridges = dict ({});
		var salt_bridge_labels = [];
		for (var receptor_charge of receptor.charges) {
			for (var ligand_charge of ligand.charges) {
				if (ligand_charge.positive != receptor_charge.positive) {
					if (ligand_charge.coordinates.dist_to (receptor_charge.coordinates) < parameters.params ['salt_bridge_dist_cutoff']) {
						var structure = receptor.all_atoms [receptor_charge.indices [0]].structure;
						if (structure == '') {
							var structure = 'OTHER';
						}
						var key = 'SALT-BRIDGE_' + structure;
						for (var index of receptor_charge.indices) {
							pdb_salt_bridges.add_new_atom (receptor.all_atoms [index].copy_of ());
						}
						for (var index of ligand_charge.indices) {
							pdb_salt_bridges.add_new_atom (ligand.all_atoms [index].copy_of ());
						}
						self.hashtable_entry_add_one (salt_bridges, key);
						salt_bridge_labels.append (tuple ([('[' + ' / '.join ((function () {
							var __accu0__ = [];
							for (var index of ligand_charge.indices) {
								__accu0__.append (ligand.all_atoms [index].string_id ());
							}
							return __accu0__;
						}) ())) + ']', ('[' + ' / '.join ((function () {
							var __accu0__ = [];
							for (var index of receptor_charge.indices) {
								__accu0__.append (receptor.all_atoms [index].string_id ());
							}
							return __accu0__;
						}) ())) + ']']));
					}
				}
			}
		}
		var preface = 'REMARK ';
		var json_output = self.json_file (close_contacts_labels, contacts_labels, hbonds_labels, hydrophobic_labels, pi_stacking_labels, T_stacking_labels, pi_cat_labels, salt_bridge_labels);
		print ('json output:');
		print (json_output);
		var output = '';
		var output = ((output + preface) + 'Command-line parameters used:') + '\n';
		var output = ((output + preface) + '                 Parameter              |            Value           ') + '\n';
		var output = ((output + preface) + '   -------------------------------------|----------------------------') + '\n';
		for (var key of list (parameters.params.py_keys ())) {
			var value = str (parameters.params [key]);
			var output = (((((output + preface) + '   ') + self.center (key, 37)) + '| ') + self.center (value, 27)) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((((output + preface) + 'Atom-type pair counts within ') + str (parameters.params ['close_contacts_dist1_cutoff'])) + ' angstroms:') + '\n';
		var output = ((output + preface) + '    Atom Type | Atom Type | Count') + '\n';
		var output = ((output + preface) + '   -----------|-----------|-------') + '\n';
		for (var key of ligand_receptor_atom_type_pairs_less_than_two_half) {
			var value = ligand_receptor_atom_type_pairs_less_than_two_half [key];
			var key = key.py_split ('_');
			var output = (((((((output + preface) + '   ') + self.center (key [0], 11)) + '|') + self.center (key [1], 11)) + '|') + self.center (str (value), 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of close_contacts_labels) {
			var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
		}
		var output = (output + preface) + '\n\n';
		var output = ((((output + preface) + 'Atom-type pair counts within ') + str (parameters.params ['close_contacts_dist2_cutoff'])) + ' angstroms:') + '\n';
		var output = ((output + preface) + '    Atom Type | Atom Type | Count') + '\n';
		var output = ((output + preface) + '   -----------|-----------|-------') + '\n';
		for (var key of ligand_receptor_atom_type_pairs_less_than_four) {
			var value = ligand_receptor_atom_type_pairs_less_than_four [key];
			var key = key.py_split ('_');
			var output = (((((((output + preface) + '   ') + self.center (key [0], 11)) + '|') + self.center (key [1], 11)) + '|') + self.center (str (value), 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of contacts_labels) {
			var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'Ligand atom types:') + '\n';
		var output = ((output + preface) + '    Atom Type ') + '\n';
		var output = ((output + preface) + '   -----------') + '\n';
		for (var key of ligand_atom_types) {
			var output = (((output + preface) + '   ') + self.center (key, 11)) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'Summed electrostatic energy by atom-type pair, in J/mol:') + '\n';
		var output = ((output + preface) + '    Atom Type | Atom Type | Energy (J/mol)') + '\n';
		var output = ((output + preface) + '   -----------|-----------|----------------') + '\n';
		for (var key of ligand_receptor_atom_type_pairs_electrostatic) {
			var value = ligand_receptor_atom_type_pairs_electrostatic [key];
			var key = key.py_split ('_');
			var output = (((((((output + preface) + '   ') + self.center (key [0], 11)) + '|') + self.center (key [1], 11)) + '|') + self.center (str (value), 16)) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = (((output + preface) + 'Number of rotatable bonds in the ligand: ') + str (ligand.rotateable_bonds_count)) + '\n';
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'Active-site flexibility:') + '\n';
		var output = ((output + preface) + '    Sidechain/Backbone | Secondary Structure | Count ') + '\n';
		var output = ((output + preface) + '   --------------------|---------------------|-------') + '\n';
		for (var key of active_site_flexibility) {
			var value = active_site_flexibility [key];
			var key = key.py_split ('_');
			var output = (((((((output + preface) + '   ') + self.center (key [0], 20)) + '|') + self.center (key [1], 21)) + '|') + self.center (str (value), 7)) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'Hydrogen bonds:') + '\n';
		var output = ((output + preface) + '    Location of Donor | Sidechain/Backbone | Secondary Structure | Count ') + '\n';
		var output = ((output + preface) + '   -------------------|--------------------|---------------------|-------') + '\n';
		for (var key of hbonds) {
			var value = hbonds [key];
			var key = key.py_split ('_');
			var output = (((((((((output + preface) + '   ') + self.center (key [1], 19)) + '|') + self.center (key [2], 20)) + '|') + self.center (key [3], 21)) + '|') + self.center (str (value), 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of hbonds_labels) {
			var output = (((((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + ' - ') + atom_pairs [2]) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'Hydrophobic contacts (C-C):') + '\n';
		var output = ((output + preface) + '    Sidechain/Backbone | Secondary Structure | Count ') + '\n';
		var output = ((output + preface) + '   --------------------|---------------------|-------') + '\n';
		for (var key of hydrophobics) {
			var value = hydrophobics [key];
			var key = key.py_split ('_');
			var output = (((((((output + preface) + '   ') + self.center (key [0], 20)) + '|') + self.center (key [1], 21)) + '|') + self.center (str (value), 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of hydrophobic_labels) {
			var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
		}
		var stacking = [];
		var t_shaped = [];
		var pi_cation = [];
		for (var key of PI_interactions) {
			var value = PI_interactions [key];
			var together = (key + '_') + str (value);
			if (__in__ ('STACKING', together)) {
				stacking.append (together);
			}
			if (__in__ ('CATION', together)) {
				pi_cation.append (together);
			}
			if (__in__ ('SHAPED', together)) {
				t_shaped.append (together);
			}
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'pi-pi stacking interactions:') + '\n';
		var output = ((output + preface) + '    Secondary Structure | Count ') + '\n';
		var output = ((output + preface) + '   ---------------------|-------') + '\n';
		for (var item of stacking) {
			var item = item.py_split ('_');
			var output = (((((output + preface) + '   ') + self.center (item [1], 21)) + '|') + self.center (item [2], 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of pi_stacking_labels) {
			var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'T-stacking (face-to-edge) interactions:') + '\n';
		var output = ((output + preface) + '    Secondary Structure | Count ') + '\n';
		var output = ((output + preface) + '   ---------------------|-------') + '\n';
		for (var item of t_shaped) {
			var item = item.py_split ('_');
			var output = (((((output + preface) + '   ') + self.center (item [1], 21)) + '|') + self.center (item [2], 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of T_stacking_labels) {
			var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'Cation-pi interactions:') + '\n';
		var output = ((output + preface) + '    Which residue is charged? | Secondary Structure | Count ') + '\n';
		var output = ((output + preface) + '   ---------------------------|---------------------|-------') + '\n';
		for (var item of pi_cation) {
			var item = item.py_split ('_');
			var item2 = item [1].py_split ('-');
			var output = (((((((output + preface) + '   ') + self.center (item2 [0], 27)) + '|') + self.center (item [2], 21)) + '|') + self.center (item [3], 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of pi_cat_labels) {
			var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
		}
		var output = ((output + preface) + '') + '\n';
		var output = ((output + preface) + 'Salt Bridges:') + '\n';
		var output = ((output + preface) + '    Secondary Structure | Count ') + '\n';
		var output = ((output + preface) + '   ---------------------|-------') + '\n';
		for (var key of salt_bridges) {
			var value = salt_bridges [key];
			var key = key.py_split ('_');
			var output = (((((output + preface) + '   ') + self.center (key [1], 21)) + '|') + self.center (str (value), 7)) + '\n';
		}
		var output = (output + preface) + '\nRaw data:\n';
		for (var atom_pairs of salt_bridge_labels) {
			var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
		}
		pdb_close_contacts.set_resname ('CCN');
		pdb_contacts.set_resname ('CON');
		pdb_contacts_alpha_helix.set_resname ('ALP');
		pdb_contacts_beta_sheet.set_resname ('BET');
		pdb_contacts_other_2nd_structure.set_resname ('OTH');
		pdb_back_bone.set_resname ('BAC');
		pdb_side_chain.set_resname ('SID');
		pdb_hydrophobic.set_resname ('HYD');
		pdb_hbonds.set_resname ('HBN');
		pdb_pistack.set_resname ('PIS');
		pdb_pi_T.set_resname ('PIT');
		pdb_pi_cat.set_resname ('PIC');
		pdb_salt_bridges.set_resname ('SAL');
		ligand.set_resname ('LIG');
		if (parameters.params ['output_dir'] != '') {
			pdb_close_contacts.save_PDB (parameters.params ['output_dir'] + '/close_contacts.pdb');
			pdb_contacts.save_PDB (parameters.params ['output_dir'] + '/contacts.pdb');
			pdb_contacts_alpha_helix.save_PDB (parameters.params ['output_dir'] + '/contacts_alpha_helix.pdb');
			pdb_contacts_beta_sheet.save_PDB (parameters.params ['output_dir'] + '/contacts_beta_sheet.pdb');
			pdb_contacts_other_2nd_structure.save_PDB (parameters.params ['output_dir'] + '/contacts_other_secondary_structure.pdb');
			pdb_back_bone.save_PDB (parameters.params ['output_dir'] + '/back_bone.pdb');
			pdb_side_chain.save_PDB (parameters.params ['output_dir'] + '/side_chain.pdb');
			pdb_hydrophobic.save_PDB (parameters.params ['output_dir'] + '/hydrophobic.pdb');
			pdb_hbonds.save_PDB (parameters.params ['output_dir'] + '/hydrogen_bonds.pdb');
			pdb_pistack.save_PDB (parameters.params ['output_dir'] + '/pi_pi_stacking.pdb');
			pdb_pi_T.save_PDB (parameters.params ['output_dir'] + '/T_stacking.pdb');
			pdb_pi_cat.save_PDB (parameters.params ['output_dir'] + '/cat_pi.pdb');
			pdb_salt_bridges.save_PDB (parameters.params ['output_dir'] + '/salt_bridges.pdb');
			ligand.save_PDB (parameters.params ['output_dir'] + '/ligand.pdb');
			receptor.save_PDB (parameters.params ['output_dir'] + '/receptor.pdb');
			var f = open (parameters.params ['output_dir'] + 'log.txt', 'w');
			f.write (output.py_replace ('REMARK ', ''));
			f.close ();
			var f = open (parameters.params ['output_dir'] + 'state.vmd', 'w');
			f.write (self.vmd_state_file ());
			f.close ();
		}
		if (parameters.params ['output_file'] == '' && parameters.params ['output_dir'] == '') {
			print (output.py_replace ('REMARK ', ''));
		}
		if (parameters.params ['output_file'] != '') {
			var explain = ((('The residue named "CCN" illustrates close contacts where the protein and ligand atoms come within ' + str (parameters.params ['close_contacts_dist1_cutoff'])) + ' of each other. "CON" illustrates close contacts where the protein and ligand atoms come within ') + str (parameters.params ['close_contacts_dist2_cutoff'])) + ' of each other. "ALP", "BET", and "OTH" illustrates receptor contacts whose respective protein residues have the alpha-helix, beta-sheet, or "other" secondary structure. "BAC" and "SID" illustrate receptor contacts that are part of the protein backbone and sidechain, respectively. "HYD" illustrates hydrophobic contacts between the protein and ligand. "HBN" illustrates hydrogen bonds. "SAL" illustrates salt bridges. "PIS" illustrates pi-pi stacking interactions, "PIT" illustrates T-stacking interactions, and "PIC" illustrates cation-pi interactions. Protein residue names are unchanged, but the ligand residue is now named "LIG".';
			var output = output + 'REMARK\n';
			var lines = textwrap.wrap (explain, 71);
			for (var line of lines) {
				var output = ((output + 'REMARK ') + line) + '\n';
			}
			var output = output + 'REMARK\n';
			var output = (((((output + receptor.save_PDB_String ()) + 'TER\n') + ligand.save_PDB_String ()) + 'TER\n') + pdb_close_contacts.save_PDB_String ()) + 'TER\n';
			var output = (((((output + pdb_contacts.save_PDB_String ()) + 'TER\n') + pdb_contacts_alpha_helix.save_PDB_String ()) + 'TER\n') + pdb_contacts_beta_sheet.save_PDB_String ()) + 'TER\n';
			var output = (((((output + pdb_contacts_other_2nd_structure.save_PDB_String ()) + 'TER\n') + pdb_back_bone.save_PDB_String ()) + 'TER\n') + pdb_side_chain.save_PDB_String ()) + 'TER\n';
			var output = (((((((output + pdb_hydrophobic.save_PDB_String ()) + 'TER\n') + pdb_hbonds.save_PDB_String ()) + 'TER\n') + pdb_pistack.save_PDB_String ()) + 'TER\n') + pdb_pi_T.save_PDB_String ()) + 'TER\n';
			var output = (((output + pdb_pi_cat.save_PDB_String ()) + 'TER\n') + pdb_salt_bridges.save_PDB_String ()) + 'TER\n';
			var f = open (parameters.params ['output_file'], 'w');
			f.write (output);
			f.close ();
		}
	});},
	get vmd_state_file () {return __get__ (this, function (self) {
		var vmd = [];
		vmd.append ('set viewplist {}');
		vmd.append ('set fixedlist {}');
		vmd.append ('# Display settings');
		vmd.append ('display projection   Orthographic');
		vmd.append ('display depthcue   on');
		vmd.append ('display cuestart   0.500000');
		vmd.append ('display cueend     10.000000');
		vmd.append ('display cuedensity 0.200000');
		vmd.append ('display cuemode    Exp2');
		vmd.append ('mol new back_bone.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 1.000000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top back_bone.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new side_chain.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 1.000000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top side_chain.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new close_contacts.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 1.000000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top close_contacts.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new contacts.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 0.500000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top contacts.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new contacts_alpha_helix.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 1.000000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top contacts_alpha_helix.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new contacts_beta_sheet.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 1.000000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top contacts_beta_sheet.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new contacts_other_secondary_structure.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 1.000000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top contacts_other_secondary_structure.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new hydrophobic.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation VDW 0.500000 8.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top hydrophobic.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new hydrogen_bonds.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation Licorice 0.300000 10.000000 10.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top hydrogen_bonds.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new salt_bridges.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation Licorice 0.300000 10.000000 10.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top salt_bridges.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new cat_pi.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation Licorice 0.300000 10.000000 10.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top cat_pi.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new pi_pi_stacking.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation Licorice 0.300000 10.000000 10.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top pi_pi_stacking.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new T_stacking.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation Licorice 0.300000 10.000000 10.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top T_stacking.pdb');
		vmd.append ('molinfo top set drawn 0');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('mol new ligand.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation CPK 1.000000 0.300000 8.000000 6.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top ligand.pdb');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('set topmol [molinfo top]');
		vmd.append ('mol new receptor.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all');
		vmd.append ('mol delrep 0 top');
		vmd.append ('mol representation Lines 3.000000');
		vmd.append ('mol color Name');
		vmd.append ('mol selection {all}');
		vmd.append ('mol material Opaque');
		vmd.append ('mol addrep top');
		vmd.append ('mol selupdate 0 top 0');
		vmd.append ('mol colupdate 0 top 0');
		vmd.append ('mol scaleminmax top 0 0.000000 0.000000');
		vmd.append ('mol smoothrep top 0 0');
		vmd.append ('mol drawframes top 0 {now}');
		vmd.append ('mol rename top receptor.pdb');
		vmd.append ('set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}');
		vmd.append ('lappend viewplist [molinfo top]');
		vmd.append ('foreach v $viewplist {');
		vmd.append ('  molinfo $v set {center_matrix rotate_matrix scale_matrix global_matrix} $viewpoints($v)');
		vmd.append ('}');
		vmd.append ('foreach v $fixedlist {');
		vmd.append ('  molinfo $v set fixed 1');
		vmd.append ('}');
		vmd.append ('unset viewplist');
		vmd.append ('unset fixedlist');
		vmd.append ('mol top $topmol');
		vmd.append ('unset topmol');
		vmd.append ('color Display {Background} white');
		return '\n'.join (vmd);
	});},
	get json_helper () {return __get__ (this, function (self, interaction_labels) {
		var i = 0;
		var interaction_list = [];
		for (var atom_pairs of interaction_labels) {
			interaction_list.append (dict ({}));
			var ligand_atom_details = re.py_split ('[():]', atom_pairs [0]);
			var receptor_atom_details = re.py_split ('[():]', atom_pairs [1]);
			for (var detail of ligand_atom_details) {
				if (detail == '') {
					ligand_atom_details.remove (detail);
				}
			}
			for (var detail of receptor_atom_details) {
				if (detail == '') {
					receptor_atom_details.remove (detail);
				}
			}
			interaction_list [i] = dict ({'ligandAtoms': [dict ({'chain': 'A', 'resID': int (ligand_atom_details [1]), 'resName': ligand_atom_details [0], 'atomName': ligand_atom_details [2], 'atomIndex': int (ligand_atom_details [3])})], 'receptorAtoms': [dict ({'chain': receptor_atom_details [0], 'resID': int (receptor_atom_details [2]), 'resName': receptor_atom_details [1], 'atomName': receptor_atom_details [3], 'atomIndex': int (receptor_atom_details [4])})]});
			i++;
		}
		return interaction_list;
	});},
	get json_file () {return __get__ (this, function (self, close_contact_interactions, contact_interactions, hydrogen_bonds, hydrophobic_interactions, pi_stacking_interactions, t_stacking_interactions, cat_pi_interactions, salt_bridge_interactions) {
		var json_output = dict ({});
		json_output ['contactsWithin2.5A'] = [];
		json_output ['contactsWithin4.0A'] = [];
		json_output ['hydrogenBonds'] = [];
		json_output ['hydrophobicContacts'] = [];
		json_output ['piPiStackingInteractions'] = [];
		json_output ['tStackingInteractions'] = [];
		json_output ['cationPiInteractions'] = [];
		json_output ['saltBridges'] = [];
		json_output ['contactsWithin2.5A'] = self.json_helper (close_contact_interactions);
		json_output ['contactsWithin4.0A'] = self.json_helper (contact_interactions);
		json_output ['hydrophobicContacts'] = self.json_helper (hydrophobic_interactions);
		var i = 0;
		for (var atom_pairs of hydrogen_bonds) {
			json_output ['hydrogenBonds'].append (dict ({}));
			var ligand_and_receptor = [re.py_split ('[():]', atom_pairs [0]), re.py_split ('[():]', atom_pairs [1]), re.py_split ('[():]', atom_pairs [2])];
			var ligand_atom_details = [];
			var receptor_atom_details = [];
			for (var atom of ligand_and_receptor) {
				if (len (atom [0]) > 1) {
					ligand_atom_details.append (atom);
				}
				else {
					receptor_atom_details.append (atom);
				}
			}
			for (var atom of ligand_atom_details) {
				for (var detail of atom) {
					if (detail == '') {
						atom.remove (detail);
					}
				}
			}
			for (var atom of receptor_atom_details) {
				for (var detail of atom) {
					if (detail == '') {
						atom.remove (detail);
					}
				}
			}
			json_output ['hydrogenBonds'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
			for (var detail of ligand_atom_details) {
				json_output ['hydrogenBonds'] [i] ['ligandAtoms'].append (dict ({'chain': 'A', 'resID': int (detail [1]), 'resName': detail [0], 'atomName': detail [2], 'atomIndex': int (detail [3])}));
			}
			for (var detail of receptor_atom_details) {
				json_output ['hydrogenBonds'] [i] ['receptorAtoms'].append (dict ({'chain': detail [0], 'resID': int (detail [2]), 'resName': detail [1], 'atomName': detail [3], 'atomIndex': detail [4]}));
			}
			i++;
		}
		var i = 0;
		for (var atom_pair of pi_stacking_interactions) {
			json_output ['piPiStackingInteractions'].append (dict ({}));
			var individual_ligand_atoms = atom_pair [0].py_split ('/');
			var individual_receptor_atoms = atom_pair [1].py_split ('/');
			var individual_ligand_atoms_details = [];
			for (var atom of individual_ligand_atoms) {
				if (atom != '') {
					individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			var individual_receptor_atoms_details = [];
			for (var atom of individual_receptor_atoms) {
				if (atom != '') {
					individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			for (var detail_list of individual_ligand_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			for (var detail_list of individual_receptor_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			json_output ['piPiStackingInteractions'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
			for (var detail of individual_ligand_atoms_details) {
				json_output ['piPiStackingInteractions'] [i] ['ligandAtoms'].append (dict ({'chain': 'A', 'resID': int (detail [1]), 'resName': detail [0], 'atomName': detail [2], 'atomIndex': int (detail [3])}));
			}
			for (var detail of individual_receptor_atoms_details) {
				json_output ['piPiStackingInteractions'] [i] ['receptorAtoms'].append (dict ({'chain': detail [0], 'resID': int (detail [2]), 'resName': detail [1], 'atomName': detail [3], 'atomIndex': detail [4]}));
			}
			i++;
		}
		var i = 0;
		for (var atom_pair of t_stacking_interactions) {
			json_output ['tStackingInteractions'].append (dict ({}));
			var individual_ligand_atoms = atom_pair [0].py_split ('/');
			var individual_receptor_atoms = atom_pair [1].py_split ('/');
			var individual_ligand_atoms_details = [];
			for (var atom of individual_ligand_atoms) {
				if (atom != '') {
					individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			var individual_receptor_atoms_details = [];
			for (var atom of individual_receptor_atoms) {
				if (atom != '') {
					individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			for (var detail_list of individual_ligand_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			for (var detail_list of individual_receptor_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			json_output ['tStackingInteractions'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
			for (var detail of individual_ligand_atoms_details) {
				json_output ['tStackingInteractions'] [i] ['ligandAtoms'].append (dict ({'chain': 'A', 'resID': int (detail [1]), 'resName': detail [0], 'atomName': detail [2], 'atomIndex': int (detail [3])}));
			}
			for (var detail of individual_receptor_atoms_details) {
				json_output ['tStackingInteractions'] [i] ['receptorAtoms'].append (dict ({'chain': detail [0], 'resID': int (detail [2]), 'resName': detail [1], 'atomName': detail [3], 'atomIndex': detail [4]}));
			}
			i++;
		}
		var i = 0;
		for (var atom_pair of cat_pi_interactions) {
			json_output ['cationPiInteractions'].append (dict ({}));
			var individual_ligand_atoms = atom_pair [0].py_split ('/');
			var individual_receptor_atoms = atom_pair [1].py_split ('/');
			var individual_ligand_atoms_details = [];
			for (var atom of individual_ligand_atoms) {
				if (atom != '') {
					individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			var individual_receptor_atoms_details = [];
			for (var atom of individual_receptor_atoms) {
				if (atom != '') {
					individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			for (var detail_list of individual_ligand_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			for (var detail_list of individual_receptor_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			json_output ['cationPiInteractions'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
			for (var detail of individual_ligand_atoms_details) {
				json_output ['cationPiInteractions'] [i] ['ligandAtoms'].append (dict ({'chain': 'A', 'resID': int (detail [1]), 'resName': detail [0], 'atomName': detail [2], 'atomIndex': int (detail [3])}));
			}
			for (var detail of individual_receptor_atoms_details) {
				json_output ['cationPiInteractions'] [i] ['receptorAtoms'].append (dict ({'chain': detail [0], 'resID': int (detail [2]), 'resName': detail [1], 'atomName': detail [3], 'atomIndex': detail [4]}));
			}
			i++;
		}
		var i = 0;
		for (var atom_pair of salt_bridge_interactions) {
			json_output ['saltBridges'].append (dict ({}));
			var individual_ligand_atoms = atom_pair [0].py_split ('/');
			var individual_receptor_atoms = atom_pair [1].py_split ('/');
			var individual_ligand_atoms_details = [];
			for (var atom of individual_ligand_atoms) {
				if (atom != '') {
					individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			var individual_receptor_atoms_details = [];
			for (var atom of individual_receptor_atoms) {
				if (atom != '') {
					individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
				}
			}
			for (var detail_list of individual_ligand_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			for (var detail_list of individual_receptor_atoms_details) {
				for (var detail of detail_list) {
					if (detail == '') {
						detail_list.remove (detail);
					}
				}
			}
			json_output ['saltBridges'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
			for (var detail of individual_ligand_atoms_details) {
				json_output ['saltBridges'] [i] ['ligandAtoms'].append (dict ({'chain': 'A', 'resID': int (detail [1]), 'resName': detail [0], 'atomName': detail [2], 'atomIndex': int (detail [3])}));
			}
			for (var detail of individual_receptor_atoms_details) {
				json_output ['saltBridges'] [i] ['receptorAtoms'].append (dict ({'chain': detail [0], 'resID': int (detail [2]), 'resName': detail [1], 'atomName': detail [3], 'atomIndex': detail [4]}));
			}
			i++;
		}
		var json_string_output = str (json_output).py_replace ("'", '"');
		return json_string_output;
	});}
});
export var CommandLineParameters =  __class__ ('CommandLineParameters', [object], {
	__module__: __name__,
	params: dict ({}),
	get is_num () {return __get__ (this, function (self, num) {
		try {
			var t = float (num);
			return t;
		}
		catch (__except0__) {
			if (isinstance (__except0__, ValueError)) {
				return num;
			}
			else {
				throw __except0__;
			}
		}
	});},
	get __init__ () {return __get__ (this, function (self, parameters) {
		self.params ['close_contacts_dist1_cutoff'] = 2.5;
		self.params ['close_contacts_dist2_cutoff'] = 4.0;
		self.params ['electrostatic_dist_cutoff'] = 4.0;
		self.params ['active_site_flexibility_dist_cutoff'] = 4.0;
		self.params ['hydrophobic_dist_cutoff'] = 4.0;
		self.params ['hydrogen_bond_dist_cutoff'] = 4.0;
		self.params ['hydrogen_bond_angle_cutoff'] = 40.0;
		self.params ['pi_padding_dist'] = 0.75;
		self.params ['pi_pi_interacting_dist_cutoff'] = 7.5;
		self.params ['pi_stacking_angle_tolerance'] = 30.0;
		self.params ['T_stacking_angle_tolerance'] = 30.0;
		self.params ['T_stacking_closest_dist_cutoff'] = 5.0;
		self.params ['cation_pi_dist_cutoff'] = 6.0;
		self.params ['salt_bridge_dist_cutoff'] = 5.5;
		self.params ['receptor'] = '';
		self.params ['ligand'] = '';
		self.params ['output_dir'] = '';
		self.params ['output_file'] = '';
		for (var index = 0; index < len (parameters); index++) {
			var item = parameters [index];
			if (item.__getslice__ (0, 1, 1) == '-') {
				var key = item.py_replace ('-', '');
				var value = self.is_num (parameters [index + 1]);
				if (__in__ (key, list (self.params.py_keys ()))) {
					self.params [key] = value;
					parameters [index] = '';
					parameters [index + 1] = '';
				}
			}
		}
		self.error = '';
		for (var index = 1; index < len (parameters); index++) {
			var item = parameters [index];
			if (item != '') {
				self.error = (self.error + item) + ' ';
			}
		}
		if (self.params ['output_dir'] != '' && self.params ['output_file'] == '') {
			self.params ['output_file'] = self.params ['output_dir'] + 'output.pdb';
		}
	});},
	get okay_to_proceed () {return __get__ (this, function (self) {
		if (self.params ['receptor'] != '' && self.params ['ligand'] != '') {
			return true;
		}
		else {
			return false;
		}
	});}
});
export var intro = function () {
	var version = '1.2.1';
	var lines = [];
	lines.append ('');
	lines.append ('BINANA ' + version);
	lines.append ('============');
	lines.append ("   BINANA is released under the GNU General Public License (see http://www.gnu.org/licenses/gpl.html). If you have any questions, comments, or suggestions, please don't hesitate to contact me, Jacob Durrant, at jdurrant [at] ucsd [dot] edu. If you use BINANA in your work, please cite [REFERENCE HERE].");
	lines.append ('');
	lines.append ('Introduction');
	lines.append ('============');
	lines.append ('   BINANA (BINding ANAlyzer) is a python-implemented algorithm for analyzing ligand binding. The program identifies key binding characteristics like hydrogen bonds, salt bridges, and pi interactions. As input, BINANA accepts receptor and ligand files in the PDBQT format. PDBQT files can be generated from the more common PDB file format using the free converter provided with AutoDockTools, available at http://mgltools.scripps.edu/downloads');
	lines.append ("   As output, BINANA describes ligand binding. Here's a simple example of how to run the program:");
	lines.append ('');
	lines.append ('python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt');
	lines.append ('');
	lines.append ('   To create a single PDB file showing the different binding characteristics with those characteristics described in the PDB header:');
	lines.append ('');
	lines.append ('python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb');
	lines.append ('');
	lines.append ('   Note that in the above example, errors and warnings are not written to the output file. To save these to a file, try:');
	lines.append ('');
	lines.append ('python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb > errors.txt');
	lines.append ('');
	lines.append ('   You can also send the program output to a directory, which will be created if it does not already exist. If a directory is specified, the program automatically separates the output PDB file into separate files for each interaction analyzed, and a description of the interactions is written to a file called \'log.txt\'. Additionally, a VMD state file is created so the results can be easily visualized in VMD, a free program available for download at http://www.ks.uiuc.edu/Development/Download/download.cgi?PackageName=VMD Again, to save warnings and errors, append something like "> errors.txt" to the end of your command:');
	lines.append ('');
	lines.append ('python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_dir /path/to/output/directory/ > errors.txt');
	lines.append ('');
	lines.append ('   Though we recommend using program defaults, the following command-line tags can also be specified: -close_contacts_dist1_cutoff -close_contacts_dist2_cutoff -electrostatic_dist_cutoff -active_site_flexibility_dist_cutoff -hydrophobic_dist_cutoff -hydrogen_bond_dist_cutoff -hydrogen_bond_angle_cutoff -pi_padding_dist -pi_pi_interacting_dist_cutoff -pi_stacking_angle_tolerance -T_stacking_angle_tolerance -T_stacking_closest_dist_cutoff -cation_pi_dist_cutoff -salt_bridge_dist_cutoff');
	lines.append ('   For example, if you want to tell BINANA to detect only hydrogen bonds where the donor and acceptor are less than 3.0 angstroms distant, run:');
	lines.append ('');
	lines.append ('python binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -hydrogen_bond_dist_cutoff 3.0');
	lines.append ('');
	lines.append ('   What follows is a detailed description of the BINANA algorithm and a further explaination of the optional parameters described above. Parameter names are enclosed in braces.');
	lines.append ('');
	lines.append ('Close Contacts');
	lines.append ('==============');
	lines.append ('   BINANA begins by identifying all ligand and protein atoms that come within {close_contacts_dist1_cutoff} angstroms of each other. These close-contact atoms are then characterized according to their respective AutoDock atom types, without regard for the receptor or ligand. The number of each pair of close-contact atoms of given AutoDock atom types is then tallied. For example, the program counts the number of times a hydrogen-bond accepting oxygen atom (atom type OA), either on the ligand or the receptor, comes within {close_contacts_dist1_cutoff} angstroms of a polar hydrogen atom (atom type HD) on the corresponding binding partner, be it the receptor or the ligand. A similar list of atom-type pairs is tallied for all ligand and receptor atoms that come within {close_contacts_dist2_cutoff} angstroms of each other, where {close_contacts_dist2_cutoff} > {close_contacts_dist1_cutoff}.');
	lines.append ('');
	lines.append ('Electrostatic Interactions');
	lines.append ('==========================');
	lines.append ('   For each atom-type pair of atoms that come within {electrostatic_dist_cutoff} angstroms of each other, as described above, a summed electrostatic energy is calculated using the Gasteiger partial charges assigned by AutoDockTools.');
	lines.append ('');
	lines.append ('Binding-Pocket Flexibility');
	lines.append ('==========================');
	lines.append ('   BINANA also provides useful information about the flexibility of a binding pocket. Each receptor atom that comes with {active_site_flexibility_dist_cutoff} angstroms of any ligand atom is characterized according to whether or not it belongs to a protein side chain or backbone. Additionally, the secondary structure of the corresponding protein residue of each atom, be it alpha helix, beta sheet, or other, is also determined. Thus, there are six possible characterizations for each atom: alpha-sidechain, alpha-backbone, beta-sidechain, beta-backbone, other-sidechain, other-backbone. The number of close-contact receptor atoms falling into each of these six categories is tallied as a metric of binding-site flexibility.');
	lines.append ('   All protein atoms with the atom names "CA," "C," "O," or "N" are assumed to belong to the backbone. All other receptor atoms are assigned side-chain status. Determining the secondary structure of the corresponding residue of each close-contact receptor atom is more difficult. First, preliminary secondary-structure assignments are made based on the phi and psi angles of each residue. If phi in (-145, -35) and psi in (-70, 50), the residue is assumed to be in the alpha-helix conformation. If phi in [-180, -40) and psi in (90,180], or phi in [-180,-70) and psi in [-180, -165], the residue is assumed to be in the beta-sheet conformation. Otherwise, the secondary structure of the residue is labeled "other."');
	lines.append ('   Inspection of actual alpha-helix structures revealed that the alpha carbon of an alpha-helix residue i is generally within 6.0 angstroms of the alpha carbon of an alpha-helix residue three residues away (i + 3 or i - 3). Any residue that has been preliminarily labeled "alpha helix" that fails to meet this criteria is instead labeled "other." Additionally, the residues of any alpha helix comprised of fewer than four consecutive residues are also labeled "other," as these tended belong to be small loops rather than genuine helices.');
	lines.append ('   True beta strands hydrogen bond with neighboring beta strands to form beta sheets. Inspection of actual beta strands revealed that the Calpha of a beta-sheet residue, i, is typically within 6.0 angstroms of the Calpha of another beta-sheet residue, usually on a different strand, when the residues [i - 2, i + 2] are excluded. Any residue labeled "beta sheet" that does not meet this criteria is labeled "other" instead. Additionally, the residues of beta strands that are less than three residues long are likewise labeled "other," as these residues typically belong to loops rather than legitimate strands.');
	lines.append ('');
	lines.append ('Hydrophobic Contacts');
	lines.append ('====================');
	lines.append ('   To identify hydrophobic contacts, BINANA simply tallies the number of times a ligand carbon atom comes within {hydrophobic_dist_cutoff} angstroms of a receptor carbon atom. These hydrophobic contacts are categorized according to the flexibility of the receptor carbon atom. There are six possible classifications: alpha-sidechain, alpha-backbone, beta-sidechain, beta-backbone, other-sidechain, other-backbone. The total number of hydrophobic contacts is simply the sum of these six counts.');
	lines.append ('');
	lines.append ('Hydrogen Bonds');
	lines.append ('==============');
	lines.append ('   BINANA allows hydroxyl and amine groups to act as hydrogen-bond donors. Oxygen and nitrogen atoms can act as hydrogen-bond acceptors. Fairly liberal cutoffs are implemented in order to accommodate low-resolution crystal structures. A hydrogen bond is identified if the hydrogen-bond donor comes within {hydrogen_bond_dist_cutoff} angstroms of the hydrogen-bond acceptor, and the angle formed between the donor, the hydrogen atom, and the acceptor is no greater than {hydrogen_bond_angle_cutoff} degrees. BINANA tallies the number of hydrogen bonds according to the secondary structure of the receptor atom, the side-chain/backbone status of the receptor atom, and the location (ligand or receptor) of the hydrogen bond donor. Thus there are twelve possible categorizations: alpha-sidechain-ligand, alpha-backbone-ligand, beta-sidechain-ligand, beta-backbone-ligand, other-sidechain-ligand, other-backbone-ligand, alpha-sidechain-receptor, alpha-backbone-receptor, beta-sidechain-receptor, beta-backbone-receptor, other-sidechain-receptor, other-backbone-receptor.');
	lines.append ('');
	lines.append ('Salt Bridges');
	lines.append ('============');
	lines.append ('   BINANA also seeks to identify possible salt bridges binding the ligand to the receptor. First, charged functional groups are identified and labeled with a representative point to denote their location. For non-protein residues, BINANA searches for common functional groups or atoms that are known to be charged. Atoms containing the following names are assumed to be metal cations: MG, MN, RH, ZN, FE, BI, AS, AG. The identifying coordinate is centered on the metal cation itself. Sp3-hybridized amines (which could pick up a hydrogen atom) and quaternary ammonium cations are also assumed to be charged; the representative coordinate is centered on the nitrogen atom. Imidamides where both of the constituent amines are primary, as in the guanidino group, are also fairly common charged groups. The representative coordinate is placed between the two constituent nitrogen atoms. ');
	lines.append ('   Carboxylate groups are likewise charged; the identifying coordinate is placed between the two oxygen atoms. Any group containing a phosphorus atom bound to two oxygen atoms that are themselves bound to no other heavy atoms (i.e., a phosphate group) is also likely charged; the representative coordinate is centered on the phosphorus atom. Similarly, any group containing a sulfur atom bound to three oxygen atoms that are themselves bound to no other heavy atoms (i.e., a sulfonate group) is also likely charged; the representative coordinate is centered on the sulfur atom. Note that while BINANA is thorough in its attempt to identify charged functional groups on non-protein residues, it is not exhaustive. For example, one could imagine a protonated amine in an aromatic ring that, though charged, would not be identified as a charged group.');
	lines.append ('   Identifying the charged functional groups of protein residues is much simpler. Functional groups are identified based on standardized protein atom names. Lysine residues have an amine; the representative coordinate is centered on the nitrogen atom. Arginine has a guanidino group; the coordinate is centered between the two terminal nitrogen atoms. Histadine is always considered charged, as it could pick up a hydrogen atom. The representative charge is placed between the two ring nitrogen atoms. Finally, glutamate and aspartate contain charged carboxylate groups; the representative coordinate is placed between the two oxygen atoms.');
	lines.append ('   Having identified the location of all charged groups, BINANA is ready to predict potential salt bridges. First, the algorithm identifies all representative charge coordinates within {salt_bridge_dist_cutoff} angstroms of each other. Next, it verifies that the two identified coordinates correspond to charges that are opposite. If so, a salt bridge is detected. These salt bridges are characterized and tallied by the secondary structure of the associated protein residue: alpha helix, beta sheet, or other.');
	lines.append ('');
	lines.append ('pi Interactions');
	lines.append ('===============');
	lines.append ('   A number of interactions are known to involve pi systems. In order to detect the aromatic rings of non-protein residues, a recursive subroutine identifies all five or six member rings, aromatic or not. The dihedral angles between adjacent ring atoms, and between adjacent ring atoms and the first atom of ring substituents, are checked to ensure that none deviate from planarity by more than 15 degrees. Planarity establishes aromaticity. For protein residues, aromatic rings are identified using standardized protein-atom names. Phenylalanine, tyrosine, and histidine all have aromatic rings. Tryptophan is assigned two aromatic rings. ');
	lines.append ('   Once an aromatic ring is identified, it must be fully characterized. First, a plane is defined that passes through three ring atoms, preferably the first, third, and fifth atoms. The center of the ring is calculated by averaging the coordinates of all ring atoms, and the radius is given to be the maximum distance between the center point and any of those atoms. From this information, a ring disk can be defined that is centered on the ring center point, oriented along the ring plane, and has a radius equal to that of the ring plus a small buffer ({pi_padding_dist} angstroms).');
	lines.append ('   Having identified and characterized all aromatic rings, the algorithm next attempts to identify pi-pi stacking interactions. First, every aromatic ring of the ligand is compared to every aromatic ring of the receptor. If the centers of two rings are within {pi_pi_interacting_dist_cutoff} angstroms of each other, the angle between the two vectors normal to the planes of each ring is calculated. If this angle suggests that the two planes are within {pi_stacking_angle_tolerance} degrees of being parallel, then each of the ring atoms is projected onto the plane of the opposite ring by identifying the nearest point on that plane. If any of these projected points fall within the ring disk of the opposite ring, the two aromatic rings are said to participate in a pi-pi stacking interaction. We note that it is not sufficient to simply project the ring center point onto the plane of the opposite ring because pi-pi stacking interactions are often off center.');
	lines.append ('   To detect T-stacking or edge-face interactions, every aromatic ring of the ligand is again compared to every aromatic ring of the receptor. If the centers of two rings are within {pi_pi_interacting_dist_cutoff} angstroms of each other, the angle between the two vectors normal to the planes of each ring is again calculated. If this angle shows that the two planes are within {T_stacking_angle_tolerance} degrees of being perpendicular, a second distance check is performed to verify that the two rings come within {T_stacking_closest_dist_cutoff} angstroms at their nearest point. If so, each of the coordinates of the ring center points is projected onto the plane of the opposite ring by identifying the nearest point on the respective plane. If either of the projected center points falls within the ring disk of the opposite ring, the two aromatic rings are said to participate in a T-stacking interaction.');
	lines.append ('   Finally, BINANA also detects cation-pi interactions between the ligand and the receptor. Each of the representative coordinates identifying charged functional groups is compared to each of the center points of the identified aromatic rings. If the distance between any of these pairs is less than {cation_pi_dist_cutoff} angstroms, the coordinate identifying the charged functional group is projected onto the plane of the aromatic ring by identifying the nearest point on that plane. If the projected coordinate falls within the ring disk of the aromatic ring, a cation-pi interaction is identified. ');
	lines.append ('   pi-pi stacking, T-stacking, and cation-pi interactions are tallied according to the secondary structure of the receptor residue containing the associated aromatic ring or charged functional group: alpha helix, beta sheet, or other.');
	lines.append ('');
	lines.append ('Ligand Atom Types and Rotatable Bonds');
	lines.append ('=====================================');
	lines.append ('   BINANA also tallies the number of atoms of each AutoDock type present in the ligand as well as the number of ligand rotatable bonds identified by the AutoDockTools scripts used to generate the input PDBQT files.');
	lines.append ('');
	lines.append ('                            [- END INTRO -]');
	lines.append ('');
	var wrapped = [];
	for (var line of lines) {
		if (line == '') {
			wrapped.append ('');
		}
		else if (__in__ ('python binana.py', line)) {
			wrapped.append (line);
		}
		else {
			wrapped.extend (textwrap.wrap (line, 80));
		}
	}
	print ('');
	print ('                                                             |[]{};');
	print ('                                                            .|[]{}');
	print ('                                                            .|  {}');
	print ('                                                             |   }');
	print ('                                                             |   }');
	print ('                                                             |   }');
	print ('                                                            .|   };');
	print ('                                                            .|     :\'"');
	print ('                                                           +.        "');
	print ('                                                          =+         "/');
	print ('                                                         _=          "/');
	print ('                                                        -_           "/');
	print ('                                                       ,-            "/');
	print ('                                                     <>              "/');
	print ('                                                   |\\                "');
	print ('                                               :\'"/                 \'"');
	print ("                                        .|[]{};                    :'");
	print ('               ,-_=+.|[]{};:\'"/|\\<>,-_=+                           :\'');
	print ('           |\\<>                                                   ;:');
	print ('          /|                                                    {};');
	print ('          /|                                                   ]{}');
	print ('          /|                                                  []');
	print ('           |\\                                               .|[');
	print ('            \\<                                            =+.');
	print ('              >,                                        -_=');
	print ('               ,-_=                                  <>,-');
	print ('                  =+.|[]                         "/|\\<');
	print ('                       ]{};:\'"/|\\         []{};:\'"');
	print ('                                \\<>,-_=+.|');
	for (var i of wrapped) {
		print (i);
	}
};
intro ();
export var cmd_params = CommandLineParameters (sys.argv.__getslice__ (0, null, 1));
if (cmd_params.okay_to_proceed () == false) {
	print ('Error: You need to specify the ligand and receptor PDBQT files to analyze using\nthe -receptor and -ligand tags from the command line.\n');
	sys.exit (0);
}
if (cmd_params.error != '') {
	print ('Warning: The following command-line parameters were not recognized:');
	print (('   ' + cmd_params.error) + '\n');
}
export var lig = cmd_params.params ['ligand'];
export var rec = cmd_params.params ['receptor'];
export var d = Binana (lig, rec, cmd_params);

//# sourceMappingURL=binana.map