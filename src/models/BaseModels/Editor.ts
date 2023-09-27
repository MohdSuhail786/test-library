import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { Image } from "./Image";
import { getRecoil, setRecoil } from "recoil-nexus";
import { activeImageAtom, appModeAtom, cursorTextAtom, filterAtom, imageListAtom, labelListAtom, loaderAtom } from "../../state/editor";
import { KonvaEventObject } from "konva/lib/Node";
import { AppMode, IMImage, IMBox, COCOObj, Filter, IMPolygon, ImageTypes } from "../Types";
import { RemoveBoxAction } from "../../actions/RemoveBoxAction";
import ActionsStore from "../../actions/ActionStore";
import { Rect } from "konva/lib/shapes/Rect";
import { Box } from "../Box";
import { Anchor } from "../Anchor";
import { Polygon } from "../Polygon";
import { Line } from "konva/lib/shapes/Line";
import { RemovePolygonAction } from "../../actions/RemovePolygonAction";
import { Label } from "../Label";
import { ViewportListRef } from "react-viewport-list";
import { HumanAnnotationImage } from "../HumanAnnotationModels/HumanAnnotationImage";
import { DrawingAreaImage } from "../DrawingAreaModels/DrawingAreaImage";

export interface EditorConfig extends Konva.StageConfig {
    spacingLeft?: number
    spacingRight?: number
    editorSpacingTop?: number
    editorSpacingLeft?: number
}
Konva.pixelRatio = 1
export class Editor<ImageType,Config extends EditorConfig = EditorConfig> extends Konva.Stage {
    
    filter: Filter = {annotationType: 'entity',entityClass: '',entityType:''}
    crosshairLayer!: Konva.Layer;
    imageLayer!: Konva.Layer;
    images: ImageType[] = []
    listContainerRef!: React.RefObject<ViewportListRef>;
    activeImage: ImageType | null = null;
    labels: Label[] = []
    _zoomStep: number = 1.1;
    spacingLeft: number = 0;
    spacingRight: number = 0;
    editorSpacingLeft: number = 0;
    editorSpacingTop: number = 0;
    appMode: AppMode = {
        mode: "DRAWING_MODE"
    };
    backgroundRect!: Konva.Rect;
    crosshairLines: [Konva.Line, Konva.Line] = [new Konva.Line(), new Konva.Line()];
    imageMask!: Konva.Rect;
    shapeMask!: Konva.Line;
    shapeAnchorsMask!: [Konva.Rect,Konva.Rect,Konva.Rect,Konva.Rect];
    cursorTextElementRef!: React.RefObject<HTMLSpanElement>

    constructor(config: Config) {
        super(config);
        // this.init(config);
        this.removeEventListeners();
        this.container().addEventListener("wheel", this.zoomInOutStage);
        document.addEventListener("keydown", this.keyDownAction)
        document.addEventListener("keyup", this.keyUpAction)
        document.addEventListener("mousemove", this.mouseMoveAction)
        this.on("dragstart", this.dragStartAction.bind(this))
        this.on("dragmove", this.dragMoveAction.bind(this))
        this.on("dragend", this.dragEndAction.bind(this))
        this.on("click", () => {
            console.log(this.getRelativePointerPosition())
        })
    }

    setCursorTextElement(cursorRef: React.RefObject<HTMLSpanElement>) {
        this.cursorTextElementRef = cursorRef
    }

    showCursorTextElement(config: {x:number,y: number, text: string}) {
        if(!this.cursorTextElementRef.current) return;
        this.cursorTextElementRef.current.style.display = 'block';
        this.cursorTextElementRef.current.style.left = `${config.x}px`;
        this.cursorTextElementRef.current.style.top = `${config.y}px`;
        this.cursorTextElementRef.current.innerHTML = `${config.text}`;
    }

    hideCursorTextElement() {
        if(!this.cursorTextElementRef.current) return;
        this.cursorTextElementRef.current.innerHTML = '';
        this.cursorTextElementRef.current.style.display = 'none';
    }

    addLabel(label: Label) {
        this.labels.push(label)
        this.syncLabels()
    }

    removeEventListeners() {
        this.container().removeEventListener("wheel", this.zoomInOutStage);
        document.removeEventListener("keydown", this.keyDownAction)
        document.removeEventListener("keyup", this.keyUpAction)
        document.removeEventListener("mousemove", this.mouseMoveAction)
    }

