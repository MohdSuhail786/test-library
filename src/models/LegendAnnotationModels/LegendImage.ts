import { Box } from "../Box";
import { Image, ImageConfig } from "../BaseModels/Image";
import { CreateBoxAction } from "../../actions/CreateBoxAction";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { IMBox, ImageTypes } from "../Types";
import { entityListAtom } from "../../state/editor";
import { setRecoil } from "recoil-nexus";
import { LegendEditor } from "./LegendEditor";

export interface LegendImageConfig extends ImageConfig {
    editor: LegendEditor,
}

export class LegendImage<Config extends LegendImageConfig = LegendImageConfig> extends Image {

    legendSelection: Set<Box> = new Set();
    createBoxAction: CreateBoxAction | null = null;

    constructor(config: Config) {
        super(config)

        this.init(config)
        
        this.on("mousedown", this.mouseDownAction.bind(this));
        this.on("mousemove", this.mouseMoveAction.bind(this));
        this.on("mouseup", this.mouseUpAction.bind(this));
    }

    init(config: Config) {
        super.init(config)
    }

    async mouseDownAction(event: KonvaEventObject<MouseEvent>) {
        try {
            if(!["DRAWING_MODE"].includes(this.editor?.appMode.mode || "") || this.createBoxAction !== null || event.evt.which !== 1) return;
            this.editor?.hideCrossHairs()
            const pos = this.editor?.getRelativePointerPosition() as Vector2d;
            if(this.editor.appMode.mode === "DRAWING_MODE") {
                this.createBoxAction = new CreateBoxAction({pos,image:this, actionsStore: this.actionStore})
                await this.createBoxAction.build()
            }
        } catch (error) {
            console.log(error)
        }
    }

    async mouseMoveAction(event: KonvaEventObject<MouseEvent>) {
        try {
            if(!["DRAWING_MODE"].includes(this.editor?.appMode.mode || "")) return;
            const pos = this.editor?.getRelativePointerPosition() as Vector2d;
            if(this.createBoxAction) {
                await this.createBoxAction.execute(pos);
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
            this.editor?.setMode({
                mode: "EDIT_MODE",
                shapeInEditMode: box,
                visible: true,
                scrollIntoView: true
            })
        } catch (error) {
            console.log(error)
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

    addBox(box: Box) {
        this.legendSelection.add(box);
        (this.editor as LegendEditor).legendSelectionLayer.add(box)
        this.editor.activeImage && this.syncBoxs()
    }

    deleteBox(box: Box) {
        this.legendSelection.delete(box)
        box.remove()
        this.syncBoxs()
    }

    syncBoxs() {
        setRecoil(entityListAtom, [...this.legendSelection])
    }

}