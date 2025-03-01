import BaseScene from './base';

class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.birdGravity = 600;
        this.birdFlapVelocity = 300; // gravity / 2
        this.pipesVelocity = 150;
        this.score = 0;
        this.difficulties = {
            easy: {
                threshold: 15,
                pipesVerticalGapRange: [150, 205],
                pipesHorizontalGapRange: [300, 400],
            },
            normal: {
                threshold: 30,
                pipesVerticalGapRange: [130, 185],
                pipesHorizontalGapRange: [280, 380],
            },
            hard: {
                threshold: 45,
                pipesVerticalGapRange: [110, 155],
                pipesHorizontalGapRange: [260, 360],
            },
        }
        this.currentDifficulty = this.difficulties.easy;
        this.livesCount = config.livesCount
    }

    create() {
        super.create();
        this.createBird()

        this.createPipes()
        this.createColliders()
        this.addEventListeners()
        this.createScore()
        this.createLives()
        this.isPaused = false;

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNames('bird', {
                start: 8,
                end: 15
            }),
            frameRate: 12, // 8 fps; 24 fps by default, 
            repeat: -1, // repeat infinitely
        })
        this.bird.play('fly')
    }
    update() {
        this.updateBirdState()
        this.recyclePipes()
    }

    createBackground() {
        this.add.image(400, 300, 'sky');
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.width / 10, this.config.height / 2, 'bird').setOrigin(0.5, 0.5).setScale(2.5).setFlipX(true)
        this.bird.setBodySize(this.bird.width - 2, this.bird.height - 7)
        this.bird.body.gravity.y = this.birdGravity
        this.bird.setCollideWorldBounds(true)
    }

    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < 4; i++) {
            const upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1).setImmovable(true).setScale(2).setFlipY(true)
            const lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 0).setImmovable(true).setScale(2)

            this.placePipe(upperPipe, lowerPipe)
        }

        this.pipes.setVelocityX(-this.pipesVelocity)
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.onCollide.bind(this))
    }

    onCollide() {
        this.gameOver()
    }

    addEventListeners() {
        this.input.keyboard.on('keydown-SPACE', () => {
            if (!this.isPaused) {
                this.bird.body.velocity.y = -this.birdFlapVelocity
            }
        })
        this.input.keyboard.on('keydown-ESC', () => {
            this.physics.pause()
            this.scene.pause()
            this.scene.launch('PauseScene')
            this.isPaused = true;
        })
        if (!this.resumeEvent) {
            this.resumeEvent = this.events.on('resume', () => {
                this.initialStartTime = 3;
                this.countdownText = this.add.text(...this.screenCenter, `Start in: ${this.initialStartTime}`, { ...this.config.text, fontSize: '28px' }).setOrigin(0.5)
                this.timeEvent = this.time.addEvent({
                    delay: 1000,
                    loop: true,
                    callback: () => {
                        this.initialStartTime--;
                        this.countdownText.setText(`Start in: ${this.initialStartTime}`)
                        if (this.initialStartTime === 0) {
                            this.timeEvent.remove()
                            this.physics.resume()
                            this.countdownText.setText('');
                            this.isPaused = false;
                        }
                    },
                    callbackScope: this,
                })

            })
        }
        this.events.on('shutdown', () => {
            this.livesCount = this.livesCount <= 0 ? this.config.livesCount : this.livesCount
        })
    }

    createScore() {
        this.score = 0;
        this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
            ...this.config.text,
            fill: '#000',
            fontSize: 20,
        })
        // const bs = localStorage.getItem('bestScore') || 0
        // this.bestScore = this.add.text(16, 48, `Best score: ${bs}`, {
        //     ...this.config.text,
        //     fill: '#000',
        //     fontSize: 20,
        // })
    }

    createLives() {
        this.livesText = this.add.text(this.config.width - 150, 16, `Lives: ${this.livesCount}`, {
            ...this.config.text,
            fill: '#000',
            fontSize: 20,
        })
    }

    updateScore() {
        this.score++
        this.scoreText.setText(`Score: ${this.score}`)
    }

    updateLives() {
        this.livesCount--;
        this.livesText.setText(`Lives: ${this.livesCount}`)
    }

    updateBirdState() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0) {
            this.gameOver()
        }
    }

    placePipe(uPipe, lPipe) {
        const {
            pipesVerticalGapRange,
            pipesHorizontalGapRange,
        } = this.difficulties[this.currentDifficulty]
        const rmp = this.getRightmostPipeX()
        let pipeDistanceY = Phaser.Math.Between(...pipesVerticalGapRange)
        let pipeDistanceX = Phaser.Math.Between(...pipesHorizontalGapRange)
        let pipePositionY = Phaser.Math.Between(30, this.config.height - 30 - pipeDistanceY)

        uPipe.x = rmp + pipeDistanceX
        uPipe.y = pipePositionY
        lPipe.x = uPipe.x
        lPipe.y = uPipe.y + pipeDistanceY

    }

    getRightmostPipeX() {
        let rightMostX = 0;
        this.pipes.getChildren().forEach((pipe) => {
            rightMostX = Math.max(pipe.x, rightMostX)
        });
        return rightMostX;
    }

    getLeftMostPipeX() {
        this.pipes.getChildren().sort((pipe1, pipe2) => {
            return pipe1.x - pipe2.x;
        });
        return this.pipes.getChildren()[0].x;
    }

    recyclePipes() {
        let tmp = []
        this.pipes.getChildren().forEach((pipe) => {
            if (pipe.getBounds().right <= 0) {
                tmp.push(pipe)
                if (tmp.length === 2) {
                    this.placePipe(...tmp)
                    this.updateScore()
                    this.setBestScore()
                    this.increaseDifficulty()
                }
            }
        })
    }

    increaseDifficulty() {
        if (this.score === this.difficulties.easy.threshold) {
            this.currentDifficulty = 'normal';
        } else if (this.score === this.difficulties.normal.threshold) {
            this.currentDifficulty = 'hard';
        }
    }

    setBestScore() {
        const bestScore = localStorage.getItem('bestScore') || '0'
        if (parseInt(bestScore) < this.score) {
            localStorage.setItem('bestScore', this.score)
        }
    }

    gameOver() {
        this.physics.pause()
        this.bird.setTint(0xff0000)

        this.setBestScore()

        this.time.addEvent({
            loop: false,
            delay: 1000,
            callback: () => {
                this.updateLives()
                if (this.livesCount === 0) {
                    this.scene.stop('PlayScene')
                    this.scene.start('MenuScene')
                } else {
                    this.scene.restart()
                }
            }
        })
    }
}

export default PlayScene
