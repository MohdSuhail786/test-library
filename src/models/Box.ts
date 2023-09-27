import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { setRecoil } from "recoil-nexus";
import { appModeAtom } from "../state/editor";
import { BoxTransformAction } from "../actions/BoxTransformAction";
import ActionsStore from "../actions/ActionStore";
import { BoxMoveAction } from "../actions/BoxMoveAction";
import { Anchor } from "./Anchor";
import { Label } from "./Label";
import { Direction } from "./Types";
import { HumanAnnotationEditor } from "./HumanAnnotationModels/HumanAnnotationEditor";
import { DrawingAreaEditor } from "./DrawingAreaModels/DrawingAreaEditor";
import { HumanAnnotationImage } from "./HumanAnnotationModels/HumanAnnotationImage";
import { DrawingAreaImage } from "./DrawingAreaModels/DrawingAreaImage";

export interface GroupConfig extends Konva.GroupConfig {
    image: HumanAnnotationImage | DrawingAreaImage,
    indexId: number,
    humanAnnotated: boolean,
    label?: Label | null
    direction: Direction
}

export class Box<Config extends GroupConfig = GroupConfig> extends Konva.Group {

    rect: Konva.Rect = new Konva.Rect();
    label: Label | null = null;
    direction!: Direction;
    image: HumanAnnotationImage | DrawingAreaImage | null = null;
    indexId!: number;
    humanAnnotated!: boolean;
    editor: HumanAnnotationEditor | DrawingAreaEditor | null = null;
    anchors: {rect?: Konva.Rect, pos: [number,number], name: string}[] =  [{pos: [0,0], name: 'top-left'}, {pos: [1,0], name: "top-right"}, {pos: [0,1], name: 'bottom-left'}, {pos: [1,1], name: 'bottom-right'}]
    boxTransformAction: BoxTransformAction | null = null;
    boxMoveAction: BoxMoveAction | null = null;

    constructor(config: Config) {
        super(config)
        this.init(config);
        this.on("mousemove", this.mouseMoveAction.bind(this))
        this.on('click', this.mouseClickAction.bind(this))
        this.on('mouseenter', this.mouseEnterAction.bind(this))
        this.on('mouseleave', this.mouseLeaveAction.bind(this))
        this.on('dragstart', this.handleDragStart.bind(this))
        this.on('dragmove', this.handleDragMove.bind(this))
        this.on('dragend', this.handleDragEnd.bind(this))
    }


    focus() {
        this.editor?.imageMask.width(this.image?.width() || 0)
        this.editor?.imageMask.height(this.image?.height() || 0)
        this.editor?.shapeMask.x(this.x())
        this.editor?.shapeMask.y(this.y())
        this.editor?.shapeMask.points([this.rect.x(),this.rect.y(),this.rect.width(),this.rect.y(), this.rect.width(), this.rect.height(), this.rect.x(), this.rect.height(), this.rect.x(), this.rect.y()])
        this.rect.fill('transparent')
        this.rect.stroke('black')
    }

    unFocus() {
        this.editor?.imageMask.width(0)
        this.editor?.imageMask.height(0)
        this.editor?.shapeMask.points([])
        this.rect.fill(this.label?.fill || 'rgb(0, 0, 0, 0.10)')
        this.rect.stroke(this.label?.stroke || 'rgb(0, 0, 0)')
    }

