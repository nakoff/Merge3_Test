import { IGameView } from './presenter';
import { Event } from '../core/event';
import { Resource, ResourceManager } from '../core/resource-manager';
import { Vec2 } from '../core/types';

export class GameView implements IGameView {
    private _scene: Phaser.Scene;
    private _resManager: ResourceManager;

    public constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this.init();
    }

    clickEvent = new Event<number, number>();


    private init(): void {
        const x = this._scene.cameras.main.centerX;
        const y = this._scene.cameras.main.centerY;

        this._resManager = new ResourceManager(this._scene);
        this._resManager.createSprite(Resource.GAME_BG, x, y);

        this._scene.input.on("pointerdown", () => {
            const x = this._scene.input.mousePointer.x;
            const y = this._scene.input.mousePointer.y;
            this.clickEvent.trigger(x,y);
        })
    }

    createCell(pos: Vec2): void {
        this._resManager.createSprite(Resource.ELEMENTS, pos.x, pos.y, 2);
    }
}