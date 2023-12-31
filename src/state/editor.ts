import { atom } from "recoil";
import { Box } from "../models/Box";
import { AppMode, Filter, ImageTypes, LoaderSpinner } from "../models/Types";
import { Label } from "../models/Label";
import { Polygon } from "../models/Polygon";
import { HumanAnnotationImage } from "../models/HumanAnnotationModels/HumanAnnotationImage";
import { DrawingAreaImage } from "../models/DrawingAreaModels/DrawingAreaImage";

export const entityListAtom = atom<Box[]>({
    key: 'entityListAtom',
    default: [],
})

export const textListAtom = atom<Box[]>({
    key: 'textListAtom',
    default: [],
})

export const polygonListAtom = atom<Polygon[]>({
    key: 'polygonListAtom',
    default: [],
})

export const labelListAtom = atom<Label[]>({
    key: 'labelListAtom',
    default: [],
})

export const filterAtom = atom<Filter>({
    key: 'filterAtom',
    default: {annotationType: 'entity',entityClass: '',entityType:''},
})

export const cursorTextAtom = atom<{x:number,y:number,text:string}>({
    key: 'cursorTextAtom',
    default: {x:0,y:0,text:'ball valve'},
})

export const appModeAtom = atom<AppMode>({
    key: 'appModeAtom',
    default: {
        mode: "DRAWING_MODE"
    }
})

export const loaderAtom = atom<LoaderSpinner>({
    key: 'loaderAtom',
    default: {
        visible: false,
    }
})

export const activeImageAtom = atom<ImageTypes | null>({
    key: 'activeImage',
    default: null,
})

export const imageListAtom = atom<(ImageTypes)[]>({
    key: 'imageListAtom',
    default: [],
})

export const showUploadDraggerAtom = atom<boolean>({
    key: 'showUploadDraggerAtom',
    default: false
})