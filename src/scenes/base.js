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
        if (this.config.canGoBack) {
            this.createBackButton()
        }
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