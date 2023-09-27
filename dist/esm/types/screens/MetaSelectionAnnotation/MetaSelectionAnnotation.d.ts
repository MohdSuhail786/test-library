import { IMImage, LabelMappings, LoaderSpinner, MetaSelectionState } from "../../models/Types";
import "../../styles/global.scss";
import { MetaSelectionEditor } from "../../models/MetaSelectionModels/MetaSelectionEditor";
interface IProps {
    metaExtractionState: MetaSelectionState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    editor: MetaSelectionEditor;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
    loader: LoaderSpinner;
}
export default function MetaSelectionAnnotation({ editor, labelMappings, metaExtractionState, loader, editorSpacingLeft, uploadRequest, onUploadSubmit }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
