import { Vector2d } from "konva/lib/types";
import { Action } from "./AbstractAction";
import ActionsStore from "./ActionStore";
import { Polygon } from "../models/Polygon";
import { HumanAnnotationImage } from "../models/HumanAnnotationModels/HumanAnnotationImage";

interface CreatePolygonActionIProps {
    parent?: Action<any>;
    pos: Vector2d
    image: HumanAnnotationImage,
    actionsStore: ActionsStore
}

export class CreatePolygonAction extends Action<Polygon> {
    pos: Vector2d | null = null;

    constructor(config: CreatePolygonActionIProps) {
        super(null, config.actionsStore, config.parent)
        this.image = config.image;
        this.pos = config.pos;
    }

    build(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(!this.image || !this.pos || this.status !== "awaitingBuild") {
                this.status = 'buildFailed';
                return reject("Unable to create box.");
            }

            this.subject = new Polygon({
                points: [this.pos.x, this.pos.y],
                draggable: true,
                listening: false,
                image: (this.image as HumanAnnotationImage),
                direction: 'E'
            })
            this.subject.anchors[0].moveTo(this.image.getLayer());
            (this.image as HumanAnnotationImage).addPolygon(this.subject)
            this.subject.anchors[0].moveToTop()
            this.status = 'awaitingExecute';
            resolve();
        })
    }

    execute(pos: Vector2d): Promise<void> {
        return new Promise((resolve,reject) => {
            if(!this.pos || !['awaitingExecute','executing'].includes(this.status)) {
                this.status = 'executionFailed';
                return reject("Unable to create box.");
            }

            this.subject.addAnchor(pos,this.subject.line.points().length - 2);
            this.subject.line.points([...this.subject.line.points(), pos.x, pos.y])
            
            this.status = 'executing'
            resolve()
        })
    }

    async finish(config?: any): Promise<void> {
        await super.finish();
        this.subject.anchors[0].moveTo(this.subject)
    }

    undo(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.status !== 'finish') {
                this.status = 'undoFailed';
                return reject("Unable to undo, action execution is not finished yet.");
            }
            (this.image as HumanAnnotationImage)?.deletePolygon(this.subject);

            this.status = 'undo'
            resolve()
        })
    }

    redo(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.status !== "undo") {
                this.status = 'redoFailed';
                return reject("Unable to redo. Undo is not finished yet.")
            }
            (this.image as HumanAnnotationImage)?.addPolygon(this.subject)

            this.status = 'finish'
            resolve();
        })
    }

}