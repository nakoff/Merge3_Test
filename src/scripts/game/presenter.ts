import { GameFieldModel } from '../models/game-field';
import { CellObject } from '../models/objects/cell';
import { Vec2 } from '../core/types';
import { IGameView, ElementType } from './iviewer';

enum Direction {
    LEFT, RIGHT, UP, DOWN,
}

export class GamePresenter {
    private _view: IGameView;
    private _cols: integer;
    private _rows: integer;
    private _cellSize: Vec2;
    private _fieldModel: GameFieldModel;
    private _minOverlap: integer;

    public constructor(view: IGameView) {
        this._view = view;
    }

    public create(fieldSize: Vec2, cellSize: Vec2, minOverlap: integer): void {
        this._cols = fieldSize.x;
        this._rows = fieldSize.y;
        this._cellSize = cellSize;
        this._minOverlap = minOverlap;

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
        const elSize = Object.keys(ElementType).length / 2;

        for (const [c, map] of field) {
            for (const [r, cell] of map) {
                const type = Math.floor(Math.random() * elSize);
                pos.x = cell.x,
                pos.y = cell.y;
                cell.cellType = type;
                this._view.createCell(cell.id, pos, type);
            }
        }

        this._view.clickEvent.on((x, y) => this.onClick(x, y));
    }

    public onUpdate() { }

    private onClick(x: number, y: number): void {
        const cell = this.getCellByPos(x, y);
        if (!cell) return;

        const cellsChain = new Map<integer, CellObject>();
        this.collectChain(cell, cellsChain);

        if (cellsChain.size < this._minOverlap) return;

        for (const [id, c] of cellsChain) {
            c.cellType = -1;
            this._view.deleteCell(id);
        }
    }

    private getCellByPos(x: number, y: number): CellObject | null {
        const field = this._fieldModel.getField();
        const halfSize = {x: this._cellSize.x/2, y: this._cellSize.y/2};

        for (const [c, map] of field) {
            for (const [r, cell] of map) {
                if (x >= cell.x - halfSize.x && x < cell.x + halfSize.x 
                && y >= cell.y - halfSize.y && y < cell.y + halfSize.y) {
                    return cell;
                }
            }
        }
        return null;
    }

    private getCellByDir(curCell: CellObject, dir: Direction): CellObject | undefined {
        var col: integer = curCell.col;
        var row: integer = curCell.row;

        switch (dir) {
            case Direction.LEFT: col--; break;
            case Direction.RIGHT: col++; break;
            case Direction.UP: row--; break;
            case Direction.DOWN: row++; break;
        }

        return this._fieldModel.getCell(col, row);
    }

    private collectChain(cell: CellObject, chain: Map<integer, CellObject>): void{
        for (const val in Direction) {
            const dir = Number(val);
            if (isNaN(dir)) continue;

            const targetCell = this.getCellByDir(cell, dir);
            if (!targetCell || targetCell.cellType != cell.cellType) continue;

            if (!chain.has(targetCell.id)) {
                chain.set(targetCell.id, targetCell);
                this.collectChain(targetCell, chain);
            }
        }
    }
}