import 'phaser';
import { GameScene } from './scripts/scenes/game';
import { StartScene } from './scripts/scenes/start';
import { GameWinScene } from './scripts/scenes/game-win';
import { GameOverScene } from './scripts/scenes/game-over';
 
let configObject: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 800,
        height: 600
    },
    scene: [StartScene, GameScene, GameWinScene, GameOverScene]
};

new Phaser.Game(configObject);