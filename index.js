/**
 * a queue that queues up event handlers that get triggered on a certain event
 * @param autoRelock specifies if the queue should lock itself after triggering and after having invoked all handlers
 * @constructor
 */
function EventedQueue (autoRelock) {
    this._autoRelock = !!autoRelock;
    this._triggered = false;
    this._triggerQueue = [];
}

/**
 * noop function that acts as the empty callback when the eventedQueue has emptied
 */
EventedQueue.prototype.empty = function() {};

/**
 * adds an event handler.
 * first argument has to be a function, the following parameters will be applied on invocation
 */
EventedQueue.prototype.push = function() {
    var args = Array.prototype.slice.call(arguments);

    if (args.length > 0) {
        if ('function' !== typeof args[0]) {
            throw new Error('first parameter has to be a function');
        }

        if (this._triggered) {
            args.shift().apply(null, args);
        } else {
            this._triggerQueue.push({ f: args.shift(), args: args });
        }
    } else {
        throw new Error('job argument is missing');
    }
};

/**
 * cause all queued event handlers to be triggered
 */
EventedQueue.prototype.trigger = function() {
    this._triggered = true;

    while(this._triggerQueue.length > 0) {
        var item = this._triggerQueue.shift();
        item.f.apply(null, item.args);
    }

    if (this._autoRelock) {
        this.relock();
    }

    this.empty && 'function' === typeof this.empty && this.empty();
};

/**
 * locks the event queue
 */
EventedQueue.prototype.relock = function() {
    this._triggered = false;
};

/**
 * returns the size of the event queue
 * @returns {Number}
 */
EventedQueue.prototype.size = function() {
    return this._triggerQueue.length;
};

module.exports = EventedQueue;
