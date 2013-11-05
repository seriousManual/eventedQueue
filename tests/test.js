var expect = require('chai').expect;

var EventedQueue = require('../index');

describe('EventedQueue', function() {
    it('should work in order without relocking', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(false);

        var testFunction = function(nr, time) {
            setTimeout(function() {
                callOrder.push(nr);

                numberCalled++;
            }, time);
        };

        eq.push(testFunction, 'task1', 20);
        eq.push(testFunction, 'task2', 10);
        eq.push(testFunction, 'task3', 40);
        eq.push(testFunction, 'task4', 30);

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        setTimeout(function() {
            eq.trigger();

            eq.push(testFunction, 'task5', 100);
            eq.push(testFunction, 'task6', 120);
        }, 50);

        setTimeout(function() {
            expect(callOrder).to.deep.equal(['task2', 'task1', 'task4', 'task3', 'task5', 'task6']);
            done();
        }, 200);
    });

    it('should work in order with relocking', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(false);

        var testFunction = function(nr, time) {
            setTimeout(function() {
                callOrder.push(nr);

                numberCalled++;
            }, time);
        };

        eq.push(testFunction, 'task1', 20);
        eq.push(testFunction, 'task2', 10);
        eq.push(testFunction, 'task3', 30);
        eq.push(testFunction, 'task4', 40);

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        setTimeout(function() {
            expect(eq.size()).to.equal(4);
            expect(numberCalled).to.equal(0);

            eq.trigger();

            eq.push(testFunction, 'task5', 50);
            eq.push(testFunction, 'task6', 60);

            eq.relock();

            eq.push(testFunction, 'task7', 10);
            eq.push(testFunction, 'task8', 20);
        }, 50);

        setTimeout(function() {
            expect(numberCalled).to.equal(6);
            expect(eq.size()).to.equal(2);
            expect(callOrder).to.deep.equal(['task2', 'task1', 'task3', 'task4', 'task5', 'task6']);

            done();
        }, 300);
    });

    it('should accept a retrigger after locking', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(false);

        var testFunction = function(nr, time) {
            setTimeout(function() {
                callOrder.push(nr);

                numberCalled++;
            }, time);
        };

        eq.push(testFunction, 'task1', 4);
        eq.push(testFunction, 'task2', 3);
        eq.push(testFunction, 'task3', 2);
        eq.push(testFunction, 'task4', 1);

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        setTimeout(function() {
            expect(eq.size()).to.equal(4);
            expect(numberCalled).to.equal(0);

            eq.trigger();

            eq.push(testFunction, 'task5', 10);
            eq.push(testFunction, 'task6', 20);

            eq.relock();

            eq.push(testFunction, 'task7', 20);
            eq.push(testFunction, 'task8', 10);

            setTimeout(function() {
                expect(eq.size()).to.equal(2);
                expect(numberCalled).to.equal(6);
                expect(callOrder).to.deep.equal([ 'task4', 'task3', 'task2', 'task1', 'task5', 'task6' ]);

                eq.trigger();

                setTimeout(function() {
                    expect(eq.size()).to.equal(0);
                    expect(numberCalled).to.equal(8);
                    expect(callOrder).to.deep.equal([ 'task4', 'task3', 'task2', 'task1', 'task5', 'task6', 'task8', 'task7' ]);
                    done();
                }, 60);
            }, 100);
        }, 50);
    });

    it('should relock the queue automatically', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(true); //<--- setting default behaviour to relock after trigger

        var testFunction = function(nr, time) {
            setTimeout(function() {
                callOrder.push(nr);

                numberCalled++;
            }, time);
        };

        eq.push(testFunction, 'task1', 20);
        eq.push(testFunction, 'task2', 10);
        eq.push(testFunction, 'task3', 40);
        eq.push(testFunction, 'task4', 30);

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        eq.trigger();

        setTimeout(function() {
            expect(eq.size()).to.equal(0);
            expect(numberCalled).to.equal(4);
            expect(callOrder).to.deep.equal(['task2', 'task1', 'task4', 'task3']);

            eq.push(testFunction, 'task5', 10);
            eq.push(testFunction, 'task6', 20);

            expect(eq.size()).to.equal(2);
            expect(numberCalled).to.equal(4);
            expect(callOrder).to.deep.equal(['task2', 'task1', 'task4', 'task3']);

            done();
        }, 80);

    });

    it('should call empty', function(done) {
        var callOrder = [];
        var numberCalled = 0;
        var eq = new EventedQueue(); //<--- setting default behaviour to relock after trigger

        eq.empty = function() {
            done();
        };

        var testFunction = function(nr, time) {
            setTimeout(function() {
                callOrder.push(nr);

                numberCalled++;
            }, time);
        };

        eq.push(testFunction, 'task1', 20);
        eq.push(testFunction, 'task2', 10);
        eq.push(testFunction, 'task3', 40);
        eq.push(testFunction, 'task4', 30);

        expect(eq.size()).to.equal(4);
        expect(numberCalled).to.equal(0);

        setTimeout(function() {
            eq.trigger();
        }, 20);
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