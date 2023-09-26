import Konva from "konva";
import { Box } from "./Box";
import { Polygon } from "./Polygon";
export interface AnchorConfig extends Konva.RectConfig {
    polygon?: Polygon;
    box?: Box;
    posIndex: number;
}
export declare class Anchor<Config extends AnchorConfig = AnchorConfig> extends Konva.Rect {
    polygon: Polygon | null;
    box: Box | null;
    startAnchor: boolean;
    posIndex: number;
    constructor(config: Config);
}
