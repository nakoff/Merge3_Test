import { ResourceManager } from '../core/resource-manager';
import { DataManager } from '../core/data-manager';
import { Scene, SceneManager } from '../core/scene-manager';
import { GameDataModel } from '../models/game-data';

export class StartScene extends Phaser.Scene {
    constructor() {
        super(Scene.START);
    }

    preload(): void {
        new DataManager().init();
        new GameDataModel().init();

        new ResourceManager(this).init();
        new SceneManager().init(this);
    }

    create(): void {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;

        const gameText = this.add.text(x, y, "Merge3 Test Game", { font: "40px Arial" });
        gameText.setX(gameText.x - gameText.width/2);

        const clickText = this.add.text(x, y, "Click to start Game", { font: "20px Arial" });
        clickText.setX(clickText.x - clickText.width/2);
        clickText.setY(y + gameText.height);

        this.input.once("pointerdown", () => {
            new SceneManager().changeScene(Scene.GAME);
        })
    }

    update(): void {
    }
}