# eventedQueue

[![Build Status](https://travis-ci.org/zaphod1984/node-piglow.png)](https://travis-ci.org/zaphod1984/node-piglow)

[![NPM](https://nodei.co/npm/eventedqueue.png)](https://nodei.co/npm/eventedqueue/)

[![NPM](https://nodei.co/npm-dl/eventedqueue.png?months=3)](https://nodei.co/npm/eventedqueue/)

The eventedQueue collects jobs in the form of callbacks supplied with an arbitrary number of arguments.
When the queue is triggered, the jobs will be executed.

## Example

````javascript
var EventedQueue = require('../');

var myQueue = EventedQueue();

var job = function(name) {
    console.log('job ' + name + ' executed');
};

myQueue.push(job, 'foo');
myQueue.push(job, 'bar');
myQueue.push(job, 'bax');

setTimeout(function() {
    myQueue.trigger();
}, 1000);

````

## Invocation

### Constructor([autoRelock])

Creates a new eventedQueue that accepts jobs and can be triggered to execute these jobs.

The optional parameter `autoRelock` specifies if the queue should trigger jobs, that are subsequently pushed after the queue has been triggered, automatically. default: false

### EventedQueue.push(jobFunction, [arg1, arg2, ...])

Adds a new job to the eventedQueue. An arbitrary number of parameters can be supplied and are optional.

### EventedQueue.trigger()

Triggers the queue and causes all enqueued jobs to be executed.

### EventedQueue.relock()

If `autoRelock` is set to false via the `relock` command the queue can be set to enque jobs again.

### EventedQueue.size()

Returns the number of enqueued jobs.

### EventedQueue.empty

An optional callback that is called when the queue is emptied.