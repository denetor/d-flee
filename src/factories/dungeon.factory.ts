import {Dungeon} from "@/models/dungeon.model";
import {Vector} from "excalibur";
import {SceneryItemType} from "@/scenery-item-type.enum";
import {SceneryItem} from "@/models/scenery-item.model";

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
        d.scenery.push(
            new SceneryItem(4.5, 7.5, SceneryItemType.barrel)
        );
        // d.scenery.push(
        //     new SceneryItem(1.5, 5.5, SceneryItemType.barrel)
        // );
        // d.scenery.push(
        //     new SceneryItem(4.5, 6.5, SceneryItemType.barrel)
        // );
        return d;
    }
}
