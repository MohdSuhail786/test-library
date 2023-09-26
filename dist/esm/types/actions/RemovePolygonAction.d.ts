import { Action } from "./AbstractAction";
import { Editor } from "../models/HumanAnnotationModels/HumanAnnotationEditor";
import ActionsStore from "./ActionStore";
import { Polygon } from "../models/Polygon";
interface RemovePolygonActionIProps {
    parent?: Action<any>;
    polygon: Polygon;
    actionsStore: ActionsStore;
}
export declare class RemovePolygonAction extends Action<Polygon> {
    editor: Editor | null;
    constructor(config: RemovePolygonActionIProps);
    build(): Promise<void>;
    execute(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
