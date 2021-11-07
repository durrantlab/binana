// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-05 16:24:08
var binana = {};
var math = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {r_just, round_to_thousandths_to_str} from './binana._utils.shim.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
var __name__ = 'binana._structure.point';
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
	get create_pdb_line () {return __get__ (this, function (self, index) {
		var output = 'ATOM ';
		var output = ((output + r_just (str (index), 6)) + r_just ('X', 5)) + r_just ('XXX', 4);
		var output = output + r_just (round_to_thousandths_to_str (self.x), 18);
		var output = output + r_just (round_to_thousandths_to_str (self.y), 8);
		var output = output + r_just (round_to_thousandths_to_str (self.z), 8);
		var output = output + r_just ('X', 24);
		return output;
	});}
});

//# sourceMappingURL=binana._structure.point.map