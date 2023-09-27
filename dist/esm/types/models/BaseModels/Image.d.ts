import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import ActionsStore from "../../actions/ActionStore";
import { EditorTypes } from "../Types";
export interface ImageConfig extends Konva.ImageConfig {
    src: string;
}
export declare class Image<EditorType = EditorTypes, Config extends ImageConfig = ImageConfig> extends Konva.Image {
    src: string;
    editor: EditorType;
    actionStore: ActionsStore;
    constructor(config: Config);
    init(config: Config): void;
    mouseEnterAction(event: KonvaEventObject<MouseEvent>): void;
    mouseLeaveAction(event: KonvaEventObject<MouseEvent>): void;
}
