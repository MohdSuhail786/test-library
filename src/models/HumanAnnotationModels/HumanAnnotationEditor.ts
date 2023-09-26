import Konva from "konva";
import { Editor, EditorConfig } from "../BaseModels/Editor";
import { AppMode, COCOObj, Filter, IMBox, IMImage, IMPolygon } from "../Types";
import { Label } from "../Label";
import { setRecoil } from "recoil-nexus";
import { filterAtom, loaderAtom } from "../../state/editor";
import { HumanAnnotationImage } from "./HumanAnnotationImage";
import { Vector2d } from "konva/lib/types";
import { Box } from "../Box";

export interface HumanAnnotationEditorConfig extends EditorConfig {
}

export class HumanAnnotationEditor<Config extends HumanAnnotationEditorConfig = HumanAnnotationEditorConfig> extends Editor<HumanAnnotationImage> {
    
    entityLayer!: Konva.Layer;
    polygonLayer!: Konva.Layer;
    textLayer!: Konva.Layer;

    constructor(config: Config) {
        super(config)
        this.init(config)
    }


    init(config: Config) {
        super.init(config)
        
        this.entityLayer = new Konva.Layer();
        this.entityLayer.canvas._canvas.setAttribute('id','ENTITY-LAYER')
        
        this.polygonLayer = new Konva.Layer();
        this.polygonLayer.canvas._canvas.setAttribute('id','POLYGON-LAYER')

        this.textLayer = new Konva.Layer();
        this.textLayer.canvas._canvas.setAttribute('id','TEXT-LAYER')

        this.add(this.entityLayer);
        this.add(this.polygonLayer);
        this.add(this.textLayer);

    }

    showCursorTextElement(config: {x:number,y: number, text: string}) {
        if(this.filter.annotationType === 'text') return;
        super.showCursorTextElement(config)
    }

    importCOCOObj(COCOObj:COCOObj): Promise<void> {
        return new Promise((resolve,reject) => {
            this.addImage(COCOObj.image, []).then(() => {
                this.syncImageList();
                this.loadFirstImageIfRequired()
                COCOObj.categories.forEach(category => {
                    const label = new Label({
                        id: category.id,
                        name: category.name,
                        type: category.type,
                    })
                    this.addLabel(label)
                })
                this.syncLabels();
                COCOObj.annotations.sort((a,b) => a.bbox ? (b.bbox[2]*b.bbox[3]) - (a.bbox[2]*a.bbox[3]) : 1).forEach(annotation => {
                    if(annotation.bbox) { // draw Box
                        const imBox: IMBox = {
                            x: annotation.bbox[0],
                            y: annotation.bbox[1],
                            width: annotation.bbox[2],
                            height: annotation.bbox[3],
                            labelId: annotation.category_id,
                            direction: annotation.direction,
                            indexId: annotation.index_id,
                            humanAnnotated: false
                        }
                        this.activeImage?.addImBox(imBox)
                    } else if(annotation.segmentation) { // draw Polygon
                        const imPolygon: IMPolygon = {
                            points: annotation.segmentation,
                            direction: annotation.direction,
                            indexId: annotation.index_id,
                            humanAnnotated: false,
                            labelId: annotation.category_id
                        }
                        this.activeImage?.addImPolygon(imPolygon)
                    }
                })
                this.renderAnnotations()
            }).catch(reject).finally(() => {
                setRecoil(loaderAtom, {visible: false})
            })
        })
    }

    switchAppMode() {
        let mode : "DRAG_SELECTION_MODE" | "DRAWING_MODE" | "POLYGON_MODE" | "EDIT_MODE" = "DRAG_SELECTION_MODE";

        if(this.appMode.mode === "DRAG_SELECTION_MODE") {
            mode = this.filter.annotationType === "polygon" ? "POLYGON_MODE" : "DRAWING_MODE"
        }
        this.setMode({
            mode
        })
    }

    keyDownAction = async (event: KeyboardEvent) => {
        super.keyDownAction(event)
        if(!event.ctrlKey) {
            if(event.key === 'Escape') {
                if((this.activeImage)?.createPolygonAction) {
                    await (this.activeImage).createPolygonAction.finish();
                    await (this.activeImage).createPolygonAction.undo();
                    await (this.activeImage).createPolygonAction.destroy();
                    (this.activeImage).createPolygonAction = null;
                }
            }
        }
    }

