import Konva from "konva";
import { Label } from "../Label";
import { AppMode, DrawingAreaState, IMBox, IMImage, LabelMappings } from "../Types";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { DrawingAreaImage } from "./DrawingAreaImage";
import { Vector2d } from "konva/lib/types";
import { setRecoil } from "recoil-nexus";
import { showUploadDraggerAtom } from "../../state/editor";

export interface DrawingAreaConfig extends EditorConfig {
}

export class DrawingAreaEditor<Config extends DrawingAreaConfig = DrawingAreaConfig> extends Editor<DrawingAreaImage> {
    
    drawingAreaLayer!: Konva.Layer

    constructor(config: Config) {
        super(config)
        this.init(config)
    }


    init(config: Config) {
        super.init(config)

        this.drawingAreaLayer = new Konva.Layer();
        this.drawingAreaLayer.canvas._canvas.setAttribute('id','DRAWING-AREA-LAYER')
    }

    addNewImage = async (imImage: IMImage) => {
        setRecoil(showUploadDraggerAtom,false); 
        const image = await this.addImage(imImage)
        this.syncImageList()
        if(!this.activeImage) this.loadImage(image)
    }


    async importDrawingAreaState(drawingAreaState: DrawingAreaState, labelMappings: LabelMappings) {
        if(drawingAreaState.length === 0) return;
        await this.addImage(drawingAreaState[0].image)
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
        this.syncLabels();
        console.log(this.labels, drawingAreaState[0].bounding_box)
        drawingAreaState[0].bounding_box.forEach(box => {
            const imBox: IMBox = {
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
                labelId: this.labels.find(label => label.name === box.label)?.id ?? -1,
                direction: 'E', 
                humanAnnotated: false,
                indexId: box.id || -1
            }
            this.activeImage?.addImBox(imBox)
        })
        this.renderAnnotations()
    }

    exportDrawingAreaState():DrawingAreaState {
        return [{
            image: {
                id: this.activeImage?.id() || '',
                src: this.activeImage?.src || '',
                name: this.activeImage?.name() || ''
            },
            bounding_box: [...this.activeImage?.drawingAreas || []].map(box => ({
                x: box.x(),
                y: box.y(),
                width: box.rect.width(),
                height: box.rect.height(),
                id: box.indexId === -1 ? null : box.indexId,
                label: box.label?.name || ""
            })).filter(box => !!box.label)
        }]
    }

    addImage(imImage: IMImage): Promise<DrawingAreaImage> {
        return new Promise((resolve,reject) => {
            let pos:Vector2d = { x:0, y:0 };
            const image = new window.Image();
            image.crossOrigin = 'Anonymous';
            image.src = imImage.src;
            image.onload = (e) => {
                const img = new DrawingAreaImage({
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
                resolve(img);
            }
            image.onerror = () => reject("Failed to load image.")
        })
    }

    async renderAnnotations() {
        if(!this.drawingAreaLayer) return;
        this.add(this.drawingAreaLayer)
        this.drawingAreaLayer.moveToTop()
        this.crosshairLayer.moveToTop()
    }

    setSelectionBoxesListening(listen: boolean) {
        this.activeImage?.drawingAreas.forEach(entity => {entity.listening(listen); entity.hideAnchors()})
    }

    setMode(appMode: AppMode) {
        super.setMode(appMode);
        if(this.activeImage?.createBoxAction) return;
        if(appMode.mode === 'DRAG_SELECTION_MODE') {
            this.setSelectionBoxesListening(true);
        } else if(appMode.mode === 'EDIT_MODE') {
            this.setSelectionBoxesListening(false);
        } else if(appMode.mode === 'DRAWING_MODE') {
            this.activeImage?.drawingAreas.forEach(entity => entity.hideAnchors())
            this.setSelectionBoxesListening(false);
        }
    }
}