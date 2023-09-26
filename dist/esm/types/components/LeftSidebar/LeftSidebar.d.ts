import { HumanAnnotationEditor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";
import { DrawingAreaEditor } from "../../models/DrawingAreaModels/DrawingAreaEditor";
interface IProps {
    editor: HumanAnnotationEditor | DrawingAreaEditor;
    config?: {
        showInput?: boolean;
        showCheckBoxes?: boolean;
        showDirection?: boolean;
        allowLabelUpdate?: boolean;
    };
}
export default function LeftSidebar({ editor, config }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
