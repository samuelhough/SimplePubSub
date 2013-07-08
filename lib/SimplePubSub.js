/*
 * SimplePubSub
 * https://github.com/samuelhough/SimplePubSub
 *
 * Copyright (c) 2013 SamuelHough
 * Licensed under the MIT license.
 */

'use strict';

function PubSub(){
  if(!this instanceof PubSub){
    return new PubSub();
  }
  this.__events = {};
}

PubSub.prototype.__defaultScope = {};

PubSub.prototype.on = function(event, fn, scope){
  if(!this.__events[event]){ this.__events[event] = []; }
  
  
  this.__events[event].push({
    fn: fn,
    scope: scope || this.__defaultScope,
  });
  
  return true;
};

PubSub.prototype.emit = function(event, data){
  if(!this.__events[event]){
    return false;
  }
  
  var args = [];  
  
  if(arguments.length > 1){
    for(var cur = 1, len = arguments.length; cur < len; cur ++){
      args.push(arguments[cur]);
    }
  }
  
  this.emitToListeners(event, args);
  
  return true;
};

PubSub.prototype.emitToListeners = function(event, args){ 
  var oneEvent = null;
  for(var cur = 0, len = this.__events[event].length; cur < len; cur ++){
    oneEvent = this.__events[event][cur];
    try {
      oneEvent.fn.apply(oneEvent.scope, args);  
    } catch(e){
      console.log(e);
    }
  }
  return true;
};

PubSub.prototype.destroyChannel = function(channel){
  if ( this.hasChannel( channel ) ){
    delete this.__events[channel];
    return true;
  }
  return false;
};

PubSub.prototype.hasChannel = function( channel ){
  if(this.__events[channel]){ 
    return true;
  } else {
    return false;
  }
};

PubSub.prototype.removeListener = function( channel, fn ){
  if( this.hasChannel( channel ) ){
    var arr = this.__events[ channel ];
    for( var cur = 0; cur < arr.length; cur ++ ){
      if( arr[ cur ].fn === fn ){
        arr.splice( cur, 1 );
        if( !arr.length ){
          this.destroyChannel( channel );
        }
        return true;
      }
    }
  }
  return false;
};


module.exports = PubSub;