    addImage(imImage: IMImage, imBoxes?: IMBox[]): Promise<void> {
        return new Promise((resolve,reject) => {
            let pos:Vector2d = { x:0, y:0 };
            const image = new window.Image();
            image.crossOrigin = 'Anonymous';
            image.src = imImage.src;
            image.onload = (e) => {
                const img = new HumanAnnotationImage({
                    id: imImage.id,
                    name: imImage.name,
                    src: imImage.src,
                    x: pos.x,
                    y: pos.y,
                    fill: 'white',
                    draggable: false,
                    image: image,
                    editor: this,
                    imBoxes
                });
                this.images.unshift(img);
                resolve();
            }
            image.onerror = () => reject("Failed to load image.")
        })
    }

    extractBBoxes(): {
        box: IMBox;
        label: string;
    }[] {
        const [pos,scale] = [this.position(), this.scale()]
        this.resetZoom();
        const allSelectionBoxes = this.images.reduce((acc: Box[], curr: HumanAnnotationImage) => {
            return [...acc, ...curr.entities]
        }, [] as Box[])
        const bBoxesWithLabels = [...allSelectionBoxes].filter(box => box.label).map(box => ({
            box: {
                x: box.x(),
                y: box.y(),
                width: box.rect.width(),
                height: box.rect.height()
            } as IMBox,
            label: box.label?.name || ""
        }))
        this.position(pos)
        this.scale(scale)
        return bBoxesWithLabels;
    }

    setSelectionBoxesListening(listen: boolean) {
        if(this.filter.annotationType === "entity") {
            this.activeImage?.entities.forEach(entity => {entity.listening(listen); entity.hideAnchors()})
        } else if(this.filter.annotationType === "polygon") {
            this.activeImage?.polygons.forEach(polygon => {polygon.listening(listen); polygon.hideAnchors()})
        } else {
            this.activeImage?.texts.forEach(text => {text.listening(listen); text.hideAnchors()})
        }
    }

    async renderAnnotations() {
        if(!this.entityLayer || !this.textLayer || !this.polygonLayer) return;
        switch(this.filter.annotationType) {
            case "entity": 
                this.add(this.entityLayer)
                this.entityLayer.moveToTop();
                if(this.activeImage?.entities) {
                    [...this.activeImage.entities].forEach(entity => {
                        if(entity.label?.name.toLocaleLowerCase().includes(this.filter.entityClass.toLocaleLowerCase()) && !entity.parent) {
                            this.entityLayer.add(entity)
                        } else if(!entity.label?.name.toLocaleLowerCase().includes(this.filter.entityClass.toLocaleLowerCase()) && entity.parent) {
                            entity.remove()
                        }
                    })
                }
                this.polygonLayer.remove()
                this.textLayer.remove()
                break;
            case "polygon":
                this.add(this.polygonLayer)
                this.polygonLayer.moveToTop()
                if(this.activeImage?.polygons) {
                    [...this.activeImage.polygons].forEach(entity => {
                        if(entity.label?.name.toLocaleLowerCase().includes(this.filter.entityClass.toLocaleLowerCase()) && !entity.parent) {
                            this.polygonLayer.add(entity)
                        } else if(!entity.label?.name.toLocaleLowerCase().includes(this.filter.entityClass.toLocaleLowerCase()) && entity.parent) {
                            entity.remove()
                        }
                    })
                }

                this.entityLayer.remove()
                this.textLayer.remove()
                break;
            case "text":
                this.add(this.textLayer)
                this.textLayer.moveToTop()

                this.entityLayer.remove()
                this.polygonLayer.remove()
                break;
        }
        this.crosshairLayer.moveToTop()
    }

    setMode(appMode: AppMode) {
        super.setMode(appMode);
        if(this.activeImage?.createPolygonAction || this.activeImage?.createBoxAction) return;
        if(appMode.mode === 'DRAG_SELECTION_MODE') {
            this.setSelectionBoxesListening(true);
        } else if(appMode.mode === 'EDIT_MODE') {
            this.setSelectionBoxesListening(false);
        } else if(appMode.mode === 'DRAWING_MODE' || appMode.mode === "POLYGON_MODE") {
            if(this.filter.annotationType === "entity") {
                this.activeImage?.entities.forEach(entity => entity.hideAnchors())
            } else if(this.filter.annotationType === "text") {
                this.activeImage?.texts.forEach(text => text.hideAnchors())
            }
            this.activeImage?.polygons.forEach(polygon => polygon.hideAnchors())
            this.setSelectionBoxesListening(false);
        }
    }
}