var config = {
    type: Phaser.AUTO,
    width: 1623,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var anims;
var cursors;
var jumpBtn;
var platforms;
var ground;

var game = new Phaser.Game(config);

function preload () {
    //background
    this.load.image('background', 'assets/pixel_tomb.png');
    //ground
    this.ground = this.load.image('ground', 'assets/ground.png');

    //atlas includes: key, spritesheet, and json
    this.load.atlas('player', 'assets/heroKnightSprites.png', 'assets/heroKnightSprites.json');

}

function create () {
    console.log("ready!");

    //background image
    this.add.image(800, 325, 'background').setScale(3,3);

    //physics
    platforms = this.physics.add.staticGroup();
    //let groundPlatform = this.add.sprite(800, 595, "block");
    //platforms.add(groundPlatform);
    platforms.create(800, 595, 'ground').setScale(10,1);

    //player
    this.player = this.physics.add.sprite(150, 490, 'player').setScale(3,3);
    this.player.setGravityY(300);
    this.player.setCollideWorldBounds(true);

    //collision
    this.physics.add.collider(this.player, platforms);

    
    //set up cursor
    cursors = this.input.keyboard.createCursorKeys();

    //print animation frame names
    var frameNames = this.textures.get('player').getFrameNames();
    console.log(frameNames);

    //create IDLE animation
    this.anims.create({
        key: 'HeroKnight_Idle',
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 7,
            zeroPad: 1,
            prefix: 'HeroKnight_Idle_',
            suffix: '.png'
        }),
        frameRate: 8,
        repeat: -1
    });
    
    //create RIGHT_RUN animation
    this.anims.create({
        key: 'HeroKnight_Run',
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 9,
            zeroPad: 1,
            prefix: 'HeroKnight_Run_',
            suffix: '.png'
        }),
        frameRate: 15,
        repeat: -1
    });

    //create ATTACK1 animation
    this.anims.create({
        key: 'HeroKnight_Attack1',
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 5,
            zeroPad: 1,
            prefix: 'HeroKnight_Attack1_',
            suffix: '.png'
        }),
        frameRate: 15,
        repeat: -1
    });

    //create JUMP animation
    this.anims.create({
        key: 'HeroKnight_Jump',
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 2,
            zeroPad: 1,
            prefix: 'HeroKnight_Jump_',
            suffix: '.png'
        }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'HeroKnight_Fall',
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 3,
            zeroPad: 1,
            prefix: 'HeroKnight_Fall_',
            suffix: '.png'
        }),
        frameRate: 15,
        repeat: -1
    });



    //keys
    jumpBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

}

function update() {

    //console.log(this.player.body.velocity.y);
    
    //attack
    if (cursors.space.isDown) {
        this.player.play("HeroKnight_Attack1", true);
        //this.player.setVelocityX(0);
    //left
    } else if (cursors.left.isDown) {
        this.player.setVelocityX(-200);
        this.player.flipX = true;
        this.player.anims.play('HeroKnight_Run', true);
    //right
    } else if (cursors.right.isDown) {
        this.player.setVelocityX(200);
        this.player.flipX = false;
        this.player.play("HeroKnight_Run", true);
    //idle
    } else {
        this.player.setVelocityX(0);
        this.player.setGravityY(300);
        this.player.anims.play('HeroKnight_Idle', true);
    }

    //jump
    if (Phaser.Input.Keyboard.JustDown(jumpBtn)) {
        this.player.setVelocityY(-200);
        this.player.anims.play('HeroKnight_Jump', true);
    }

    //travelling up through air
    if (this.player.body.velocity.y < -1) {
        this.player.anims.play('HeroKnight_Jump', true);
    } else if (this.player.body.velocity.y > 50) {
       this.player.anims.play('HeroKnight_Fall');
    }

}

/* GRAVEYARD

LONGFORM ANIMATION
    this.anims.create({
        key: 'HeroKnight_Idle',
        frames: [{
            key: 'player',
            frame: "HeroKnight_Idle_0.png"
        }, { 
            key: 'player',
            frame: "HeroKnight_Idle_1.png"
        }, { 
            key: 'player',
            frame: "HeroKnight_Idle_2.png"
        }, { 
            key: 'player',
            frame: "HeroKnight_Idle_3.png"
        }, { 
            key: 'player',
            frame: "HeroKnight_Idle_4.png"
        }, { 
            key: 'player',
            frame: "HeroKnight_Idle_5.png"
        }, { 
            key: 'player',
            frame: "HeroKnight_Idle_6.png"
        }, { 
            key: 'player',
            frame: "HeroKnight_Idle_7.png"

        }],
        frameRate: 8,
        repeat: -1
    }); 

*/
