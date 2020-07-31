//Skeletons are a non-player class which can attack the player
class Skeleton extends Enemy {
    constructor(config) {
        super(config);
        
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   

        this.setScale(config.scale);
        this.body.setSize(config.sizeX, config.sizeY);
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

    //set skeleton attacking status to false
    //BUT ADD A DELAY IN BETWEEN ATTACKS
    toggleAttackingOff = () => {
        this.anims.play('Skeleton_Idle', true);
        this.setAttacking(false);
        //setTimeout( () => this.setAttacking(false), 1000 );  //add 1 second delay in between attacks
        //this.setAttacking(false);
    }

    skeletonHit() {
        this.attributes.health -= 3;
        console.log(this.attributes.health);
        if (this.attributes.health <= 0) {
            this.skeletonDying();
        }
    }

    //Skeleton Death
    skeletonDying() {
        this.status.attacking = false;
        this.status.alive = false;
        this.anims.play('Skeleton_Death', true);
        this.on('animationcomplete-Skeleton_Death', this.skeletonDead);
    }

    //return true is skeleton is alive
    isAlive() {
        return this.status.alive;
    }

    //disable skeleton physics without removing them from the scene
    skeletonDead = () => {
        console.log('skeleton died');
        this.body.setEnable(false);
        // can't call time outside of a scene:
        //this.time.addEvent({ delay: 4000, callback: this.reviveSkeleton, callbackScope: this, loop: false });

        //this.destroy();  //don't destroy unless you want skeleton to disappear
    }

    //'dead' skeletons are revived and their physics are added back to the game
    reviveSkeleton() {
        this.status.alive = true;
        this.body.setEnable(true);
    }
}