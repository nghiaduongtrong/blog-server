const EventEmitter = require('events');
const baseEvent = new EventEmitter();
class BaseEvent {
    constructor() {
        this.eventCenter = baseEvent;
    }

    fireEvent = (event, ...params) => {
        this.eventCenter.emit(event, ...params);
    }

    addListener = (event, listener) => {
        if (typeof listener === 'function') {
            this.eventCenter.removeAllListeners(event);
            this.eventCenter.once(event, listener);
        }
    }
}

module.exports = BaseEvent;