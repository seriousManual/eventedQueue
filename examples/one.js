var eq = require('../');

var myEq = eq(true);

myEq.push(function() {
    console.log( 'ola0' );
});

myEq.push(function() {
    console.log( 'ola1' );
});

myEq.push(function() {
    console.log( 'ola2' );
});

setTimeout(function() {
    myEq.trigger();
}, 1000);

setTimeout(function() {
    myEq.push(function() {
        console.log( 'ola3' );
    });
}, 2000);

setTimeout(function() {
    myEq.trigger();
}, 2500);