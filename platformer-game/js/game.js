/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    constructor(title) {
        super(title);
    }

    init() {
        this.playerSpeed = 100;
        this.jumpSpeed = -600;
    }

    preload() {
        this.load.image('barrel', 'assets/barrel.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('gorilla', 'assets/gorilla3.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform', 'assets/platform.png');

        this.load.spritesheet('fire', 'assets/fire_spritesheet.png', {
            frameWidth: 20,
            frameHeight: 21,
            margin: 1,
            spacing: 1
        });
        
        this.load.spritesheet('player', 'assets/player_spritesheet.png', {
            frameWidth: 28,
            frameHeight: 30,
            margin: 1,
            spacing: 1
        });
    }

    create() {
        const platforms = this.add.group();

        const ground = this.physics.add.staticSprite(180, 600, 'ground');
        platforms.add(ground);

        const platform = this.add.tileSprite(180, 450, 4 * 36, 30, 'block');
        this.physics.add.existing(platform, true);
        platforms.add(platform);

        this.player = this.physics.add.sprite(180, 500, 'player');
        this.player.setFrame(3);
        this.player.body.setCollideWorldBounds(true);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', { frames: [ 0, 1, 2 ] }),
            yoyo: true,
            frameRate: 12,
            repeat: -1
        });

        this.physics.add.collider(this.player, platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const onGround = this.player.body.blocked.down;

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(false);

            if (!this.player.anims.isPlaying && onGround) {
                this.player.anims.play('walk');
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.setFlipX(true);

            if (!this.player.anims.isPlaying && onGround) {
                this.player.anims.play('walk');
            }
        }
        else {
            this.player.body.setVelocityX(0);
            this.player.anims.stop('walk');

            if (onGround) {
                this.player.setFrame(3);
            }
        }

        if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
            this.player.setVelocityY(this.jumpSpeed);
            this.player.setFrame(2);
        }
    }
}

const gameScene = new GameScene('game');

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 1000
            }
        }
    }
});