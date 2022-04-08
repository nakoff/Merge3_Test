import { Event } from '../core/event';
import { Resource, ResourceManager } from '../core/resource-manager';
import { Vec2 } from '../core/types';
import { IGameView } from './iviewer';

class Cell {
    public readonly id: integer;
    public readonly type: integer;
    public readonly x: number;
    public readonly y: number;

    public element?: Phaser.GameObjects.Sprite;

    constructor (id: integer, type: integer, pos: Vec2) {
        this.id = id;
        this.type = type;
        this.x = pos.x;
        this.y = pos.y;
    }
}

export class GameView implements IGameView {
    private _scene: Phaser.Scene;
    private _resManager: ResourceManager;
    private readonly _cells = new Map<integer, Cell>();
    private readonly _dirtyCells = new Map<integer, Cell>();
    private _fallSpeed = 3;

    public constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this.init();
    }

    clickEvent = new Event<number, number>();


    private init(): void {
        const x = this._scene.cameras.main.centerX;
        const y = this._scene.cameras.main.centerY;

        this._resManager = new ResourceManager(this._scene);
        this._resManager.createSprite(Resource.GAME_BG, x, y);

        this._scene.input.on("pointerdown", () => {
            const x = this._scene.input.mousePointer.x;
            const y = this._scene.input.mousePointer.y;
            this.clickEvent.trigger(x,y);
        })
    }

    update(): void {
        for (const [id, cell] of this._dirtyCells) {
            const el = cell.element;
            if (!el) continue;

            el.y += this._fallSpeed;
            if (el.y >= cell.y) {
                el.y = cell.y;
                this._dirtyCells.delete(id);
            }
        }
    }

    createCell(id: integer, pos: Vec2, type: integer): void {
        var cell = new Cell(id, type, pos);
        this._cells.set(id, cell);

        const element = this._resManager.createSprite(Resource.ELEMENTS, pos.x, pos.y, type);
        cell.element = element;
    }

    changeCellType(id: integer, type: integer): void {
        const cell = this._cells.get(id);
        if (!cell || !cell.element) return;

        cell.element.destroy();
        cell.element = undefined;

        if (type >= 0) {
            this.createCell(id, {x: cell.x, y: cell.y}, type);
        }
    }

    swapCells(idFrom: integer, idTo: integer): void {
        const cellFrom = this._cells.get(idFrom);
        const cellTo = this._cells.get(idTo);
        if (!cellFrom || !cellTo) return;

        const elFrom = cellFrom.element;
        const elTo = cellTo.element;

        cellFrom.element = elTo;
        cellTo.element = elFrom;

        this._dirtyCells.set(cellFrom.id, cellFrom);
        this._dirtyCells.set(cellTo.id, cellTo);
    }
}