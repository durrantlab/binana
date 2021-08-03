from binana._utils.shim import _set_default


def hashtable_entry_add_one(hashtable, key, toadd=None):
    # note that dictionaries (hashtables) are passed by reference in
    # python

    toadd = _set_default(toadd, 1)

    if key in hashtable:
        hashtable[key] = hashtable[key] + toadd
    else:
        hashtable[key] = toadd


def list_alphebetize_and_combine(list_obj):
    list_obj.sort()
    return "_".join(list_obj)
