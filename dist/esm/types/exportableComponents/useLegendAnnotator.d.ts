import { SetterOrUpdater } from "recoil";
import { IMImage, LabelMappings, LoaderSpinner, LegendState } from "../models/Types";
import { ReactNode } from "react";
interface IProps {
    legendState: LegendState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
    onImageRequest: (id: number) => Promise<string>;
}
export default function useLegendAnnotator(): [ReactNode, (config: IProps) => any, () => any, SetterOrUpdater<LoaderSpinner>];
export {};
