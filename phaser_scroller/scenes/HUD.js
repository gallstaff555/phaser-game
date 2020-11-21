//This scene displays information about the player and world on the screen
class HUD extends Phaser.Scene {
    constructor() {
        super('HUD');
    }

    preload() {
        this.load.image('blue_flare', 'assets/effects/blue_flare.png');
    }

    create() {
        this.playerHealth = this.add.text(0,0,'');
        this.graphics = this.add.graphics( { fillStyle: { color: 0x0000ff }});
        //this.healthBar = new Phaser.Geom.Rectangle(0, 0, 0, 0);
    }

    update() {}

    HUDTest() {
        console.log('testing hud function');
    }

    displayPlayerHealth(health) {
        this.playerHealth.destroy();
        this.playerHealth = this.add.text(5, 5, health);
    }

    displayPlayerHealthBar(health) {
        this.healthBar = new Phaser.Geom.Rectangle(5, 5, health, 10);
        this.graphics.fillRectShape(this.healthBar);
    }

    displayNumber(number) {
        for (let i = 1; i < number; i++) {
            this.add.image(i * 15, 30, 'blue_flare');
        }
    }
}