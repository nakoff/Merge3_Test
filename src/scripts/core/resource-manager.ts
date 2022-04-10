export enum Resource {
    GAME_BG, ELEMENTS, PROGRESS,
}

export class ResourceManager {
    private _sc: Phaser.Scene;

    public constructor(scene: Phaser.Scene) {
        this._sc = scene;
    }

    public init(): void {
        this._sc.load.spritesheet(Resource.ELEMENTS.toString(), "assets/elements.png", {frameWidth: 275/7, frameHeight: 44});
        this._sc.load.image(Resource.GAME_BG.toString(), "assets/bg.png");
        this._sc.load.image(Resource.PROGRESS.toString(), "assets/progress.png");
    }

    public createSprite(res: Resource, x: number, y: number, frame?: integer): Phaser.GameObjects.Sprite {
        return this._sc.add.sprite(x, y, res.toString(), frame);
    }
}