var eventedQueue = require('../');

function DbAbstraction() {
    this._eq = new eventedQueue(false);

    this._init();
}

DbAbstraction.prototype._init = function() {
    var that = this;

    setTimeout(function() {
        that._eq.trigger();
    }, 1000);
};

DbAbstraction.prototype.get = function(id, callback) {
    this._eq.push(function() {
        setTimeout(function() {
            callback(null, '|' + id + '|');
        }, 30);
    });
};

var i = new DbAbstraction();

i.get(1, function(error, result) {
    console.log( result );
});

i.get(2, function(error, result) {
    console.log( result );
});

i.get(3, function(error, result) {
    console.log( result );
});