import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key)
        this.config = config
        this.screenCenter = [
            config.width / 2,
            config.height / 2,
        ];
        this.lineHeight = 50;
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0)
        this.sound.mute = !this.isMusicOn()
        if (this.config.canGoBack) {
            this.createBackButton()
        }
        this.createMusicToggle()
    }

    isMusicOn() {
        return localStorage.getItem('musicOn') !== 'false'
    }

    musicLabel() {
        return this.isMusicOn() ? 'Music: ON' : 'Music: OFF'
    }

    toggleMusic() {
        const next = !this.isMusicOn()
        localStorage.setItem('musicOn', next ? 'true' : 'false')
        this.sound.mute = !next
        this.game.events.emit('music-toggled')
    }

    createMusicToggle() {
        this.musicToggle = this.add.text(10, this.config.height - 10, this.musicLabel(), { ...this.config.text, fontSize: '20px' })
            .setOrigin(0, 1)
            .setDepth(100)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.musicToggle.setStyle({ fill: this.config.text.hover }))
            .on('pointerout', () => this.musicToggle.setStyle({ fill: this.config.text.fill }))
            .on('pointerup', () => this.toggleMusic())

        const onToggle = () => this.musicToggle && this.musicToggle.setText(this.musicLabel())
        this.game.events.on('music-toggled', onToggle)
        this.events.once('shutdown', () => this.game.events.off('music-toggled', onToggle))
    }

    createMenu(menu, addEventListeners) {
        let gap = 0;
        menu.forEach((item) => {
            const position = [
                ...this.screenCenter
            ]
            item.textGO = this.add.text(position[0], position[1] + gap, item.text, this.config.text).setOrigin(0.5, 1);
            gap += this.lineHeight;
            addEventListeners(item)
        })
    }

    createBackButton() {
        const backButton = this.add.text(10, 10, 'Back', { ...this.config.text, fontSize: '24px' })
            .setOrigin(0)
            .setInteractive({
                useHandCursor: true
            })
            .on('pointerover', () => {
                backButton.setStyle({ fill: this.config.text.hover })
            })
            .on('pointerout', () => {
                backButton.setStyle({ fill: this.config.text.fill })
            })
            .on('pointerup', () => {
                this.scene.start('MenuScene')
            })
    }
}

export default BaseScene