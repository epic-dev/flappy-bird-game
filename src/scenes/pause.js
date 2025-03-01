import BaseScene from './base';

class PauseScene extends BaseScene {
    constructor(config) {
        super('PauseScene', config)
        this.menu = [
            { id: 'play', scene: 'PlayScene', text: 'Resume' },
            { id: 'exit', scene: 'MenuScene', text: 'Main menu' },
        ]
    }
    create() {
        super.create()
        this.createMenu(this.menu, this.addEventListeners.bind(this))
    }

    addEventListeners({ textGO, scene, id }) {
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
            if (scene && id === 'play') {
                this.scene.stop()
                this.scene.resume(scene)
                this.events.emit('resume')
            }
            if (id === 'exit') {
                this.scene.stop('PlayScene')
                this.scene.start(scene)
            }
        })
    }
}

export default PauseScene;