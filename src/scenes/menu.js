import BaseScene from './base';

class MenuScene extends BaseScene {
    constructor(config) {
        super('MenuScene', config)
    }
    create() {
        super.create()
        this.menu = [
            { scene: 'PlayScene', text: 'Play' },
            { scene: 'ScoreScene', text: 'Score' },
            { id: 'music', text: this.musicLabel() },
            { scene: null, text: 'Exit' },
        ]
        this.createMenu(this.menu, this.addEventListeners.bind(this))

        if (!this.sound.get('bgMusic')) {
            this.sound.add('bgMusic', { loop: true, volume: 0.4 }).play()
        }

        const musicItem = this.menu.find(i => i.id === 'music')
        const onToggle = () => musicItem.textGO && musicItem.textGO.setText(this.musicLabel())
        this.game.events.on('music-toggled', onToggle)
        this.events.once('shutdown', () => this.game.events.off('music-toggled', onToggle))
    }

    addEventListeners({ textGO, scene, text, id }) {
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
            if (id === 'music') {
                this.toggleMusic()
                return
            }
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