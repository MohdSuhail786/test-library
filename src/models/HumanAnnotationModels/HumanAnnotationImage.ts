import { Box } from "../Box";
import { Image, ImageConfig } from "../BaseModels/Image";
import { HumanAnnotationEditor } from "./HumanAnnotationEditor";
import { IMBox, IMPolygon } from "../Types";
import { Polygon } from "../Polygon";
import { CreateBoxAction } from "../../actions/CreateBoxAction";
import { CreatePolygonAction } from "../../actions/CreatePolygonAciton";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { setRecoil } from "recoil-nexus";
import { entityListAtom, polygonListAtom, textListAtom } from "../../state/editor";
import { Label } from "../Label";

export interface HumanAnnotationImageConfig extends ImageConfig {
    editor: HumanAnnotationEditor,
    imBoxes?: IMBox[]
}

export class HumanAnnotationImage<Config extends HumanAnnotationImageConfig = HumanAnnotationImageConfig> extends Image<HumanAnnotationEditor> {

    drawingAreas: Set<Box> = new Set();
    entities: Set<Box> = new Set();
    texts: Set<Box> = new Set();
    polygons: Set<Polygon> = new Set();
    createBoxAction: CreateBoxAction | null = null;
    createPolygonAction: CreatePolygonAction | null = null;

    constructor(config: Config) {
        super(config)
        this.init(config)
        
        this.on("mousedown", this.mouseDownAction.bind(this));
        this.on("mousemove", this.mouseMoveAction.bind(this));
        this.on("mouseup", this.mouseUpAction.bind(this));
    }

    init(config: Config) {
        super.init(config)
        if(config.imBoxes) {
            config.imBoxes.forEach(imBox => this.addImBox(imBox))
        }
    }

    addImBox(imBox: IMBox) {
        const label = this.editor.labels.find(label => label.id === imBox.labelId)
        const box = new Box({
            ...imBox,
            rotation: 0,
            rotated: imBox?.rotation,
            draggable: true,
            listening: false,
            image: this,
            label
        })
        this.addBox(box);
    }

    addImPolygon(imPolygon: IMPolygon) {
        const label = this.editor.labels.find(label => label.id === imPolygon.labelId)
        const polygon = new Polygon({
            ...imPolygon,
            draggable: true,
            listening: false,
            image: this,
            label
        })
        polygon.line.closed(true)
        polygon.dummyLine.destroy();
        this.addPolygon(polygon)
    }


    async mouseDownAction(event: KonvaEventObject<MouseEvent>) {
        try {
            if(!["DRAWING_MODE", "POLYGON_MODE"].includes(this.editor?.appMode.mode || "") || this.createBoxAction !== null || event.evt.which !== 1) return;
            this.editor?.hideCrossHairs()
            const pos = this.editor?.getRelativePointerPosition() as Vector2d;
            if(this.editor.appMode.mode === "DRAWING_MODE") {
                this.createBoxAction = new CreateBoxAction({pos,image:this, actionsStore: this.actionStore})
                await this.createBoxAction.build()
                if(this.editor?.filter.annotationType === "text") {
                    const label = this.editor.labels.find(label => label.name === 'TEXT') as Label
                    if(label)
                        this.createBoxAction.subject.updateLabel(label)
                }
            }
            else if(this.editor.appMode.mode === "POLYGON_MODE") {
                if(!this.createPolygonAction) {
                    this.createPolygonAction = new CreatePolygonAction({pos,image:this, actionsStore: this.actionStore})
                    await this.createPolygonAction.build()
                } else {
                    this.createPolygonAction.execute(pos)
                    // await this.createPolygonAction.finish()
                    // this.createPolygonAction = null;
                    
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async mouseMoveAction(event: KonvaEventObject<MouseEvent>) {
        try {
            if(!["DRAWING_MODE", "POLYGON_MODE"].includes(this.editor?.appMode.mode || "")) return;
            const pos = this.editor?.getRelativePointerPosition() as Vector2d;
            if(this.createBoxAction) {
                await this.createBoxAction.execute(pos);
            } else if(this.createPolygonAction) {
                const line = this.createPolygonAction.subject.line
                const dummyLine = this.createPolygonAction.subject.dummyLine
                if(line.points().length === 2) {
                    line.points([...line.points(),pos.x,pos.y])
                    dummyLine.points([...line.points(),pos.x,pos.y])
                } else {
                    line.points([...line.points().slice(0,-2),pos.x,pos.y])
                    dummyLine.points([...line.points().slice(0,-2),pos.x,pos.y])
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async mouseUpAction(event: KonvaEventObject<MouseEvent>) {
        try {
            if(this.editor?.appMode.mode !== "DRAWING_MODE" || this.createBoxAction === null) return;
            this.editor?.showCrossHairs()
            await this.createBoxAction.finish();
            if(this.createBoxAction.subject?.rect?.width() === 0 || this.createBoxAction.subject?.rect?.height() === 0) {
                await this.createBoxAction.undo();
                await this.createBoxAction.destroy()
                this.createBoxAction = null;
                return;
            }
            const box = this.createBoxAction.subject;
            this.createBoxAction = null;
            if(this.editor.filter.annotationType !== "text") {
                this.editor?.setMode({
                    mode: "EDIT_MODE",
                    shapeInEditMode: box,
                    visible: true,
                    scrollIntoView: true
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    addBox(box: Box) {
        if(box.label === null) { // box we are currently drawing
            if(this.editor.filter.annotationType === 'text') {
                this.texts.add(box)
                this.editor.textLayer.add(box)
            } else if(this.editor.filter.annotationType === 'entity') {
                this.entities.add(box)
                this.editor.entityLayer.add(box)
            }
        } else {
            if(box.label?.name === 'TEXT') {
                this.texts.add(box)
                this.editor.textLayer.add(box)
            } else {
                this.entities.add(box)
                this.editor.entityLayer.add(box)
            }
        }
        this.syncBoxs()
    }

    deleteBox(box: Box) {
        if(box.label?.name === 'TEXT') {
            this.texts.delete(box)
        } else {
            this.entities.delete(box)
        }
        box.remove()
        this.syncBoxs()
    }

    addPolygon(polygon: Polygon) {
        this.polygons.add(polygon)
        this.editor.polygonLayer.add(polygon)
        this.syncPolygons()
    }

    deletePolygon(polygon: Polygon) {
        this.polygons.delete(polygon);
        polygon.remove()
        this.syncPolygons()
    }

    syncBoxs() {
        setRecoil(entityListAtom, [...this.entities])
        setRecoil(textListAtom, [...this.texts])
    }

    syncPolygons() {
        setRecoil(polygonListAtom, [...this.polygons])
    }
}