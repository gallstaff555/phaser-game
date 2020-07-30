class Scene1 extends Phaser.Scene {
    constructor() {
        super("level_one");
    }

    create() {
        this.add.text(20, 20, "Level One");

        //set up keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        //background - parallax
        this.setUpBackground();

        //player
        this.setUpPlayer();

        //set up NPCs
        this.setUpNPCs();

        //collisons
        this.physics.add.collider(this.player, this.skeleton);

        //camera
        //this.cam = this.cameras.main.startFollow(this.player);
    }

    update() {
        this.playerInput(); 
        this.skeletonBehavior();
        this.parallaxUpdate();
    }

    playerInput() {
        let playerVelocity_Y = this.player.body.velocity.y;
        let playerPosition_X = this.player.body.x;

        if (playerPosition_X >= game.config.width - 50) {
            console.log("end of level");
        }

        //attack
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.player.isAttacking()) {
            this.player.attack();
            //this.playerAttackEffect();
        } else if (Phaser.Input.Keyboard.JustDown(this.down_key) && !this.player.isRolling()) {
            this.player.roll();
        }
        
        if (!this.player.isAttacking() && !this.player.isRolling()) {
            //run left
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-200);
                this.player.flipX = true;
                this.player.anims.play('HeroKnight_Run', true);
            //run right
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(200);
                this.player.flipX = false;
                this.player.play("HeroKnight_Run", true);
            //idle
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('HeroKnight_Idle', true);
            }

            //jump
            if (this.cursors.up.isDown && (playerVelocity_Y >= -30 && playerVelocity_Y <= 30)) {
                this.player.setVelocityY(-300);
                this.player.anims.play('HeroKnight_Jump', true);
            }

            //travelling up through air
            if (this.player.body.velocity.y < -1) {
                this.player.anims.play('HeroKnight_Jump', true);
            //falling animation
            } else if (this.player.body.velocity.y > 50) {
            this.player.anims.play('HeroKnight_Fall');
            } 
        }
    }

    skeletonBehavior() {

        let playerVelocity_Y = this.player.body.velocity.y;
        let playerPosition_X = this.player.body.x;
        let skeletonPosition_X = this.skeleton.body.x;

        //skeleton in sight of player
        var distToPlayer = Math.abs(playerPosition_X - skeletonPosition_X);
        if (distToPlayer < 300 && distToPlayer > 100) {
            this.skeleton.anims.play('Skeleton_Walk', true);
            //player is to the left of skeleton
            if (playerPosition_X <= skeletonPosition_X) {
                this.skeleton.setVelocityX(-50);
                this.skeleton.flipX = true;
            } else { //player is to right of skeleton
                this.skeleton.setVelocityX(50);
                this.skeleton.flipX = false;
            }
        //skeleton in attack range of player
        } else if (distToPlayer <= 100) {
            this.skeleton.setVelocityX(0);
            this.skeleton.anims.play('Skeleton_Attack', true);
        //skeleton out of range of player
        } else {
            this.skeleton.setVelocityX(0);
            this.skeleton.anims.play('Skeleton_Idle', true);
            if (playerPosition_X <= skeletonPosition_X) {
                this.skeleton.flipX = true;
            } else { //player is to right of skeleton
                this.skeleton.flipX = false;
            }
        }
    }

    parallaxUpdate() {
        this.bg_1.tilePositionX = this.player.body.x * .3;
        this.bg_2.tilePositionX = this.player.body.x * .6;
    }

    setUpPlayer() {

        this.player = new Character({
            scene: this,
            key: 'player',
            x: 150,
            y: 450
        });

        this.player.setScale(2);
        this.player.body.setSize(20, 50);
        this.player.setGravityY(300);
        this.player.setCollideWorldBounds(true);
        this.player.printAttributes();

    }

    setUpNPCs() {
        this.skeleton = this.physics.add.sprite(850, 150, 'skeleton').setScale(3,3);
        this.skeleton.body.setSize(20,60);
        this.skeleton.setGravityY(300);
        this.skeleton.setCollideWorldBounds(true);
    }

    setUpBackground() {
        this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky');
        this.sky.setOrigin(0, 0);
        this.sky.setScrollFactor(0);
        this.bg_1 = this.add.tileSprite(0, 0, game.config.width * 1.5, game.config.height, 'background');
        this.bg_1.setOrigin(0,0);
        this.bg_1.setScrollFactor(1);
        this.bg_2 = this.add.tileSprite(0, 0, game.config.width * 2, game.config.height, 'midground');
        this.bg_2.setOrigin(0,0);
        this.bg_2.setScrollFactor(1);
    }

    playerAttackEffect() {
        console.log('effect created');
        let atk_effect = this.add.sprite(this.player.x + 45, this.player.y, 'atk_effect');
        console.log(atk_effect.visible); 
    }
}