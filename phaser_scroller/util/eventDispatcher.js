
//a singleton class for emitting messages

//not configured correctly

instance = null;

class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }

    static getInstance() {
        if (instance == null) {
            instance = new EventDispatcher();
        }
    }
    
}