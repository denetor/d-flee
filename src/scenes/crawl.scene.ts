import {Actor, Canvas, Color, Engine, Keys, Line, Scene, vec, Vector} from "excalibur";
import {DungeonFactory} from "@/factories/dungeon.factory";
import {Dungeon} from "@/models/dungeon.model";
import {Player} from "@/models/player.model";
import {GeometryService} from "@/services/geometry.service";
import {MapService} from "@/services/map.service";

export class CrawlScene extends Scene {
    dungeon: Dungeon;
    player: Player;
    // field of view width (in radians)
    fov: number = 60 * Math.PI / 180;
    // single FOV increment to span for each frame width pixel
    fovStep: number = 0;
    maxRenderingDistance = 999;
    exCanvas: Canvas = null as any;
    // mouse cursor position
    mousePos: {
        current: Vector,
        previous: Vector,
    }


    constructor() {
        super();
        this.dungeon = DungeonFactory.getTestDungeon();
        this.player = new Player();
        this.player.position = this.dungeon.startPosition;
        this.player.direction = 270 * Math.PI / 180; // in degrees
        this.mousePos = {
            current: new Vector(0, 0),
            previous: new Vector(0, 0),
        }
    }


    onInitialize(engine: Engine) {
        super.onInitialize(engine);
        this.fovStep = this.fov / engine.drawWidth;

        this.exCanvas = new Canvas({
            height: engine.drawHeight,
            width: engine.drawWidth,
            // cache: true,
            draw: this.renderCanvas.bind(this),
        });
        const canvasActor = new Actor({
            pos: engine.screen.center,
        });
        canvasActor.graphics.use(this.exCanvas);
        engine.add(canvasActor);
    }


    onPreUpdate(engine: Engine, elapsed: number) {
        super.onPreUpdate(engine, elapsed);
    }


    onPostUpdate(engine: Engine, elapsed: number) {
        super.onPostUpdate(engine, elapsed);

        // manage key presses
        if (engine.input.keyboard.isHeld(Keys.W)) {
            const newPos = this.movePlayer(0.05);
            if (this.dungeon.getCell(newPos.x, newPos.y) === 0 && this.dungeon.isInBounds(newPos.x, newPos.y)) {
                this.player.position = newPos;
            }
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            const newPos = this.movePlayer(-0.05);
            if (this.dungeon.getCell(newPos.x, newPos.y) === 0 && this.dungeon.isInBounds(newPos.x, newPos.y)) {
                this.player.position = newPos;
            }
        }
        if (engine.input.keyboard.isHeld(Keys.A)) {
            const newPos = this.strafePlayer(-0.05);
            if (this.dungeon.getCell(newPos.x, newPos.y) === 0 && this.dungeon.isInBounds(newPos.x, newPos.y)) {
                this.player.position = newPos;
            }
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            const newPos = this.strafePlayer(0.05);
            if (this.dungeon.getCell(newPos.x, newPos.y) === 0 && this.dungeon.isInBounds(newPos.x, newPos.y)) {
                this.player.position = newPos;
            }
        }

        // manage mouse movement
        engine.input.pointers.primary.on('move', (evt) => {
            this.mousePos.previous = this.mousePos.current;
            this.mousePos.current = new Vector(evt.screenPos.x, evt.screenPos.y);
            if (this.mousePos.current.x > this.mousePos.previous.x) {
                this.rotatePlayer(2);
            } else if (this.mousePos.current.x < this.mousePos.previous.x) {
                this.rotatePlayer(-2);
            }
        });
    }


    /**
     * Renders the canvas by drawing the background and walls elements.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
     * @return {void} Does not return a value.
     */
    renderCanvas(ctx: CanvasRenderingContext2D) {
        this.drawBackgroundCanvas(ctx);
        this.drawWallsCanvas(ctx);
        this.drawScenery(ctx);
        this.drawMap(ctx);
    }


