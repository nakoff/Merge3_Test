import 'phaser';
 
class PlayGame extends Phaser.Scene {
    image: Phaser.GameObjects.Image;
    constructor() {
        super("Merge3");
    }
    preload(): void {
        this.load.image('logo', 'assets/logo.png');    
    }
    create(): void {
        this.image = this.add.image(400, 300, 'logo');
    }
    update(): void {
        this.image.rotation += 0.01;   
    }
}
 
let configObject: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 800,
        height: 600
    },
    scene: PlayGame
};
 
new Phaser.Game(configObject);