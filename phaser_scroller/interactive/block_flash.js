//an effect that displays on player sprite after successfully blocking enemy attack
class Block_Flash extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this); 
        this.setOrigin(0);
        this.visible = false;

    }

    testBlock() {
        console.log('block test');
    }

    blockSuccess() {
        this.anims.play("Block_Flash", true);
        this.on('animationcomplete-Block_Flash', this.blockFlashOver);
    }

    blockFlashOver = () => {
        this.destroy();
    }
}