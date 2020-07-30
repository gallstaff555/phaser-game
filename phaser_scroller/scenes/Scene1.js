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
        this.q_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.e_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //background - parallax
        this.setUpBackground();

        //player
        this.setUpPlayer();

        //effects

        //set up NPCs
        this.setUpNPCs();

        //collisons
        for (let i = 0; i < this.skeletonGroup.getLength(); i++) {
            this.physics.add.collider(this.player, this.skeletonGroup.getChildren()[i]);
        }

        /*TODO 
        Add loops to register collisions between all skeletons
        */
        this.physics.add.collider(this.skeleton, this.skeleton2);

        //camera
        //this.cam = this.cameras.main.startFollow(this.player);
        //for (let skeleton in this.skeletonGroup.getChildren()) {
    }

    update() {
        this.playerInput(); 
        
        //update behavior of skeletons
        for (let i = 0; i < this.skeletonGroup.getLength(); i++) {
            this.skeletonBehavior(this.skeletonGroup.getChildren()[i]);
        }

        this.parallaxUpdate();
    }

    playerInput() {
        let playerVelocity_Y = this.player.body.velocity.y;
        let playerPosition_X = this.player.body.x;

        if (playerPosition_X >= game.config.width - 50) {
            console.log("end of level");
        }

        //attack
        if (Phaser.Input.Keyboard.JustDown(this.q_key) && !this.player.isAttacking()) {
            this.player.attack();
            this.playerAttackEffect();

        } else if (Phaser.Input.Keyboard.JustDown(this.down_key) && !this.player.isRolling()) {
            this.player.roll();
        }
        
        if (!this.player.isAttacking() && !this.player.isRolling()) {
            //run left
            if (this.cursors.left.isDown) {
                this.player.setDirection('left');
                this.player.setVelocityX(-200);
                this.player.flipX = true;
                this.player.anims.play('HeroKnight_Run', true);
            //run right
            } else if (this.cursors.right.isDown) {
                this.player.setDirection('right');
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

    skeletonBehavior(skeleton) {

        let playerVelocity_Y = this.player.body.velocity.y;
        let playerPosition_X = this.player.body.x;
        let skeletonPosition_X = skeleton.body.x;
        var distToPlayer = Math.abs(playerPosition_X - skeletonPosition_X);
        
        //skeleton in sight of player
        if (!skeleton.isAttacking()) {
            if (distToPlayer < 300 && distToPlayer > 100) {
                skeleton.anims.play('Skeleton_Walk', true);
                //player is to the left of skeleton
                if (playerPosition_X <= skeletonPosition_X) {
                    skeleton.setVelocityX(-50);
                    skeleton.flipX = true;
                } else { //player is to right of skeleton
                    skeleton.setVelocityX(50);
                    skeleton.flipX = false;
                }
            //skeleton in attack range of player
            } else if (distToPlayer <= 100) {
                skeleton.setVelocityX(0);
                skeleton.skeletonAttack();
                //skeleton.anims.play('Skeleton_Attack', true);
            //skeleton out of range of player
            } else {
                skeleton.setVelocityX(0);
                skeleton.anims.play('Skeleton_Idle', true);
                if (playerPosition_X <= skeletonPosition_X) {
                    skeleton.flipX = true;
                } else { //player is to right of skeleton
                    skeleton.flipX = false;
                }
            }
        }
    }

    parallaxUpdate() {
        this.bg_1.tilePositionX = this.player.body.x * .3;
        this.bg_2.tilePositionX = this.player.body.x * .6;
    }

    setUpPlayer() {

        this.player = new Knight({
            scene: this,
            key: 'player',
            x: 150,
            y: 450
        });
    }

    setUpNPCs() {

        //create from skeleton class
        this.skeleton = new Skeleton({
            scene: this,
            key: 'skeleton',
            x: 1050,
            y: 150,
            direction: 'left'
        });

        this.skeleton2 = new Skeleton({
            scene: this,
            key: 'skeleton',
            x: 850,
            y: 150,
            direction: 'left'
        });

        this.skeletonGroup = this.add.group();
        this.skeletonGroup.add(this.skeleton);
        this.skeletonGroup.add(this.skeleton2);

        this.physics.world.enable(this.skeletonGroup);
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

        //if player is facing left, reverse direction of attack line
        var x_mod = 1;
        if (this.player.getAttributes().direction == 'left') {
            x_mod = -1;
        }
        this.atk_effect = new SwordAttackBox({
            scene: this,
            key: 'atk_effect',
            x: (this.player.x + 45 * x_mod),
            y: this.player.y,
        });
        this.physics.add.overlap(this.atk_effect, this.skeleton, function() {
            console.log('hit!!');
        });
        this.time.addEvent({ delay: 400, callback: this.destroyAtkBox, callbackScope: this, loop: false });
    }

    destroyAtkBox() {
        this.atk_effect.destroy();
    }
}