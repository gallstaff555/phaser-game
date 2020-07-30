class PlayerAttack extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        console.log("created player attack");
        var x = scene.player.x;
        var y = scene.player.y;

        super(scene, x, y, null);

        this.playerDirection = 'right';
        this.xCoord = x;
        this.yCoord = y;

        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        
    }

    updateDirection(x, y, newDirection) {
        //console.log(this.playerDirection);
        this.playerDirection = 'newDirection';
        this.yCoord = y;
        if (this.playerDirection == 'right') {
            this.xCoord = x + 100;
        } else {
            this.xCoord = x - 100;
        }
        console.log(this.xCoord + "||" + this.yCoord);
    }
}