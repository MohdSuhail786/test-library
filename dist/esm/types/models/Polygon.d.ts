import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Anchor } from "./Anchor";
import { PolygonTransformAction } from "../actions/PolygonTransformAction";
import { PolygonMoveAction } from "../actions/PolygonMoveAction";
import { Label } from "./Label";
import { Direction } from "./Types";
import { HumanAnnotationImage } from "./HumanAnnotationModels/HumanAnnotationImage";
import { HumanAnnotationEditor } from "./HumanAnnotationModels/HumanAnnotationEditor";
import { DrawingAreaEditor } from "./DrawingAreaModels/DrawingAreaEditor";
export interface GroupConfig extends Konva.GroupConfig {
    image: HumanAnnotationImage;
    label?: Label;
    points: number[];
    direction: Direction;
}
export declare class Polygon<Config extends GroupConfig = GroupConfig> extends Konva.Group {
    direction: Direction;
    line: Konva.Line;
    dummyLine: Konva.Line;
    label: Label | null;
    image: HumanAnnotationImage | null;
    editor: HumanAnnotationEditor | DrawingAreaEditor | null;
    anchors: Anchor[];
    polygonTransformAction: PolygonTransformAction | null;
    polygonMoveAction: PolygonMoveAction | null;
    constructor(config: Config);
    focus(): void;
    unFocus(): void;
    init(config: Config): void;
    initAnchors(): void;
    handleDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleDragMove(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleDragEnd(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    addAnchor(pos: Vector2d, index: number): void;
    handleAnchorClick(event: Konva.KonvaEventObject<MouseEvent>): Promise<void>;
    handleAnchorDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleAnchorDragEnd(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleAnchorDragMove(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleAnchorMouseLeave(event: Konva.KonvaEventObject<MouseEvent>): void;
    handleAnchorMouseEnter(event: Konva.KonvaEventObject<MouseEvent>): void;
    updateAnchorsPosition(): void;
    showAnchors(): void;
    updateAnchorsScale(): void;
    hideAnchors(): void;
    mouseClickAction(event: KonvaEventObject<MouseEvent>): void;
    scrollIntoView(): void;
    mouseMoveAction(event: KonvaEventObject<MouseEvent>): void;
    mouseEnterAction(event: KonvaEventObject<MouseEvent>): void;
    mouseLeaveAction(event: KonvaEventObject<MouseEvent>): void;
    updateLabel(label: Label): void;
    updateDirection(direction: Direction): void;
}
