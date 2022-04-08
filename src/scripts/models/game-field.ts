import { CellObject } from './objects/cell';
import { DataManager } from '../core/data-manager';
import { Vec2 } from '../core/types';
import { ObjectType } from '../core/data-object';

export class GameFieldModel {
    private _cacheObjs: Map<integer, Map<integer, CellObject>>;
    private _cacheCells: Map<integer, CellObject>;
    private _dataManager: DataManager;

    public constructor() {
        this._dataManager = new DataManager();
    }

    public createField(cols:integer, rows:integer, cellSize:Vec2, offset: Vec2): string | null {
        let err: string | null = null;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                var x = col * cellSize.x + offset.x;
                var y = row * cellSize.y + offset.y;
                var cell = new CellObject(col, row, x, y);
                err = this._dataManager.addObject(cell);
                if (err) break;
            }
        }
        return err;
    }

    public getCells(): Map<integer, CellObject> {
        if (!this._cacheCells) {
            this._cacheCells = new Map<integer, CellObject>();
            const objs = this._dataManager.getObjects(ObjectType.CELL);

            for (const obj of objs) {
                const cell = <CellObject> obj;
                this._cacheCells.set(cell.id, cell);
            }
        }
        return this._cacheCells;
    }

    public getCell(id: integer): CellObject | undefined {
        if (!this._cacheObjs)
            this.getCells();
        return this._cacheCells.get(id);
    }
}