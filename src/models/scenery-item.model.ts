import {SceneryItemType} from "@/scenery-item-type.enum";

export class SceneryItem {
    x: number;
    y: number;
    type: SceneryItemType;

    constructor(x: number, y: number, type: SceneryItemType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}