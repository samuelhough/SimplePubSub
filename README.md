# SimplePubSub

Simple Publish/Subscriber class


```javascript
var SimplePubSub = require('SimplePubSub'),
    childinstance = function(){
      SimplePubSub.apply( this, arguments );
    };
childinstance.prototype = new SimplePubSub();

childinstance.on('hi', function mycallback(){
  console.log('omg')
});
childinstance.emit('hi')  // logs 'omg'

```


## License
Copyright (c) 2013 SamuelHough  
Licensed under the MIT license.
