class Skeleton extends Enemy {
    constructor(config) {
        super(config);
        
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   

        this.setScale(2);
        this.body.setSize(20, 60);
    }
}