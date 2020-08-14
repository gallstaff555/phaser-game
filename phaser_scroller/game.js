var config = {
    width: 800,
    height: 480,
    scene: [Scene0, HubScene, RuinsDemoScene, ElevatorDemoScene, SelectNewScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    }
}

var game = new Phaser.Game(config);