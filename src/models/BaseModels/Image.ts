import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import ActionsStore from "../../actions/ActionStore";
import { HumanAnnotationEditor } from "../HumanAnnotationModels/HumanAnnotationEditor";
import { EditorTypes } from "../Types";

export interface ImageConfig extends Konva.ImageConfig {
    src: string
}

export class Image<EditorType = EditorTypes,Config extends ImageConfig = ImageConfig> extends Konva.Image {

    src: string = "";
    editor!: EditorType;
    actionStore: ActionsStore = new ActionsStore();

    constructor(config: Config) {
        super(config);
        
        this.on('mouseenter', this.mouseEnterAction.bind(this))
        this.on('mouseleave', this.mouseLeaveAction.bind(this))
        
        this.cache()    
    }

    init(config: Config) {
        this.src = config.src
        this.editor = config.editor;
    }

    mouseEnterAction(event: KonvaEventObject<MouseEvent>) {
        (this.editor as HumanAnnotationEditor)?.updateCursorStyle(this)
    }

    mouseLeaveAction(event: KonvaEventObject<MouseEvent>) {
        (this.editor as HumanAnnotationEditor)?.updateCursorStyle()
    }
}