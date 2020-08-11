//A standalone scene in a ruined castle
class Scene3 extends Phaser.Scene {
    constructor() {
        super("level_three");
    }

    preload() {
        
        //tiled map
        //run this command for new tilesheets
        //tile-extruder --tileWidth 8 --tileHeight 8 --input .\souls_tileset.png --output .\souls_tileset_extruded.pngq

        this.load.image('sky_day', 'assets/tiled_map/Szadi/background_night1.png');
        this.load.image('sky_day_2', 'assets/tiled_map/Szadi/background_night2.png');
        this.load.image('sky_day_3', 'assets/tiled_map/Szadi/background_night3.png');

        this.load.image('mainlevbuild_A', 'assets/tiled_map/Szadi/mainlevbuild_A.png');
        this.load.image('mainlevbuild_B', 'assets/tiled_map/Szadi/mainlevbuild_B.png');
        this.load.image('decorative', 'assets/tiled_map/Szadi/decorative.png');
        //this.load.image('souls_tileset_extruded', 'assets/tiled_map/souls_tileset_extruded.png');
        
        this.load.tilemapTiledJSON('RuinedCity_02', 'assets/tiled_map/Szadi/RuinedCity_02.json');

        this.level_width = 1920;
        this.level_height = 960;
    }

    create() {
        //set up keyboard
        this.setUpKeyboard();

        //fixed world objects
        this.platforms = this.physics.add.staticGroup();


        //set up sky and parallax
        this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky_day');
        this.sky.setOrigin(0, 0);
        this.sky.setScrollFactor(0);
        this.sky2 = this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky_day_2');
        this.sky2.setOrigin(0, 0);
        this.sky2.setScrollFactor(0);
        this.sky3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky_day_3');
        this.sky3.setOrigin(0,0);
        this.sky3.setScrollFactor(0);

        //set up tile map
        const map = this.make.tilemap( { key: 'RuinedCity_02' });
        //const tileset = map.addTilesetImage('souls_tileset_extruded');
        const tilesetA = map.addTilesetImage('mainlevbuild_A');
        const tilesetB = map.addTilesetImage('mainlevbuild_B');
        const tilesetDec = map.addTilesetImage('decorative');

        //layers
        //const platform_layer = map.createStaticLayer('platforms', tileset, 0, 0);
        const background_layer = map.createStaticLayer('background', [tilesetA, tilesetB], 0 ,0);
        const platform_layer = map.createStaticLayer('platforms', [tilesetA, tilesetB], 0, 0);
        const decorative_layer = map.createStaticLayer('decorative', [tilesetDec], 0, 0);
        const foreground_layer = map.createStaticLayer('foreground', [tilesetA, tilesetB], 0, 0);
        foreground_layer.setDepth(2);
        platform_layer.setCollisionByExclusion(-1, true); //look at other collision methods

        //player
        this.setUpPlayer();

        //set up NPCs
        this.setUpNPCs();


        //set up collisions
        this.physics.add.collider(this.player, this.platforms);

        /*TODO 
        Add loops to register collisions between all skeletons
        */
        //this.physics.add.collider(this.skeleton, this.skeleton2);
        for (let i = 0; i < this.skeletonGroup.getLength(); i++) {
            this.physics.add.collider(this.platforms, this.skeletonGroup.getChildren()[i]);
            this.physics.add.collider(platform_layer, this.skeletonGroup.getChildren()[i]);
        }
        this.physics.add.collider(this.player, platform_layer);
        this.gateCollider = this.physics.add.collider(this.player, this.gate);


        //camera
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, this.level_width, this.level_height); //this is size of tiled map
        this.cam.setViewport(0,0, game.config.width, game.config.height);
        this.cam.startFollow(this.player);
        this.cam.fadeIn(2000);

    }

    update() {
        //update player movement
        this.playerInput();

        //update behavior of skeletons
        for (let i = 0; i < this.skeletonGroup.getLength(); i++) {
            this.skeletonBehavior(this.skeletonGroup.getChildren()[i]);
        }

    }

    //Player character affected by keyboard input
    playerInput() {
        let playerVelocity_Y = this.player.body.velocity.y;
        let playerPosition_X = this.player.body.x;

        if (playerPosition_X >= this.level_width) {
            console.log("end of level"); 
            this.scene.start("level_three");  //when reaching end of screen, start the level over
        }

        if (this.player.isBlocking() && this.player.status.jump == 2) {
            this.player.setVelocityX(0);
        }

        //reset double jump if player is on ground
        if (this.player.body.blocked.down) {
            this.player.status.jump = 2;   //2 jumps means player can double jump         
        }
        //attack
        if (Phaser.Input.Keyboard.JustDown(this.atk_btn) && !this.player.isAttacking()) {
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
        //block -- note there is one check above and one check below for whether player is blocking
        } else if (this.block_key.isDown) {
            this.player.block();
        } 

        //check if block key was released
        if (!this.block_key.isDown) {
            this.player.setBlocking(false);
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
            if (this.cursors.up.isDown && (playerVelocity_Y >= -100 && playerVelocity_Y <= 100)) {
                if (this.player.status.jump > 0) {
                    this.player.status.jump--;
                    this.player.setVelocityY(-this.player.attributes.speed * 2); //this is the jump
                    this.player.anims.play('HeroKnight_Jump', true);
                }
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

    //skeleton AI behavior
    skeletonBehavior(skeleton) {

        //if skeleton is dead:
        if (!skeleton.isAlive()) {
            skeleton.setVelocityX(0); //stop dead or dying skeleton from moving
            //approach player if skeleton isn't attacking or isn't dead
        } else if (skeleton.status.stunned) {
            //skeleton stays stunned
        } else if (!skeleton.isAttacking()) {

            let playerPosition_X = this.player.body.x;
            let skeletonPosition_X = skeleton.body.x;
            let distToPlayerX = Math.abs(playerPosition_X - skeletonPosition_X);
            let distToPlayerY = Math.abs(this.player.body.y - skeleton.body.y);

            //skeleton in sight of player
            if (distToPlayerX < 300 && distToPlayerX > 70) {
                skeleton.anims.play('Skeleton_Walk', true);
                //player is to the left of skeleton
                if (playerPosition_X <= skeletonPosition_X) {
                    skeleton.setVelocityX(-25);
                    skeleton.flipX = true;
                    skeleton.setDirection('left');
                } else { //player is to right of skeleton
                    skeleton.setVelocityX(25);
                    skeleton.flipX = false;
                    skeleton.setDirection('right');
                }
            //skeleton in attack range of player
            //ATTACK PLAYER
            //console.log(this.skeleton.status.stunned);
            console.log("stunned: " + skeleton.status.stunned);
            } else if (distToPlayerX <= 80 && distToPlayerY < 50 && !skeleton.status.stunned) {
                this.skeletonFacePlayer(skeleton);
                skeleton.setVelocityX(0);
                skeleton.skeletonAttack();
                this.delayAttack(skeleton, 600);
            //skeleton out of range of player
            } else {
                skeleton.setVelocityX(0);
                skeleton.anims.play('Skeleton_Idle', true);
                this.skeletonFacePlayer(skeleton);
            }
        }
    }

    //enemy attack
    //skeleton is the enemy attacking
    //delay is the number of ms before attack box appears after attack animation begins.
    delayAttack(skeleton, delay) {
        setTimeout(() => {
            this.enemyAttackEffect(skeleton);
        }, delay);
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
            //x: 50,
            //y: 320
            x: 600,
            y: 920
        });
    }

    //instantiate the NPCs 
    setUpNPCs() {

        this.skeletonGroup = this.add.group();
        this.physics.world.enable(this.skeletonGroup);
        this.createNewSkeleton(200, 920);
       // this.createNewSkeleton(400, 920);
        this.createNewSkeleton(1200, 520);
        this.createNewSkeleton(1400, 520);
        this.createNewSkeleton(1450, 520);
        this.createNewSkeleton(1300, 520);
    }

    createNewSkeleton(xcoord, ycoord) {
        this.skeleton = new Skeleton({
            scene: this,
            key: 'skeleton',
            x: xcoord,
            y: ycoord,
            direction: 'left',
            sizeX: 20,
            sizeY: 60,
            scale: 1
        });

        this.skeletonGroup.add(this.skeleton);
    }

    //set up background tile sprites and objects other than actors
    setUpBackground() {
        this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'sky');
        this.sky.setOrigin(0, 0);
        this.sky.setScrollFactor(0);
        this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background');
        this.bg_1.setOrigin(0, 0);
        this.bg_1.setScrollFactor(1);
        this.bg_2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'midground');
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

    playerBlockEffect() {
        var x_mod = 0;
        if (this.player.getStatus().direction == 'left') {
            x_mod = -15;
        }

        this.block_effect = new Block_Flash({
            scene: this,
            key: 'block_flash',
            x: this.player.x - 15 + x_mod, // (15 * x_mod),
            y: this.player.y - 35
        });

        this.block_effect.visible = true;
        this.block_effect.blockSuccess();
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
            x: (this.player.x + 20 * x_mod),
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
            x: (enemy.x + 20 * x_mod),
            y: enemy.y,
            persistFor: 200
        });

        //if attack landed, do something to the player
        this.physics.add.overlap(this.enemy_atk_effect, this.player, this.playerHitByAttack(this, enemy));
    }

    playerHitByAttack(x, enemy) {
        
        if (!this.player.status.blocking) {
            //player hit
        } else {
            enemy.skeletonStunned();
            this.playerBlockEffect();
            this.player.status.blocking = false;
        }
    }

    setUpKeyboard() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jump_btn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.atk_btn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.block_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.w_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.f_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

}

/*  GRAVEYARD

    this.physics.add.collider(this.gate, this.skeletonGroup.getChildren()[i]);

    setUpObjectAnimations() {
        createGateObject();
    }

    
    openDoor(input, scene) {
        return function() {
            if (input == 'switch1') {
                if (!scene.gate.open) {
                    scene.gate.openGate();
                    scene.gate.body.enable = false;
                }
            }
        }
    
    }


    setUpObjectAnimations() {
        this.gate = new Gate({
            scene: this,
            key: 'gate',
            x: 136,
            y: 96
        });
    }

        test(scene) {
        //console.log('open door!');
        scene.gate.openGate();
    }
*/