class StormMage extends Enemy {
    constructor(config) {
        super(config);
        
        config.scene.add.existing(this);
        config.scene.physics.world.enableBody(this);   
        //this.setGravityY(300);
        this.setScale(config.scale);
        this.body.setSize(config.sizeX, config.sizeY);
        this.setActive(true);
        //this.body.setImmovable(true);
    }
}