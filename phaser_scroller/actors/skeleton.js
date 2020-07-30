class Skeleton extends Enemy {
    constructor(config) {
        super(config);
        
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   

        this.setScale(2);
        this.body.setSize(20, 60);
    }

    //ATTACK ANIMATIONS AND STATUS
    //set attacking to true, play attacking animation, and when animation is complete: set attacking status to false
    skeletonAttack() {
        this.setAttacking(true);
        this.anims.play('Skeleton_Attack', true);
        this.on('animationcomplete-Skeleton_Attack', this.toggleAttackingOff);
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

    skeletonDying() {
        
    }
}