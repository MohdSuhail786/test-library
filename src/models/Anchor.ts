import Konva from "konva"
import { Box } from "./Box"
import { Polygon } from "./Polygon"

export interface AnchorConfig extends Konva.RectConfig {
    polygon?: Polygon
    box?: Box
    posIndex: number
}


export class Anchor<Config extends AnchorConfig = AnchorConfig> extends Konva.Rect {
    polygon: Polygon | null = null
    box: Box | null = null
    startAnchor: boolean = false
    posIndex!: number
    constructor(config: Config) {
        super(config)
        this.polygon = config.polygon || null;
        this.box = config.box || null;
        this.posIndex = config.posIndex
    }
}
