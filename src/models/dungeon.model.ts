import {Vector} from "excalibur";

export class DungeonProperties {
    width?: number;
    height?: number;
    cells?: number[];
}


export class Dungeon {
    width: number = 1;
    height: number = 1;
    cells: number[] = [];
    startPosition: Vector;
    rayCastIncrement = 0.02;
    rayCastMaxDistance = 10;

    constructor(properties?: DungeonProperties) {
        this.width = properties?.width ?? 1;
        this.height = properties?.height ?? 1;
        this.cells = properties?.cells ?? [];
        this.startPosition = new Vector(0, 0);
    }


    getCell(x: number, y: number): number {
        return this.cells[Math.floor(y) * this.width + Math.floor(x)];
    }


    isInBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }



    /**
     * Identifies and returns the entrance cell in a dungeon.
     * The entrance cell is a cell with a value of `0` located on any of the grid edges.
     *
     * The search prioritizes edges in this order:
     * 1. Top row
     * 2. Bottom row
     * 3. Left column
     * 4. Right column
     *
     * If no entrance is found, it defaults to the top-left corner (0, 0).
     *
     * @return {Vector} The coordinates of the entrance cell as a `Vector` object.
     */
    findEntranceCell(): Vector {
        for (let x=0; x<this.width; x++) {
            if (this.cells[x] === 0) {
                return new Vector(x, 0);
            }
            if (this.cells[(this.height - 1) * this.width + x] === 0) {
                return new Vector(x, this.height - 1);
            }
        }
        for (let y = 0; y < this.height; y++) {
            if (this.cells[(this.height - 1) * this.width] === 0) {
                return new Vector(0, y);
            }
            if (this.cells[(this.height - 1) * this.width + this.width-1] === 0) {
                return new Vector(this.width-1, (this.height - 1) * this.width + this.width-1);
            }
        }
        return new Vector(0, 0);
    }


    /**
     * Finds the center of the entrance cell in a grid or structure.
     * This method calculates the center position by identifying the entrance cell
     * and adjusting its coordinates to account for its center.
     *
     * @return {Vector} A Vector representing the center coordinates of the entrance cell.
     */
    findEntranceCenter(): Vector {
        const entranceCell = this.findEntranceCell();
        return new Vector(entranceCell.x + 0.5, entranceCell.y + 0.5);
    }


    /**
     * Casts a ray from a given starting point in a specified direction and determines the distance to the first object
     * it hits or returns -1 if no object is hit within the maximum distance.
     *
     * @param {Vector} origin The starting point of the ray, represented as an object with x and y coordinates.
     * @param {number} direction The angle of the ray's direction in radians.
     * @return {number} The distance to the first object encountered by the ray, or -1 if no object is hit within the maximum distance.
     */
    castRay(origin: Vector, direction: number): number {
        // start at starting point
        let x = origin.x;
        let y = origin.y;
        let rayDistance = 0;
        // precalculate single distance increment in the specified direction
        const dx = Math.cos(direction) * this.rayCastIncrement;
        const dy = Math.sin(direction) * this.rayCastIncrement;
        let hit = 0;
        do {
            // increment distance
            x += dx;
            y += dy;
            // just sum the distance to avoid computing sqrt()
            rayDistance += dx + dy;
            // test presence of a cell
            hit = this.cells[Math.floor(y)*this.width + Math.floor(x)];
        } while (hit === 0 && rayDistance < this.rayCastMaxDistance && x >= 0 && y >= 0 && x <= this.width && y <= this.height);
        if (hit === 1) {
            return Math.sqrt((x - origin.x)**2 + (y - origin.y)**2);
        } else {
            return -1;
        }
    }


    /**
     * Converts the cell structure of the object into a string representation.
     * Each row of cells is represented as a line of text, with specific characters
     * denoting the state of each cell.
     *
     * @return {string} A string representation of the object's cell layout,
     * with each row separated by a newline character.
     */
    toString(): string {
        let s = '';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                s += this.cells[y*this.width + x] ? '░' : ' ';
            }
            s += "\n";
        }
        return s;
    }
}