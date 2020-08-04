class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
         
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   
        
        this.scene = config.scene;

        //this.setCollideWorldBounds(true);

        //this.setOrigin(0,0);
        

        this.status = ({
            attacking: false,
            rolling: false,
            alive: true,
            direction: config.direction
        })

        this.attributes = ({
            health: 100,
            //direction: config.direction
        })
    }

    getAttributes() {
        return this.attributes;
    }

    getStatus() {
        return this.status;
    }

    setDirection(newDirection) {
        this.status.direction = newDirection;
    }
}