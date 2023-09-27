import Konva from "konva";
import { AppMode, IMImage, LabelMappings, MetaSelectionState } from "../Types";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { MetaSelectionImage } from "./MetaSelectionImage";
export interface MetaSelectionEditorConfig extends EditorConfig {
}
export declare class MetaSelectionEditor<Config extends MetaSelectionEditorConfig = MetaSelectionEditorConfig> extends Editor<MetaSelectionImage> {
    metaSelectionLayer: Konva.Layer;
    constructor(config: Config);
    init(config: Config): void;
    importMetaSelectionState(metaSelectionState: MetaSelectionState, labelMappings: LabelMappings): Promise<void>;
    exportMetaSelectionState(): MetaSelectionState;
    addImage(imImage: IMImage): Promise<void>;
    renderAnnotations(): Promise<void>;
    setSelectionBoxesListening(listen: boolean): void;
    setMode(appMode: AppMode): void;
}
