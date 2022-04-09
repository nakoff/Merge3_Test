import { IDataObject, ObjectType } from "../../core/data-object";

export class GameDataObject implements IDataObject {
    readonly type = ObjectType.GAME_DATA;
    id: number;

    public mixCount: integer = 0;
    public score: integer = 0;
    public step: integer = 0;
}