import { Action } from "./AbstractAction";
import { Box } from "../models/Box";
import ActionsStore from "./ActionStore";
import { EditorTypes } from "../models/Types";
interface RemoveBoxActionIProps {
    parent?: Action<any>;
    box: Box;
    actionsStore: ActionsStore;
}
export declare class RemoveBoxAction extends Action<Box> {
    editor: EditorTypes | null;
    constructor(config: RemoveBoxActionIProps);
    build(): Promise<void>;
    execute(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
