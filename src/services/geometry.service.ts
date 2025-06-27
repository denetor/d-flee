import {Vector} from "excalibur";

export class GeometryService {


    /**
     * Calculates the angle in radians between two vectors a and b.
     *
     * @param {Vector} a - The starting vector with x and y coordinates.
     * @param {Vector} b - The ending vector with x and y coordinates.
     * @return {number} The angle in radians between vector a and vector b.
     */
    static getAngle(a: Vector, b: Vector): number {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }



    /**
     * Calculates the Euclidean distance between two vectors.
     *
     * @param {Vector} a - The first vector containing x and y coordinates.
     * @param {Vector} b - The second vector containing x and y coordinates.
     * @return {number} The distance between the two vectors.
     */
    static getDistance(a: Vector, b: Vector): number {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }



    /**
     *
     * @param observer
     * @param target
     *
     * The hit side is the nearest to the ray contact point "t" (i know, not perfect, but we accept it, for now)
     *                o
     *  O---------+  /
     *  |         | /
     *  |         |/
     *  |        t|
     *  +---------+
     * O: origin of the cell (Math.floor(t.x), Math.floor(t.y))
     * t: ray contact point
     * o: observer point
     *
     */
    static getSide(observer: Vector, target: Vector): number {
        const x = target.x - Math.floor(target.x);
        const y = target.y - Math.floor(target.y);
        // distance from each side
        const dTop = y;
        const dLeft = x;
        const dBottom = 1 - y;
        const dRight = 1 - x;
        if (dTop < dLeft && dTop < dBottom && dTop < dRight) {
            return 0;
        } else if (dRight < dTop && dRight < dLeft && dRight < dBottom) {
            return 1;
        } else if (dBottom < dTop && dBottom < dLeft && dBottom < dRight) {
            return 2;
        } else if (dLeft < dTop && dLeft < dBottom && dLeft < dRight) {
            return 3;
        }
    }
}
