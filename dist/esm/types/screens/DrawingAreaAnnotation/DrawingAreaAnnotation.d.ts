import { DrawingAreaState, IMImage, LabelMappings, LoaderSpinner } from "../../models/Types";
import "../../styles/global.scss";
import { DrawingAreaEditor } from "../../models/DrawingAreaModels/DrawingAreaEditor";
interface IProps {
    drawingAreaState: DrawingAreaState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    editor: DrawingAreaEditor;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
    loader: LoaderSpinner;
}
export default function DrawingAreaAnnotation({ editor, labelMappings, drawingAreaState, loader, editorSpacingLeft, uploadRequest, onUploadSubmit }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
