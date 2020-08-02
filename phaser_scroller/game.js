var config = {
    width: 500,
    height: 400,
    scene: [Scene0, Scene1, Scene2],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    }
}

var game = new Phaser.Game(config);