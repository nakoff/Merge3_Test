import { IDataObject, ObjectType } from "../../core/data-object";
import { Event } from "../../core/event";

export class GameDataObject implements IDataObject {
    public updateEvent = new Event<integer>();
    readonly type = ObjectType.GAME_DATA;
    id: number;

    public mixCount: integer = 0;
    public score: integer = 0;
    public step: integer = 0;
}