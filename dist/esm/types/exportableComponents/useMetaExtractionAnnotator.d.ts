import { SetterOrUpdater } from "recoil";
import { MetaSelectionState, IMImage, LabelMappings, LoaderSpinner } from "../models/Types";
import { ReactNode } from "react";
interface IProps {
    metaExtractionState: MetaSelectionState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
}
export default function useMetaExtractionAnnotator(): [ReactNode, (config: IProps) => any, (imImage: IMImage) => void, () => any, SetterOrUpdater<LoaderSpinner>];
export {};
