import { EditorTypes } from "../../models/Types";
interface IProps {
    editor: EditorTypes;
    config?: {
        showInput?: boolean;
        showCheckBoxes?: boolean;
        showDirection?: boolean;
        allowLabelUpdate?: boolean;
        showRotation?: boolean;
    };
}
export default function LeftSidebar({ editor, config }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
