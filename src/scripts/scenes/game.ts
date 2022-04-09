import { GamePresenter } from '../game-field/presenter';
import { GameView } from '../game-field/viewer';
import { GameConsts } from '../game-consts';

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
        const cols = GameConsts.FIELD_COLS;
        const rows = GameConsts.FIELD_ROWS;

        //Cell Size
        const cellWidth = GameConsts.CELL_WIDTH;
        const cellHeight = GameConsts.CELL_HEIGHT;

        this._gamePres.create(
            { x: cols, y: rows }, 
            { x: cellWidth, y: cellHeight },
            GameConsts.MIN_CHAIN
        );
    }

    update(): void {
        this._gamePres?.onUpdate();
    }
}