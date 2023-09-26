import { Box } from "../Box";
import { Image, ImageConfig } from "../BaseModels/Image";
import { HumanAnnotationEditor } from "./HumanAnnotationEditor";
import { IMBox, IMPolygon } from "../Types";
import { Polygon } from "../Polygon";
import { CreateBoxAction } from "../../actions/CreateBoxAction";
import { CreatePolygonAction } from "../../actions/CreatePolygonAciton";
import { KonvaEventObject } from "konva/lib/Node";
export interface HumanAnnotationImageConfig extends ImageConfig {
    editor: HumanAnnotationEditor;
    imBoxes?: IMBox[];
}
export declare class HumanAnnotationImage<Config extends HumanAnnotationImageConfig = HumanAnnotationImageConfig> extends Image<HumanAnnotationEditor> {
    drawingAreas: Set<Box>;
    entities: Set<Box>;
    texts: Set<Box>;
    polygons: Set<Polygon>;
    createBoxAction: CreateBoxAction | null;
    createPolygonAction: CreatePolygonAction | null;
    constructor(config: Config);
    init(config: Config): void;
    addImBox(imBox: IMBox): void;
    addImPolygon(imPolygon: IMPolygon): void;
    mouseDownAction(event: KonvaEventObject<MouseEvent>): Promise<void>;
    mouseMoveAction(event: KonvaEventObject<MouseEvent>): Promise<void>;
    mouseUpAction(event: KonvaEventObject<MouseEvent>): Promise<void>;
    addBox(box: Box): void;
    deleteBox(box: Box): void;
    addPolygon(polygon: Polygon): void;
    deletePolygon(polygon: Polygon): void;
    syncBoxs(): void;
    syncPolygons(): void;
}
