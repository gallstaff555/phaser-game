var config = {
    width: 800,
    height: 600,
    scene: [Scene0, Scene1, Scene2, Scene3],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);