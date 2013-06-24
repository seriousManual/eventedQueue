var eventedQueue = function(autoRelock) {
    autoRelock = !!autoRelock;

    var triggered = false;
    var triggerQueue = [];

    return {
        empty: null,

        push: function() {
            var args = Array.prototype.slice.call(arguments);

            if (args.length > 0) {
                if ('function' !== typeof args[0]) {
                    throw new Error('first parameter should be a function');
                }

                if (triggered) {
                    async.nextTick(function() {
                        args.shift().apply(null, args);
                    });
                } else {
                    triggerQueue.push({ f: args.shift(), args: args });
                }
            } else {
                throw new Error('not function argument supplied!');
            }
        },

        trigger: function() {
            triggered = true;

            while(triggerQueue.length > 0) {
                var item = triggerQueue.shift();
                item.f.apply(null, item.args);
            }

            if (autoRelock) {
                this.relock();
            }

            this.empty && 'function' === typeof this.empty && this.empty();
        },

        relock: function() {
            triggered = false;
        },

        length: function() {
            return triggerQueue.length;
        }
    };
};

module.exports = eventedQueue;