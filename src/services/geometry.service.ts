import {Vector} from "excalibur";

export class GeometryService {


    static getSide(observer: Vector, target: Vector): number {
        if (observer.x >= target.x && observer.y >= target.y) {
            return 0
        } else if (observer.x >= target.x && observer.y < target.y) {
            return 1;
        } else if (observer.x < target.x && observer.y < target.y) {
            return 2;
        } else if (observer.x < target.x && observer.y >= target.y) {
            return 3
        }
    }
}
