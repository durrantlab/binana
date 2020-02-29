# this file contains the Point class
# for binana.py
import math


class Point:
    x = 99999.0
    y = 99999.0
    z = 99999.0

    # Initialize nitialize a point
    # Param x (float): x coordinate
    # Param y (float): y coordinate
    # Param z (float): z coordinate
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    # Returns a copy of a point
    # Param self (Point): point to be copied
    def copy_of(self):
        return Point(self.x, self.y, self.z)

    # Print the coordinates of a point
    # Param self (Point)
    def print_coors(self):
        print((str(self.x) + "\t" + str(self.y) + "\t" + str(self.z)))

    def snap(self, reso):  # snap the point to a grid
        self.x = round(self.x / reso) * reso
        self.y = round(self.y / reso) * reso
        self.z = round(self.z / reso) * reso

    # Returns the distance between two points
    # Param self (Point): this point
    # Param a_point (Point): the other point
    def dist_to(self, apoint):
        return math.sqrt(
            math.pow(self.x - apoint.x, 2)
            + math.pow(self.y - apoint.y, 2)
            + math.pow(self.z - apoint.z, 2)
        )

    # Returns a the coordinates of a point
    # Param self (Point)
    def description(self):
        return str(self.x) + " " + str(self.y) + " " + str(self.z)

    # Returns the magnitude of a point (distance from origin)
    # Param self (Point)
    def magnitude(self):
        return self.dist_to(Point(0, 0, 0))

    # Returns a PDB line for the point
    # Param self (Point)
    # Param index (integer): index of the point
    def create_PDB_line(self, index):
        output = "ATOM "
        output = output + str(index).rjust(6) + "X".rjust(5) + "XXX".rjust(4)
        output = output + ("%.3f" % self.x).rjust(18)
        output = output + ("%.3f" % self.y).rjust(8)
        output = output + ("%.3f" % self.z).rjust(8)
        output = output + "X".rjust(24)
        return output

