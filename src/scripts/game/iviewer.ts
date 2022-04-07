import { Vec2 } from "../core/types";
import { Event } from '../core/event';

export enum ElementType {
    ONE, TWO, THREE, FOR, FIVE, 
}

export interface IGameView {
    createCell(id: integer, pos: Vec2, type: integer): void;
    deleteCell(id: integer): void;
    clickEvent: Event<number, number>;
}