    /**
     * Draws the walls of the dungeon onto a canvas context by casting rays for each viewport pixel.
     * This method simulates a 3D rendering effect by calculating wall heights and shading based on
     * ray-cast collisions in the dungeon.
     *
     * @param {CanvasRenderingContext2D} ctx The 2D canvas rendering context where the walls are drawn.
     * @return {void} This method does not return any value; it directly renders the walls onto the canvas.
     */
    drawWallsCanvas(ctx: CanvasRenderingContext2D) {
        // list all sprites with their distance, remove out-of-FOV items, then sort items from the most distant
        const sceneryItemsList: any[] = [];
        for (let sceneryItem of this.dungeon.scenery) {
            // ignore scenery out of FOV
            const angle = GeometryService.getAngle(this.player.position, new Vector(sceneryItem.x, sceneryItem.y));
            if (Math.abs(angle) < this.fov / 2) {
                const distance = GeometryService.getDistance(this.player.position, new Vector(sceneryItem.x, sceneryItem.y));
                sceneryItemsList.push({
                    item: sceneryItem,
                    distance: distance,
                    angle: angle,
                });
            }
        }
        sceneryItemsList.sort((a, b) => a.distance - b.distance);
        // calculate starting angle (direction - half the FOV)
        let rayDirection = this.player.direction - this.fov / 2;
        // create z-buffer distance array
        const wallDistance = new Array(ctx.canvas.width).fill(this.maxRenderingDistance);
        // cast a ray for each viewport pixel
        for (let x = 0; x < ctx.canvas.width; x++) {
            // cast ray to find distance to wall
            const hitStatus = this.dungeon.castRay(this.player.position, rayDirection, this.player.direction);
            if (hitStatus.hit) {
                let d = hitStatus.distance;
                // add wall distance to z-buffer distance
                wallDistance[x] = d;
                // calculate wall height basing on distance
                let wallHeight = this.getWallHeight(ctx.canvas.height, d);
                const wallShade = this.getWallColor(d, hitStatus.side);
                // draw wall
                ctx.fillStyle = `rgb(${wallShade.r}, ${wallShade.g}, ${wallShade.b})`;
                ctx.fillRect(x, ctx.canvas.height / 2 - wallHeight / 2, 1, wallHeight);
                ctx.strokeStyle = `rgb(${wallShade.r}, ${wallShade.g}, ${wallShade.b})`;
            }
            // increment ray direction for next pixel
            rayDirection += this.fovStep;
        }
    }


