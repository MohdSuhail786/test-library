import { Vector2d } from "konva/lib/types";
import { Box } from "../models/Box";
import { IMBox } from "../models/Types";
import { Action } from "./AbstractAction";
import ActionsStore from "./ActionStore";
import { Anchor } from "../models/Anchor";
import { Polygon } from "../models/Polygon";

interface PolygonTransformActionIProps {
    parent?: Action<any>;
    actionsStore: ActionsStore
    polygon: Polygon
    anchor: Anchor
}

export class PolygonTransformAction extends Action<Polygon> {

    anchor: Anchor | null = null;
    oldPoints: number[] | null = null;
    newPoints: number[] | null = null;

    constructor(config: PolygonTransformActionIProps) {
        super(config.polygon, config.actionsStore, config.parent)
        this.anchor = config.anchor;
    }

    build(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.status !== "awaitingBuild") {
                this.status = 'buildFailed';
                return reject("Unable to store old position of box.");
            }
            this.oldPoints = this.subject.line.points();
            this.status = 'awaitingExecute';
            resolve();
        })
    }

    execute(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(!['awaitingExecute','executing'].includes(this.status)) {
                this.status = 'executionFailed';
                return reject("Unable to transform box.");
            }

            const pos = this.subject.image?.editor?.getRelativePointerPosition() as Vector2d;
            pos.x -= this.subject.x();
            pos.y -= this.subject.y();
            const posIndex = this.anchor?.getAttr('posIndex')
            this.subject.line.points(this.subject.line.points().map((p,i) => {
                if(i === posIndex) {
                    return pos.x;
                }
                if(i === posIndex + 1) {
                    return pos.y;
                }
                return p;
            }))
            if(posIndex === 0) this.subject.line.points([...this.subject.line.points().slice(0,-2),pos.x,pos.y])
            this.newPoints = this.subject.line.points();
            this.status = 'executing'
            resolve()
        })
    }

    undo(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.status !== 'finish' || !this.oldPoints) {
                this.status = 'undoFailed';
                return reject("Unable to undo, action execution is not finished yet or old position is not found.");
            }

            this.subject.line.points(this.oldPoints)
            this.subject.updateAnchorsPosition()
            this.status = 'undo'
            resolve()
        })
    }

    redo(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.status !== "undo" || !this.newPoints) {
                this.status = 'redoFailed';
                return reject("Unable to redo. Undo is not finished yet or new position is not found.")
            }

            this.subject.line.points(this.newPoints)
            this.subject.updateAnchorsPosition()
            this.status = 'finish'
            resolve();
        })
    }

}