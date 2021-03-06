import { Event } from '../core/event';
import { Resource, ResourceManager } from '../core/resource-manager';
import { Vec2 } from '../core/types';
import { IGameView, ElementType } from './iviewer';

class Cell {
    public readonly id: integer;
    public readonly x: number;
    public readonly y: number;

    public type: integer;
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
    private readonly _deletedCells = new Map<integer, Phaser.GameObjects.Sprite>();
    private _bonuses = new Array<Phaser.GameObjects.Sprite>();
    private _fallSpeed = 5;

    public constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this.init();
    }

    public clickEvent = new Event<Vec2>();


    private init(): void {
        const x = this._scene.cameras.main.centerX;
        const y = this._scene.cameras.main.centerY;

        this._resManager = new ResourceManager(this._scene);
        this._resManager.createSprite(Resource.GAME_BG, x, y);

        this._scene.input.on("pointerdown", () => {
            const x = this._scene.input.mousePointer.x;
            const y = this._scene.input.mousePointer.y;
            this.clickEvent.trigger({x:x, y:y});
        })
    }

    private createElement(type: integer, x: number, y: number): Phaser.GameObjects.Sprite {
       return this._resManager.createSprite(Resource.ELEMENTS, x, y, type);
    }

    private t = 0;
    update(): void {
        this.t += 0.1;

        //Move animation
        for (const [id, cell] of this._dirtyCells) {
            const el = cell.element;
            if (!el) continue;

            const dirX = Math.sign(cell.x - el.x);
            const dirY = Math.sign(cell.y - el.y);
            const distX = Math.abs(cell.x - el.x);
            const distY = Math.abs(cell.y - el.y);

            if (distX > this._fallSpeed) el.x += this._fallSpeed * dirX;
            else el.x = cell.x;

            if (distY > this._fallSpeed) el.y += this._fallSpeed * dirY;
            else el.y = cell.y;
            
            if (distX <= this._fallSpeed && distY <= this._fallSpeed)
                this._dirtyCells.delete(id);
        }

        //Delete animation
        for (const [id, el] of this._deletedCells) {
            el.setScale(el.scaleX-0.2, el.scaleY-0.2);
            if (el.scaleX < 0) {
                el.destroy();
                this._deletedCells.delete(id);
            }
        }

        //Bouses
        for (const el of this._bonuses) {
            const s = Math.max(Math.sin(this.t)*2, 1);
            el.scaleX = s;
            el.scaleY = s;
        }
    }

    createCell(id: integer, pos: Vec2, type: integer): void {
        var cell = new Cell(id, type, pos);
        this._cells.set(id, cell);
        cell.element = this.createElement(type, pos.x, pos.y);
    }

    changeCell(id: integer, type: integer, offsetY?: number): void {
        const cell = this._cells.get(id);
        if (!cell) return;

        if (cell.element) {
            if (this._deletedCells.has(cell.id))
                cell.element.destroy();
            this._deletedCells.set(cell.id, cell.element);
            cell.element = undefined;
        }

        cell.type = type;
        if (type >= 0) {
            const y = offsetY ? offsetY : 0;
            cell.element = this.createElement(type, cell.x, cell.y - y);
            this._dirtyCells.set(id, cell);
        }
        this.checkBonusCells();
    }

    swapCells(idFrom: integer, idTo: integer): void {
        const cellFrom = this._cells.get(idFrom);
        const cellTo = this._cells.get(idTo);
        if (!cellFrom || !cellTo) return;

        const elFrom = cellFrom.element;
        const elTo = cellTo.element;
        const type1 = cellFrom.type;

        cellFrom.element = elTo;
        cellTo.element = elFrom;
        cellFrom.type = cellTo.type;
        cellTo.type = type1;

        this._dirtyCells.set(cellFrom.id, cellFrom);
        this._dirtyCells.set(cellTo.id, cellTo);
        this.checkBonusCells();
    }

    private checkBonusCells(): void {
        this._bonuses = new Array<Phaser.GameObjects.Sprite>();
        for (const [id, cell] of this._cells) {
            if (!cell.element) continue;
            if (cell.type === ElementType.BONUS1 || cell.type === ElementType.BONUS2) {
                cell.element.depth = 2;
                this._bonuses.push(cell.element);
            }
        }
    }
}