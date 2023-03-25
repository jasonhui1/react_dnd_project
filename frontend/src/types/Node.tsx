type Status='ON'|'OFF'
export interface Node {
    id: string;
    text: string;
    x: number;
    y: number;
    status:Status
}



export enum ItemTypes {
    NODE = "node",
}