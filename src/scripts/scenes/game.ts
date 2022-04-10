import { GamePresenter } from '../game-field/presenter';
import { GameView } from '../game-field/viewer';
import { GameConsts } from '../game-consts';
import { GameUIView } from '../game-ui/viewer';
import { GameUI } from '../game-ui/presenter';
import { Scene, SceneManager } from '../core/scene-manager';

export class GameScene extends Phaser.Scene {
    private _gamePres: GamePresenter;
    private _uiPres: GameUI;

    constructor() {
        super(Scene.GAME);
    }

    preload(): void {
        new SceneManager().init(this);

        //Game Field
        const gameView = new GameView(this);
        this._gamePres = new GamePresenter(gameView);

        //Game UI
        const uiView = new GameUIView(this);
        this._uiPres = new GameUI(uiView);
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

        this._uiPres.create();
    }

    update(): void {
        this._gamePres?.onUpdate();
        this._uiPres?.onUpdate();
    }
}