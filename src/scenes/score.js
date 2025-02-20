import BaseScene from './base'

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', { ...config, canGoBack: true })
    }
    create() {
        super.create()
        const bestScore = localStorage.getItem('bestScore') || '0'
        this.add.text(this.config.width / 2, this.config.height / 2, `Best Score: ${bestScore}`, { ...this.config.text, fill: '#000' }).setOrigin(0.5)
    }
}

export default ScoreScene;