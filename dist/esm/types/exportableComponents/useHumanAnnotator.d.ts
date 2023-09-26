import { GraphJSON, HumanAnnotations, LabelMappings } from "../models/Types";
import { ReactNode } from "react";
interface IProps {
    humanAnnotations: HumanAnnotations;
    graphJSON: GraphJSON;
    labelMappings: LabelMappings;
    imageSrc: string;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
}
export default function useHumanAnnotator(): [ReactNode, (config: IProps) => any, () => any];
export {};
