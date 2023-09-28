import { IMImage, LabelMappings, LegendState, LoaderSpinner } from "../../models/Types";
import "../../styles/global.scss";
import { LegendEditor } from "../../models/LegendAnnotationModels/LegendEditor";
interface IProps {
    legendState: LegendState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    editor: LegendEditor;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
    loader: LoaderSpinner;
}
export default function LegendAnnotation({ editor, labelMappings, legendState, loader, editorSpacingLeft, uploadRequest, onUploadSubmit }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
