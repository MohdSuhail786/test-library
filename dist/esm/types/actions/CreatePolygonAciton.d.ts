import { Vector2d } from "konva/lib/types";
import { Action } from "./AbstractAction";
import ActionsStore from "./ActionStore";
import { Polygon } from "../models/Polygon";
import { HumanAnnotationImage } from "../models/HumanAnnotationModels/HumanAnnotationImage";
interface CreatePolygonActionIProps {
    parent?: Action<any>;
    pos: Vector2d;
    image: HumanAnnotationImage;
    actionsStore: ActionsStore;
}
export declare class CreatePolygonAction extends Action<Polygon> {
    pos: Vector2d | null;
    constructor(config: CreatePolygonActionIProps);
    build(): Promise<void>;
    execute(pos: Vector2d): Promise<void>;
    finish(config?: any): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
