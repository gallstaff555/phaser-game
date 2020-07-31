class Scene0 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload () {
        //background
        this.load.image('sky', 'assets/backgrounds/sky.png');
        this.load.image('background', 'assets/backgrounds/forest_background.png');
        this.load.image('midground', 'assets/backgrounds/forest_midground.png');
        this.load.image('tree01', 'assets/world/tree01.png');
        this.load.image('forest_ground', 'assets/backgrounds/forest_ground.png');
        this.load.image('forest_bush', 'assets/world/bush01.png');

        //effects
        this.load.image('atk_effect', 'assets/effects/atk_effect.png');

        //ground
        this.ground = this.load.image('ground', 'assets/world/ground.png');
    
        //atlas for sprite animation
        this.load.atlas('player', 'assets/sprites/heroKnightSprites.png', 'assets/sprites/heroKnightSprites.json');
        this.load.atlas('skeleton', 'assets/sprites/skeletonSprites.png', 'assets/sprites/skeletonSprites.json');  
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.addAnimations();

        //start first level
        this.scene.start("level_one");
    }

    //Add player and skeleton animations
    addAnimations() {

        //Player IDLE
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
            repeat: 0
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

        //create BLOCK (IDLE) animation
        this.anims.create({
            key: 'HeroKnight_Block_Idle',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 7,
                zeroPad: 1,
                prefix: 'HeroKnight_Block Idle_',
                suffix: '.png'
            }),
            frameRate: 12,
            repeat: 0
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


        /*SKELETON ANIMATION */

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
            frameRate: 5,
            repeat: -1
        });


        //create SKELETON ATTACK animation
        this.anims.create({
            key: 'Skeleton_Attack',
            frames: this.anims.generateFrameNames('skeleton', {
                start: 0,
                end: 16,
                zeroPad: 2,
                prefix: 'Skeleton_Attack_',
                suffix: '.png'
            }),
            frameRate: 5,
            repeat: 0
        });

        //create SKELETON DEATH animation
        this.anims.create({
            key: 'Skeleton_Death',
            frames: this.anims.generateFrameNames('skeleton', {
                start: 0,
                end: 12,
                zeroPad: 2,
                prefix: 'Skeleton_Death_',
                suffix: '.png'
            }),
            frameRate: 6,
            repeat: 0
        });
    }
}