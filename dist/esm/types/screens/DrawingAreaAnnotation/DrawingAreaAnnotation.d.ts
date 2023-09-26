import { DrawingAreaState, LabelMappings } from "../../models/Types";
import "../../styles/global.scss";
import { DrawingAreaEditor } from "../../models/DrawingAreaModels/DrawingAreaEditor";
interface IProps {
    drawingAreaState: DrawingAreaState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    editor: DrawingAreaEditor;
}
export default function DrawingAreaAnnotation({ editor, labelMappings, drawingAreaState }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
