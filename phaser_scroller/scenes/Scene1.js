class Scene1 extends Phaser.Scene {
    constructor() {
        super("level_one");
    }

    create() {
        this.add.text(20, 20, "Level One");

        //set up keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeys({ 'E': Phaser.Input.Keyboard.KeyCodes.E });
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.q_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.e_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


        //fixed world objects
        this.platforms = this.physics.add.staticGroup();

        //background - parallax
        this.setUpBackground();

        //player
        this.setUpPlayer();

        //effects

        //set up NPCs
        this.setUpNPCs();

        //collisons
        this.physics.add.collider(this.player, this.platforms);

        for (let i = 0; i < this.skeletonGroup.getLength(); i++) {
            this.physics.add.collider(this.platforms, this.skeletonGroup.getChildren()[i]);
            
            //collider between player and skeletons currently disabled:
            //this.physics.add.collider(this.player, this.skeletonGroup.getChildren()[i]);
        }

        /*TODO 
        Add loops to register collisions between all skeletons
        */
        //this.physics.add.collider(this.skeleton, this.skeleton2);


        //camera
        this.cam = this.cameras.main;
        this.cam.flash(2000);

    }

    update() {

        //update player based on user input
        this.playerInput();

        //update behavior of skeletons
        for (let i = 0; i < this.skeletonGroup.getLength(); i++) {
            this.skeletonBehavior(this.skeletonGroup.getChildren()[i]);
        }

        this.parallaxUpdate();
    }

    //Player character affected by keyboard input
    playerInput() {
        let playerVelocity_Y = this.player.body.velocity.y;
        let playerPosition_X = this.player.body.x;

        if (playerPosition_X >= game.config.width - 50) {
            console.log("end of level"); 
            //this.scene.start("level_one");  //when reaching end of screen, start the level over
        }

        if (this.player.body.touching.down) {
            this.player.status.jump = 2;            
        }

        //attack
        if (Phaser.Input.Keyboard.JustDown(this.q_key) && !this.player.isAttacking()) {
            this.player.attack();
            this.playerAttackEffect();

            //roll
        } else if (Phaser.Input.Keyboard.JustDown(this.down_key) && !this.player.isRolling()) {
            if (this.player.status.direction == 'right') {
                this.player.setVelocityX(this.player.attributes.speed + 100);
            } else {
                this.player.setVelocityX(-this.player.attributes.speed - 100);
            }

            this.player.roll();

            //block 
        } else if (Phaser.Input.Keyboard.JustDown(this.e_key)) {
            if (this.player.body.touching.down) {
                this.player.setVelocityX(0);
            }
            this.player.block();
        }

        //NOT ATTACKING, NOT ROLLING, NOT BLOCKING
        if (!this.player.isAttacking() && !this.player.isRolling() && !this.player.isBlocking()) {
            //run left
            if (this.cursors.left.isDown) {
                this.player.setDirection('left');
                this.player.setVelocityX(-this.player.attributes.speed);
                this.player.flipX = true;
                this.player.anims.play('HeroKnight_Run', true);
                //run right
            } else if (this.cursors.right.isDown) {
                this.player.setDirection('right');
                this.player.setVelocityX(this.player.attributes.speed);
                this.player.flipX = false;
                this.player.play("HeroKnight_Run", true);
                //idle
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('HeroKnight_Idle', true);
            }

            //jump
            if (this.cursors.up.isDown && (playerVelocity_Y >= -30 && playerVelocity_Y <= 30)) {
                if (this.player.status.jump > 0) {
                    this.player.status.jump--;
                    this.player.setVelocityY(-this.player.attributes.speed - 100); //this is the jump
                    this.player.anims.play('HeroKnight_Jump', true);
                }
            }

            //travelling up through air
            if (this.player.body.velocity.y < -1) {
                this.player.anims.play('HeroKnight_Jump', true);
                //falling animation and reset player jump count
            } else if (this.player.body.velocity.y > 50) {
                this.player.anims.play('HeroKnight_Fall');
                //this.player.status.jump = 2;              
            }
        }
    }

    //skeleton AI behavior
    skeletonBehavior(skeleton) {


        //if skeleton is dead:
        if (!skeleton.isAlive()) {
            skeleton.setVelocityX(0); //stop dead or dying skeleton from moving
            //approach player if skeleton isn't attacking or isn't dead
        } else if (!skeleton.isAttacking()) {

            let playerPosition_X = this.player.body.x;
            let skeletonPosition_X = skeleton.body.x;
            let distToPlayer = Math.abs(playerPosition_X - skeletonPosition_X);

            //skeleton in sight of player
            if (distToPlayer < 300 && distToPlayer > 100) {
                skeleton.anims.play('Skeleton_Walk', true);
                //player is to the left of skeleton
                if (playerPosition_X <= skeletonPosition_X) {
                    skeleton.setVelocityX(-50);
                    skeleton.flipX = true;
                    skeleton.setDirection('left');
                } else { //player is to right of skeleton
                    skeleton.setVelocityX(50);
                    skeleton.flipX = false;
                    skeleton.setDirection('right');
                }
            //skeleton in attack range of player
            //ATTACK PLAYER
            } else if (distToPlayer <= 100) {
                this.skeletonFacePlayer(skeleton);
                skeleton.setVelocityX(0);
                skeleton.skeletonAttack();
                this.enemyAttackEffect(skeleton);
                //this.time.addEvent({ delay: 200, callback: this.destroyEnemyAtkBox, callbackScope: this, loop: false });
            //skeleton out of range of player
            } else {
                skeleton.setVelocityX(0);
                skeleton.anims.play('Skeleton_Idle', true);
                this.skeletonFacePlayer(skeleton);
            }
        }
    }

    skeletonFacePlayer(skeleton) {

        let playerPosition_X = this.player.body.x;
        let skeletonPosition_X = skeleton.body.x;

        if (playerPosition_X <= skeletonPosition_X) {
            skeleton.flipX = true;
            skeleton.setDirection('left');
        } else { //player is to right of skeleton
            skeleton.flipX = false;
            skeleton.setDirection('right');
        }
    }


    //instantiate the player character
    setUpPlayer() {
        this.player = new Knight({
            scene: this,
            key: 'player',
            x: 250,
            y: 380
        });
    }

    //instantiate the NPCs 
    setUpNPCs() {

        this.skeletonGroup = this.add.group();
        this.physics.world.enable(this.skeletonGroup);

        for (let i = 0; i < 4; i++) {
            this.skeleton = new Skeleton({
                scene: this,
                key: 'skeleton',
                x: (i * 100 + 800),
                y: 350,
                direction: 'left',
                sizeX: 20,
                sizeY: 60,
                scale: 2
            });
            this.skeletonGroup.add(this.skeleton);
        }
    }

    //set up background tile sprites and objects other than actors
    setUpBackground() {
        this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky');
        this.sky.setOrigin(0, 0);
        this.sky.setScrollFactor(0);
        this.bg_1 = this.add.tileSprite(0, 0, game.config.width , game.config.height, 'background');
        this.bg_1.setOrigin(0, 0);
        this.bg_1.setScrollFactor(1);
        this.bg_2 = this.add.tileSprite(0, 0, game.config.width , game.config.height, 'midground');
        this.bg_2.setOrigin(0, 0);
        this.bg_2.setScrollFactor(1);

        //ground
        this.ground = this.add.tileSprite(0, game.config.height - 100, game.config.width * 2, 100, 'forest_ground');
        this.ground.setOrigin(0, 0);
        this.platforms.add(this.ground);

        //tree
        this.tree1 = this.add.image(300, game.config.height - 650, 'tree01'); //game.config.height - 650
        this.tree1.setOrigin(0, 0);
        this.tree1.setScale(1.5);

        //bushes
        this.bush1 = this.add.image(600, game.config.height - 125, 'forest_bush');
        this.bush1.setOrigin(0, 0);
        this.bush1.setDepth(1.5);
        this.bush2 = this.add.image(300, game.config.height - 125, 'forest_bush');
        this.bush2.setOrigin(0, 0);
        this.bush2.setDepth(1);
    }

    //set far background and mid-background to slowly move as player moves
    parallaxUpdate() {
        this.bg_1.tilePositionX = this.player.body.x * .03; //background
        this.bg_2.tilePositionX = this.player.body.x * .06; //foreground
    }

    //A playerATtackEffect is used to determine if player attack hits enemy 
    playerAttackEffect() {

        //if player is facing left, reverse direction of attack line
        var x_mod = 1;
        if (this.player.getStatus().direction == 'left') {
            x_mod = -1;
        }
        //create a new swordattackbox
        this.atk_effect = new SwordAttackBox({
            scene: this,
            key: 'atk_effect',
            x: (this.player.x + 25 * x_mod),
            y: this.player.y,
            persistFor: 300
        });

        //Register hits for each skeleton on the screen
        for (let i = 0; i < this.skeletonGroup.getLength(); i++) {
            let skeleton = this.skeletonGroup.getChildren()[i];
            this.physics.add.overlap(this.atk_effect, skeleton, function () {
                if (skeleton.isAlive()) {
                    skeleton.skeletonDying();
                    //skeleton.skeletonHit();
                }
            });
        }
    }


    //creates a physic sprite for detecting if skeleton atk hit player character
    enemyAttackEffect(enemy) {

        //if player is facing left, reverse direction of attack line
        var x_mod = 1;
        if (enemy.getStatus().direction == 'left') {
            x_mod = -1;
        }

        //create a new swordattackbox
        this.enemy_atk_effect = new SwordAttackBox({
            scene: this,
            key: 'atk_effect',
            x: (enemy.x + 55 * x_mod),
            y: enemy.y,
            persistFor: 300
        });

        //if attack landed, do something to the player
        this.physics.add.overlap(this.enemy_atk_effect, this.player, function () {
            console.log('player hit!');
        })
    }
}

/*Graveyard

    //destroys the current player attack box
    destroyAtkBox() {
        this.atk_effect.destroy();
    }

    destroyEnemyAtkBox() {
        this.enemy_atk_effect.destroy();
    }

        //from attackeffect(enemy)
        //Remove the attack box after 400ms. Only one attack box should be present at a time.
        //this.time.addEvent({ delay: 400, callback: this.destroyEnemyAtkBox, callbackScope: this, loop: false });


*/