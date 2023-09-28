import Konva from "konva";
import { Label } from "../Label";
import { AppMode, IMBox, IMImage, LabelMappings, MetaSelectionState } from "../Types";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { Vector2d } from "konva/lib/types";
import { MetaSelectionImage } from "./MetaSelectionImage";

export interface MetaSelectionEditorConfig extends EditorConfig {
}

export class MetaSelectionEditor<Config extends MetaSelectionEditorConfig = MetaSelectionEditorConfig> extends Editor<MetaSelectionImage> {
    
    metaSelectionLayer!: Konva.Layer

    constructor(config: Config) {
        super(config)
        this.init(config)
    }


    init(config: Config) {
        super.init(config)

        this.metaSelectionLayer = new Konva.Layer();
        this.metaSelectionLayer.canvas._canvas.setAttribute('id','META-SELECTION-LAYER')
    }


    async importMetaSelectionState(metaSelectionState: MetaSelectionState, labelMappings: LabelMappings) {
        if(metaSelectionState.length === 0) return;
        await this.addImage(metaSelectionState[0].image)
        this.syncImageList()
        this.loadFirstImageIfRequired()

        labelMappings.forEach(label => {
            const newLabel = new Label({
                id: label.id,
                name: label.name,
                type: label.type
            })
            this.addLabel(newLabel)
        })
        console.log(this.labels, metaSelectionState[0].bounding_box)
        metaSelectionState[0].bounding_box.forEach(box => {
            let label = this.labels.find(label => label.name === box.label)
            if(!label) {
                label = new Label({
                    id: this.labels.length,
                    name: box.label,
                    type: this.labels.length
                })
                this.addLabel(label)
            }
            const imBox: IMBox = {
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
                labelId: label.id,
                direction: 'E', 
                humanAnnotated: false,
                indexId: box.id || -1
            }
            this.activeImage?.addImBox(imBox)
        })
        this.syncLabels()
        this.renderAnnotations()
    }

    exportMetaSelectionState():MetaSelectionState {
        return [{
            image: {
                id: this.activeImage?.id() || '',
                src: this.activeImage?.src || '',
                name: this.activeImage?.name() || ''
            },
            bounding_box: [...this.activeImage?.metaSelections || []].map(box => ({
                x: box.x(),
                y: box.y(),
                width: box.rect.width(),
                height: box.rect.height(),
                id: box.indexId === -1 ? null : box.indexId,
                label: box.label?.name || ""
            })).filter(box => !!box.label)
        }]
    }

    addImage(imImage: IMImage): Promise<void> {
        return new Promise((resolve,reject) => {
            let pos:Vector2d = { x:0, y:0 };
            const image = new window.Image();
            image.crossOrigin = 'Anonymous';
            image.src = imImage.src;
            image.onload = (e) => {
                const img = new MetaSelectionImage({
                    id: imImage.id,
                    name: imImage.name,
                    src: imImage.src,
                    x: pos.x,
                    y: pos.y,
                    fill: 'white',
                    draggable: false,
                    image: image,
                    editor: this,
                });
                this.images.unshift(img);
                resolve();
            }
            image.onerror = () => reject("Failed to load image.")
        })
    }

    async renderAnnotations() {
        if(!this.metaSelectionLayer) return;
        this.add(this.metaSelectionLayer)
        this.metaSelectionLayer.moveToTop()
        this.crosshairLayer.moveToTop()
    }

    setSelectionBoxesListening(listen: boolean) {
        this.activeImage?.metaSelections.forEach(entity => {entity.listening(listen); entity.hideAnchors()})
    }

    setMode(appMode: AppMode) {
        super.setMode(appMode);
        if(this.activeImage?.createBoxAction) return;
        if(appMode.mode === 'DRAG_SELECTION_MODE') {
            this.setSelectionBoxesListening(true);
        } else if(appMode.mode === 'EDIT_MODE') {
            this.setSelectionBoxesListening(false);
        } else if(appMode.mode === 'DRAWING_MODE') {
            this.activeImage?.metaSelections.forEach(entity => entity.hideAnchors())
            this.setSelectionBoxesListening(false);
        }
    }
}