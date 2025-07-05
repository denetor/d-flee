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

    static draw(ctx: CanvasRenderingContext2D, dungeon: Dungeon, player: Player, fov: number) {
        MapService.drawBackground(ctx);
        MapService.drawDungeon(ctx, dungeon);
        MapService.drawScenery(ctx, dungeon);
        MapService.drawPlayer(ctx, player, fov);
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


    /**
     * Renders a player representation on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used to draw the player.
     * @param {Player} player - The player object containing position data for rendering.
     * @return {void} This method does not return a value.
     */
    static drawPlayer(ctx: CanvasRenderingContext2D, player: Player, fov: number) {
        const playerCanvasPosition = new Vector(
            player.position.x * MapService.cellWidth,
            player.position.y * MapService.cellHeight
        );
        ctx.fillStyle = "red";
        ctx.fillRect(playerCanvasPosition.x - MapService.cellWidth / 8, playerCanvasPosition.y - MapService.cellHeight / 8, MapService.cellWidth / 4, MapService.cellHeight / 4);
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.fillText(`(${Math.floor(player.position.x * 100) / 100}, ${Math.floor(player.position.y * 100) / 100})`, player.position.x * MapService.cellWidth - MapService.cellWidth / 8, player.position.y * MapService.cellHeight - MapService.cellHeight / 8 + 16);
        MapService.drawPlayerDirection(ctx, playerCanvasPosition, player.direction, fov);
    }


    static drawPlayerDirection(ctx: CanvasRenderingContext2D, playerCanvasPosition: Vector, direction: number, fov: number): void {
        const rayLength = 25;
        ctx.strokeStyle = "white";
        // player direction
        ctx.beginPath();
        ctx.moveTo(playerCanvasPosition.x, playerCanvasPosition.y);
        ctx.lineTo(playerCanvasPosition.x + Math.cos(direction) * rayLength, playerCanvasPosition.y + Math.sin(direction) * rayLength);
        ctx.stroke();
        // player FOV
        ctx.beginPath();
        ctx.moveTo(playerCanvasPosition.x + Math.cos(direction-fov/2) * rayLength, playerCanvasPosition.y + Math.sin(direction-fov/2) * rayLength);
        ctx.lineTo(playerCanvasPosition.x, playerCanvasPosition.y);
        ctx.lineTo(playerCanvasPosition.x + Math.cos(direction+fov/2) * rayLength, playerCanvasPosition.y + Math.sin(direction+fov/2) * rayLength);
        ctx.stroke();
    }
}