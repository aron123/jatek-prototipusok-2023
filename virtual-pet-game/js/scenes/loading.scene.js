/// <reference path="../types/index.d.ts" />

class LoadingScene extends Phaser.Scene {
    constructor(title) {
        super(title);
    }

    preload() {
        this.load.image('apple', 'assets/apple.png');
        this.load.image('background', 'assets/backyard.png');
        this.load.image('candy', 'assets/candy.png');
        this.load.image('duck', 'assets/rubber_duck.png');
        this.load.image('rotate', 'assets/rotate.png');

        this.load.spritesheet('pet', 'assets/pet.png', {
            frameWidth: 97,
            frameHeight: 83,
            margin: 1,
            spacing: 1
        });

        const bg = this.add.rectangle(
            0, 0,
            this.sys.game.config.width,
            this.sys.game.config.height,
            0xffffff
        );
        bg.setOrigin(0, 0);

        const bgBar = this.add.rectangle(
            0, 0, 200, 40, 0x000000, 0.1
        );
        Phaser.Display.Align.In.Center(bgBar, bg);

        const progressBar = this.add.rectangle(
            0, 0, 0, 40, 0x2255ff
        );
        Phaser.Display.Align.In.TopLeft(progressBar, bgBar);

        this.load.on('progress', (percentage) => {
            progressBar.setSize(percentage * 200, progressBar.height);
            Phaser.Display.Align.In.TopLeft(progressBar, bgBar);
        });
    }

    create() {
        this.scene.start('home');
    }
}