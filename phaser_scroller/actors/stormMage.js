class StormMage extends Enemy {
    constructor(config) {
        super(config);
        
        config.scene.add.existing(this);  
        this.setGravityY(-300);
        this.setScale(config.scale);
        this.body.setSize(config.sizeX, config.sizeY);

        this.setScale(1);
        this.setOrigin(0);
        this.body.setBounce(0, 0);
        //this.body.setImmovable(true);
        //this.setActive(true);
        //config.scene.physics.world.enableBody(this); 

        this.status = ({
            attacking: false
        })

    }

    attack() { //#00FFF0 is attack lightning color
        this.setAttacking(true);
        this.anims.play("StormMage_Spell2", true);
        this.on('animationcomplete-StormMage_Spell2', this.toggleAttackingOff);
    }

    setAttacking(attackStatus) {
        this.status.attacking = attackStatus;
    }

    isAttacking() {
        return this.status.attacking;
    }

    toggleAttackingOff = () => {
        this.setAttacking(false);
    }
    
}