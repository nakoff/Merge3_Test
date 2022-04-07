import { GamePresenter } from '../game/presenter';
import { GameView } from '../game/viewer';

export class GameScene extends Phaser.Scene {
    private _gamePres: GamePresenter;

    constructor() {
        super("Game");
    }

    preload(): void {
        const gameView = new GameView(this);
        this._gamePres = new GamePresenter(gameView);
    }

    create(): void {
        //Field Size
        const cols = 9;
        const rows = 9;

        //Cell Size
        const cellWidth = 39.3;
        const cellHeight = 44.3;

        this._gamePres.create({x: cols, y: rows}, {x: cellWidth, y: cellHeight});
    }

    update(): void {
        this._gamePres?.onUpdate();
    }
}