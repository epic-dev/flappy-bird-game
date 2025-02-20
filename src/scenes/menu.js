import BaseScene from './base';

class MenuScene extends BaseScene {
    constructor(config) {
        super('MenuScene', config)
        this.menu = [
            { scene: 'PlayScene', text: 'Play' },
            { scene: 'ScoreScene', text: 'Score' },
            { scene: null, text: 'Exit' },
        ]
    }
    create() {
        super.create()
        this.createMenu(this.menu, this.addEventListeners.bind(this))
    }

    addEventListeners({ textGO, scene, text }) {
        textGO.setInteractive({
            useHandCursor: true
        })
        textGO.on('pointerover', () => {
            textGO.setStyle({ fill: this.config.text.hover })
        })
        textGO.on('pointerout', () => {
            textGO.setStyle({ fill: this.config.text.fill })
        })
        textGO.on('pointerup', () => {
            if (scene) {
                this.scene.start(scene)
            }
            if (text === 'Exit') {
                this.game.destroy(true)
            }
        })
    }
}

export default MenuScene;