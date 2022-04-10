import { IGameUIView } from './iviewer';
import { Vec2 } from '../core/types';

enum TextIds { STEP, SCORE, MIX, }

export class GameUIView implements IGameUIView {
    private _scene: Phaser.Scene;
    private _texts = new Map<TextIds, Phaser.GameObjects.Text>();

    public constructor(scene: Phaser.Scene) {
        this._scene = scene;

        this.createText(TextIds.MIX, "0", {x: 150, y: 50}, 25);
        this.createText(TextIds.STEP, "0", {x: 625, y: 215}, 50);
        this.createText(TextIds.SCORE, "0", {x: 625, y: 335}, 30);
    }

    public set leftSteps(val: integer) {
        const to = this.getText(TextIds.STEP);
        to?.setText(val.toString());
    }

    public set score(val: integer) {
        const to = this.getText(TextIds.SCORE);
        to?.setText(val.toString());
    }

    public set leftMix(val: integer) {
        const to = this.getText(TextIds.MIX);
        to?.setText(val.toString());
    }

    private createText(id: TextIds, msg: string, pos: Vec2, size: number): void {
        if (this._texts.has(id))
            this._texts.get(id)?.destroy();
        
        const txtObj = this._scene.add.text(pos.x, pos.y, msg, { font: `${size}px Arial`});
        txtObj.setOrigin(0.5);
        this._texts.set(id, txtObj);
    }

    private getText(id: TextIds): Phaser.GameObjects.Text | undefined {
        return this._texts.get(id);
    }
}