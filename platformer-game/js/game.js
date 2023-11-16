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

        this.load.json('levelData', 'assets/level.json');
    }

    create() {
        this.platforms = this.add.group();
        this.fires = this.add.group();
        this.barrels = this.physics.add.group({
            collideWorldBounds: true,
            bounceY: 0.1,
            bounceX: 1
        });

        this.levelData = this.cache.json.get('levelData');

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', { frames: [0, 1, 2] }),
            yoyo: true,
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'burn',
            frames: this.anims.generateFrameNames('fire', { frames: [0, 1] }),
            frameRate: 4,
            repeat: -1
        });
        
        this.setupLevel();

        this.physics.add.collider([this.player, this.enemy, this.barrels], this.platforms);
        this.physics.add.overlap([this.fires, this.enemy, this.barrels], this.player,
            () => this.restartGame());

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

    setupLevel() {
        // const platforms = this.levelData.platforms
        const { platforms } = this.levelData; 

        for (const platform of platforms) {
            let platformSprite;

            if (platform.tileCount == 1) {
                platformSprite = this.add.sprite(platform.x, platform.y,
                    platform.texture);
            } else {
                const width = this.textures.get(platform.texture).get(0).width;
                const height = this.textures.get(platform.texture).get(0).height;
                platformSprite = this.add.tileSprite(platform.x, platform.y,
                    platform.tileCount * width, height, platform.texture);
            }

            platformSprite.setOrigin(0, 0);
            this.physics.add.existing(platformSprite, true);
            this.platforms.add(platformSprite);
        }

        const { player } = this.levelData; 
        this.player = this.physics.add.sprite(player.x, player.y, 'player');
        this.player.setFrame(3);
        this.player.body.setCollideWorldBounds(true);

        const { enemy } = this.levelData; 
        this.enemy = this.physics.add.sprite(enemy.x, enemy.y, 'gorilla');
        this.enemy.body.setCollideWorldBounds(true);

        const { fires } = this.levelData;
        for (const fire of fires) {
            const fireSprite = this.add.sprite(fire.x, fire.y, 'fire');
            fireSprite.setOrigin(0, 0);
            fireSprite.anims.play('burn');

            this.physics.add.existing(fireSprite, true);
            this.fires.add(fireSprite);
        }

        const { spawner } = this.levelData;
        this.time.addEvent({
            delay: spawner.interval,
            repeat: -1,
            callback: () => {
                const barrel = this.add.sprite(this.enemy.x, this.enemy.y, 'barrel');
                this.physics.add.existing(barrel);
                this.barrels.add(barrel);
                barrel.body.setVelocityX(spawner.speed);

                this.time.addEvent({
                    delay: spawner.lifespan,
                    repeat: 0,
                    callback: () => barrel.destroy()
                });
            }
        });
    }

    restartGame() {
        this.cameras.main.fade(500);
        this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.restart();
        });
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