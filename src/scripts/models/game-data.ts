import { DataManager } from '../core/data-manager';
import { GameDataObject } from './objects/data';
import { Event } from '../core/event';
import { ObjectType } from '../core/data-object';

export enum TypeEvent { STEP, SCORE, MIX }

export class GameDataModel {
    private _dataManager: DataManager;
    private _do: GameDataObject;

    private updateEvent = new Event<TypeEvent>();

    public constructor() {
        this._dataManager = new DataManager();
        const obj = this._dataManager.getObjects(ObjectType.GAME_DATA).pop();
        if (obj) {
            this._do = <GameDataObject> obj;
        }
    }

    public subscribe(listener: (arg0: TypeEvent)=> void): void {
        this._do.updateEvent.on((id) => this.onDataChanged(id));
        this.updateEvent.on(listener)
    }

    public unSubscribe(): void {
        this._do.updateEvent.off((id) => this.onDataChanged(id));
    }

    private onDataChanged(id: TypeEvent): void {
        this.updateEvent.trigger(id);
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
        this._do.updateEvent.trigger(TypeEvent.STEP);
    }

    public get score(): integer {
        return this._do.score;
    }

    public set score(val: integer) {
        this._do.score = val;
        this._do.updateEvent.trigger(TypeEvent.SCORE);
    }

    public get mixCount(): integer {
        return this._do.mixCount;
    }

    public set mixCount(val: integer) {
        this._do.mixCount = val;
        this._do.updateEvent.trigger(TypeEvent.MIX);
    }
}