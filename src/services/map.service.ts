import {Vector} from "excalibur";
import {Dungeon} from "@/models/dungeon.model";
import {Player} from "@/models/player.model";

export class MapService {
    static position: Vector = new Vector(0, 0);
    static width: number = 100;
    static height: number = 100;
    static cellWidth: number = 10;
    static cellHeight: number = 10;

    constructor() {
        //
    }

    static draw(ctx: CanvasRenderingContext2D, dungeon: Dungeon, player: Player ) {
        MapService.drawBackground(ctx);
        MapService.drawDungeon(ctx, dungeon);
        MapService.drawScenery(ctx, dungeon);
        MapService.drawPlayer(ctx, player);
    }


    /**
     * Draws the background of the canvas using the current position and dimensions
     * provided by MapService, filling it with a black color.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context of the canvas where the background will be drawn.
     * @return {void} This method does not return anything.
     */
    static drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.fillRect(MapService.position.x, MapService.position.y, MapService.width, MapService.height);
    }


    /**
     * Renders the specified dungeon on the given CanvasRenderingContext2D.
     * Iterates over each cell in the dungeon and draws it based on its content.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas where the dungeon will be drawn.
     * @param {Dungeon} dungeon - The dungeon to be rendered, containing the cells and their dimensions.
     * @return {void} This method does not return a value.
     */
    static drawDungeon(ctx: CanvasRenderingContext2D, dungeon: Dungeon) {
        for (let y = 0; y < dungeon.height; y++) {
            for (let x = 0; x < dungeon.width; x++) {
                const cellContent = dungeon.getCell(x, y);
                if (cellContent === 1) {
                    ctx.fillStyle = "lightgray";
                    ctx.fillRect(x*MapService.cellWidth, y*MapService.cellHeight, MapService.cellWidth, MapService.cellHeight);
                } else {
                    ctx.fillStyle = "darkgray";
                    ctx.fillRect(x*MapService.cellWidth, y*MapService.cellHeight, MapService.cellWidth, MapService.cellHeight);
                }
            }
        }
    }


    /**
     * Draws scenery objects onto the given canvas rendering context based on the provided dungeon layout.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context where the scenery will be drawn.
     * @param {Dungeon} dungeon - The dungeon containing scenery information to be rendered.
     * @return {void} This method does not return a value.
     */
    static drawScenery(ctx: CanvasRenderingContext2D, dungeon: Dungeon) {
        for (const sceneryItem of dungeon.scenery) {
            ctx.fillStyle = "blue";
            ctx.fillRect(sceneryItem.x * MapService.cellWidth - MapService.cellWidth / 8, sceneryItem.y * MapService.cellHeight - MapService.cellHeight / 8, MapService.cellWidth / 4, MapService.cellHeight / 4);
        }
    }



    static drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
        ctx.fillStyle = "red";
        ctx.fillRect(player.position.x * MapService.cellWidth - MapService.cellWidth / 8, player.position.y * MapService.cellHeight - MapService.cellHeight / 8, MapService.cellWidth / 4, MapService.cellHeight / 4);
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.fillText(`(${Math.floor(player.position.x * 100) / 100}, ${Math.floor(player.position.y * 100) / 100})`, player.position.x * MapService.cellWidth - MapService.cellWidth / 8, player.position.y * MapService.cellHeight - MapService.cellHeight / 8 + 16);
    }
}