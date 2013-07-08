'use strict';

var SimplePubSub = require('../lib/SimplePubSub.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var Child,
    childinstance;

exports['PubSub'] = {
  setUp: function(done) {
    Child = function(){
      SimplePubSub.apply(this, arguments );
    };
    Child.prototype = new SimplePubSub();
    childinstance = new Child();
    done();
  },
  'child instanceof SimplePubSub': function(test) {
    test.equal( childinstance instanceof SimplePubSub, true );
    test.done();
  },
  'Has an event hash': function(test) {
    test.ok( childinstance.__events, 'Is not an object' );
    test.done();
  },
  'Can register a callback': function(test) {
    var hit = false;
    childinstance.on('hi', function(){
      hit = true;
    });
    childinstance.emit('hi')
    test.equal( hit, true );

    test.done();
  },
  'Registering a callback creates a channel': function(test) {
    childinstance.on('hi', function(){
      hit = true;
    });
    var hit = childinstance.hasChannel('hi')
    
    test.equal( hit, true );

    test.done();
  },
  'Not registering a callback does not create a channel': function(test) {
    var hit = childinstance.hasChannel('boo');
    
    test.equal( hit, false );

    test.done();
  },
  'Can unregister a callback': function(test) {
    var hit = false,
        cb = function(){
          hit = true;
        };

    childinstance.on('hi', cb);
    childinstance.removeListener('hi', cb);
    childinstance.emit('hi');
    test.equal( hit, false );

    test.done();
  },
  'Unregistering a callback only affects that callback': function(test) {
    var count = 0,
        cb = function(){
          count++;
        },
        cb2 = function(){
          count++;
        };

    childinstance.on('hi', cb);
    childinstance.on('hi', cb2);
    childinstance.removeListener('hi', cb);
    childinstance.emit('hi');
    test.equal( count, 1 );

    test.done();
  },
  'Can remove a channel': function(test){
    childinstance.on('hi', function(){});
    childinstance.on('hi', function(){});
    test.equal( true, childinstance.hasChannel('hi') );
    childinstance.destroyChannel( 'hi' );
    test.equal( false, childinstance.hasChannel('hi') );
    test.done();
  },
  'Removing the last callback destroys a channel': function(test){
    var cb1 = function(){},
        cb2 = function(){};

    childinstance.on('hi', cb1);
    childinstance.on('hi', cb2);
    test.equal( true, childinstance.hasChannel('hi') );
    childinstance.removeListener( 'hi', cb1 );
    childinstance.removeListener( 'hi', cb2 );
    test.equal( false, childinstance.hasChannel('hi') );
    test.done();
  },
  'All callbacks are called when an emit is thrown': function(test){
    var count = 0;
    var cb1 = function(){
          count++;
        },
        cb2 = function(){
          count++;
        };

    childinstance.on('hi', cb1 );
    childinstance.on('hi', cb2 );

    childinstance.emit('hi');
    test.equal( count, 2 );
    test.done();
  },
  'All arguments passed after the channel are given to subscribers': function(test){
    var args = [1,2,3,4],
        same = true;
    var cb1 = function(){
          for (var cur = 0; cur < arguments.length; cur++){
            if( args[ cur ] !== arguments[cur] ){
              same = false;
            }
          }
        };

    childinstance.on('hi', cb1 );
    
    childinstance.emit( 'hi', 1,2,3,4 );
    test.equal( same, true );
    childinstance.emit( 'hi', 1,2,3,3 );
    test.equal( same, false );
    test.done();
  }

};
