import Phaser from 'phaser'

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene')
    }
    preload() {
        this.load.image('sky', '../assets/sky_bg.png');
        this.load.spritesheet('bird', '../assets/birdSprite.png', {
            frameWidth: 16,
            frameHeight: 16,
        })
        this.load.image('pipe', '../assets/pipe.png')
    }
    create() {
        this.scene.start('MenuScene')
    }
}

export default PreloadScene;