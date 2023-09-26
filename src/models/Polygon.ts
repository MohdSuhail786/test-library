import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { setRecoil } from "recoil-nexus";
import { appModeAtom } from "../state/editor";
import ActionsStore from "../actions/ActionStore";
import { Anchor } from "./Anchor";
import { Box } from "./Box";
import { PolygonTransformAction } from "../actions/PolygonTransformAction";
import { PolygonMoveAction } from "../actions/PolygonMoveAction";
import { Label } from "./Label";
import { Direction } from "./Types";
import { HumanAnnotationImage } from "./HumanAnnotationModels/HumanAnnotationImage";
import { HumanAnnotationEditor } from "./HumanAnnotationModels/HumanAnnotationEditor";
import { DrawingAreaEditor } from "./DrawingAreaModels/DrawingAreaEditor";

export interface GroupConfig extends Konva.GroupConfig {
    image: HumanAnnotationImage,
    label?: Label,
    points: number[],
    direction: Direction
}

export class Polygon<Config extends GroupConfig = GroupConfig> extends Konva.Group {
    direction!: Direction;
    line!: Konva.Line;
    dummyLine!: Konva.Line;
    label: Label | null = null;
    image: HumanAnnotationImage | null = null;
    editor: HumanAnnotationEditor | DrawingAreaEditor | null = null;
    anchors: Anchor[] =  []
    polygonTransformAction: PolygonTransformAction | null = null;
    polygonMoveAction: PolygonMoveAction | null = null;

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
        this.editor?.shapeMask.points(this.line.points())
        this.line.fill('transparent')
        this.line.stroke('black')
    }

    unFocus() {
        this.editor?.imageMask.width(0)
        this.editor?.imageMask.height(0)
        this.editor?.shapeMask.points([])
        this.line.fill(this.label?.fill || 'rgb(0, 0, 0, 0.10)')
        this.line.stroke(this.label?.stroke || 'rgb(0, 0, 0)')
    }

    init(config: Config) {
        this.direction = config.direction;
        this.image = config.image;
        this.editor = this.image.editor;
        this.label = config?.label || null;
        this.line = new Konva.Line({
            x: 0,
            y: 0,
            points: config.points,
            fill: this.label?.fill || 'rgb(0, 0, 0, 0.10)',
            stroke: this.label?.stroke || 'rgb(0, 0, 0)',
            strokeWidth: 1.5,
            strokeScaleEnabled: false,
        })
        this.dummyLine = this.line.clone();
        this.dummyLine.strokeWidth(0.2)
        this.dummyLine.closed(true)
        this.add(this.line,this.dummyLine)
        this.initAnchors()
    }

    initAnchors() {
        const points = this.line.points()
        const isComplete = this.line.points().length !== 2
        for(let i = 0; i<points.length - (isComplete ? 2 : 1); i+=2) {
            this.addAnchor({x: points[i], y: points[i+1]}, i)
        }
        this.anchors[0].startAnchor = true;
    }

    handleDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.polygonMoveAction = new PolygonMoveAction({polygon: this,actionsStore: this.image?.actionStore as ActionsStore})
            this.polygonMoveAction.build().then(() => {
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
            this.polygonMoveAction?.execute();
        })
    }

    handleDragEnd(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.polygonMoveAction?.finish().then(()=>{
                resolve()
            }).catch((error)=>{
                console.log(error)
            });
        })
    }

    addAnchor(pos: Vector2d, index: number) {
        const anchor = new Anchor({
            x: pos.x,
            y: pos.y,
            width: 1,
            height: 1,
            draggable: true,
            stroke: 'black',
            strokeWidth: 10,
            strokeScaleEnabled: false,
            fill: 'white',
            visible: true,
            polygon: this,
            posIndex: index
        });
        anchor.on('click',this.handleAnchorClick.bind(this))
        anchor.on('mouseenter',this.handleAnchorMouseEnter.bind(this))
        anchor.on('mouseleave',this.handleAnchorMouseLeave.bind(this))
        anchor.on('dragmove',this.handleAnchorDragMove.bind(this))
        anchor.on('dragstart',this.handleAnchorDragStart.bind(this))
        anchor.on('dragend',this.handleAnchorDragEnd.bind(this))
        this.add(anchor)
        this.anchors.push(anchor)
        anchor.moveToTop()
        this.updateAnchorsScale()
    }

    async handleAnchorClick(event: Konva.KonvaEventObject<MouseEvent>): Promise<void> {
        const anchor = event.target as Anchor
        if(this.image?.createPolygonAction && anchor.startAnchor) {
            this.line.points([...this.line.points().slice(0,-2),this.line.points()[0],this.line.points()[1]])
            this.line.closed(true)
            this.dummyLine.destroy();
            await this.image.createPolygonAction.finish()
            this.image.createPolygonAction = null;
            this.image.editor.showCrossHairs();
            this.hideAnchors()
            this.editor?.setMode({
                mode: "EDIT_MODE",
                shapeInEditMode: this,
                visible: true,
                scrollIntoView: true
            })
        }
    }

    handleAnchorDragStart(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            event.cancelBubble = true;
            if(this.editor?.appMode.mode === "EDIT_MODE") {
                setRecoil(appModeAtom, (prev) => ({...prev, visible: false}));
            }
            this.hideAnchors();
            this.polygonTransformAction = new PolygonTransformAction({anchor: event.target as Anchor,polygon: this,actionsStore: this.image?.actionStore as ActionsStore})
            this.polygonTransformAction.build().then(() => {
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
            this.polygonTransformAction?.finish().then(()=>{
                resolve()
            }).catch(error => console.log(error))
        })
    }

    handleAnchorDragMove(event: Konva.KonvaEventObject<DragEvent>): Promise<void> {
        return new Promise((resolve, reject) => {
            event.cancelBubble = true
            this.polygonTransformAction?.execute().then(() => {
                resolve();
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    handleAnchorMouseLeave(event: Konva.KonvaEventObject<MouseEvent>) {
        event.cancelBubble = true
        this.editor?.updateCursorStyle()
    }

    handleAnchorMouseEnter(event: Konva.KonvaEventObject<MouseEvent>) {
        event.cancelBubble = true
        this.editor?.updateCursorStyle(event.target as Anchor)
    }

    updateAnchorsPosition() {
        const points = this.line.points().slice(0,-2)
        for(let i = 0; i < points.length - 1; i+=2) {
            const anchor = this.find((shape: Konva.Shape) => shape.getAttr('posIndex') === i)[0] as Anchor;
            anchor.x(points[i])
            anchor.y(points[i+1])
        }
    }

    showAnchors() {
        this.anchors.forEach(anchor => {
            anchor.show();
            this.updateAnchorsScale()
            this.updateAnchorsPosition();
            anchor.moveToTop();
        })
        this.focus()
    }

    updateAnchorsScale() {
        // const scale = this.editor?.scaleX() || 1;
        // this.anchors.forEach(anchor => {
        //     anchor.width(10 / scale);
        //     anchor.height(10 / scale);
        //     anchor.offset({
        //         x: anchor.width() / 2,
        //         y: anchor.height() /2
        //     })
        // })
    }

    hideAnchors() {
        this.anchors.forEach(anchor => anchor.hide())
        this.editor?.hideCursorTextElement()
        this.unFocus()
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

    scrollIntoView() {
        const virtualList = this.editor?.listContainerRef
        if(!virtualList?.current) return;
        virtualList.current.scrollToIndex({index: this.getAttr('virtualIndex')})
    }

    mouseMoveAction(event: KonvaEventObject<MouseEvent>) {
        this.editor?.showCursorTextElement({x: event.evt.offsetX + 10, y: event.evt.offsetY + 10, text: this.label?.name  || ""})
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
        this.line.stroke(label.stroke)
        this.line.fill(label.fill)
        this.image?.syncPolygons()
    }

    updateDirection(direction: Direction) {
        this.direction = direction;
        this.image?.syncPolygons()
    }
}   