//Create a sprite at the location of the Knight's sword attack
//class KnightAttackBox extends Phaser.Physics.Arcade.Sprite {
class SwordAttackBox extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {

        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   
        this.scene = config.scene;
        this.body.allowGravity = false;
    }
}