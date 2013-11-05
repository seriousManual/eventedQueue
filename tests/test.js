var expect = require('chai').expect;

var EventedQueue = require('../index');

describe('EventedQueue', function() {
    it('should work in order without relocking', function(done) {
        this.timeout(3000);

        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(false);

        var testFunction = function(nr) {
            callOrder.push(nr);

            numberCalled++;
        };

        eq.push(testFunction, 'task1');
        eq.push(testFunction, 'task2');
        eq.push(testFunction, 'task3');
        eq.push(testFunction, 'task4');

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        eq.trigger();

        eq.push(testFunction, 'task5');
        eq.push(testFunction, 'task6');

        expect(callOrder).to.deep.equal(['task1', 'task2', 'task3', 'task4', 'task5', 'task6']);
        expect(numberCalled).to.equal(6);
        done();
    });

    it('should work in order with relocking', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(false);

        var testFunction = function(nr) {
            callOrder.push(nr);

            numberCalled++;
        };

        eq.push(testFunction, 'task1');
        eq.push(testFunction, 'task2');
        eq.push(testFunction, 'task3');
        eq.push(testFunction, 'task4');

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        eq.trigger();

        eq.push(testFunction, 'task5');
        eq.push(testFunction, 'task6');

        expect(numberCalled).to.equal(6);
        expect(eq.size()).to.equal(0);

        eq.relock();

        eq.push(testFunction, 'task7');
        eq.push(testFunction, 'task8');

        expect(numberCalled).to.equal(6);
        expect(eq.size()).to.equal(2);
        expect(callOrder).to.deep.equal(['task1', 'task2', 'task3', 'task4', 'task5', 'task6']);

        done();
    });

    it('should accept a retrigger after locking', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(false);

        var testFunction = function(nr, time) {
            callOrder.push(nr);

            numberCalled++;
        };

        eq.push(testFunction, 'task1');
        eq.push(testFunction, 'task2');
        eq.push(testFunction, 'task3');
        eq.push(testFunction, 'task4');

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        eq.trigger();

        eq.push(testFunction, 'task5');
        eq.push(testFunction, 'task6');

        expect(eq.size()).to.equal(0);
        expect(numberCalled).to.equal(6);

        eq.relock();

        eq.push(testFunction, 'task7');
        eq.push(testFunction, 'task8');

        expect(eq.size()).to.equal(2);
        expect(numberCalled).to.equal(6);
        expect(callOrder).to.deep.equal([ 'task1', 'task2', 'task3', 'task4', 'task5', 'task6' ]);

        eq.trigger();

        expect(eq.size()).to.equal(0);
        expect(numberCalled).to.equal(8);
        expect(callOrder).to.deep.equal([ 'task1', 'task2', 'task3', 'task4', 'task5', 'task6', 'task7', 'task8' ]);

        done();
    });

    it('should relock the queue automatically', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(true); //<--- setting default behaviour to relock after trigger

        var testFunction = function(nr) {
            callOrder.push(nr);

            numberCalled++;
        };

        eq.push(testFunction, 'task1');
        eq.push(testFunction, 'task2');
        eq.push(testFunction, 'task3');
        eq.push(testFunction, 'task4');

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        eq.trigger();

        expect(eq.size()).to.equal(0);
        expect(numberCalled).to.equal(4);
        expect(callOrder).to.deep.equal(['task1', 'task2', 'task3', 'task4']);

        eq.push(testFunction, 'task5');
        eq.push(testFunction, 'task6');

        expect(eq.size()).to.equal(2);
        expect(numberCalled).to.equal(4);
        expect(callOrder).to.deep.equal(['task1', 'task2', 'task3', 'task4']);

        done();
    });

    it('should call empty', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(); //<--- setting default behaviour to relock after trigger

        eq.empty = function() {
            done();
        };

        var testFunction = function(nr) {
            callOrder.push(nr);

            numberCalled++;
        };

        eq.push(testFunction, 'task1');
        eq.push(testFunction, 'task2');
        eq.push(testFunction, 'task3');
        eq.push(testFunction, 'task4');

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        eq.trigger();
    });

    it('should throw', function() {
        var eq = new EventedQueue();

        expect(function() {
            eq.push()
        }).to.throw();

        expect(function() {
            eq.push(true)
        }).to.throw();

        expect(function() {
            eq.push('')
        }).to.throw();

        expect(function() {
            eq.push({})
        }).to.throw();

        expect(function() {
            eq.push([])
        }).to.throw();
    });
});