interface Config {
    id: number;
    name: string;
    type: number;
}
export declare class Label {
    id: number;
    name: string;
    type: number;
    stroke: string;
    fill: string;
    constructor(config: Config);
}
export {};
