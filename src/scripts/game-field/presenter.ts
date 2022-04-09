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

    private get randType(): integer {
        // const elSize = Object.keys(ElementType).length / 2;
        const types = [
            ElementType.ONE, ElementType.TWO, ElementType.THREE, 
            ElementType.FOR, ElementType.FIVE
        ];
        return Math.floor(Math.random() * types.length);
    }

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
        for (const [id, cell] of cells) {
            cell.cellType = this.randType;
            this._view.createCell(cell.id, {x: cell.x, y: cell.y}, cell.cellType);
        }

        this._view.clickEvent.on((pos: Vec2) => this.onClick(pos.x, pos.y));
    }

    public onUpdate() {
        this._view.update();
    }

    private onClick(x: number, y: number): void {
        const cell = this.getCellByPos(x, y);
        if (!cell || cell.cellType < 0) return;

        //Get Chain by Cell
        const cellsChain = new Map<integer, CellObject>();
        this.collectChain(cell, cellsChain);
        if (cellsChain.size < this._minOverlap) return;

        //Delete Elements
        for (const [id, c] of cellsChain) {
            c.cellType = -1;
            this._view.changeCell(id, c.cellType);
        }

        //Falling Cells
        this.fallinCells(cellsChain);

        //Calculate Left Steps
        const cells = this._fieldModel.getCellsArray();
        const leftSteps = this.getLeftSteps(cells);
        if (leftSteps === 0) {
            this.mixField(this._fieldModel.getCellsArray());
        }
    }

    private mixField(cells: CellObject[]): void {
        if (cells.length < 2) return;

        const tId1 = Math.floor(Math.random() * cells.length);
        let cell1 = cells[tId1];
        cells.splice(tId1, 1);

        const tId2 = Math.floor(Math.random() * cells.length);
        const cell2 = cells[tId2];
        cells.splice(tId2, 1);

        this.swapCells(cell1, cell2);
        this.mixField(cells);
    }

    private swapCells(cell1: CellObject, cell2: CellObject): void {
        const type1 = cell1.cellType;
        cell1.cellType = cell2.cellType;
        cell2.cellType = type1;
        this._view.swapCells(cell1.id, cell2.id);
    }

    private fallinCells(emptyCells: Map<integer, CellObject>): void {
        if (emptyCells.size == 0) return;

        for (const [id, cell] of emptyCells) {
            const upCell = this.getCellByDir(cell, Direction.UP);
            if (upCell) {
                emptyCells.set(upCell.id, upCell);
                if (upCell.cellType >= 0) {
                    this.swapCells(cell, upCell);
                    emptyCells.delete(id);
                }
            } else {
                emptyCells.delete(id);
                cell.cellType = this.randType;
                this._view.changeCell(id, cell.cellType, this._cellSize.y);
            }
        }
        this.fallinCells(emptyCells);
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

    private getLeftSteps(cells: CellObject[]): integer{
        const cell = cells.pop();
        let count = 0;
        if (!cell) return count;

        const chain = new Map<integer, CellObject>();
        this.collectChain(cell, chain);
        if (chain.size >= this._minOverlap)
            count++

        for (const [i, c] of chain) {
            const idx = cells.indexOf(c, 0);
            if (idx > -1) cells.splice(idx, 1);
        }

        return count + this.getLeftSteps(cells);
    }
}