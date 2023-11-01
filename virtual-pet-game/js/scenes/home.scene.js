/// <reference path="../types/index.d.ts" />

class HomeScene extends Phaser.Scene {
    constructor(title) {
        super(title);
    }

    create() {
        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.setInteractive();
        bg.on('pointerdown', () => this.scene.start('game'));

        const text = this.add.text(0, 0, 'START GAME', {
            font: '48px Arial'
        });
        text.setDepth(1);
        Phaser.Display.Align.In.Center(text, bg);

        const textBg = this.add.rectangle(
            0, 0,
            text.width + 20, text.height + 20,
            0x000000, 0.5
        );
        Phaser.Display.Align.In.Center(textBg, text);
    }
}