import { Box } from "../models/Box";
import { AppMode, Filter, ImageTypes, LoaderSpinner } from "../models/Types";
import { Label } from "../models/Label";
import { Polygon } from "../models/Polygon";
export declare const entityListAtom: import("recoil").RecoilState<Box<import("../models/Box").GroupConfig>[]>;
export declare const textListAtom: import("recoil").RecoilState<Box<import("../models/Box").GroupConfig>[]>;
export declare const polygonListAtom: import("recoil").RecoilState<Polygon<import("../models/Polygon").GroupConfig>[]>;
export declare const labelListAtom: import("recoil").RecoilState<Label[]>;
export declare const filterAtom: import("recoil").RecoilState<Filter>;
export declare const cursorTextAtom: import("recoil").RecoilState<{
    x: number;
    y: number;
    text: string;
}>;
export declare const appModeAtom: import("recoil").RecoilState<AppMode>;
export declare const loaderAtom: import("recoil").RecoilState<LoaderSpinner>;
export declare const activeImageAtom: import("recoil").RecoilState<ImageTypes | null>;
export declare const imageListAtom: import("recoil").RecoilState<ImageTypes[]>;
export declare const showUploadDraggerAtom: import("recoil").RecoilState<boolean>;
