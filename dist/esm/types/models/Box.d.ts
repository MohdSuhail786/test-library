import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { BoxTransformAction } from "../actions/BoxTransformAction";
import { BoxMoveAction } from "../actions/BoxMoveAction";
import { Label } from "./Label";
import { Direction, EditorTypes, ImageTypes } from "./Types";
export interface GroupConfig extends Konva.GroupConfig {
    image: ImageTypes;
    indexId: number;
    humanAnnotated: boolean;
    label?: Label | null;
    direction: Direction;
}
export declare class Box<Config extends GroupConfig = GroupConfig> extends Konva.Group {
    rect: Konva.Rect;
    label: Label | null;
    direction: Direction;
    image: ImageTypes | null;
    indexId: number;
    humanAnnotated: boolean;
    editor: EditorTypes | null;
    anchors: {
        rect?: Konva.Rect;
        pos: [number, number];
        name: string;
    }[];
    boxTransformAction: BoxTransformAction | null;
    boxMoveAction: BoxMoveAction | null;
    constructor(config: Config);
    focus(): void;
    unFocus(): void;
    init(config: Config): void;
    initAnchors(): void;
    handleDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleDragMove(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleDragEnd(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    updateAnchorsPosition(): void;
    handleAnchorDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleAnchorDragEnd(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleAnchorDragMove(event: Konva.KonvaEventObject<DragEvent>): Promise<void>;
    handleAnchorMouseLeave(event: Konva.KonvaEventObject<MouseEvent>): void;
    handleAnchorMouseEnter(event: Konva.KonvaEventObject<MouseEvent>): void;
    showAnchors(): void;
    updateAnchorsScale(): void;
    scrollIntoView(): void;
    hideAnchors(): void;
    mouseClickAction(event: KonvaEventObject<MouseEvent>): void;
    mouseMoveAction(event: KonvaEventObject<MouseEvent>): void;
    mouseEnterAction(event: KonvaEventObject<MouseEvent>): void;
    mouseLeaveAction(event: KonvaEventObject<MouseEvent>): void;
    updateLabel(label: Label): void;
    updateDirection(direction: Direction): void;
}
