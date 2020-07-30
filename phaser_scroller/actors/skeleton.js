class Skeleton extends Enemy {
    constructor(config) {
        super(config);

        this.setScale(2);
        this.body.setSize(20, 60);
    }
}