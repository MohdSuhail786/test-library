import { Action } from "./AbstractAction";
import { Box } from "../models/Box";
import { Editor } from "../models/HumanAnnotationModels/HumanAnnotationEditor";
import ActionsStore from "./ActionStore";
interface RemoveBoxActionIProps {
    parent?: Action<any>;
    box: Box;
    actionsStore: ActionsStore;
}
export declare class RemoveBoxAction extends Action<Box> {
    editor: Editor | null;
    constructor(config: RemoveBoxActionIProps);
    build(): Promise<void>;
    execute(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
