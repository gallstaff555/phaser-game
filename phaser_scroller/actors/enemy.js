class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   
        
        this.scene = config.scene;

        this.setCollideWorldBounds(true);

        this.status = ({
            attacking: false,
            rolling: false,
            dying: false
        })

        this.attributes = ({
            health: 100,
            direction: 'left'   //can i assign a value from argument??
        })
    }
}