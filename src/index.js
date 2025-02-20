
import Phaser from 'phaser'
import PlayScene from './scenes/play';
import MenuScene from './scenes/menu';
import PreloadScene from './scenes/preload';
import ScoreScene from './scenes/score';
import PauseScene from './scenes/pause';

const sharedConfig = {
  width: 800,
  height: 600,
  text: {
    fill: '#007',
    hover: '#00c',
    fontSize: '32px',
    fontFamily: 'Joystix',
  },
  livesCount: 3,
}

const initScene = scene => new scene(sharedConfig)
const getScenes = () => [
  PreloadScene,
  MenuScene,
  ScoreScene,
  PlayScene,
  PauseScene,
].map(initScene);

const config = {
  type: Phaser.AUTO,
  ...sharedConfig,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true
    }
  },
  scene: getScenes(),
  pixelArt: true
};

new Phaser.Game(config)