    init(config: Config) {
        this.spacingLeft = config?.spacingLeft || 0;
        this.spacingRight = config?.spacingRight || 0;
        this.editorSpacingLeft = config.editorSpacingLeft || 0;
        this.editorSpacingTop = config.editorSpacingTop || 0;
        
        

        this.crosshairLayer = new Konva.Layer();
        this.crosshairLayer.canvas._canvas.setAttribute('id','CROSSHAIR-LAYER')

        this.imageLayer = new Konva.Layer();
        this.imageLayer.canvas._canvas.setAttribute('id','IMAGE-LAYER')

        this.imageMask = new Konva.Rect({
            x: 0,
            y: 0,
            width: 0,
            globalCompositeOperation: 'source-over',
            height: 0,
            fill: '#00000050',
            listening: false,
            draggable: false,
        })


        this.shapeMask = new Konva.Line({
            points: [],
            globalCompositeOperation: 'destination-out',
            stroke: 'white',
            fill: 'white',
            listening: false,
            draggable: false,
            closed: true
        })

        this.crosshairLayer.add(this.imageMask)
        this.crosshairLayer.add(this.shapeMask)

        this.crosshairLines = [new Konva.Line({
            points: [0, 100, 1000, 100],
            stroke: '#424242',
            strokeWidth: 2,
            dash: [10, 5], 
            listening: false,
            strokeScaleEnabled: false,
            visible: false
        }),new Konva.Line({
            points: [0, 0, 0, this.height()],
            stroke: '#424242',
            strokeWidth: 2,
            dash: [10, 5],
            listening: false,
            strokeScaleEnabled: false,
            visible: false
        })]
        this.crosshairLayer.add(this.crosshairLines[0],this.crosshairLines[1])
        
        const bBox = this.getRelativeBBoxOfStage();   
        this.backgroundRect = new Konva.Rect({
            x: bBox.l,
            y: bBox.t,
            width: bBox.r - bBox.l,
            height: bBox.b - bBox.t,
            fill: '#e1e1e1',
            name: 'background-rect'
        })

        this.imageLayer.add(this.backgroundRect)
        this.add(this.imageLayer);
        this.add(this.crosshairLayer);
        this.imageLayer.moveToTop()
        this.loadFirstImageIfRequired()
    }

