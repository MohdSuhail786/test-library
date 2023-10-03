import Konva from "konva";
import { Label } from "../Label";
import { AppMode, IMBox, IMImage, ImageTypes, LabelMappings, LegendState } from "../Types";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { Vector2d } from "konva/lib/types";
import { LegendImage } from "./LegendImage";
import { setRecoil } from "recoil-nexus";
import { loaderAtom, showUploadDraggerAtom } from "../../state/editor";

export interface LegendEditorConfig extends EditorConfig {
    onImageRequest: (id: number) => Promise<string>
}

export class LegendEditor<Config extends LegendEditorConfig = LegendEditorConfig> extends Editor<LegendImage> {
    
    legendSelectionLayer!: Konva.Layer
    handleImageRequest!: (id: number) => Promise<string>

    constructor(config: Config) {
        super(config)
        this.init(config)
    }


    init(config: Config) {
        super.init(config)

        this.handleImageRequest = config.onImageRequest;
        this.legendSelectionLayer = new Konva.Layer();
        this.legendSelectionLayer.canvas._canvas.setAttribute('id','META-SELECTION-LAYER')
    }

    async loadImageFromServer(id:number | string): Promise<string> {
        return await this.handleImageRequest(id as number)
    }

    async loadImage(img: LegendImage): Promise<void> {
        return new Promise(async(resolve,reject) => {
            console.trace("CALLED")
            if(img.src === '') {
                setRecoil(loaderAtom, {visible: true, title: "Loading Image..."})
                const src = await this.loadImageFromServer(img.id())
                const image = new window.Image();
                image.crossOrigin = 'Anonymous';
                image.src = src;
                image.onload = async (e) => {
                    img.image(image)
                    img.src = src
                    await super.loadImage(img)
                    this.renderAnnotations()
                    img.syncBoxs()
                    resolve()
                }
                image.onerror = () => {reject("Failed to load image.")}
            } else {
                await super.loadImage(img);
                this.renderAnnotations()
                img.syncBoxs()
                resolve()
            }
            
        })
    }

    addNewImage = async (imImage: IMImage) => {
        setRecoil(showUploadDraggerAtom,false); 
        const image = await this.addImage(imImage)
        this.syncImageList()
        if(!this.activeImage) await this.loadImage(image)
    }

    async importLegendState(legendState: LegendState, labelMappings: LabelMappings) {
        if(legendState.length === 0) return;
        labelMappings.forEach(label => {
            const newLabel = new Label({
                id: label.id,
                name: label.name,
                type: label.type
            })
            this.addLabel(newLabel)
        })
        this.syncLabels()
        await Promise.all(legendState.map(async state => {
            const image = await this.addImage({...state.image, src: ''})
            
            state.bounding_box.forEach(box => {
                let label = this.labels.find(label => label.name === box.label)
                const imBox: IMBox = {
                    x: box.x,
                    y: box.y,
                    width: box.width,
                    height: box.height,
                    labelId: label?.id ?? -1,
                    direction: 'E', 
                    humanAnnotated: false,
                    indexId: box.id || -1,
                    rotation: box.rotation
                }
                image.addImBox(imBox)
            })
        }))
        this.syncImageList()
        if(this.images.length) await this.loadImage(this.images[0])
    }

    exportLegendState():LegendState {
        return this.images.map(image => ({
            image: {
                id: image?.id() || '',
                name: image?.name() || ''
            },
            bounding_box: [...image?.legendSelection || []].map(box => ({
                x: box.x(),
                y: box.y(),
                width: box.rect.width(),
                height: box.rect.height(),
                id: box.indexId === -1 ? null : box.indexId,
                label: box.label?.name || "",
                rotation: box.rotated
            })).filter(box => !!box.label)
        }))
    }

    addImage(imImage: IMImage): Promise<LegendImage> {
        return new Promise((resolve,reject) => {
            let pos:Vector2d = { x:0, y:0 };
            const image = new window.Image();
            image.crossOrigin = 'Anonymous';
            image.src = imImage.src;
            const img = new LegendImage({
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
        })
    }

    async renderAnnotations() {
        if(!this.legendSelectionLayer || !this.activeImage) return;
        this.add(this.legendSelectionLayer);
        this.legendSelectionLayer.removeChildren();
        [...(this.activeImage?.legendSelection || [])].forEach(legendSelectionObj => {
            this.legendSelectionLayer.add(legendSelectionObj);
        })
        this.legendSelectionLayer.moveToTop()
        this.crosshairLayer.moveToTop()
    }

    setSelectionBoxesListening(listen: boolean) {
        this.activeImage?.legendSelection.forEach(entity => {entity.listening(listen); entity.hideAnchors()})
    }

    setMode(appMode: AppMode) {
        super.setMode(appMode);
        if(this.activeImage?.createBoxAction) return;
        if(appMode.mode === 'DRAG_SELECTION_MODE') {
            this.setSelectionBoxesListening(true);
        } else if(appMode.mode === 'EDIT_MODE') {
            this.setSelectionBoxesListening(false);
        } else if(appMode.mode === 'DRAWING_MODE') {
            this.activeImage?.legendSelection.forEach(entity => entity.hideAnchors())
            this.setSelectionBoxesListening(false);
        }
    }
}