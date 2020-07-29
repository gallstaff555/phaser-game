class PlayerAttack extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        
        var x = scene.player.x;
        var y = scene.player.y;
        
        super(scene, x, y, 'character');
    }
}