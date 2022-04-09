
export enum ObjectType {
    TEST, CELL, GAME_DATA,
}

export interface IDataObject {
    readonly type: ObjectType;
    id: integer;
}