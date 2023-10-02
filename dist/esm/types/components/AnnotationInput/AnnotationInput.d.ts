import { Box } from "../../models/Box";
import { Polygon } from "../../models/Polygon";
import { EditorTypes } from "../../models/Types";
interface IProps {
    editor: EditorTypes;
    shape: Box | Polygon;
    index: number;
    showDirection?: boolean;
    allowLabelUpdate?: boolean;
    showRotation?: boolean;
    allowCustomLabels?: boolean;
}
export default function AnnotationInput({ shape, index, editor, allowLabelUpdate, showDirection, showRotation, allowCustomLabels }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
