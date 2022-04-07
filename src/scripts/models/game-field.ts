import { CellObject } from './objects/cell';
import { DataManager } from '../core/data-manager';
import { Vec2 } from '../core/types';
import { ObjectType } from '../core/data-object';

export class GameFieldModel {
    private _cacheObjs: Map<integer, Map<integer, CellObject>>;
    private _dataManager: DataManager;

    public constructor() {
        this._dataManager = new DataManager();
    }

    public createField(cols:integer, rows:integer, cellSize:Vec2, offset: Vec2): string | null {
        let err: string | null = null;

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                var x = col * cellSize.x + offset.x;
                var y = row * cellSize.y + offset.y;
                var cell = new CellObject(col, row, x, y);
                err = this._dataManager.addObject(cell);
                if (err) break;
            }
        }
        return err;
    }

    public getField(): Map<integer, Map<integer,CellObject>> {
        if (!this._cacheObjs) {
            this._cacheObjs = new Map<integer, Map<integer, CellObject>>();

            const objs = this._dataManager.getObjects(ObjectType.CELL);

            for (const obj of objs) {
                const cell = <CellObject> obj;
                
                if (!this._cacheObjs.has(cell.col)) {
                    this._cacheObjs.set(cell.col, new Map<integer,CellObject>());
                }
                if (!this._cacheObjs.get(cell.col)?.has(cell.row)) {
                    this._cacheObjs.get(cell.col)?.set(cell.row, cell);
                }
            }
        }
        
        return this._cacheObjs;
    }

    public getCell(col: integer, row: integer): CellObject | undefined {
        if (!this._cacheObjs)
            this.getField();
        return this._cacheObjs.get(col)?.get(row);
    }
}