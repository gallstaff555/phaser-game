var config = {
    type: Phaser.AUTO,
    width: 1623,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player, anims, cursors, platforms, ground, skeleton, playerTest1;

var game = new Phaser.Game(config);

function preload () {
    //background
    this.load.image('background', 'assets/pixel_tomb.png');
    //ground
    this.ground = this.load.image('ground', 'assets/ground.png');

    this.load.image("playerTestImage", "assets/playerTest.png");

    //atlas includes: key, spritesheet, and json
    this.load.atlas('player', 'assets/heroKnightSprites.png', 'assets/heroKnightSprites.json');
    this.load.atlas('skeleton', 'assets/skeletonSprites.png', 'assets/skeletonSprites.json');

}

function create () {
    console.log("ready!");

    //background image
    this.add.image(800, 355, 'background').setScale(3,3);

    //platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(800, 450, 'ground');
    //let groundPlatform = this.add.sprite(800, 595, "block");
    //platforms.add(groundPlatform);

    
    //player
    this.player = this.physics.add.sprite(150, 450, 'player').setScale(3,3);
    this.player.body.setSize(20, 50);
    this.player.setGravityY(300);
    this.player.setCollideWorldBounds(true); 

    //skeleton
    this.skeleton = this.physics.add.sprite(850, 150, 'skeleton').setScale(3,3);
    this.skeleton.body.setSize(20,60);
    this.skeleton.setGravityY(300);
    this.skeleton.setCollideWorldBounds(true);

    //collision
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.skeleton, platforms);

    //set up cursor
    cursors = this.input.keyboard.createCursorKeys();

    //print animation frame names
    var frameNames = this.textures.get('skeleton').getFrameNames();
    console.log(frameNames);

    //keys
    //this.rollBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //create animations
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
        frameRate: 6,
        repeat: -1
    });

    //create RUN animation
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


    //create ATTACK3 animation (down attack)
    this.anims.create({
        key: 'HeroKnight_Attack3',
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 7,
            zeroPad: 1,
            prefix: 'HeroKnight_Attack3_',
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

    //create FALL animation
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

    //create ROLL animation
    this.anims.create({
        key: 'HeroKnight_Roll',
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 8,
            zeroPad: 1,
            prefix: 'HeroKnight_Roll_',
            suffix: '.png'
        }),
        frameRate: 15,
        repeat: 0
    });


    //create SKELETON IDLE animation
    this.anims.create({
        key: 'Skeleton_Idle',
        frames: this.anims.generateFrameNames('skeleton', {
            start: 0,
            end: 6,
            zeroPad: 1,
            prefix: 'Skeleton_Idle_',
            suffix: '.png'
        }),
        frameRate: 4,
        repeat: -1
    });

    //create SKELETON WALK animation
    this.anims.create({
        key: 'Skeleton_Walk',
        frames: this.anims.generateFrameNames('skeleton', {
            start: 0,
            end: 9,
            zeroPad: 1,
            prefix: 'Skeleton_Walk_',
            suffix: '.png'
        }),
        frameRate: 7,
        repeat: -1
    });
}


function update() {

    let playerVelocity_Y = this.player.body.velocity.y;
    let playerPosition_X = this.player.body.x;
    let skeletonPosition_X = this.skeleton.body.x;
    
    //attack
    if (cursors.space.isDown) {
        this.player.play("HeroKnight_Attack1", true);
    //roll
    } else if (cursors.down.isDown) {
        this.player.anims.play('HeroKnight_Roll', true);
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
        //this.player.setGravityY(600);
        this.player.anims.play('HeroKnight_Idle', true);
    }

    //jump
    if (cursors.up.isDown && playerVelocity_Y == 0) {
        this.player.setVelocityY(-400);
        this.player.anims.play('HeroKnight_Jump', true);
    }

    //travelling up through air
    if (this.player.body.velocity.y < -1) {
        this.player.anims.play('HeroKnight_Jump', true);
    } else if (this.player.body.velocity.y > 50) {
       this.player.anims.play('HeroKnight_Fall');
    }  
    

    /* SKELETON */

    //skeleton within range of player
    if (Math.abs(playerPosition_X - skeletonPosition_X) < 500) {
        this.skeleton.anims.play('Skeleton_Walk', true);
        //player is to the left of skeleton
        if (playerPosition_X <= skeletonPosition_X) {
            this.skeleton.setVelocityX(-100);
            this.skeleton.flipX = true;
        } else { //player is to right of skeleton
            this.skeleton.setVelocityX(100);
            this.skeleton.flipX = false;
        }
    } else {
        this.skeleton.anims.play('Skeleton_Idle', true);
        if (playerPosition_X <= skeletonPosition_X) {
            this.skeleton.flipX = true;
        } else { //player is to right of skeleton
            this.skeleton.flipX = false;
        }
    }
} 


/* GRAVEYARD

*/
