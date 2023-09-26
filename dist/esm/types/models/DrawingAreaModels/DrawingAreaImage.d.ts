import { Box } from "../Box";
import { Image, ImageConfig } from "../BaseModels/Image";
import { CreateBoxAction } from "../../actions/CreateBoxAction";
import { DrawingAreaEditor } from "./DrawingAreaEditor";
import { KonvaEventObject } from "konva/lib/Node";
import { IMBox } from "../Types";
export interface DrawingAreaImageConfig extends ImageConfig {
    editor: DrawingAreaEditor;
}
export declare class DrawingAreaImage<Config extends DrawingAreaImageConfig = DrawingAreaImageConfig> extends Image {
    drawingAreas: Set<Box>;
    createBoxAction: CreateBoxAction | null;
    constructor(config: Config);
    init(config: Config): void;
    mouseDownAction(event: KonvaEventObject<MouseEvent>): Promise<void>;
    mouseMoveAction(event: KonvaEventObject<MouseEvent>): Promise<void>;
    mouseUpAction(event: KonvaEventObject<MouseEvent>): Promise<void>;
    addImBox(imBox: IMBox): void;
    addBox(box: Box): void;
    deleteBox(box: Box): void;
    syncBoxs(): void;
}
