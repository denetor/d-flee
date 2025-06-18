import {Vector} from "excalibur";

export class Player {
    // position into the dungeon
    position: Vector;
    // sight direction
    direction: number;

    constructor() {
        this.position = new Vector(0, 0);
        this.direction = 0;
    }
}