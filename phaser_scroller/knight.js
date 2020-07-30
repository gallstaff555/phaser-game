class Knight extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   

        this.scene = config.scene;

        this.cursors = this.scene.input.keyboard.createCursorKeys();

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

    //print attributes to the console
    printAttributes() {
        for (var key in this.attributes) {
            var val = this.attributes[key];
            console.log(key + ": " + val);
        }
    }

    //ATTACK ANIMATIONS AND STATUS
    //set attacking to true, play attacking animation, and when animation is complete: set attacking status to false
    attack() {
        this.setAttacking(true);
        this.scene.player.play("HeroKnight_Attack1", true);
        this.scene.player.on('animationcomplete-HeroKnight_Attack1', this.toggleAttackingOff);
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
        this.scene.player.play('HeroKnight_Roll', true);
        this.scene.player.on('animationcomplete-HeroKnight_Roll', this.toggleRollingOff);
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