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
        const cells = this._fieldModel.getCells();
        const elSize = Object.keys(ElementType).length / 2;

        for (const [id, cell] of cells) {
            const type = Math.floor(Math.random() * elSize);
            cell.cellType = type;
            this._view.createCell(cell.id, {x: cell.x, y: cell.y}, type);
        }

        this._view.clickEvent.on((x, y) => this.onClick(x, y));
    }

    public onUpdate() {
        this._view.update();
    }

    private onClick(x: number, y: number): void {
        const cell = this.getCellByPos(x, y);
        if (!cell) return;

        const cellsChain = new Map<integer, CellObject>();
        this.collectChain(cell, cellsChain);

        if (cellsChain.size < this._minOverlap) return;

        //Delete
        const colCells = new Map<integer, CellObject[]>();
        for (const [id, c] of cellsChain) {
            c.cellType = -1;
            this._view.changeCellType(id, c.cellType);

            if (!colCells.has(c.col))
                colCells.set(c.col, new Array<CellObject>());
            
            colCells.get(c.col)?.push(c);
        }

        //Falling Cells
        this.spawCells(colCells);
    }

    private spawCells(cellsEmpty: Map<integer, CellObject[]>): void {
        const newEmpty = new Map<integer, CellObject[]>();

        for (const [col, cells] of cellsEmpty) {
            const colSize = cells.length;
            for (const cell of cells) {
                if (cell.cellType != -1) continue;

                const tCell = this.getCellByDir(cell, Direction.UP, colSize);
                if (tCell) {
                    cell.cellType = tCell.cellType;
                    tCell.cellType = -1;
                    if (!newEmpty.has(tCell.col))
                        newEmpty.set(tCell.col, new Array<CellObject>());
                    newEmpty.get(tCell.col)?.push(tCell);
                    this._view.swapCells(tCell.id, cell.id);
                }
            }
        }

        if (newEmpty.size > 0)
            this.spawCells(newEmpty);
    }

    private getCellByPos(x: number, y: number): CellObject | null {
        const cells = this._fieldModel.getCells();
        const halfSize = {x: this._cellSize.x/2, y: this._cellSize.y/2};

        for (const [id, cell] of cells) {
            if (x >= cell.x - halfSize.x && x < cell.x + halfSize.x 
            && y >= cell.y - halfSize.y && y < cell.y + halfSize.y) {
                return cell;
            }
        }
        return null;
    }

    private getCellByDir(curCell: CellObject, dir: Direction, dist: integer = 1): CellObject | undefined {
        let curId = curCell.id;
        let tId = -1;

        switch (dir) {
            case Direction.LEFT: 
                if ((curId - this._cols * curCell.row) - dist >= 0) tId = curId - dist;
                break;
            case Direction.RIGHT:
                if ((curId - this._cols * curCell.row) + dist < this._cols) tId = curId + dist;
                break;
            case Direction.UP: 
                tId = curId - (this._cols * dist); 
                break;
            case Direction.DOWN: 
                tId = curId + (this._cols * dist); 
                break;
        }

        return this._fieldModel.getCell(tId);
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