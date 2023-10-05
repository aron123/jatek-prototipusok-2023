/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    constructor(title) {
        super(title);
    }

    init () {
        this.words = [
            {
                key: 'building',
                spanish: 'edificio',
                setXY: {
                    x: 80,
                    y: 250
                }
            },
            {
                key: 'car',
                spanish: 'auto',
                setXY: {
                    x: 240,
                    y: 300
                },
                setScale: {
                    x: 0.8,
                    y: 0.8
                }
            },
            {
                key: 'house',
                spanish: 'casa',
                setXY: {
                    x: 400,
                    y: 275
                },
                setScale: {
                    x: 0.8,
                    y: 0.8
                }
            },
            {
                key: 'tree',
                spanish: 'arbol',
                setXY: {
                    x: 550,
                    y: 240
                }
            }
        ];
    }

    preload() {
        this.load.image('background', 'assets/img/background-city.png');
        this.load.image('building', 'assets/img/building.png');
        this.load.image('car', 'assets/img/car.png');
        this.load.image('house', 'assets/img/house.png');
        this.load.image('tree', 'assets/img/tree.png');

        this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
        this.load.audio('carAudio', 'assets/audio/auto.mp3');
        this.load.audio('houseAudio', 'assets/audio/casa.mp3');
        this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
        
        this.load.audio('correctAudio', 'assets/audio/correct.mp3');
        this.load.audio('wrongAudio', 'assets/audio/wrong.mp3');
    }

    create() {
        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);

        this.correctAudio = this.sound.add('correctAudio');
        this.wrongAudio = this.sound.add('wrongAudio');

        this.wordText = this.add.text(40, 40, '', {
            font: '28px Arial',
            color: 'yellow'
        });

        this.items = this.add.group(this.words);

        Phaser.Actions.Call(this.items.getChildren(), (item) => {
            item.setInteractive();

            item.setData('audio', this.sound.add(item.texture.key + 'Audio'));
            const index = this.items.getChildren().indexOf(item);
            item.setData('spanish', this.words[index].spanish);

            const alphaTween = this.tweens.add({
                targets: item,
                alpha: 0.7,
                duration: 200,
                paused: true,
                persist: true
            });

            const correctTween = this.tweens.add({
                targets: item,
                scale: 1.5,
                duration: 300,
                ease: 'Quint.easeInOut',
                yoyo: true,
                paused: true,
                persist: true
            });

            const wrongTween = this.tweens.add({
                targets: item,
                scale: 1.5,
                angle: 90,
                duration: 300,
                ease: 'Quint.easeInOut',
                yoyo: true,
                paused: true,
                persist: true
            });

            item.on('pointerdown', () => {
                const isCorrect = this.processAnswer(item.getData('spanish'));

                if (isCorrect) {
                    correctTween.play();
                    this.showNext();
                } else {
                    wrongTween.play();
                }
            });

            item.on('pointerover', () => {
                alphaTween.play();
            });

            item.on('pointerout', () => {
                alphaTween.pause();
                alphaTween.reset();
                item.alpha = 1;
            });
        });

        this.showNext();
    }

    showNext() {
        this.currentWord = Phaser.Math.RND.pick(this.items.getChildren());
        
        const audio = this.currentWord.getData('audio');
        audio.play();

        this.wordText.setText(this.currentWord.getData('spanish'));
    }

    processAnswer(userResponse) {
        const correctAnswer = this.currentWord.getData('spanish');

        if (userResponse == correctAnswer) {
            this.correctAudio.play();
            return true;
        } else {
            this.wrongAudio.play();
            return false;
        }
    }
}

const gameScene = new GameScene('game');

const game = new Phaser.Game({
    width: 640,
    height: 360,
    type: Phaser.AUTO,
    scene: gameScene
});
