//a moving platform that can hold the player character
class Elevator extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   
        this.setOrigin(0, .5);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setSize(64, 8);
        this.velocity = config.vel;
        this.potentialSpeed = config.potentialSpeed;
    }
}
