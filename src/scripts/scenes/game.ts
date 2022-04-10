import { GamePresenter } from '../game-field/presenter';
import { GameView } from '../game-field/viewer';
import { GameConsts } from '../game-consts';
import { Scene, SceneManager } from '../core/scene-manager';

export class GameScene extends Phaser.Scene {
    private _gamePres: GamePresenter;

    constructor() {
        super(Scene.GAME);
    }

    preload(): void {
        new SceneManager().init(this);

        //Game Field
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