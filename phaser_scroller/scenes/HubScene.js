//A hub level for selecting new levels
class HubScene extends Phaser.Scene {
    constructor() {
        super("hub_level");
    }

    //data passed from previous scene
    init(data) {
        this.level = data.level;
        this.underDevelopment = false;
        this.talkingToStormMage = false;

        this.textIcon = this.add.text(150, 150, 'Press F');
        this.textIcon.setAlpha(0);
        this.textIcon.setDepth(4);
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

        //flare
        this.load.image('flare', 'assets/effects/flare.png');


        this.load.tilemapTiledJSON('HubMap', 'assets/tiled_map/Hub/HubMap2.json');

        //elevator platform
        this.load.image('elevator', 'assets/sprites/smallElevator.png');

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
        this.sky3.setOrigin(0, 0);
        this.sky3.setScrollFactor(0);

        //set up tile map
        const map = this.make.tilemap({ key: 'HubMap' });
        const tilesetA = map.addTilesetImage('castleA');
        const tilesetB = map.addTilesetImage('castleB');
        const tileset1 = map.addTilesetImage('snowy1');

        //layers
        //const platform_layer = map.createStaticLayer('platforms', tileset, 0, 0);
        const foreground_layer = map.createStaticLayer('foreground', [tileset1, tilesetA], 0, 0);
        const platform_layer = map.createStaticLayer('platforms', [tilesetA, tilesetB], 0, 0);
        const ruins_layer = map.createStaticLayer('ruins', [tilesetA, tilesetB], 0, 0);
        const tower_layer = map.createStaticLayer('tower', [tilesetA, tilesetB], 0, 0);
        const background_layer = map.createStaticLayer('background', [tilesetA, tilesetB], 0, 0);
        foreground_layer.setDepth(6);
        platform_layer.setDepth(5);
        ruins_layer.setDepth(3);
        tower_layer.setDepth(2);
        background_layer.setDepth(1);


        //set platform layer as a collision layer
        platform_layer.setCollisionByExclusion(-1, true);

        this.setUpElevators();

        //player
        this.setUpPlayer();
        this.player.setDepth(4);

        //set up NPCs
        this.setUpNPCs();
        this.stormMage.setDepth(3);

        //set up collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stormMage, platform_layer);
        this.physics.add.collider(this.player, platform_layer);
        this.physics.add.overlap(this.player, this.stormMage);
        //this.physics.add.collider(this.player, this.elevator1);
        for (let i = 0; i < this.elevatorGroup.getLength(); i++) {
            this.physics.add.collider(this.player, this.elevatorGroup.getChildren()[i]);
        }

        //particle effects
        this.setUpDoorParticleEffect();
        //this.setUpMagePortalEmitter();

        //camera
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, this.level_width, this.level_height); //this is size of tiled map
        this.cam.setViewport(0, 0, game.config.width, game.config.height);
        this.cam.startFollow(this.player);
        this.cam.fadeIn(3000);
    }

    update() {
        //update player movement
        this.playerInput();
        this.stormMageBehavior();
        this.checkUnderDevelopment();


        //talking to Storm Mage


        this.onElevator = false;
        for (let i = 0; i < this.elevatorGroup.getLength(); i++) {
            if (this.elevatorGroup.getChildren()[i].body.touching.up) {
                this.onElevator = true;
            }
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

        if (this.player.isBlocking() && this.player.status.jump == this.player.attributes.jumps) {
            this.player.setVelocityX(0);
        }

        //reset double jump if player is on ground
        if (this.player.body.blocked.down || this.onElevator) {
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

            //jump //this.cursors.up.isDown
            if (Phaser.Input.Keyboard.JustDown(this.jump_btn) && (playerVelocity_Y >= -200 && playerVelocity_Y <= 200)) {
                if (this.player.status.jump > 0) {
                    this.player.status.jump--;
                    this.player.setVelocityY(-this.player.attributes.speed * 2); //this is the jump
                    if (!this.player.body.blocked.down) {
                        this.player.anims.play('HeroKnight_Jump', true);
                    }
                }
            }

            //travelling up through air
            if (this.player.body.velocity.y < -1 && !this.player.body.touching.down) {
                this.player.anims.play('HeroKnight_Jump', true);
                //falling animation
            } else if (this.player.body.velocity.y > 50) {
                this.player.anims.play('HeroKnight_Fall');
            }
        }
    }

    stormMageBehavior() {

        //face player
        if (this.player.body.x <= this.stormMage.body.x + (this.stormMage.body.width / 2)) {
            this.stormMage.flipX = true;
        } else {
            this.stormMage.flipX = false;
        }

        //attack animation
        if (this.stormMage.isAttacking()) {
            //play attack animation
        } else {
            this.stormMage.anims.play("StormMage_Idle", true);
        }

        //prompt player to talk to mage
        if (!this.stormMage.body.touching.none) {
            this.talkingToStormMage = true;
            this.textIcon.setAlpha(1);
        } else {
            this.talkingToStormMage = false;
            this.textIcon.setAlpha(0);
        }

        //animation when player talks to mage
        if (this.talkingToStormMage && Phaser.Input.Keyboard.JustDown(this.f_key)) {
            this.stormMage.attack();
            setTimeout( () => {
                this.setUpMagePortalEmitter();
            }, 800);

            //this.scene.launch('SelectNewScene');
        }
    }

    setUpMagePortalEmitter() {


        var portal = this.add.particles('flare');
        portal.createEmitter({
            key: 'portal',
            blendMode: 'SCREEN',
            lifespan: 1200,
            speed: { min: -20, max: 20 },
            scale: { start: 0.4, end: .2 },
            visible: true,
            quantity: 1,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Ellipse(240, 80, 40, 60),
                quantity: 16
            }
        });

        console.log(Phaser.blendMode);
        portal.setDepth(4);
    }

    //instantiate the player character
    setUpPlayer() {
        this.player = new Knight({
            scene: this,
            key: 'player',
            x: 180,
            y: 80
        });
    }

    createNewStormMage(xcoord, ycoord) {
        this.stormMage = new StormMage({
            scene: this,
            key: 'stormMage',
            x: xcoord,
            y: ycoord,
            direction: 'left',
            sizeX: 64,
            sizeY: 64,
            scale: 1
        });

        this.NPCGroup.add(this.stormMage);

        var stormMageText = this.add.text(175, 50, 'Speak with me...').setAlpha(0);
        stormMageText.setDepth(4);
        var stormMageTween = this.tweens.add({
            targets: stormMageText,
            alpha: 1,
            duration: 8000,
            yoyo: true,
            repeat: 0
        });
    }

    //instantiate the NPCs 
    setUpNPCs() {
        this.NPCGroup = this.add.group();
        this.createNewStormMage(120, 30);
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

    setUpElevators() {
        var elevator1 = new Elevator({
            scene: this,
            key: 'elevator',
            x: 300,
            y: 350,
            vel: -50
        });

        var elevator2 = new Elevator({
            scene: this,
            key: 'elevator',
            x: 450,
            y: 100,
            vel: 70
        });

        var elevator3 = new Elevator({
            scene: this,
            key: 'elevator',
            x: 750,
            y: 100,
            vel: 30
        });

        var elevator4 = new Elevator({
            scene: this,
            key: 'elevator',
            x: 280,
            y: 100,
            vel: 20
        });


        elevator1.setFriction(1, 1);
        elevator1.setVelocityY(elevator1.velocity);
        elevator2.setFriction(1, 1);
        elevator2.setVelocityX(elevator2.velocity);
        elevator3.setFriction(1, 1);
        elevator3.setVelocityY(elevator3.velocity);
        elevator4.setVelocityX(elevator4.velocity);

        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: function () {
                elevator1.body.velocity.y *= -1;
                elevator2.body.velocity.x *= -1;
            }
        })

        this.time.addEvent({
            delay: 4000,
            loop: true,
            callback: function () {
                elevator3.body.velocity.y *= -1;
                elevator4.body.velocity.x *= -1;
            }
        })

        this.elevatorGroup = this.add.group();
        this.elevatorGroup.add(elevator1);
        this.elevatorGroup.add(elevator2);
        this.elevatorGroup.add(elevator3);
        this.elevatorGroup.add(elevator4);
        this.physics.world.enable(this.elevatorGroup);

        this.elevator1 = elevator1;
    }

    setUpKeyboard() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jump_btn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.atk_btn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.block_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.w_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.f_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    checkUnderDevelopment() {
        if (!this.underDevelopment && (this.player.x < 50 || this.player.x > 870)) {
            if (!this.underDevelopment) {
                this.notifyUnderDevelopment();
                setTimeout(() => {
                    this.underDevelopment = false;
                }, 5000);
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
        var textFadeIn = this.tweens.add({
            targets: myText,
            alpha: 1,
            duration: 2000,
            yoyo: true,
            repeat: 0
        });
    }

    setUpDoorParticleEffect() {
        var particles = this.add.particles('flare');
        particles.setDepth(4);

        var leftEmitter = particles.createEmitter({
            x: 10,
            y: { min: 330, max: 400 },
            lifespan: 2000,
            speedX: { min: 20, max: 50 },
            scale: { start: 0.2, end: 0 },
            quantity: 1,
            blendMode: 'ADD'
        });

        var rightEmitter = particles.createEmitter({
            x: this.level_width - 10,
            y: { min: 330, max: 400 },
            lifespan: 2000,
            speedX: { min: -20, max: -50 },
            scale: { start: 0.2, end: 0 },
            quantity: 1,
            blendMode: 'ADD'
        });
    }
}

/*
GRAVEYARD

        /*
                var ellipse = new Phaser.Geom.Rectangle(400, 320, 40, 60);

        var portal = this.add.particles('flare');
        portal.createEmitter({
            key: 'portal',
            x: 420,
            y: 340,
            blendMode: 'ADD',
            speed: { min: 100, max: 200},
            scale: { start: 0.5, end: 0 },
            visible: true,
            quantity: 10,
            bounds: ellipse
            /*emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Ellipse(400, 240, 40, 60),
                quantity: 50
            }
    */