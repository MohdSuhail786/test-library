import { Vector2d } from "konva/lib/types";
import { Action } from "./AbstractAction";
import { Box } from "../models/Box";
import ActionsStore from "./ActionStore";
import { HumanAnnotationImage } from "../models/HumanAnnotationModels/HumanAnnotationImage";
import { DrawingAreaImage } from "../models/DrawingAreaModels/DrawingAreaImage";

interface CreateBoxActionIProps {
    parent?: Action<any>;
    pos: Vector2d
    image: HumanAnnotationImage | DrawingAreaImage,
    actionsStore: ActionsStore
}

export class CreateBoxAction extends Action<Box> {
    pos: Vector2d | null = null;

    constructor(config: CreateBoxActionIProps) {
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

            this.subject = new Box({
                x: this.pos.x,
                y: this.pos.y,
                width: 0,
                height: 0,
                draggable: true,
                listening: false,
                image: this.image,
                label: null,
                direction: 'E',
                humanAnnotated: true,
                indexId: -1
            })
            this.image.addBox(this.subject)
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

            this.subject.rect.width(0 - this.pos.x + pos.x);
            this.subject.rect.height(0 - this.pos.y + pos.y);
            this.subject.updateAnchorsPosition();
            
            this.status = 'executing'
            resolve()
        })
    }

    undo(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.status !== 'finish') {
                this.status = 'undoFailed';
                return reject("Unable to undo, action execution is not finished yet.");
            }
            this.image?.deleteBox(this.subject);

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
            this.image?.addBox(this.subject)

            this.status = 'finish'
            resolve();
        })
    }

}