'use strict';var binana={};import{AssertionError,AttributeError,BaseException,DeprecationWarning,Exception,IndexError,IterableError,KeyError,NotImplementedError,RuntimeWarning,StopIteration,UserWarning,ValueError,Warning,__JsIterator__,__PyIterator__,__Terminal__,__add__,__and__,__call__,__class__,__envir__,__eq__,__floordiv__,__ge__,__get__,__getcm__,__getitem__,__getslice__,__getsm__,__gt__,__i__,__iadd__,__iand__,__idiv__,__ijsmod__,__ilshift__,__imatmul__,__imod__,__imul__,__in__,__init__,__ior__,
__ipow__,__irshift__,__isub__,__ixor__,__jsUsePyNext__,__jsmod__,__k__,__kwargtrans__,__le__,__lshift__,__lt__,__matmul__,__mergefields__,__mergekwargtrans__,__mod__,__mul__,__ne__,__neg__,__nest__,__or__,__pow__,__pragma__,__proxy__,__pyUseJsNext__,__rshift__,__setitem__,__setproperty__,__setslice__,__sort__,__specialattrib__,__sub__,__super__,__t__,__terminal__,__truediv__,__withblock__,__xor__,abs,all,any,assert,bool,bytearray,bytes,callable,chr,copy,deepcopy,delattr,dict,dir,divmod,enumerate,
filter,float,getattr,hasattr,input,int,isinstance,issubclass,len,list,map,max,min,object,ord,pow,print,property,py_TypeError,py_iter,py_metatype,py_next,py_reversed,py_typeof,range,repr,round,set,setattr,sorted,str,sum,tuple,zip}from"./org.transcrypt.__runtime__.js";import*as __module_binana__ from"./binana.js";__nest__(binana,"",__module_binana__);var __name__="binana.Output.Dir.vmd_state";export var openFile=binana.shim.OpenFile;export var vmd_state_file=function(parameters){var vmd=[];vmd.append("set viewplist {}");
vmd.append("set fixedlist {}");vmd.append("# Display settings");vmd.append("display projection   Orthographic");vmd.append("display depthcue   on");vmd.append("display cuestart   0.500000");vmd.append("display cueend     10.000000");vmd.append("display cuedensity 0.200000");vmd.append("display cuemode    Exp2");vmd.append("mol new back_bone.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation VDW 1.000000 8.000000");
vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top back_bone.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");
vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new side_chain.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation VDW 1.000000 8.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");
vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top side_chain.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new close_contacts.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");
vmd.append("mol delrep 0 top");vmd.append("mol representation VDW 1.000000 8.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top close_contacts.pdb");vmd.append("molinfo top set drawn 0");
vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new contacts.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation VDW 0.500000 8.000000");
vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top contacts.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");
vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new contacts_alpha_helix.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation VDW 1.000000 8.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");
vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top contacts_alpha_helix.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new contacts_beta_sheet.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");
vmd.append("mol delrep 0 top");vmd.append("mol representation VDW 1.000000 8.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top contacts_beta_sheet.pdb");vmd.append("molinfo top set drawn 0");
vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new contacts_other_secondary_structure.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");
vmd.append("mol representation VDW 1.000000 8.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top contacts_other_secondary_structure.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");
vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new hydrophobic.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation VDW 0.500000 8.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");
vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top hydrophobic.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new hydrogen_bonds.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");
vmd.append("mol delrep 0 top");vmd.append("mol representation Licorice 0.300000 10.000000 10.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top hydrogen_bonds.pdb");vmd.append("molinfo top set drawn 0");
vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new salt_bridges.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");
vmd.append("mol representation Licorice 0.300000 10.000000 10.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top salt_bridges.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");
vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new cat_pi.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation Licorice 0.300000 10.000000 10.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");
vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top cat_pi.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");
vmd.append("mol new pi_pi_stacking.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation Licorice 0.300000 10.000000 10.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");
vmd.append("mol rename top pi_pi_stacking.pdb");vmd.append("molinfo top set drawn 0");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new T_stacking.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");
vmd.append("mol delrep 0 top");vmd.append("mol representation Licorice 0.300000 10.000000 10.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top T_stacking.pdb");vmd.append("molinfo top set drawn 0");
vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("mol new ligand.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation CPK 1.000000 0.300000 8.000000 6.000000");
vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top ligand.pdb");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");
vmd.append("lappend viewplist [molinfo top]");vmd.append("set topmol [molinfo top]");vmd.append("mol new receptor.pdb type pdb first 0 last -1 step 1 filebonds 1 autobonds 1 waitfor all");vmd.append("mol delrep 0 top");vmd.append("mol representation Lines 3.000000");vmd.append("mol color Name");vmd.append("mol selection {all}");vmd.append("mol material Opaque");vmd.append("mol addrep top");vmd.append("mol selupdate 0 top 0");vmd.append("mol colupdate 0 top 0");vmd.append("mol scaleminmax top 0 0.000000 0.000000");
vmd.append("mol smoothrep top 0 0");vmd.append("mol drawframes top 0 {now}");vmd.append("mol rename top receptor.pdb");vmd.append("set viewpoints([molinfo top]) {{{1 0 0 -75.1819} {0 1 0 -83.0219} {0 0 1 -119.981} {0 0 0 1}} {{-0.0620057 0.672762 -0.737291 0} {0.428709 0.685044 0.589035 0} {0.90135 -0.279568 -0.33089 0} {0 0 0 1}} {{0.11999 0 0 0} {0 0.11999 0 0} {0 0 0.11999 0} {0 0 0 1}} {{1 0 0 0} {0 1 0 0} {0 0 1 0} {0 0 0 1}}}");vmd.append("lappend viewplist [molinfo top]");vmd.append("foreach v $viewplist {");
vmd.append("  molinfo $v set {center_matrix rotate_matrix scale_matrix global_matrix} $viewpoints($v)");vmd.append("}");vmd.append("foreach v $fixedlist {");vmd.append("  molinfo $v set fixed 1");vmd.append("}");vmd.append("unset viewplist");vmd.append("unset fixedlist");vmd.append("mol top $topmol");vmd.append("unset topmol");vmd.append("color Display {Background} white");var txt="\n".join(vmd);var f=openFile(parameters.params["output_dir"]+"state.vmd","w");f.write(txt);f.close()};

//# sourceMappingURL=binana.Output.Dir.vmd_state.map