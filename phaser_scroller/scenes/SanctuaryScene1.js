//A starting level

class SanctuaryScene1 extends Phaser.Scene {
    constructor() {
        super("sanctuary_level_one");
    }

    //data passed from previous scene
    init(data) {
        this.level = data.level;
        this.talkingToStormMage = false;

        this.textIcon = this.add.text(480, 305, 'Press F');
        this.textIcon.setAlpha(0);
        this.textIcon.setDepth(4);

        this.level_width = 960;
        this.level_height = 640; 
    }

    preload() {

        //tiled map
        //run this command for new tilesheets
        //tile-extruder --tileWidth 16 --tileHeight 16 --input .\souls_tileset.png --output .\souls_tileset_extruded.png

        this.load.image('bg_1', 'assets/tiled_map/snowy_mountains/background1.png');
        this.load.image('bg_2', 'assets/tiled_map/snowy_mountains/background2a.png');
        this.load.image('bg_3', 'assets/tiled_map/snowy_mountains/background3.png');

        //tilesets
        this.load.image('sanctuary', 'assets/tiled_map/Sanctuary/sanctuary.png');

        //flare
        this.load.image('blue_flare', 'assets/effects/blue_flare.png');
        this.load.image('yellow_flare', 'assets/effects/yellow_flare.png');


        this.load.tilemapTiledJSON('SanctuaryMap', 'assets/tiled_map/Sanctuary/sanctuary_map.json');

       
        //elevator platform
        this.load.image('elevator', 'assets/sprites/smallElevator.png');

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
        const map = this.make.tilemap({ key: 'SanctuaryMap' });
        const sanctuary = map.addTilesetImage('sanctuary');


        //layers
        //const platform_layer = map.createStaticLayer('platforms', tileset, 0, 0);
        const foreground_layer = map.createStaticLayer('foreground', sanctuary, 0, 0);
        const platform_layer = map.createStaticLayer('platforms', sanctuary, 0, 0);
        const midground_layer = map.createStaticLayer('midground', sanctuary, 0, 0);
        const background_layer = map.createStaticLayer('background', sanctuary, 0, 0);
        foreground_layer.setDepth(6);
        platform_layer.setDepth(5);
        midground_layer.setDepth(2);
        background_layer.setDepth(1);


        //set platform layer as a collision layer
        platform_layer.setCollisionByExclusion(-1, true);

        this.setUpElevators();

        //player
        //this.setUpPlayer();
        this.player = new Knight({
            scene: this,
            key: 'player',
            x: 80,
            y: 305
        });
    
        this.player.setDepth(4);

        //set up NPCs
        this.setUpNPCs();
        this.stormMage.setDepth(3);

        //set up collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stormMage, platform_layer);
        this.physics.add.collider(this.player, platform_layer);
        this.physics.add.overlap(this.player, this.stormMage);
        this.switch_1_overlap = this.physics.add.overlap(this.player, this.elevatorSwitch1);
        this.switch_2_overlap = this.physics.add.overlap(this.player, this.elevatorSwitch2);


        //collider for player and all moving platforms
        for (let i = 0; i < this.elevatorGroup.getLength(); i++) {
            this.physics.add.collider(this.player, this.elevatorGroup.getChildren()[i]);
        }
        this.elevatorGroup.setDepth(4);

        //particle effects
        this.setUpClosedDoorParticleEffect();

        //camera
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, this.level_width, this.level_height); //this is size of tiled map
        this.cam.setViewport(0, 0, game.config.width, game.config.height);
        this.cam.startFollow(this.player);
        this.cam.fadeIn(3000);

            
        this.scene.launch('HUD');
        this.HUD = this.scene.get('HUD');
        this.HUD.displayNumber(6);
        //HUD.displayPlayerHealth(this.player.attributes.health);

    }
    
    update() {

        //this.HUD.displayPlayerHealth(this.player.attributes.health);
        this.HUD.displayPlayerHealthBar(this.player.attributes.health);

        //update player movement
        this.playerInput();
        this.stormMageBehavior();

        //event emitter for activating platform
        if (!this.elevatorSwitch1.body.touching.none) {
            this.elevatorSwitch1.emit("overlapstart1");
            this.physics.world.removeCollider(this.switch_1_overlap);
            this.elevatorSwitch1.setVisible(false);
        }

        if (!this.elevatorSwitch2.body.touching.none) {
            this.elevatorSwitch2.emit("overlapstart2");
            this.physics.world.removeCollider(this.switch_2_overlap);
            this.elevatorSwitch2.setVisible(false);
        }

        //determine if player is on elevator (used for calculating if player can jump or not)
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

                    //delete this
                    this.player.attributes.health--;

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

                var stormMageText2 = this.add.text(450, 285, 'Collect the orbs to proceed...').setAlpha(0);
                stormMageText2.setDepth(4);
                var stormMageTween2 = this.tweens.add({
                    targets: stormMageText2,
                    alpha: 1,
                    duration: 4000,
                    yoyo: true,
                    repeat: 0
        });
            }, 800);

            //this.scene.launch('SelectNewScene');
        }
    }

    setUpMagePortalEmitter() {

        var portal = this.add.particles('blue_flare');
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
                source: new Phaser.Geom.Ellipse(250, 160, 40, 60),
                quantity: 16
            }
        });
        portal.setDepth(4);
    }

    //instantiate the player character
    setUpPlayer() {
        this.player = new Knight({
            scene: this,
            key: 'player',
            x: 80,
            y: 305
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

        var stormMageText = this.add.text(450, 270, 'Speak with me...').setAlpha(0);
        stormMageText.setDepth(4);
        var stormMageTween = this.tweens.add({
            targets: stormMageText,
            alpha: 1,
            duration: 4000,
            yoyo: true,
            repeat: 0
        });
    }

    //instantiate the NPCs 
    setUpNPCs() {
        this.NPCGroup = this.add.group();
        this.createNewStormMage(480, 305);
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
            x: 550,
            y: 400,
            veloityY: 70,
            potentialSpeed: 45,
            vel: 45 
        }); 

        elevator1.setVelocityY(elevator1.velocity);

        var elevator2 = new Elevator({
            scene: this,
            key: 'elevator',
            x: 450,
            y: 165,
            potentialSpeed: 60,
            vel: 0        
        });

        //activated by first switch
        var elevator3 = new Elevator({
            scene: this,
            key: 'elevator',
            x: 780,
            y: 150,
            potentialSpeed: 40,
            vel: 0         
        });

        var elevator4 = new Elevator({
            scene: this,
            key: 'elevator',
            x: 375,
            y: 130,
            potentialSpeed: -45,
            vel: 0        
        });

        var elevatorSwitch1 = new ElevatorSwitch({
            scene: this,
            key: 'blue_flare',
            x: 220,
            y: 540
        });

        var elevatorSwitch2 = new ElevatorSwitch({
            scene: this,
            key: 'blue_flare',
            x: this.level_width - 45,
            y: 265
        });

        //emitter activates elevator3 and turns on its timed event 
        elevatorSwitch1.on("overlapstart1", () => {
            console.log("platform activated!");
            elevator3.setVelocityY(elevator3.potentialSpeed);
            var elevator_3_time = this.time.addEvent({
                delay: 7000,
                loop: true,
                callback: function () {
                    elevator3.body.velocity.y *= -1;
                }
            });
        });

        elevatorSwitch2.on("overlapstart2", () => {
            console.log("platform activated");
            elevator2.setVelocityX(elevator2.potentialSpeed);
            elevator4.setVelocityX(elevator4.potentialSpeed);
            
            var elevator_2_time = this.time.addEvent({
                delay: 3800,
                loop: true,
                callback: function () {
                    elevator2.body.velocity.x *= -1;
                }
            });

            var elevator_4_time = this.time.addEvent({
                delay: 2200,
                loop: true,
                callback: function () {
                    elevator4.body.velocity.x *= -1;
                }
            });
        });

        var elevator_1_time = this.time.addEvent({
            delay: 3800,
            loop: true,
            callback: function () {
                elevator1.body.velocity.y *= -1;
            }
        })

    
        //adding elevators to group allows them to be collision platforms
        this.elevatorGroup = this.add.group();
        this.elevatorGroup.add(elevator1);
        this.elevatorGroup.add(elevator2);
        this.elevatorGroup.add(elevator3);
        this.elevatorGroup.add(elevator4);
        this.physics.world.enable(this.elevatorGroup);

        //elevatorswitches are used globablly
        this.elevatorSwitch1 = elevatorSwitch1;
        this.elevatorSwitch2 = elevatorSwitch2;
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

    setUpClosedDoorParticleEffect() {
        var particles = this.add.particles('yellow_flare');
        particles.setDepth(4);

        var exitEmitter = particles.createEmitter({
            key: 'door_closed',
            x: { min: this.level_width - 20, max: this.level_width },
            y: 340,
            scale: 0.2,
            lifespan: 2900,
            speedY: { min: 20, max: 40 },
            quantity: 1,
            blendMode: 'ADD'
        });

    }

    setUpOpenDoorParticleEffect() {
        var particles = this.add.particles('blue_flare');
        particles.setDepth(4);
        
        var openDoorEmitter = particles.createEmitter({
            key: 'door_open',
            x: this.level_width,
            y: { min: 370, max: 450 },
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
    activateElevatorWithSwitch(elevator) {
        if (!this.overlapTriggered) {
            //this.overlapTriggered = true;
            console.log("overlap started");
            elevator.setVelocityY(elevator.potentialSpeed);
        }

        
    switchActivateElevator(elevator) {
        console.log('trying to activate elevator');
        console.log(elevator);
        elevator.activateElevator();
        this.switchOneColliderActivated = false;
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
    } */