import { Box } from "./Box";
import { DrawingAreaImage } from "./DrawingAreaModels/DrawingAreaImage";
import { HumanAnnotationImage } from "./HumanAnnotationModels/HumanAnnotationImage";
import { Polygon } from "./Polygon";
export type AppMode = ({
    mode: "DRAG_SELECTION_MODE" | "DRAWING_MODE" | "POLYGON_MODE";
} | {
    mode: "EDIT_MODE";
    shapeInEditMode: Box | Polygon;
    visible: boolean;
    scrollIntoView: boolean;
});
export type LoaderSpinner = ({
    visible: true;
    title: string;
} | {
    visible: false;
});
export type IMBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    direction: Direction;
    labelId: number;
    indexId: number;
    humanAnnotated: boolean;
};
export type IMPolygon = {
    points: any[];
    direction: Direction;
    labelId: number;
    indexId: number;
    humanAnnotated: boolean;
};
export type IMImage = {
    src: string;
    id: string;
    name: string;
};
export type Direction = "" | "N" | "S" | "E" | "W";
export type HumanAnnotations = {
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
export type GraphJSON = {
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
export type LabelMappings = {
    id: number;
    name: string;
    type: number;
}[];
export type COCOObj = {
    categories: any[];
    image: {
        id: string;
        name: string;
        src: string;
    };
    annotations: {
        index_id: number;
        bbox: any;
        score: any;
        category_id: any;
        category_name: any;
        segmentation: null;
        direction: any;
        iscrowd: number;
        area: any;
    }[];
};
export type AnnotationType = "entity" | "polygon" | "text";
export type Filter = {
    annotationType: AnnotationType;
    entityType: string;
    entityClass: string;
};
export type ProjectSetupBBox = {
    id: number | null;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
};
export type ProjectSetupState = {
    image: IMImage;
    bounding_box: ProjectSetupBBox[];
};
export type DrawingAreaState = ProjectSetupState[];
export type MetaDataAreaState = ProjectSetupState[];
export type ImageTypes = DrawingAreaImage | HumanAnnotationImage;
