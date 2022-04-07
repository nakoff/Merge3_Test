import { IDataObject, ObjectType } from "../../core/data-object";

export class CellObject implements IDataObject {
    readonly type = ObjectType.CELL;
    id: number;

    public readonly col: integer;
    public readonly row: integer;
    public readonly x: number;
    public readonly y: number;

    public cellType: integer;

    public constructor(col: integer, row: integer, x: number, y: number) {
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
    }
}