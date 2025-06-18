import {Dungeon} from "@/models/dungeon.model";
import {Vector} from "excalibur";

export class DungeonFactory {
    static getTestDungeon(): Dungeon {
        const d = new Dungeon();
        d.width = 10;
        d.height = 10;
        d.cells = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 1, 1, 1, 0, 0, 1,
            1, 0, 0, 0, 1, 0, 0, 0, 0, 1,
            1, 1, 1, 0, 1, 0, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
            1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        ];
        d.startPosition = new Vector(3.5, 8.5);
        return d;
    }
}