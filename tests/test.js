//var eventedQueue = require('../');
//
//module.exports['eventedQueue'] = function(test) {
//    var callOrder = []
//        , numberCalled = 0
//        , eq = eventedQueue(false);
//
//    var testFunction = function(nr, time) {
//        setTimeout(function() {
//            callOrder.push(nr);
//
//            numberCalled++;
//
//            if (numberCalled == 6) {
//                test.same(callOrder, ['task2', 'task1', 'task4', 'task3', 'task5', 'task6']);
//                test.done();
//            }
//
//        }, time);
//    };
//
//    eq.push(testFunction, 'task1', 20);
//    eq.push(testFunction, 'task2', 10);
//    eq.push(testFunction, 'task3', 40);
//    eq.push(testFunction, 'task4', 30);
//
//    test.equal(eq.length(), 4);
//    test.equal(numberCalled, 0);
//
//    setTimeout(function() {
//        test.equal(eq.length(), 4);
//        test.equal(numberCalled, 0);
//
//        eq.trigger();
//
//        eq.push(testFunction, 'task5', 100);
//        eq.push(testFunction, 'task6', 120);
//    }, 50);
//};
//
//module.exports['eventedQueue relock'] = function(test) {
//
//    var callOrder = []
//        , numberCalled = 0
//        , eq = eventedQueue(false);
//
//    var testFunction = function(nr, time) {
//        setTimeout(function() {
//            callOrder.push(nr);
//
//            numberCalled++;
//
//            if (numberCalled == 6) {
//                test.same(callOrder, ['task2', 'task1', 'task4', 'task3', 'task5', 'task6']);
//            }
//
//            if (numberCalled == 7 || numberCalled == 8) {
//                test.ok(false, 'should not be could due to relocking');
//            }
//
//        }, time);
//    };
//
//    eq.push(testFunction, 'task1', 20);
//    eq.push(testFunction, 'task2', 10);
//    eq.push(testFunction, 'task3', 40);
//    eq.push(testFunction, 'task4', 30);
//
//    test.equal(eq.length(), 4);
//    test.equal(numberCalled, 0);
//
//    setTimeout(function() {
//        test.equal(eq.length(), 4);
//        test.equal(numberCalled, 0);
//
//        eq.trigger();
//
//        eq.push(testFunction, 'task5', 60);
//        eq.push(testFunction, 'task6', 80);
//
//        eq.relock();
//
//        eq.push(testFunction, 'task7', 100);
//        eq.push(testFunction, 'task8', 120);
//    }, 50);
//
//    setTimeout(function() {
//        test.equal(eq.length(), 2);
//        test.done();
//    }, 200);
//};
//
//module.exports['eventedQueue relock retrigger'] = function(test) {
//
//    var callOrder = []
//        , numberCalled = 0
//        , eq = eventedQueue(false);
//
//    var testFunction = function(nr, time) {
//        setTimeout(function() {
//            callOrder.push(nr);
//
//            numberCalled++;
//
//            if (numberCalled == 6) {
//                test.same(callOrder, ['task2', 'task1', 'task4', 'task3', 'task5', 'task6']);
//            }
//
//            if (numberCalled == 8) {
//                test.same(callOrder, ['task2', 'task1', 'task4', 'task3', 'task5', 'task6', 'task7', 'task8']);
//                test.done();
//            }
//
//        }, time);
//    };
//
//    eq.push(testFunction, 'task1', 20);
//    eq.push(testFunction, 'task2', 10);
//    eq.push(testFunction, 'task3', 40);
//    eq.push(testFunction, 'task4', 30);
//
//    test.equal(eq.length(), 4);
//    test.equal(numberCalled, 0);
//
//    setTimeout(function() {
//        test.equal(eq.length(), 4);
//        test.equal(numberCalled, 0);
//
//        eq.trigger();
//
//        eq.push(testFunction, 'task5', 60);
//        eq.push(testFunction, 'task6', 80);
//
//        eq.relock();
//
//        eq.push(testFunction, 'task7', 200);
//        eq.push(testFunction, 'task8', 220);
//    }, 50);
//
//    setTimeout(function() {
//        test.equal(eq.length(), 2);
//        test.equal(numberCalled, 6);
//
//        eq.trigger();
//    }, 160);
//};
//
//module.exports['eventedQueue autorelock'] = function(test) {
//
//    var callOrder = []
//        , numberCalled = 0
//        , eq = eventedQueue(true); //<--- setting default behaviour to relock after trigger
//
//    var testFunction = function(nr, time) {
//        setTimeout(function() {
//            callOrder.push(nr);
//
//            numberCalled++;
//
//            if (numberCalled == 4) {
//                test.same(callOrder, ['task2', 'task1', 'task4', 'task3']);
//                test.equal(eq.length(), 2);
//                test.equal(numberCalled, 4);
//
//                setTimeout(function() {
//                    test.equal(eq.length(), 2);
//                    test.equal(numberCalled, 4);
//
//                    eq.trigger();
//                }, 50);
//            }
//
//            if (numberCalled == 6) {
//                test.same(callOrder, ['task2', 'task1', 'task4', 'task3', 'task5', 'task6']);
//                test.equal(eq.length(), 0);
//                test.equal(numberCalled, 6);
//                test.done();
//            }
//
//        }, time);
//    };
//
//    eq.push(testFunction, 'task1', 20);
//    eq.push(testFunction, 'task2', 10);
//    eq.push(testFunction, 'task3', 40);
//    eq.push(testFunction, 'task4', 30);
//
//    test.equal(eq.length(), 4);
//    test.equal(numberCalled, 0);
//
//    eq.trigger();
//
//    eq.push(testFunction, 'task5', 10);
//    eq.push(testFunction, 'task6', 20);
//
//};
//
//module.exports['eventedQueue error'] = function(test) {
//
//    var eq = async.eventedQueue(false);
//
//    test.throws(function() {
//        eq.push()
//    });
//    test.throws(function() {
//        eq.push(true)
//    });
//    test.throws(function() {
//        eq.push('')
//    });
//    test.throws(function() {
//        eq.push({})
//    });
//    test.throws(function() {
//        eq.push([])
//    });
//
//    test.done();
//};
//
//module.exports['eventedQueue events'] = function(test) {
//    var callOrder = []
//        , numberCalled = 0
//        , eq = eventedQueue(true);
//
//    var testFunction = function(nr, time) {
//        setTimeout(function() {
//            callOrder.push(nr);
//
//            numberCalled++;
//            if (numberCalled == 4) {
//                test.same(callOrder, ['empty', 'task2', 'task1', 'task4', 'task3']);
//                test.equal(eq.length(), 2);
//                test.equal(numberCalled, 4);
//
//                eq.trigger();
//            }
//
//            if (numberCalled == 6) {
//                test.same(callOrder, ['empty', 'task2', 'task1', 'task4', 'task3', 'empty', 'task5', 'task6']);
//                test.equal(eq.length(), 0);
//                test.equal(numberCalled, 6);
//                test.done();
//            }
//        }, time);
//    };
//
//    eq.empty = function() {
//        callOrder.push('empty');
//    };
//
//    eq.push(testFunction, 'task1', 20);
//    eq.push(testFunction, 'task2', 10);
//    eq.push(testFunction, 'task3', 50);
//    eq.push(testFunction, 'task4', 30);
//
//    test.equal(eq.length(), 4);
//    test.equal(numberCalled, 0);
//
//    eq.trigger();
//
//    eq.push(testFunction, 'task5', 100);
//    eq.push(testFunction, 'task6', 120);
//};