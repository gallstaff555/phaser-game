var config = {
    width: 1280,
    height: 368,
    scene: [Scene0, Scene1],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);