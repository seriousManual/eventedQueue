var EventedQueue = require('../');

var myQueue = new EventedQueue(true);

var job = function(name) {
    console.log('job ' + name + ' executed');
};

myQueue.push(job, 'foo');
myQueue.push(job, 'bar');
myQueue.push(job, 'bax');

setTimeout(function() {
    myQueue.trigger();
}, 1000);