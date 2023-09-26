import { Box } from "../../models/Box";
import { Polygon } from "../../models/Polygon";
import { HumanAnnotationEditor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";
import { DrawingAreaEditor } from "../../models/DrawingAreaModels/DrawingAreaEditor";
interface IProps {
    editor: HumanAnnotationEditor | DrawingAreaEditor;
    shape: Box | Polygon;
    index: number;
    showDirection?: boolean;
    allowLabelUpdate?: boolean;
}
export default function AnnotationInput({ shape, index, editor, allowLabelUpdate, showDirection }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
