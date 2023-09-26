import { getLabelColors } from "../utils/utils";

interface Config {
    id: number
    name: string
    type: number
}

export class Label {
    id!: number;
    name!: string;
    type!: number;
    stroke = 'rgb(255, 178, 29)'
    fill = 'rgb(255, 178, 29, 0.2)'

    constructor(config: Config) {
        this.id = config.id
        this.name = config.name
        this.type = config.type;
        if(config.name !== 'TEXT') {
            [this.stroke, this.fill] = getLabelColors()
        }
    }
}