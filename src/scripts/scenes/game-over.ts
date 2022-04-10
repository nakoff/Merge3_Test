import { GameDataModel } from '../models/game-data';
import { Scene, SceneManager } from '../core/scene-manager';

export class GameOverScene extends Phaser.Scene {

    constructor() {
        super(Scene.GAME_OVER);
    }

    preload(): void {
        new SceneManager().init(this);
    }

    create(): void {
        // const dataModel = new GameDataModel();
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;

        const gameText = this.add.text(x, y, "GAME OVER", { font: "50px Arial" });
        gameText.setOrigin(0.5);

        // const scoreText = this.add.text(x, gameText.y, `You'r Score: ${dataModel.score}`, { font: "20px Arial" });
        // scoreText.setOrigin(0.5);
        // scoreText.setY(y + gameText.height);

        // const clickText = this.add.text(x, scoreText.y, "Click to restart Game", { font: "20px Arial" });
        // clickText.setOrigin(0.5);
        // clickText.setY(y + scoreText.height);

        this.input.once("pointerdown", () => {
            new SceneManager().changeScene(Scene.START);
        })
    }

    update(): void {
    }
}