import { GraphJSON, HumanAnnotations, LabelMappings } from "../../models/Types";
import "../../styles/global.scss";
import { HumanAnnotationEditor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";
interface IProps {
    humanAnnotations: HumanAnnotations;
    graphJSON: GraphJSON;
    labelMappings: LabelMappings;
    imageSrc: string;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    editor: HumanAnnotationEditor;
}
export default function HumanAnnotation({ editor, imageSrc, humanAnnotations, graphJSON, labelMappings }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
