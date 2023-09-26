import { ReactNode } from 'react';

type IMImage = {
    src: string;
    id: string;
    name: string;
};
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
type ProjectSetupBBox = {
    id: number | null;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
};
type ProjectSetupState = {
    image: IMImage;
    bounding_box: ProjectSetupBBox[];
};
type DrawingAreaState = ProjectSetupState[];

interface IProps$1 {
    humanAnnotations: HumanAnnotations;
    graphJSON: GraphJSON;
    labelMappings: LabelMappings;
    imageSrc: string;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
}
declare function useHumanAnnotator(): [ReactNode, (config: IProps$1) => any, () => any];

interface IProps {
    drawingAreaState: DrawingAreaState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
}
declare function useDrawingAreaAnnotator(): [ReactNode, (config: IProps) => any, () => any];

export { useDrawingAreaAnnotator, useHumanAnnotator };
