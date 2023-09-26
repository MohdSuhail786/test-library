export declare function uuidv4(): string;
export declare function convertFileToBlob(file: File): Promise<string>;
export declare function humanToCOCOObj(graphObj: any): any;
export declare function graphToCOCOObj(graphObj: any, labelMappings: any[], imageSrc: string): {
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
export declare function getLabelColors(): string[];
export declare function groupArrayInPairs(arr: any[]): any[][];
