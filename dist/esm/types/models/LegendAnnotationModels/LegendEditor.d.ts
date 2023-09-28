import Konva from "konva";
import { AppMode, IMImage, LabelMappings, LegendState } from "../Types";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { LegendImage } from "./LegendImage";
export interface LegendEditorConfig extends EditorConfig {
    onImageRequest: (id: number) => Promise<string>;
}
export declare class LegendEditor<Config extends LegendEditorConfig = LegendEditorConfig> extends Editor<LegendImage> {
    legendSelectionLayer: Konva.Layer;
    handleImageRequest: (id: number) => Promise<string>;
    constructor(config: Config);
    init(config: Config): void;
    loadImageFromServer(id: number | string): Promise<string>;
    loadImage(img: LegendImage): Promise<void>;
    importLegendState(legendState: LegendState, labelMappings: LabelMappings): Promise<void>;
    exportLegendState(): LegendState;
    addImage(imImage: IMImage): Promise<LegendImage>;
    renderAnnotations(): Promise<void>;
    setSelectionBoxesListening(listen: boolean): void;
    setMode(appMode: AppMode): void;
}
