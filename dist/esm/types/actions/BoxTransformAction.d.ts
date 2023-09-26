import { Box } from "../models/Box";
import { IMBox } from "../models/Types";
import { Action } from "./AbstractAction";
import ActionsStore from "./ActionStore";
import { Anchor } from "../models/Anchor";
interface BoxTransformActionIProps {
    parent?: Action<any>;
    actionsStore: ActionsStore;
    box: Box;
    anchor: Anchor;
}
export declare class BoxTransformAction extends Action<Box> {
    anchor: Anchor | null;
    oldPosition: Omit<IMBox, "labelId"> | null;
    newPosition: Omit<IMBox, "labelId"> | null;
    constructor(config: BoxTransformActionIProps);
    build(): Promise<void>;
    execute(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}
export {};
