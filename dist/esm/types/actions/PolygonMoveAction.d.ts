import { Vector2d } from "konva/lib/types";
import { Action } from "./AbstractAction";
import ActionsStore from "./ActionStore";
import { Polygon } from "../models/Polygon";
interface PolygonMoveActionIProps {
    parent?: Action<any>;
    actionsStore: ActionsStore;
    polygon: Polygon;
}
export declare class PolygonMoveAction extends Action<Polygon> {
    oldPosition: Vector2d | null;
    newPosition: Vector2d | null;
    constructor(config: PolygonMoveActionIProps);
    build(): Promise<void>;
    execute(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