    loadFirstImageIfRequired(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(!this.activeImage && this.images.length) {
                this.loadImage(this.images[0]).then(()=>{
                    resolve()
                })
            }
        })
    }


    updateFilter(filter: Filter) {
        this.filter = filter
        switch(filter.annotationType) {
            case "text":
            case "entity": this.setMode({mode: 'DRAWING_MODE'}); break;
            case "polygon": this.setMode({mode: 'POLYGON_MODE'}); break;
        }
        this.syncFilter()
    }

    syncFilter() {
        setRecoil(filterAtom, {...this.filter})
    }

    switchAppMode() {
        let mode : "DRAG_SELECTION_MODE" | "DRAWING_MODE" | "EDIT_MODE" = "DRAG_SELECTION_MODE";
        if(this.appMode.mode === "DRAG_SELECTION_MODE") {
            mode = "DRAWING_MODE"
        }
        this.setMode({
            mode
        })
    }

    keyDownAction = async(event: KeyboardEvent) => {
        console.log("KEY DOWN ACTION***")
        try {
            if(this.appMode.mode === 'EDIT_MODE') {
                if(event.key === 'Delete') {
                    if(this.appMode.shapeInEditMode instanceof Box) {
                        await new RemoveBoxAction({box: this.appMode.shapeInEditMode, actionsStore: this.appMode.shapeInEditMode.image?.actionStore as ActionsStore}).directExecute();
                    } else if(this.appMode.shapeInEditMode instanceof Polygon) {
                        await new RemovePolygonAction({polygon: this.appMode.shapeInEditMode, actionsStore: this.appMode.shapeInEditMode.image?.actionStore as ActionsStore}).directExecute();
                    }
                    this.setMode({
                        mode: "DRAWING_MODE"
                    })
                }
            }
            if(event.ctrlKey) {
                if(this.appMode.mode !== 'EDIT_MODE') {
                    this.setMode({
                        mode: "DRAG_SELECTION_MODE"
                    })
                    setTimeout(() => {
                        const target = this.getIntersection(this.getPointerPosition() as Vector2d);
                        (target instanceof Box || target instanceof Polygon) && target.showAnchors();
                        (target instanceof Rect && target.name() !== 'background-rect') && (target.parent as unknown as Box).showAnchors();
                        target instanceof Line && (target.parent as unknown as Polygon).showAnchors();
                    }, 50);
                }
                if(event.key === 'z' || event.key === 'Z') {
                    await (this.activeImage as Image)?.actionStore.undo()
                }
                if(event.key === 'y' || event.key === 'Y') {
                    await (this.activeImage as Image)?.actionStore.redo()
                }
            }
        } catch (error) {
            console.log(error)                
        }
    }

    keyUpAction = (event: KeyboardEvent) => {
        console.log("KEY UP ACTION***")
        if(event.key === 'Control') {
            if(this.appMode.mode !== 'EDIT_MODE')
               this.switchAppMode()
        }
    }

    mouseMoveAction = (event: MouseEvent) => {
       this.setPointersPositions(event);
       this.renderCrossHair();
    }

    dragStartAction(event: KonvaEventObject<DragEvent>) {
        this.updateCursorStyle(null)
    }

    dragMoveAction(event: KonvaEventObject<DragEvent>) {
        this.renderBackground()
    }

    dragEndAction(event: KonvaEventObject<DragEvent>) {
        this.updateCursorStyle(null)
    }

    renderCrossHair() {
        const bBox = this.getRelativeBBoxOfStage();        
        const {x,y} = this.getRelativePointerPosition() as Vector2d
        this.crosshairLines[0].points([bBox.l, y, bBox.r, y]);
        this.crosshairLines[1].points([x, bBox.t, x, bBox.b]);

        this.crosshairLines[0].moveToTop()
        this.crosshairLines[1].moveToTop()
        this.crosshairLayer?.batchDraw()
    }



    removeActiveImage() {
        (this.activeImage as Image)?.remove();
        this.activeImage = null;
    }

    loadImage(image: ImageType): Promise<void> {
        return new Promise((resolve, reject) => {
            setRecoil(loaderAtom, {visible: true, title: "Loading Image..."})
            this.syncActiveImage(image)
            if(this.activeImage) {
                this.removeActiveImage()
            }
            this.activeImage = image;
            this.imageLayer?.add(image as Image);
            this.fitToScreen();
            this.showCrossHairs(); 
            setRecoil(loaderAtom, {visible: false})
        })
    }

    zoomInOutStage = (event: WheelEvent, position: Vector2d = this.getPointerPosition() as Vector2d, newPosition?: Vector2d) => {
        event.preventDefault();
        if(this.appMode.mode === 'EDIT_MODE') return;
        if (event.ctrlKey) {
            const oldScale = this.scaleX();
            const mousePointTo = {
                x: position.x / oldScale - this.x() / oldScale,
                y: position.y / oldScale - this.y() / oldScale
            };

            const newScale = event.deltaY <= 0 ? oldScale * this._zoomStep : oldScale / this._zoomStep;
            this.scale({ x: newScale, y: newScale });
            const updatedPosition = newPosition || this.getPointerPosition() as Vector2d;

            const newPos = {
                x: -(mousePointTo.x - updatedPosition.x / newScale) * newScale,
                y: -(mousePointTo.y - updatedPosition.y / newScale) * newScale
            };
            this.position(newPos);
        } else if (event.shiftKey) {
            let moveByX = this.scaleY() * event.deltaY;
            let moveByY = this.scaleX() * event.deltaX;
            this.y(this.y() - moveByY);
            this.x(this.x() - moveByX);
        } else {
            let moveByY = this.scaleY() * event.deltaY;
            let moveByX = this.scaleX() * event.deltaX;
            this.y(this.y() - moveByY);
            this.x(this.x() - moveByX);
        }
        this.renderCrossHair()
        this.renderBackground()
    }

    renderBackground() {
        const bBox = this.getRelativeBBoxOfStage();   
        this.backgroundRect.setAttrs({
            x: bBox.l,
            y: bBox.t,
            width: bBox.r - bBox.l,
            height: bBox.b - bBox.t,
        })
    }

    resetZoom() {
        this.scale({ x: 1, y: 1 });
        this.position({ x: 0, y: 0 });
    }

    fitToScreen() {
        if(!this.activeImage || !(this.activeImage instanceof Image)) return;
        const paddingLeftRight = 2000;
        const paddingTopBottom = 100;
        const additionalPaddingLeft = this.spacingLeft;
        const additionalPaddingRight = this.spacingRight
        const additionalPaddingTop = 0;
        const newScale = Math.min((this.width() - additionalPaddingLeft - additionalPaddingRight)/(((this.activeImage).x() + (this.activeImage).width()) + paddingLeftRight), (this.height() - additionalPaddingTop)/(((this.activeImage).y() + (this.activeImage).height()) + paddingTopBottom))

        this.setAttrs({
            x: this.width() / 2 - (((this.activeImage).x() + (this.activeImage).width()) / 2 * newScale) + additionalPaddingLeft / 2 - additionalPaddingRight / 2,
            y: this.height() / 2 - (((this.activeImage).y() + (this.activeImage).height()) / 2 * newScale) + additionalPaddingTop / 2,
            scaleX: newScale,
            scaleY: newScale
        })
        this.renderBackground()
    }


    syncActiveImage(image: ImageType) {
        setRecoil(activeImageAtom, image as ImageTypes)
    }

    syncLabels() {
        setRecoil(labelListAtom, [...this.labels])
    }

    syncImageList() {
        setRecoil(imageListAtom,[...this.images]  as (ImageTypes)[])
    }

    getRelativeBBoxOfStage() {
        const scale = this.scale() as Vector2d;
        return {
            l: -this.x() / scale.x,
            r: (this.width() - this.x()) / scale.x,
            t: -this.y() / scale.y,
            b: (this.height() - this.y()) / scale.y
        }
    }

    hideCrossHairs() {
        this.crosshairLines.forEach(line => line.hide())
    }

    showCrossHairs() {
        this.crosshairLines.forEach(line => line.show())
    }

    updateCursorStyle(target?: Image | Box | Polygon | Rect | Line | Anchor | null) {
        if(!target) {
            target = this.getIntersection(this.getPointerPosition() as Vector2d) as unknown as (Image | Box | Rect | Anchor | null)
        }
        let cursor = 'default';
        if(this.appMode.mode === "DRAG_SELECTION_MODE") {
            if(target instanceof Anchor) {
                ['top-left', 'bottom-right'].includes(target.name()) ? cursor = 'nwse-resize' : cursor = 'nesw-resize';
            } else if(target instanceof Box || (target instanceof Rect && target.name() !== 'background-rect') || target instanceof Polygon || target instanceof Line  ) {
                cursor = 'move';
                const shape = target as any;
                shape?.showAnchors?.()
                shape?.parent?.showAnchors?.()
            } else if(target instanceof Image || target === null) {
                if(this.isDragging()) {
                    cursor = 'grabbing'
                } else {
                    cursor = 'grab';
                }
            }
        } else if(this.appMode.mode === "EDIT_MODE") {
            if(target instanceof Anchor) {
                ['top-left', 'bottom-right'].includes(target.name()) ? cursor = 'nwse-resize' : cursor = 'nesw-resize'
            } else if(target instanceof Box  || (target instanceof Rect && target.name() !== 'background-rect') || target instanceof Polygon || target instanceof Line) {
                cursor = 'move'
            } else {
                cursor = 'default'
            }
        } else if(this.appMode.mode === "DRAWING_MODE" || this.appMode.mode === "POLYGON_MODE") {
            if(!target || (target instanceof Rect && target.name() === 'background-rect')) {
                cursor = 'default'
            } else if(target instanceof Anchor) {
                if(target.polygon && target.startAnchor && target.polygon.image?.createPolygonAction) {
                    cursor = 'pointer'
                } else {
                    cursor = 'crosshair'
                }
            } else {
                cursor = 'crosshair'
            }
        }
        this.container().style.cursor = cursor;
    }

    setMode(appMode: AppMode) {
        
        if(appMode.mode === 'DRAG_SELECTION_MODE') {
            this.hideCrossHairs();
            this.draggable(true);
        } else if(appMode.mode === 'EDIT_MODE') {
            this.hideCrossHairs();
            appMode.shapeInEditMode.showAnchors()
            appMode.shapeInEditMode.listening(true);
            appMode.scrollIntoView && appMode.shapeInEditMode.scrollIntoView()
            this.draggable(false);
        } else if(appMode.mode === 'DRAWING_MODE' || appMode.mode === "POLYGON_MODE") {
            this.draggable(false);
            this.showCrossHairs();
        }
        this.appMode = appMode;
        setRecoil(appModeAtom,appMode);
        setTimeout(() => {
            this.updateCursorStyle()
        }, 50);
    }
}