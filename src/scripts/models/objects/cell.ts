import { IDataObject, ObjectType } from "../../core/data-object";

export enum CellType {
    EMPTY, ONE, TWO, THREE, FOR, FIVE,
}

export class CellObject implements IDataObject {
    type = ObjectType.CELL;
    id: number;

    public readonly col: integer;
    public readonly row: integer;
    public readonly x: number;
    public readonly y: number;

    public cellType: CellType = CellType.EMPTY;

    public constructor(col: integer, row: integer, x: number, y: number) {
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
    }
}