//A hub level for selecting new levels
class HubScene extends Phaser.Scene {
    constructor() {
        super("hub_level");
    }

    preload() {
        
        //tiled map
        //run this command for new tilesheets
        //tile-extruder --tileWidth 16 --tileHeight 16 --input .\souls_tileset.png --output .\souls_tileset_extruded.png

        this.load.image('bg_1', 'assets/tiled_map/snowy_mountains/background1.png');
        this.load.image('bg_2', 'assets/tiled_map/snowy_mountains/background2a.png');
        this.load.image('bg_3', 'assets/tiled_map/snowy_mountains/background3.png');

        this.load.image('snowy1', 'assets/tiled_map/snowy_mountains/snowy1.png');
        this.load.image('castleA', 'assets/tiled_map/castle/castleA.png');
        this.load.image('castleB', 'assets/tiled_map/castle/castleB.png');

        
        this.load.tilemapTiledJSON('HubMap', 'assets/tiled_map/Hub/HubMap.json');

        //elevator platform
        this.load.image('elevator', 'assets/sprites/elevator.png');

        this.level_width = 960;
        this.level_height = 480;
    }

    create() {

        //set up keyboard
        this.setUpKeyboard();

        //fixed world objects
        this.platforms = this.physics.add.staticGroup();

        //set up sky and parallax
        this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg_1');
        this.sky.setOrigin(0, 0);
        this.sky.setScrollFactor(0);
        this.sky2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg_2');
        this.sky2.setOrigin(0, 0);
        this.sky2.setScrollFactor(0);
        this.sky3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg_3');
        this.sky3.setOrigin(0,0);
        this.sky3.setScrollFactor(0);

        //set up tile map
        const map = this.make.tilemap( { key: 'HubMap' });
        const tilesetA = map.addTilesetImage('castleA');
        const tilesetB = map.addTilesetImage('castleB');
        const tileset1 = map.addTilesetImage('snowy1');

        //layers
        //const platform_layer = map.createStaticLayer('platforms', tileset, 0, 0);
        const foreground_layer = map.createStaticLayer('foreground', [tileset1, tilesetA], 0, 0);
        const platform_layer = map.createStaticLayer('platforms', [tilesetA, tilesetB], 0, 0);
        const ruins_layer = map.createStaticLayer('ruins', [tilesetA, tilesetB], 0, 0);
        const tower_layer = map.createStaticLayer('tower', [tilesetA, tilesetB], 0, 0);
        const background_layer = map.createStaticLayer('background', [tilesetA, tilesetB], 0 ,0);
        foreground_layer.setDepth(6);
        platform_layer.setDepth(5);
        ruins_layer.setDepth(3);
        tower_layer.setDepth(2);
        background_layer.setDepth(1);



        //set platform layer as a collision layer
        platform_layer.setCollisionByExclusion(-1, true);

        //player
        this.setUpPlayer();
        this.player.setDepth(4);

        //set up NPCs
        this.setUpNPCs();
        this.stormMage.setDepth(1);

        //set up collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stormMage, platform_layer);
        this.physics.add.collider(this.player, platform_layer);
        this.gateCollider = this.physics.add.collider(this.player, this.gate);


        //camera
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, this.level_width, this.level_height); //this is size of tiled map
        this.cam.setViewport(0,0, game.config.width, game.config.height);
        this.cam.startFollow(this.player);
        this.cam.fadeIn(2000);

        this.underDevelopment = false;

    }

    update() {
        //update player movement
        this.playerInput();
        this.stormMageBehavior();
        this.checkUnderDevelopment(); 
    }

    //Player character affected by keyboard input
    playerInput() {
        let playerVelocity_Y = this.player.body.velocity.y;
        let playerPosition_X = this.player.body.x;

        if (playerPosition_X >= this.level_width) {
            console.log("end of level"); 
            this.scene.start("level_three");  //when reaching end of screen, start the level over
        }

        if (this.player.isBlocking() && this.player.status.jump == this.player.attributes.jumps) {
            this.player.setVelocityX(0);
        }

        //reset double jump if player is on ground
        if (this.player.body.blocked.down) {
            this.player.status.jump = this.player.attributes.jumps;   //2 jumps means player can double jump         
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

    stormMageBehavior() {
        if (this.player.body.x <= this.stormMage.body.x) {
            this.stormMage.flipX = true;
        } else {
            this.stormMage.flipX = false;
        }
        this.stormMage.anims.play("StormMage_Idle", true);
        /*if (this.player.x <= this.stormMage) {
            this.stormMage.flipX = true;
        } else {
            this.stormMage.flipX = false;
        }*/
    }

    


    //instantiate the player character
    setUpPlayer() {
        this.player = new Knight({
            scene: this,
            key: 'player',
            x: 300,
            y: 300
        });
    }

    createNewStormMage(xcoord, ycoord) {
        this.stormMage = new StormMage({
            scene: this,
            key: 'stormMage',
            x: xcoord,
            y: ycoord,
            direction: 'left',
            sizeX: 20,
            sizeY: 60,
            scale: 1
        });

        this.NPCGroup.add(this.stormMage);
    }

    //instantiate the NPCs 
    setUpNPCs() {
        this.NPCGroup = this.add.group();
        this.createNewStormMage(510, 340);
        //this.skeletonGroup = this.add.group();
        //this.physics.world.enable(this.skeletonGroup);
        //this.createNewSkeleton(200, 920);
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

    checkUnderDevelopment() {
        if (!this.underDevelopment && this.player.x < 50 || this.player.x > 800) {
            if (!this.underDevelopment) {
                this.notifyUnderDevelopment();
                setTimeout(() => {
                    this.underDevelopment = false;
                }, 6000);
            }
        }  
    }

    
    notifyUnderDevelopment() {
        this.underDevelopment = true;
        if (this.player.x < 50) {
            var myText = this.add.text(50, 280, 'Under\nDevelopment').setAlpha(0);
        } else {
            var myText = this.add.text(800, 280, 'Under\nDevelopment').setAlpha(0);
        }
        myText.setDepth(3);
        console.log('test');
        var textFadeIn = this.tweens.add({
            targets: myText,
            alpha: 1,
            duration: 2000,
            yoyo: true,
            repeat: 0
        });
    }
}