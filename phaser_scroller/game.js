var config = {
    width: 240,
    height: 160,
    scene: [Scene0, Scene1, Scene2],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);