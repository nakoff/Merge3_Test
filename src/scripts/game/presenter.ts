import { GameFieldModel } from '../models/game-field';
import { CellObject } from '../models/objects/cell';
import { Event } from '../core/event';
import { Vec2 } from '../core/types';

export interface IGameView {
    createCell(pos: Vec2): void;
    clickEvent: Event<number, number>;
}


export class GamePresenter {
    private _view: IGameView;
    private _cols: integer = 1;
    private _rows: integer = 1;
    private _cellSize: Vec2;
    private _fieldModel: GameFieldModel;

    public constructor(view: IGameView) {
        this._view = view;
        view.clickEvent.on((x, y) => {
            console.log(this.getCellByPos(x, y));
        })
    }

    public create(fieldSize: Vec2, cellSize: Vec2): void {
        this._cols = fieldSize.x;
        this._rows = fieldSize.y;
        this._cellSize = cellSize;

        this._fieldModel = new GameFieldModel();
        const offset = {x: 58, y: 148};
        const err = this._fieldModel.createField(this._cols, this._rows, cellSize, offset);
        if (err){
            console.error(err);
            return;
        }

        //draw cells
        const field = this._fieldModel.getField();
        let pos: Vec2 = {x: 0, y: 0};
        for (const [c, map] of field) {
            for (const [r, cell] of map) {
                pos.x = cell.x,
                pos.y = cell.y;
                this._view.createCell(pos);
            }
        }
    }

    public onUpdate() { }

    private getCellByPos(x: number, y: number): CellObject | undefined {
        const field = this._fieldModel.getField();
        const halfSize = {x: this._cellSize.x/2, y: this._cellSize.y/2};

        for (const [c, map] of field) {
            for (const [r, cell] of map) {
                if (x >= cell.x - halfSize.x && x < cell.x + halfSize.x &&
                    y >= cell.y - halfSize.y && y < cell.y + halfSize.y) {
                        return cell;
                    }
            }
        }
    }
}