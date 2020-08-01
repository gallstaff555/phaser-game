var config = {
    width: window.innerWidth,
    height: window.innerHeight / 2,
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