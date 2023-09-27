import { SetterOrUpdater } from "recoil";
import { DrawingAreaState, IMImage, LabelMappings, LoaderSpinner } from "../models/Types";
import { ReactNode } from "react";
interface IProps {
    drawingAreaState: DrawingAreaState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
}
export default function useDrawingAreaAnnotator(): [ReactNode, (config: IProps) => any, () => any, SetterOrUpdater<LoaderSpinner>];
export {};
