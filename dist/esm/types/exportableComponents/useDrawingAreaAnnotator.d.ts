import { DrawingAreaState, LabelMappings } from "../models/Types";
import { ReactNode } from "react";
interface IProps {
    drawingAreaState: DrawingAreaState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
}
export default function useDrawingAreaAnnotator(): [ReactNode, (config: IProps) => any, () => any];
export {};
