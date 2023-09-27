import { EditorTypes } from "../../models/Types";
interface IProps {
    editor: EditorTypes;
    matchEmptyString?: boolean;
    allowCustomLabels?: boolean;
    allowLabelUpdate?: boolean;
    showDirection?: boolean;
}
export default function AnnotationPopup({ editor, matchEmptyString, allowCustomLabels, allowLabelUpdate, showDirection }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
