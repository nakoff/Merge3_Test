
export enum Scene {
    START = "Start", 
    GAME = "Game", 
    GAME_WIN = "GameWin", 
    GAME_OVER = "GameOver",
}

export class SceneManager {
    private static _scene: Phaser.Scene;

    public init(scene: Phaser.Scene): void {
        SceneManager._scene = scene;
    }

    public changeScene(to: Scene): void {
        SceneManager._scene.scene.start(to);
        console.log(`CHANGE SCENE to: ${to}`);
    }
}