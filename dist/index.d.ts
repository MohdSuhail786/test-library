import { ReactNode } from 'react';

type Direction = "" | "N" | "S" | "E" | "W";
type HumanAnnotations = {
    bbox: {
        [key: string]: [number, number, number, number];
    };
    text: {
        [key: string]: null | string;
    };
    score: {
        [key: string]: number;
    };
    polygon: {
        [n: number]: {
            category_name: any;
            category_id: number;
            contour: number[][];
            direction: Direction;
        };
    };
    direction: {
        [key: string]: Direction;
    };
    category_id: {
        [key: string]: number;
    };
    category_name: {
        [key: string]: string;
    };
};
type GraphJSON = {
    area: {
        [key: string]: number;
    };
    bbox: {
        [key: string]: [number, number, number, number];
    };
    text: {
        [key: string]: null | string;
    };
    score: {
        [key: string]: number;
    };
    newbbox: {
        [key: string]: [] | [number, number, number, number];
    };
    old_bbox: {
        [key: string]: [] | [number, number, number, number];
    };
    direction: {
        [key: string]: Direction;
    };
    category_id: {
        [key: string]: number;
    };
    category_name: {
        [key: string]: string;
    };
};
type LabelMappings = {
    id: number;
    name: string;
    type: number;
}[];

interface IProps {
    humanAnnotations: HumanAnnotations;
    graphJSON: GraphJSON;
    labelMappings: LabelMappings;
    imageSrc: string;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
}
declare function useHumanAnnotator(): [ReactNode, (config: IProps) => any, () => any];

export { useHumanAnnotator };