    init(config: Config) {
        this.direction = config.direction
        this.humanAnnotated = config.humanAnnotated
        this.indexId = config.indexId ?? -1
        this.image = config.image;
        this.editor = this.image.editor;
        this.label = config?.label || null;
        this.initAnchors()
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width(),
            height: this.height(),
            fill: this.label?.fill || 'rgb(0, 0, 0, 0.10)',
            stroke: this.label?.stroke || 'rgb(0, 0, 0)',
            strokeWidth: 2,
            strokeScaleEnabled: false,
        })
        this.add(this.rect)
    }

    initAnchors() {
        this.anchors.forEach(anchor => {
            anchor.rect = new Anchor({
                x: anchor.pos[0] * this.width(),
                y: anchor.pos[1] * this.height(),
                width: 1    ,
                height: 1   ,
                name: anchor.name,
                draggable: true,
                stroke: 'black',
                strokeWidth: 10,
                strokeScaleEnabled: false,
                fill: 'white',
                visible: false,
                box: this,
                posIndex: 0
            })
            anchor.rect.on('mouseenter',this.handleAnchorMouseEnter.bind(this))
            anchor.rect.on('mouseleave',this.handleAnchorMouseLeave.bind(this))
            anchor.rect.on('dragmove',this.handleAnchorDragMove.bind(this))
            anchor.rect.on('dragstart',this.handleAnchorDragStart.bind(this))
            anchor.rect.on('dragend',this.handleAnchorDragEnd.bind(this))
            this.add(anchor.rect)
        })
    }

    handleDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.boxMoveAction = new BoxMoveAction({box: this,actionsStore: this.image?.actionStore as ActionsStore})
            this.boxMoveAction.build().then(() => {
                resolve()
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    handleDragMove(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.focus()
            this.editor?.hideCursorTextElement()
            this.boxMoveAction?.execute();
        })
    }

    handleDragEnd(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.boxMoveAction?.finish().then(()=>{
                resolve()
            }).catch((error)=>{
                console.log(error)
            });
        })
    }

    updateAnchorsPosition() {
        this.anchors.forEach(anchor => {
            anchor.rect?.x(anchor.pos[0] * this.rect.width())
            anchor.rect?.y(anchor.pos[1] * this.rect.height())
        })
    }

    handleAnchorDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            event.cancelBubble = true;
            if(this.editor?.appMode.mode === "EDIT_MODE") {
                setRecoil(appModeAtom, (prev) => ({...prev, visible: false}));
            }
            this.hideAnchors();
            this.boxTransformAction = new BoxTransformAction({anchor: event.target as Anchor,box: this,actionsStore: this.image?.actionStore as ActionsStore})
            this.boxTransformAction.build().then(() => {
                resolve()
            }).catch((error) => {
                console.log(error)
            });
        })
    }

    handleAnchorDragEnd(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject)=> {
            event.cancelBubble = true
            if(this.editor?.appMode.mode === "EDIT_MODE") {
                setRecoil(appModeAtom, (prev) => ({...prev, visible: true}));
                this.showAnchors();
                this.updateAnchorsPosition();
            } else {
                setTimeout(() => {
                    const target = this.editor?.getIntersection(this.editor?.getPointerPosition() as Vector2d);
                    target instanceof Box && target.showAnchors();
                    target instanceof Konva.Rect && (target.parent as unknown as Box).showAnchors();
                }, 50);
            }
            this.editor?.updateCursorStyle()
            this.boxTransformAction?.finish().then(()=>{
                resolve()
            }).catch(error => console.log(error))
        })
    }

    handleAnchorDragMove(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            event.cancelBubble = true
            this.boxTransformAction?.execute().then(() => {
                resolve();
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    handleAnchorMouseLeave(event: Konva.KonvaEventObject<MouseEvent>) {
        event.cancelBubble = true
        this.hideAnchors()
        this.editor?.updateCursorStyle()
    }

    handleAnchorMouseEnter(event: Konva.KonvaEventObject<MouseEvent>) {
        event.cancelBubble = true
        this.editor?.updateCursorStyle(event.target as Anchor)
    }

    showAnchors() {
        this.anchors.forEach(anchor => {
            anchor.rect?.show();
            this.updateAnchorsScale()
            this.updateAnchorsPosition();
            anchor.rect?.moveToTop();
        })
        this.focus()
    }

    updateAnchorsScale() {
        // const scale = this.editor?.scaleX() || 1;
        // this.anchors.forEach(anchor => {
        //     // anchor.rect?.strokeWidth(1/scale)
        //     // anchor.rect?.width(10 / scale);
        //     // anchor.rect?.height(10 / scale);
        //     // anchor.rect?.offset({
        //         // x: anchor.rect.width() / 2,
        //         // y: anchor.rect.height() /2
        //     // })
        // })
        // if(this.anchors[0].rect?.visible()) this.focus()
    }

    scrollIntoView() {
        const virtualList = this.editor?.listContainerRef
        console.log(virtualList?.current, this.getAttr('virtualIndex'))
        if(!virtualList?.current) return;
        virtualList.current.scrollToIndex({index: this.getAttr('virtualIndex')})
    }

    hideAnchors() {
        this.anchors.forEach(anchor => anchor.rect?.hide())
        this.unFocus()
        this.editor?.hideCursorTextElement()
    }

    mouseClickAction(event: KonvaEventObject<MouseEvent>) {
        console.log(this)
        if(this.editor?.appMode.mode === 'DRAG_SELECTION_MODE') {
            this.editor.setMode({
                mode: "EDIT_MODE",
                shapeInEditMode: this,
                visible: true,
                scrollIntoView: true
            });
        }
    }

    mouseMoveAction(event: KonvaEventObject<MouseEvent>) {
        this.editor?.showCursorTextElement({x: event.evt.offsetX + 10, y: event.evt.offsetY + 10, text: this.label?.name || ""})
    }
    
    mouseEnterAction(event: KonvaEventObject<MouseEvent>) {
        this.editor?.updateCursorStyle(this)
        this.showAnchors()
    }

    mouseLeaveAction(event: KonvaEventObject<MouseEvent>) {
        this.editor?.updateCursorStyle()
        if(this.editor?.appMode.mode === "EDIT_MODE") {
            this.showAnchors()
        } else {
            this.hideAnchors()
        }
        this.editor?.hideCursorTextElement()
    }

    updateLabel(label: Label) {
        this.label = label;
        this.rect.stroke(label.stroke)
        this.rect.fill(label.fill)
        this.image?.syncBoxs()
    }

    updateDirection(direction: Direction) {
        this.direction = direction;
        this.image?.syncBoxs()
    }

}