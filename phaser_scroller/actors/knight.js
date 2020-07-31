//A Knight is a character controlled Sprite class with physics
class Knight extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   

        //set size and physics rules
        this.setScale(2);
        this.body.setSize(20, 50);
        this.setGravityY(300);
        this.setCollideWorldBounds(true);

        this.status = ({
            direction: 'right',
            attacking: false,
            rolling: false,
            blocking: false
        })

        this.attributes = ({
            health: 100,
        })
    }

    getAttributes() {
        return this.attributes;
    }

    getStatus() {
        return this.status;
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

    //BLOCK ANIMATIONS AND STATUS
    block() {
        this.status.blocking = true;
        this.anims.play('HeroKnight_Block_Idle');
        this.on('animationcomplete-HeroKnight_Block_Idle', this.toggleBlockingOff);
    }

    isBlocking() {
        return this.status.blocking;
    }

    setBlocking(blockValue) {
        this.status.blocking = blockValue;
    }

    toggleBlockingOff() {
        this.setBlocking(false);
    }

    //direction
    setDirection(theDirection) {
        this.status.direction = theDirection;
    }
}