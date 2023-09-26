import { Action } from "./AbstractAction";
import ActionsStore from "./ActionStore";
import { Anchor } from "../models/Anchor";
import { Polygon } from "../models/Polygon";
interface PolygonTransformActionIProps {
    parent?: Action<any>;
    actionsStore: ActionsStore;
    polygon: Polygon;
    anchor: Anchor;
}
export declare class PolygonTransformAction extends Action<Polygon> {
    anchor: Anchor | null;
    oldPoints: number[] | null;
    newPoints: number[] | null;
    constructor(config: PolygonTransformActionIProps);
    build(): Promise<void>;
    execute(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
