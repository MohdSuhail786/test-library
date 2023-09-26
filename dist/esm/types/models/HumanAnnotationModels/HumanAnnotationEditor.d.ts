import Konva from "konva";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { AppMode, COCOObj, IMBox, IMImage } from "../Types";
import { HumanAnnotationImage } from "./HumanAnnotationImage";
export interface HumanAnnotationEditorConfig extends EditorConfig {
}
export declare class HumanAnnotationEditor<Config extends HumanAnnotationEditorConfig = HumanAnnotationEditorConfig> extends Editor<HumanAnnotationImage> {
    entityLayer: Konva.Layer;
    polygonLayer: Konva.Layer;
    textLayer: Konva.Layer;
    constructor(config: Config);
    init(config: Config): void;
    showCursorTextElement(config: {
        x: number;
        y: number;
        text: string;
    }): void;
    importCOCOObj(COCOObj: COCOObj): Promise<void>;
    switchAppMode(): void;
    keyDownAction: (event: KeyboardEvent) => Promise<void>;
    addImage(imImage: IMImage, imBoxes?: IMBox[]): Promise<void>;
    extractBBoxes(): {
        box: IMBox;
        label: string;
    }[];
    setSelectionBoxesListening(listen: boolean): void;
    renderAnnotations(): Promise<void>;
    setMode(appMode: AppMode): void;
}
