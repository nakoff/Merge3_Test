import 'phaser';
import { GameScene } from './scripts/scenes/game';
import { StartScene } from './scripts/scenes/start';
 
let configObject: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 800,
        height: 600
    },
    scene: [StartScene, GameScene]
};
 
new Phaser.Game(configObject);