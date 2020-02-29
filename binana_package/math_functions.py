# this file contains the class MathFunctions and for binana.py
import math
from point import Point
"""
Class MathFunctions
"""


class MathFunctions:
    def planrity(self, point1, point2, point3, point4):

        x1 = point1.x
        y1 = point1.y
        z1 = point1.z
        x2 = point2.x
        y2 = point2.y
        z2 = point2.z
        x3 = point3.x
        y3 = point3.y
        z3 = point3.z
        x4 = point4.x
        y4 = point4.y
        z4 = point4.z

        A = (y1 * (z2 - z3)) + (y2 * (z3 - z1)) + (y3 * (z1 - z2))
        B = (z1 * (x2 - x3)) + (z2 * (x3 - x1)) + (z3 * (x1 - x2))
        C = (x1 * (y2 - y3)) + (x2 * (y3 - y1)) + (x3 * (y1 - y2))
        D = (
            ((-x1) * ((y2 * z3) - (y3 * z2)))
            + ((-x2) * ((y3 * z1) - (y1 * z3)))
            + ((-x3) * ((y1 * z2) - (y2 * z1)))
        )
        distance = (math.fabs((A * x4) + (B * y4) + (C * z4) + D)) / (
            math.sqrt(math.pow(A, 2) + math.pow(B, 2) + math.pow(C, 2))
        )

        A1 = (y1 * (z2 - z4)) + (y2 * (z4 - z1)) + (y4 * (z1 - z2))
        B1 = (z1 * (x2 - x4)) + (z2 * (x4 - x1)) + (z4 * (x1 - x2))
        C1 = (x1 * (y2 - y4)) + (x2 * (y4 - y1)) + (x4 * (y1 - y2))
        D1 = (
            ((-x1) * ((y2 * z4) - (y4 * z2)))
            + ((-x2) * ((y4 * z1) - (y1 * z4)))
            + ((-x4) * ((y1 * z2) - (y2 * z1)))
        )
        distance1 = (math.fabs((A1 * x3) + (B1 * y3) + (C1 * z3) + D1)) / (
            math.sqrt(math.pow(A1, 2) + math.pow(B1, 2) + math.pow(C1, 2))
        )

        A2 = (y1 * (z4 - z3)) + (y4 * (z3 - z1)) + (y3 * (z1 - z4))
        B2 = (z1 * (x4 - x3)) + (z4 * (x3 - x1)) + (z3 * (x1 - x4))
        C2 = (x1 * (y4 - y3)) + (x4 * (y3 - y1)) + (x3 * (y1 - y4))
        D2 = (
            ((-x1) * ((y4 * z3) - (y3 * z4)))
            + ((-x4) * ((y3 * z1) - (y1 * z3)))
            + ((-x3) * ((y1 * z4) - (y4 * z1)))
        )
        distance2 = (math.fabs((A2 * x2) + (B2 * y2) + (C2 * z2) + D2)) / (
            math.sqrt(math.pow(A2, 2) + math.pow(B2, 2) + math.pow(C2, 2))
        )

        A3 = (y4 * (z2 - z3)) + (y2 * (z3 - z4)) + (y3 * (z4 - z2))
        B3 = (z4 * (x2 - x3)) + (z2 * (x3 - x4)) + (z3 * (x4 - x2))
        C3 = (x4 * (y2 - y3)) + (x2 * (y3 - y4)) + (x3 * (y4 - y2))
        D3 = (
            ((-x4) * ((y2 * z3) - (y3 * z2)))
            + ((-x2) * ((y3 * z4) - (y4 * z3)))
            + ((-x3) * ((y4 * z2) - (y2 * z4)))
        )
        distance3 = (math.fabs((A3 * x1) + (B3 * y1) + (C3 * z1) + D3)) / (
            math.sqrt(math.pow(A3, 2) + math.pow(B3, 2) + math.pow(C3, 2))
        )

        final_dist = -1

        if distance < distance1 and distance < distance2 and distance < distance3:
            final_dist = distance
        elif distance1 < distance and distance1 < distance2 and distance1 < distance3:
            final_dist = distance1
        elif distance2 < distance and distance2 < distance1 and distance2 < distance3:
            final_dist = distance2
        elif distance3 < distance and distance3 < distance1 and distance3 < distance2:
            final_dist = distance3

        # Now normalize by the length of the longest bond

        return final_dist

    def vector_subtraction(self, vector1, vector2):  # vector1 - vector2
        return Point(
            vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z
        )

    def cross_product(self, Pt1, Pt2):  # never tested
        response = Point(0, 0, 0)

        response.x = Pt1.y * Pt2.z - Pt1.z * Pt2.y
        response.y = Pt1.z * Pt2.x - Pt1.x * Pt2.z
        response.z = Pt1.x * Pt2.y - Pt1.y * Pt2.x

        return response

    def vector_scalar_multiply(self, vector, scalar):
        return Point(vector.x * scalar, vector.y * scalar, vector.z * scalar)

    def dot_product(self, point1, point2):
        return point1.x * point2.x + point1.y * point2.y + point1.z * point2.z

    def dihedral(self, point1, point2, point3, point4):  # never tested

        b1 = self.vector_subtraction(point2, point1)
        b2 = self.vector_subtraction(point3, point2)
        b3 = self.vector_subtraction(point4, point3)

        b2Xb3 = self.cross_product(b2, b3)
        b1Xb2 = self.cross_product(b1, b2)

        b1XMagb2 = self.vector_scalar_multiply(b1, b2.magnitude())
        radians = math.atan2(
            self.dot_product(b1XMagb2, b2Xb3), self.dot_product(b1Xb2, b2Xb3)
        )
        return radians

    def angle_between_three_points(
        self, point1, point2, point3
    ):  # As in three connected atoms
        vector1 = self.vector_subtraction(point1, point2)
        vector2 = self.vector_subtraction(point3, point2)
        return self.angle_between_points(vector1, vector2)

    def angle_between_points(self, point1, point2):
        new_point1 = self.return_normalized_vector(point1)
        new_point2 = self.return_normalized_vector(point2)
        dot_prod = self.dot_product(new_point1, new_point2)
        if dot_prod > 1.0:
            dot_prod = 1.0  # to prevent errors that can rarely occur
        if dot_prod < -1.0:
            dot_prod = -1.0
        return math.acos(dot_prod)

    def return_normalized_vector(self, vector):
        dist = self.distance(Point(0, 0, 0), vector)
        return Point(vector.x / dist, vector.y / dist, vector.z / dist)

    def distance(self, point1, point2):
        deltax = point1.x - point2.x
        deltay = point1.y - point2.y
        deltaz = point1.z - point2.z

        return math.sqrt(
            math.pow(deltax, 2) + math.pow(deltay, 2) + math.pow(deltaz, 2)
        )

    def project_point_onto_plane(self, a_point, plane_coefficients):
        # essentially finds the point on the plane that is closest to the
        # specified point the plane_coefficients are [a,b,c,d], where the
        # plane is ax + by + cz = d

        # First, define a plane using cooeficients a, b, c, d such that ax +
        # by + cz = d
        a = plane_coefficients[0]
        b = plane_coefficients[1]
        c = plane_coefficients[2]
        d = plane_coefficients[3]

        # Now, define a point in space (s,u,v)
        s = a_point.x
        u = a_point.y
        v = a_point.z

        # the formula of a line perpendicular to the plan passing through (s,u,v) is:
        # x = s + at
        # y = u + bt
        # z = v + ct

        t = (d - a * s - b * u - c * v) / (a * a + b * b + c * c)

        # here's the point closest on the plane
        x = s + a * t
        y = u + b * t
        z = v + c * t

        return Point(x, y, z)
