import { DataManager } from '../core/data-manager';
import { GameDataObject } from './objects/data';
import { Event } from '../core/event';

export enum TypeEvent { ANY, }

export class GameDataModel {
    private _dataManager: DataManager;
    private _do: GameDataObject;

    public updateEvent = new Event<TypeEvent>();

    public constructor() {
        this._dataManager = new DataManager();
    }

    public createData(): void {
        this._do = new GameDataObject();
        this._dataManager.addObject(this._do);
    }

    public get step(): integer {
        return this._do.step;
    }

    public set step(val: integer){
        this._do.step = val;
        this.updateEvent.trigger(TypeEvent.ANY);
    }

    public get score(): integer {
        return this._do.score;
    }

    public set score(val: integer) {
        this._do.score = val;
        this.updateEvent.trigger(TypeEvent.ANY);
    }

    public get mixCount(): integer {
        return this._do.mixCount;
    }

    public set mixCount(val: integer) {
        this._do.mixCount = val;
        this.updateEvent.trigger(TypeEvent.ANY);
    }
}