var eq = require('../');

var myEq = eq();

myEq.push(function() {
    console.log( 'ola' );
});

setTimeout(function() {
    myEq.trigger();
}, 1000);

