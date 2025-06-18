import {Actor, Color, Engine, Keys, Line, Scene, vec, Vector} from "excalibur";
import {DungeonFactory} from "@/factories/dungeon.factory";
import {Dungeon} from "@/models/dungeon.model";
import {Player} from "@/models/player.model";

export class CrawlScene extends Scene {
    dungeon: Dungeon;
    player: Player;
    // field of view width (in radians)
    fov: number = 90 * Math.PI / 180;
    // single FOV increment to span for each frame width pixel
    fovStep: number = 0;


    constructor() {
        super();
        this.dungeon = DungeonFactory.getTestDungeon();
        this.player = new Player();
        this.player.position = this.dungeon.startPosition;
        this.player.direction = 45 * Math.PI / 180; // in degrees
    }


    onInitialize(engine: Engine) {
        super.onInitialize(engine);
        this.fovStep = this.fov / engine.drawWidth;
    }


    onPreUpdate(engine: Engine, elapsed: number) {
        super.onPreUpdate(engine, elapsed);
        this.render(engine);
    }


    onPostUpdate(engine: Engine, elapsed: number) {
        super.onPostUpdate(engine, elapsed);

        // kill all actors, they will be rebuilt
        for (const a of this.actors) {
            a.kill();
        }

        // manage key presses
        if (engine.input.keyboard.isHeld(Keys.W)) {
            this.movePlayer(0.1);
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            this.movePlayer(-0.1);
        }
        if (engine.input.keyboard.isHeld(Keys.A)) {
            this.rotatePlayer(-1);
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            this.rotatePlayer(1);
        }
    }


    /**
     * Version 1: no optimizations, render via an actor for each vertical line
     * @param engine
     */
    render(engine: Engine) {
        this.drawBackground(engine);
        this.drawWalls(engine);
    }


    drawWalls(engine: Engine) {
        // calculate starting angle (direction - half the FOV)
        let rayDirection = this.player.direction - this.fov / 2;
        // cast a ray for each viewport pixel
        for (let x = 0; x < engine.drawWidth; x++) {
            // cast ray to find distance to wall
            let d = this.dungeon.castRay(this.player.position, rayDirection);
            // calculate wall height basing on distance
            let wallHeight = this.getWallHeight(engine, d);
            // TODO correct FOV distortion
            // add vertical line actor
            const wallShade = this.getWallColor(d);
            const a = new Actor({
                pos: vec(x, engine.halfDrawHeight - wallHeight / 2),
            })
            a.graphics.anchor = Vector.Zero
            a.graphics.use(
                new Line({
                    start: vec(0, 0),
                    end: vec(0, wallHeight),
                    color: Color.fromRGB(wallShade.r, wallShade.g, wallShade.b),
                    thickness: 1,
                })
            )
            engine.add(a)
            // increment ray direction for next pixel
            rayDirection += this.fovStep;
        }
    }


    /**
     * Calculates and returns the wall height based on the given distance.
     *
     * @param {number} distance - The distance used to calculate the wall height.
     * If the distence is less than 0, the result is 0. If the distance is between 0 and 1 (inclusive),
     * the frame height is returned. Otherwise, the frame height is divided by the distance.
     * @return {number} The calculated wall height.
     */
    getWallHeight(engine: Engine, distance: number): number {
        if (distance < 0) {
            return 0;
        } else if (distance <= 1) {
            return engine.drawHeight;
        } else {
            return engine.drawHeight / distance;
        }
    }


    // fade color basing on distance
    getWallColor(distance: number): {r: number, g: number, b: number} {
        const closeDistance = 1;
        const farDistance = (this.dungeon.height + this.dungeon.width) / 2;
        if (distance <= closeDistance) {
            // return full color
            return this.getColorShade(0);
        } else if (distance >= farDistance) {
            // return lightest color
            return this.getColorShade(1);
        } else {
            // return interpolated color shade
            return this.getColorShade(distance / farDistance);
        }
    }


    /**
     * Calculates a color shade based on the input shade value.
     *
     * @param {number} shade - A numeric value representing the shade factor, typically in the range of 0 to 1.
     0.0: full 'from' color - 1.0: full 'to' color
     * @return {string} The resulting color shade in the format of an RGB string.
     */
    getColorShade(shade: number): {r: number, g: number, b: number} {
        const fromR = 192;
        const fromG = 192;
        const fromB = 192;
        const toR = 64;
        const toG = 64;
        const toB = 64;
        const shadeR = fromR + (toR - fromR) * shade;
        const shadeG = fromG + (toG - fromG) * shade;
        const shadeB = fromB + (toB - fromB) * shade;
        return {r: shadeR, g: shadeG, b: shadeB};
    }


    drawBackground(engine: Engine): void {
        const sky = new Actor({
            pos: new Vector(0, 0),
            width: engine.drawWidth,
            height: engine.halfDrawHeight,
            color: Color.Blue,
            anchor: new Vector(0, 0),
        });
        const ground = new Actor({
            pos: new Vector(0, engine.halfDrawHeight),
            width: engine.drawWidth,
            height: engine.halfDrawHeight,
            color: Color.Brown,
            anchor: new Vector(0, 0),
        });
        engine.add(sky);
        engine.add(ground);
    }


    rotatePlayer(degrees: number): void {
        this.player.direction += degrees * Math.PI / 180;
    }


    movePlayer(distance: number): void {
        this.player.position.x += Math.cos(this.player.direction) * distance;
        this.player.position.y += Math.sin(this.player.direction) * distance;
    }


}