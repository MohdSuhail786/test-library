import { Vector2d } from "konva/lib/types";
import { Action } from "./AbstractAction";
import { Box } from "../models/Box";
import { Image } from "../models/Image";
import { Editor } from "../models/HumanAnnotationModels/HumanAnnotationEditor";
import ActionsStore from "./ActionStore";

interface RemoveBoxActionIProps {
    parent?: Action<any>;
    box: Box,
    actionsStore: ActionsStore
}

export class RemoveBoxAction extends Action<Box> {

    editor: Editor | null = null;

    constructor(config: RemoveBoxActionIProps) {
        super(config.box, config.actionsStore, config.parent)
        this.image = this.subject.image;
        this.editor = this.subject.image?.editor as Editor;
    }

    build(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.status !== "awaitingBuild") {
                this.status = 'buildFailed';
                return reject("Unable to create box.");
            }
            this.status = 'awaitingExecute';
            resolve();
        })
    }

    execute(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(!this.editor || !['awaitingExecute','executing'].includes(this.status)) {
                this.status = 'executionFailed';
                return reject("Unable to create box.");
            }

            this.image?.deleteBox(this.subject);
            
            this.status = 'executing'
            resolve()
        })
    }

    undo(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(!this.editor || this.status !== 'finish') {
                this.status = 'undoFailed';
                return reject("Unable to undo, action execution is not finished yet.");
            }

            this.image?.addBox(this.subject);

            this.status = 'undo'
            resolve()
        })
    }

    redo(): Promise<void> {
        return new Promise((resolve,reject) => {
            if(!this.editor || this.status !== "undo") {
                this.status = 'redoFailed';
                return reject("Unable to redo. Undo is not finished yet.")
            }

            this.image?.deleteBox(this.subject);

            this.status = 'finish'
            resolve();
        })
    }

}