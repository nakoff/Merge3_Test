import { Vec2 } from "../core/types";
import { Event } from '../core/event';

export enum ElementType {
    ONE, TWO, THREE, FOR, FIVE, BONUS1, BONUS2,
}

export interface IGameView {
    update(): void;
    createCell(id: integer, pos: Vec2, type: integer): void;
    changeCell(id: integer, type: integer, offsetY?: number): void;
    swapCells(id1: integer, id2: integer): void;
    clickEvent: Event<number, number>;
}
