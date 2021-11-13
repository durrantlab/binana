// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-12 01:16:46
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'binana.output._directory.pdbs';
export var output_dir_pdbs = function (pdb_closest_contacts, parameters, pdb_close_contacts, pdb_contacts_alpha_helix, pdb_contacts_beta_sheet, pdb_contacts_other_2nd_structure, pdb_back_bone, pdb_side_chain, pdb_hydrophobic, pdb_hbonds, pdb_halbonds, pdb_pistack, pdb_pi_T, pdb_pi_cat, pdb_salt_bridges, ligand, receptor) {
	pdb_closest_contacts.save_pdb (parameters.params ['output_dir'] + '/close_contacts.pdb');
	pdb_close_contacts.save_pdb (parameters.params ['output_dir'] + '/contacts.pdb');
	pdb_contacts_alpha_helix.save_pdb (parameters.params ['output_dir'] + '/contacts_alpha_helix.pdb');
	pdb_contacts_beta_sheet.save_pdb (parameters.params ['output_dir'] + '/contacts_beta_sheet.pdb');
	pdb_contacts_other_2nd_structure.save_pdb (parameters.params ['output_dir'] + '/contacts_other_secondary_structure.pdb');
	pdb_back_bone.save_pdb (parameters.params ['output_dir'] + '/back_bone.pdb');
	pdb_side_chain.save_pdb (parameters.params ['output_dir'] + '/side_chain.pdb');
	pdb_hydrophobic.save_pdb (parameters.params ['output_dir'] + '/hydrophobic.pdb');
	pdb_hbonds.save_pdb (parameters.params ['output_dir'] + '/hydrogen_bonds.pdb');
	pdb_halbonds.save_pdb (parameters.params ['output_dir'] + '/halogen_bonds.pdb');
	pdb_pistack.save_pdb (parameters.params ['output_dir'] + '/pi_pi_stacking.pdb');
	pdb_pi_T.save_pdb (parameters.params ['output_dir'] + '/T_stacking.pdb');
	pdb_pi_cat.save_pdb (parameters.params ['output_dir'] + '/cat_pi.pdb');
	pdb_salt_bridges.save_pdb (parameters.params ['output_dir'] + '/salt_bridges.pdb');
	ligand.save_pdb (parameters.params ['output_dir'] + '/ligand.pdb');
	receptor.save_pdb (parameters.params ['output_dir'] + '/receptor.pdb');
};

//# sourceMappingURL=binana.output._directory.pdbs.map