import { ResourceManager } from '../core/resource-manager';
import { DataManager } from '../core/data-manager';

export class StartScene extends Phaser.Scene {

    constructor() {
        super("Start");
    }

    preload(): void {
        new DataManager().init();
        new ResourceManager(this).init();
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
            this.scene.start("Game");
        })
    }

    update(): void {
    }
}