var config = {
    width: 800,
    height: 480,
    scene: [Scene0, SanctuaryScene1, HubScene, RuinsDemoScene, SelectNewScene, HUD],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

var game = new Phaser.Game(config);