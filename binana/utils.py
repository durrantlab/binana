def hashtable_entry_add_one(hashtable, key, toadd=1):
    # note that dictionaries (hashtables) are passed by reference in
    # python
    if key in hashtable:
        hashtable[key] = hashtable[key] + toadd
    else:
        hashtable[key] = toadd

def list_alphebetize_and_combine(list_obj):
    list_obj.sort()
    return "_".join(list_obj)