    /**
     * Draws the background on the provided canvas rendering context. The background consists of
     * two sections: the upper half representing the sky, and the lower half representing a pavement.
     *
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas on which the background is drawn.
     * @return {void} No return value. The background is drawn directly on the canvas context.
     */
    drawBackgroundCanvas(ctx: CanvasRenderingContext2D): void {
        // upper half: sky
        const skyGradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height / 2 - 1);
        skyGradient.addColorStop(0, '#87CEFA');
        skyGradient.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, ctx.canvas.width - 1, ctx.canvas.height / 2 - 1);

        // lower half: pavement
        const pavementGradient = ctx.createLinearGradient(0, ctx.canvas.height / 2, 0, ctx.canvas.height - 1);
        pavementGradient.addColorStop(0, '#101010');
        pavementGradient.addColorStop(1, '#505050');
        ctx.fillStyle = pavementGradient;
        ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width - 1, ctx.canvas.height);
    }


    drawScenery(ctx: CanvasRenderingContext2D): void {
        let sceneryItems: any[] = [];
        // v1: draw all scenery items without considering hidden items
        // list scenery objects and NPCs and add the distance from viewer
        for (const sceneryItem of this.dungeon.scenery) {
            sceneryItems.push({
                item: sceneryItem,
                // distance from player
                distance: GeometryService.getDistance(this.player.position, new Vector(sceneryItem.x, sceneryItem.y)),
                // item angle from player position
                angleFromPlayer: GeometryService.getAngle(this.player.position, new Vector(sceneryItem.x, sceneryItem.y)),
                // position of center of the sprite in screen (defaults to screen center)
                position: new Vector(ctx.canvas.width / 2, ctx.canvas.height / 2),
                // sprite height
                height: 1.0,
            });

        }

        // keep only sceneryItems within FOV
        sceneryItems = sceneryItems.filter((sceneryItem) => Math.abs(sceneryItem.angleFromPlayer - this.player.direction) <= this.fov/2);
        // sort by distance, decreasing
        sceneryItems.sort((a, b) => a.distance - b.distance);
        // draw each remaining scenery item
        sceneryItems.map((sceneryItem) => {
            // calculate sprite X position basing on angle
            sceneryItem.position.x = GeometryService.lerp(0, ctx.canvas.width, (sceneryItem.angleFromPlayer - this.player.direction + this.fov / 2) / this.fov);
            // TODO v1: skip all the item if farther than the corresponding zbuffer
            // calculate sprite height basing on distance and draw the sprite
            sceneryItem.height = this.getWallHeight(ctx.canvas.height, sceneryItem.distance);
            // display debug data
            ctx.font = "10px Courier New";
            ctx.strokeText('Direction:          ' + GeometryService.rad2degrees(this.player.direction), 100, 490, 200);
            ctx.strokeText('AngleFromPlayer:    ' + GeometryService.rad2degrees(sceneryItem.angleFromPlayer), 100, 500, 200);
            ctx.strokeText('AngleFromDirection: ' + GeometryService.rad2degrees(sceneryItem.angleFromPlayer - this.player.direction), 100, 510, 200);
            ctx.strokeText('Fov:                ' + GeometryService.rad2degrees(this.fov), 100, 520, 200);
            ctx.strokeText('Angle ratio:        ' + (sceneryItem.angleFromPlayer - this.player.direction + this.fov / 2) / this.fov, 100, 530, 200);
            ctx.strokeText('X:                  ' + sceneryItem.position.x, 100, 540, 200);
            ctx.strokeText('h:                  ' + sceneryItem.height, 100, 550, 200);
            // TODO draw scenery sprite
            ctx.fillStyle = `blue`;
            ctx.fillRect(sceneryItem.position.x - 10, ctx.canvas.height / 2 - sceneryItem.height / 2, 20, sceneryItem.height);
        });
    }


    /**
     * Calculates and returns the wall height based on the given distance.
     *
     * @param {number} distance - The distance used to calculate the wall height.
     * If the distence is less than 0, the result is 0. If the distance is between 0 and 1 (inclusive),
     * the frame height is returned. Otherwise, the frame height is divided by the distance.
     * @return {number} The calculated wall height.
     */
    getWallHeight(maxHeight: number, distance: number): number {
        if (distance < 0) {
            return 0;
        } else if (distance <= 1) {
            return maxHeight;
        } else {
            return maxHeight / distance;
        }
    }


    // fade color basing on distance
    getWallColor(distance: number, side: number): {r: number, g: number, b: number} {
        const closeDistance = 1;
        const farDistance = (this.dungeon.height + this.dungeon.width) / 2;
        if (distance <= closeDistance) {
            // return full color
            return this.getColorShade(0, side);
        } else if (distance >= farDistance) {
            // return lightest color
            return this.getColorShade(1, side);
        } else {
            // return interpolated color shade
            return this.getColorShade(distance / farDistance, side);
        }
    }


    /**
     * Calculates a color shade based on the input shade value.
     *
     * @param {number} shade - A numeric value representing the shade factor, typically in the range of 0 to 1.
     0.0: full 'from' color - 1.0: full 'to' color
     * @return {string} The resulting color shade in the format of an RGB string.
     */
    getColorShade(shade: number, side: number): {r: number, g: number, b: number} {
        let color: Color = new Color(192, 192, 192);
        // darken with distance
        color = color.darken(shade);
        // lighten even walls
        if (side === 0 || side === 2) {
            color = color.lighten(0.5);
        }

        return {r: color.r, g: color.g, b: color.b};
    }


    /**
     * Renders the game map onto the provided canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used to draw the map.
     * @return {void} This method does not return a value.
     */
    /**
     *
     */
    drawMap(ctx: CanvasRenderingContext2D): void {
        MapService.draw(ctx, this.dungeon, this.player, this.fov);
    }


    /**
     * Rotates the player's direction by the specified number of degrees.
     *
     * @param {number} degrees - The angle in degrees by which to rotate the player's direction.
     * @return {void} No return value.
     */
    rotatePlayer(degrees: number): void {
        this.player.direction += degrees * Math.PI / 180;
        if (this.player.direction > 2 * Math.PI) {
            this.player.direction -= 2 * Math.PI;
        } else if (this.player.direction < 0) {
            this.player.direction += 2 * Math.PI;
        }
    }


    /**
     * Moves the player by a specified distance in the current direction.
     *
     * @param {number} distance - The distance by which the player should be moved.
     * @return {Vector} The new position of the player as a Vector object.
     */
    movePlayer(distance: number): Vector {
        const newPosition = new Vector(this.player.position.x, this.player.position.y);
        newPosition.x += Math.cos(this.player.direction) * distance;
        newPosition.y += Math.sin(this.player.direction) * distance;
        return newPosition;
    }


    /**
     * Adjusts the player's position laterally (sideways) based on the given distance.
     *
     * @param {number} distance - The distance by which the player should strafe.
     *                            Positive values strafe to the right, and negative values strafe to the left.
     * @return {Vector} The new position of the player after strafing.
     */
    strafePlayer(distance: number): Vector {
        const newPosition = new Vector(this.player.position.x, this.player.position.y);
        newPosition.x += Math.cos(this.player.direction + Math.PI / 2) * distance;
        newPosition.y += Math.sin(this.player.direction + Math.PI / 2) * distance;
        return newPosition;
    }


}
