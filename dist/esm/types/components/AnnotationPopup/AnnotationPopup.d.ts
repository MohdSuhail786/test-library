import { HumanAnnotationEditor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";
import { DrawingAreaEditor } from "../../models/DrawingAreaModels/DrawingAreaEditor";
interface IProps {
    editor: HumanAnnotationEditor | DrawingAreaEditor;
    matchEmptyString?: boolean;
    allowCustomLabels?: boolean;
    allowLabelUpdate?: boolean;
    showDirection?: boolean;
}
export default function AnnotationPopup({ editor, matchEmptyString, allowCustomLabels, allowLabelUpdate, showDirection }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
