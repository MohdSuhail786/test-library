import { Editor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";
interface IProps {
    editor: Editor;
    onContinue: () => void;
    onSave: () => Promise<void>;
}
export default function TopActionBar({ editor, onContinue, onSave }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
