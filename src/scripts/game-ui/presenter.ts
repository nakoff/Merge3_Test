import { IGameUIView } from './iviewer';
import { GameDataModel, TypeEvent } from '../models/game-data';
import { GameConsts } from '../game-consts';

export class GameUI {
    private _view: IGameUIView;
    private _dataModel: GameDataModel;

    public constructor(view: IGameUIView) {
        this._view = view;
    }

    public create(): void {
        this._dataModel = new GameDataModel();
        this._dataModel.subscribe((eventType: TypeEvent) => this.onDataChanged(eventType));

        this.onDataChanged(TypeEvent.MIX);
        this.onDataChanged(TypeEvent.STEP);
        this.onDataChanged(TypeEvent.SCORE);
    }

    public onUpdate(): void {}

    private onDataChanged(type: TypeEvent): void {
        switch (type) {
            case TypeEvent.STEP: 
                const leftSpteps = GameConsts.MAX_STEPS - this._dataModel.step;
                this._view.leftSteps = leftSpteps;
                break;
            case TypeEvent.SCORE: 
                this._view.score = this._dataModel.score;
                break;
            case TypeEvent.MIX: 
                this._view.leftMix = GameConsts.MAX_MIXES - this._dataModel.mixCount;
                break;
        }
    }
}