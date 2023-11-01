/// <reference path="../types/index.d.ts" />

class GameScene extends Phaser.Scene {
    constructor(title) {
        super(title);
    }

    init() {
        this.stats = {
            health: 100,
            fun: 100
        };

        this.statsDecay = {
            health: -5,
            fun: -2
        };

        this.selectedItem = null;

        this.uiBlocked = false;
    }

    create() {
        this.bg = this.add.sprite(0, 0, 'background').setInteractive();
        this.bg.setOrigin(0, 0);
        this.bg.on('pointerdown', (pointer) => this.placeItem(pointer));

        this.pet = this.add.sprite(40, 220, 'pet', 0).setInteractive();
        this.pet.setDepth(1);
        this.input.setDraggable(this.pet);

        this.anims.create({
            key: 'eat',
            duration: 500,
            frames: this.anims.generateFrameNames('pet', { frames: [ 1, 2, 3 ] }),
            frameRate: 7,
            yoyo: true
        });
        
        this.input.on('drag', (pointer, gameObj, dragX, dragY) => {
            gameObj.x = dragX;
            gameObj.y = dragY;
        });

        this.createUi();

        this.healthText = this.add.text(20, 20, `Health: ${this.stats.health}`, {
            font: '24px Arial'
        });
        this.funText = this.add.text(180, 20, `Fun: ${this.stats.fun}`, {
            font: '24px Arial'
        });

        this.statsDecayEvent = this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                this.updateStats(this.statsDecay);
            }
        });
    }

    createUi() {
        this.candyBtn = this.add.sprite(72, 600, 'candy').setInteractive();
        this.candyBtn.setData('stats', { health: -20, fun: 10 });
        this.candyBtn.on('pointerdown', () => this.pickItem(this.candyBtn));

        this.appleBtn = this.add.sprite(144, 600, 'apple').setInteractive();
        this.appleBtn.setData('stats', { health: 20, fun: 0 });
        this.appleBtn.on('pointerdown', () => this.pickItem(this.appleBtn));

        this.duckBtn = this.add.sprite(216, 600, 'duck').setInteractive();
        this.duckBtn.setData('stats', { health: 20, fun: 10 });
        this.duckBtn.on('pointerdown', () => this.pickItem(this.duckBtn));

        this.rotateBtn = this.add.sprite(288, 600, 'rotate').setInteractive();
        this.rotateBtn.setData('stats', { health: 0, fun: 20 });
        this.rotateBtn.on('pointerdown', () => this.rotatePet(this.rotateBtn));
    }

    resetUi() {
        this.selectedItem = null;

        this.candyBtn.alpha = 1;
        this.appleBtn.alpha = 1;
        this.duckBtn.alpha = 1;
        this.rotateBtn.alpha = 1;
    }

    pickItem(item) {
        if (this.uiBlocked) {
            return;
        }

        this.resetUi();

        this.selectedItem = item;
        item.alpha = 0.5;
    }

    placeItem(pointer) {
        if (!this.selectedItem || this.uiBlocked) {
            return;
        }

        this.uiBlocked = true;

        const newItem = this.add.sprite(pointer.worldX, pointer.worldY,
             this.selectedItem.texture.key);

        this.tweens.add({
            targets: this.pet,
            duration: 500,
            x: newItem.x,
            y: newItem.y,
            onComplete: () => {
                this.updateStats(this.selectedItem.getData('stats'));

                this.pet.on('animationcomplete', () => {
                    newItem.destroy();
                    this.resetUi();
                    this.uiBlocked = false;
                });

                this.pet.play('eat');
            }
        });
    }

    rotatePet(item) {
        if (this.uiBlocked) {
            return;
        }

        this.resetUi();
        this.rotateBtn.alpha = 0.5;
        this.uiBlocked = true;

        this.tweens.add({
            targets: this.pet,
            duration: 600,
            angle: 360,
            onComplete: () => {
                this.updateStats(this.rotateBtn.getData('stats'));
                this.resetUi();
                this.uiBlocked = false;
            }
        });
    }

    updateStats(stats) {
        this.stats.health += stats.health;
        this.stats.fun += stats.fun;

        if (this.stats.health <= 0 || this.stats.fun <= 0) {
            this.stats.health = 0;
            this.stats.fun = 0;
            this.gameOver();
        }
        
        this.healthText.setText(`Health: ${this.stats.health}`);
        this.funText.setText(`Fun: ${this.stats.fun}`);
    }

    gameOver() {
        this.resetUi();
        this.uiBlocked = true;
        this.pet.setFrame(4);
        this.statsDecayEvent.destroy();

        this.time.addEvent({
            delay: 2000,
            repeat: 0,
            callback: () => this.scene.start('home')
        });
    }
}