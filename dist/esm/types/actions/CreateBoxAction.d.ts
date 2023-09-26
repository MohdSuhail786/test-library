import { Vector2d } from "konva/lib/types";
import { Action } from "./AbstractAction";
import { Box } from "../models/Box";
import ActionsStore from "./ActionStore";
import { HumanAnnotationImage } from "../models/HumanAnnotationModels/HumanAnnotationImage";
import { DrawingAreaImage } from "../models/DrawingAreaModels/DrawingAreaImage";
interface CreateBoxActionIProps {
    parent?: Action<any>;
    pos: Vector2d;
    image: HumanAnnotationImage | DrawingAreaImage;
    actionsStore: ActionsStore;
}
export declare class CreateBoxAction extends Action<Box> {
    pos: Vector2d | null;
    constructor(config: CreateBoxActionIProps);
    build(): Promise<void>;
    execute(pos: Vector2d): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
