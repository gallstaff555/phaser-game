class PlayerTest extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "playerTestImage");  //super is constructor for Sprite
        config.scene.add.existing(this);

        //this.setInteractive();
        this.on('pointerdown', this.clickMe, this);
    }

    clickMe() {
        this.alpha-=.1;
    }

    setUp() {
        this.setScale(3,3);
    }

    updateMovement() {
        if (cursors.left.isDown) {
            this.x -= 1;
        } else if (cursors.right.isDown) {
            this.x += 1;
        }
    }

}