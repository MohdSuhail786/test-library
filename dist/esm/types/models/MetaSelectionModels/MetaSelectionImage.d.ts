import { Box } from "../Box";
import { Image, ImageConfig } from "../BaseModels/Image";
import { CreateBoxAction } from "../../actions/CreateBoxAction";
import { KonvaEventObject } from "konva/lib/Node";
import { IMBox } from "../Types";
import { MetaSelectionEditor } from "./MetaSelectionEditor";
export interface MetaSelectionImageConfig extends ImageConfig {
    editor: MetaSelectionEditor;
}
export declare class MetaSelectionImage<Config extends MetaSelectionImageConfig = MetaSelectionImageConfig> extends Image {
    metaSelections: Set<Box>;
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
