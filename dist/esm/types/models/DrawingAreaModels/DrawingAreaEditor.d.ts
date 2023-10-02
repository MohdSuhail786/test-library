import Konva from "konva";
import { AppMode, DrawingAreaState, IMImage, LabelMappings } from "../Types";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { DrawingAreaImage } from "./DrawingAreaImage";
export interface DrawingAreaConfig extends EditorConfig {
}
export declare class DrawingAreaEditor<Config extends DrawingAreaConfig = DrawingAreaConfig> extends Editor<DrawingAreaImage> {
    drawingAreaLayer: Konva.Layer;
    constructor(config: Config);
    init(config: Config): void;
    addNewImage: (imImage: IMImage) => Promise<void>;
    importDrawingAreaState(drawingAreaState: DrawingAreaState, labelMappings: LabelMappings): Promise<void>;
    exportDrawingAreaState(): DrawingAreaState;
    addImage(imImage: IMImage): Promise<DrawingAreaImage>;
    renderAnnotations(): Promise<void>;
    setSelectionBoxesListening(listen: boolean): void;
    setMode(appMode: AppMode): void;
}
