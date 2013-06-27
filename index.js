function EventedQueue (autoRelock) {
    this._autoRelock = !!autoRelock;
    this._triggered = false;
    this._triggerQueue = [];
}

EventedQueue.prototype.empty = function() {};

EventedQueue.prototype.push = function() {
    var args = Array.prototype.slice.call(arguments);

    if (args.length > 0) {
        if ('function' !== typeof args[0]) {
            throw new Error('first parameter should be a function');
        }

        if (this._triggered) {
            args.shift().apply(null, args);
        } else {
            this._triggerQueue.push({ f: args.shift(), args: args });
        }
    } else {
        throw new Error('not function argument supplied!');
    }
};

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

EventedQueue.prototype.relock = function() {
    this._triggered = false;
};

EventedQueue.prototype.size = function() {
    return this._triggerQueue.length;
};


module.exports = function(autoRelock) {
    return new EventedQueue(autoRelock);
};