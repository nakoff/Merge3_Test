import { Vec2 } from "../core/types";
import { Event } from '../core/event';

export enum ElementType {
    ONE, TWO, THREE, FOR, FIVE, 
}

export interface IGameView {
    update(): void;
    createCell(id: integer, pos: Vec2, type: integer): void;
    changeCellType(id: integer, type: integer): void;
    swapCells(id1: integer, id2: integer): void;
    clickEvent: Event<number, number>;
}
