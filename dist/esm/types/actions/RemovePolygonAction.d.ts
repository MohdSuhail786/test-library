import { Action } from "./AbstractAction";
import ActionsStore from "./ActionStore";
import { Polygon } from "../models/Polygon";
import { EditorTypes } from "../models/Types";
interface RemovePolygonActionIProps {
    parent?: Action<any>;
    polygon: Polygon;
    actionsStore: ActionsStore;
}
export declare class RemovePolygonAction extends Action<Polygon> {
    editor: EditorTypes | null;
    constructor(config: RemovePolygonActionIProps);
    build(): Promise<void>;
    execute(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
