
export enum ObjectType {
    TEST, CELL,
}

export interface IDataObject {
    readonly type: ObjectType;
    id: integer;
}