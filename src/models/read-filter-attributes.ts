import { ReadDefaultAttributes } from "./read-default-attributes";

export interface ReadFilterAttributes {
    attributeId:number;
    attributeName:string;
    attributeType:string;
    hasDefaultAttributes:boolean;
    defaultAttributes:ReadDefaultAttributes[];
}
