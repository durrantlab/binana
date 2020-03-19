from package import print_keys
from package import print_vals

def obj_to_dict(o):
    """This function takes an object passed from javascript and converts it
    into a python dictionary.

    :param o: The object from javascript.
    :return: A python dictionary.
    """

    d = {}
    for key in [name for name in dir(o) if not name.startswith('__')]:
        d[key] = getattr(o, key)
    return d

def start_with_json_from_javascript(obj_from_javascript):
    """A function that takes an object from javascript and processes it to
    extract fake data.

    :param obj_from_javascript: The object from javascript.
    :return: The processed data.
    """
    a_dict = obj_to_dict(obj_from_javascript)
    k = print_keys.print_keys(a_dict)
    v = print_vals.print_vals(a_dict)

    data = [k, v]

    return data
