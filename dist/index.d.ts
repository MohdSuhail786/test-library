import { ReactNode } from 'react';
import { SetterOrUpdater } from 'recoil';

type LoaderSpinner = ({
    visible: true;
    title: string;
} | {
    visible: false;
});
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
type LegendProjectSetupBBox = ProjectSetupBBox & {
    rotation: boolean;
};
type ProjectSetupState = {
    image: IMImage;
    bounding_box: ProjectSetupBBox[];
};
type DrawingAreaState = ProjectSetupState[];
type MetaSelectionState = ProjectSetupState[];
type LegendState = {
    image: Omit<IMImage, "src">;
    bounding_box: LegendProjectSetupBBox[];
}[];

interface IProps$3 {
    humanAnnotations: HumanAnnotations;
    graphJSON: GraphJSON;
    labelMappings: LabelMappings;
    imageSrc: string;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
}
declare function useHumanAnnotator(): [ReactNode, (config: IProps$3) => any, () => any];

interface IProps$2 {
    drawingAreaState: DrawingAreaState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
}
declare function useDrawingAreaAnnotator(): [ReactNode, (config: IProps$2) => any, () => any, SetterOrUpdater<LoaderSpinner>];

interface IProps$1 {
    metaExtractionState: MetaSelectionState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
}
declare function useMetaExtractionAnnotator(): [ReactNode, (config: IProps$1) => any, () => any, SetterOrUpdater<LoaderSpinner>];

interface IProps {
    legendState: LegendState;
    labelMappings: LabelMappings;
    editorSpacingLeft?: number;
    editorSpacingTop?: number;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
    onImageRequest: (id: number) => Promise<string>;
}
declare function useLegendAnnotator(): [ReactNode, (config: IProps) => any, () => any, SetterOrUpdater<LoaderSpinner>];

export { useDrawingAreaAnnotator, useHumanAnnotator, useLegendAnnotator, useMetaExtractionAnnotator as useMetaAreaAnnotator };
