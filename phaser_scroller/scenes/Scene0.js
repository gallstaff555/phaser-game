class Scene0 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload () {
        //background

        //effects
        this.load.image('atk_effect', 'assets/effects/atk_effect.png');

        //sprites
        this.load.atlas('player', 'assets/sprites/heroKnightSprites.png', 'assets/sprites/heroKnightSprites.json');
        this.load.atlas('skeleton', 'assets/sprites/skeletonSprites.png', 'assets/sprites/skeletonSprites.json');
        this.load.atlas('stormMage', 'assets/sprites/stormMageSprites.png', 'assets/sprites/stormMageSprites.json');
        
        //object sprites
        this.load.atlas('block_flash', 'assets/effects/BlockFlash/block_flash.png', 'assets/effects/BlockFlash/block_flash.json');
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.addAnimations();

        //start first level
        this.scene.start("hub_level", {level: 'asdf'});
    }

    //Add player and skeleton animations
    addAnimations() {

        //Effect on player's shield when they successfully block
        this.anims.create({
            key: 'Block_Flash',
            frames: this.anims.generateFrameNames('block_flash', {
                start: 0,
                end: 4,
                zeroPad: 1,
                prefix: 'BlockFlash_',
                suffix: '.png'
            }),
            frameRate: 12,
            repeat: 0
        });

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
            frameRate: 7,
            repeat: -1
        });

        //create BLOCK SUCCESS animation
        this.anims.create({
            key: 'HeroKnight_Block_Success',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 4,
                zeroPad: 1,
                prefix: 'HeroKnight_Block_',
                suffix: '.png'
            }),
            frameRate: 7,
            repeat: 20
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
            frameRate: 5,
            repeat: 0
        });

        //create SKELETON HURT animation
        this.anims.create({
            key: 'Skeleton_Hurt',
            frames: this.anims.generateFrameNames('skeleton', {
                start: 0,
                end: 1,
                zeroPad: 1,
                prefix: 'Skeleton_Hurt_',
                suffix: '.png'
            }),
            frameRate: 3,
            repeat: 6
        });

        //create STORM MAGE IDLE animation
        this.anims.create({
            key: 'StormMage_Idle',
            frames: this.anims.generateFrameNames('stormMage', {
                start: 0,
                end: 13,
                zeroPad: 2,
                prefix: 'StormMage_Idle_',
                suffix: '.png'
            }),
            frameRate: 5,
            repeat: -1
        });
    }
}