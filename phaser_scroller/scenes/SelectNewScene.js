class SelectNewScene extends Phaser.Scene {
    constructor() {
        super("SelectNewScene");
    }

    create() {
        
        this.one_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.two_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.three_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

        var options = this.add.text(0,0, 'WHERE WOULD YOU LIKE TO GO?');
        var option1 = this.add.text(0, 20, 'Castle Ruins     [1]');
        var option2 = this.add.text(0, 40, 'Elevator Test    [2]');
        var option3 = this.add.text(0, 60, 'Stay Here        [3]');

        var container = this.add.container(200, 200, [options, option1, option2, option3]);

        container.setSize(50, 50);
        container.setInteractive();
        this.input.setDraggable(container);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.one_key)){
            console.log('1 pressed: going to castle ruins level');
            this.scene.sleep('hub_level');
            this.scene.switch("ruins_demo");
        } else if (Phaser.Input.Keyboard.JustDown(this.two_key)) {
            console.log('2 pressed: going to elevator demo level');
            this.scene.sleep('hub_level');
            this.scene.switch("elevator_demo");
        } else if (Phaser.Input.Keyboard.JustDown(this.three_key)) {
            console.log('3 pressed: staying in the current scene');
            this.scene.sleep("SelectNewScene");
        }

    }
}