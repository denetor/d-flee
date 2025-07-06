import {Vector} from "excalibur";

export class GeometryService {


    /**
     * Calculates the angle in radians of the position b rwspect the position a
     *
     * @param {Vector} a - The starting vector with x and y coordinates.
     * @param {Vector} b - The ending vector with x and y coordinates.
     * @return {number} The angle in radians between vector a and vector b.
     */
    static getAngle(a: Vector, b: Vector): number {
        let radians = Math.atan2(b.y - a.y, b.x - a.x);
        if (radians < 0) {
            radians += 2 * Math.PI;
        }
        return radians;
    }


    /**
     * Converts an angle measured in radians to an approximately equivalent angle in degrees.
     * The result is rounded to two decimal places.
     *
     * @param {number} angle - The angle in radians to be converted to degrees.
     * @return {number} The angle in degrees, rounded to two decimal places.
     */
    static rad2degrees(angle: number): number {
        return Math.round(angle * 180 * 100 / Math.PI) / 100;
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


    /**
     * Esegue un'interpolazione lineare tra due valori.
     * @param start - Il valore iniziale
     * @param end - Il valore finale
     * @param t - Il fattore di interpolazione (tra 0 e 1)
     *
     * @returns Il valore interpolato
     * `lerp(0, 100, 0.5)` restituirà 50 (il punto medio)
     */
    static lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    /**
     * Normalizza un valore all'interno di un intervallo.
     * @param value - Il valore da normalizzare
     * @param min - Il valore minimo dell'intervallo
     * @param max - Il valore massimo dell'intervallo
     *
     * @returns Il valore normalizzato tra 0 e 1
     * `normalize(50, 0, 100)` restituirà 0.5 (il valore normalizzato)
     */
    static normalize(value: number, min: number, max: number): number {
        return (value - min) / (max - min);
    }
}
