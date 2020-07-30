//A Knight is a character controlled Sprite class with physics
class Knight extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   

        //this.scene = config.scene;

        //this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.setScale(2);
        this.body.setSize(20, 50);
        this.setGravityY(300);
        this.setCollideWorldBounds(true);

        this.status = ({
            attacking: false,
            rolling: false
        })

        this.attributes = ({
            health: 100,
            direction: 'right'
        })
    }

    getAttributes() {
        return this.attributes;
    }

    //ATTACK ANIMATIONS AND STATUS
    //set attacking to true, play attacking animation, and when animation is complete: set attacking status to false
    attack() {
        this.setAttacking(true);
        this.anims.play("HeroKnight_Attack1", true);
        this.on('animationcomplete-HeroKnight_Attack1', this.toggleAttackingOff);
    }

    isAttacking() {
        return this.status.attacking;
    }

    setAttacking(attackStatus) {
        this.status.attacking = attackStatus;
    }

    toggleAttackingOff = () => {
        this.setAttacking(false);
    }

    //ROLL ANIMATIONS AND STATUS
    roll() {
        this.setRolling(true);
        this.anims.play('HeroKnight_Roll', true);
        this.on('animationcomplete-HeroKnight_Roll', this.toggleRollingOff);
    }

    isRolling() {
        return this.status.rolling;
    }

    setRolling(rollStatus) {
        this.status.rolling = rollStatus;
    }

    toggleRollingOff = () => {
        this.setRolling(false);
    }

    //direction
    setDirection(theDirection) {
        this.attributes.direction = theDirection;
    }
}