# Web Addon [![Build Status](https://secure.travis-ci.org/RoamTouch/gesturekit.js.png)](http://travis-ci.org/RoamTouch/gesturekit.js) [![devDependency Status](https://david-dm.org/RoamTouch/gesturekit.js/dev-status.png)](https://david-dm.org/RoamTouch/gesturekit.js#info=devDependencies)

A JavaScript library to recognize gestures on web browsers.

  * It's small and standalone. 
  * Dependency-free. 
  * Just 3 kb (min & gzip). 
  * Multi-device support. 
  * Easy-implementation. 
  * Made it with love. 

* * *

## Compatibility

###

  * iOS 
    * iPhone/iPod iOS 6 
    * iPad/iPhone iOS 7 
  * Android 
    * Default browser 
    * Chrome 
    * Firefox 

* * *

## Usage

### Add gesturekit.js into your HTML file.

You should download the library and reference the JavaScript file using a <
script > tag somewhere on your HTML pages.

```javascript
    <script src="gesturekit.min.js"></script>
```

* * *

### Define your gesture listeners.

Once added the library you can create your listeners with the same name you
have defined the gesture (in uppercase).

```javascript   
    <script>
    	gesturekit.on('NAME', function (event) {
    	    // Some code here!
        });
    </script>
```

* * *

### Initialize gesturekit.

Initializes the gesturekit library using the .init() method passing your `GID`
 as parameter.

```javascript      
    <script>
	    gesturekit.init({
	    	'gid': 'xxxx-xxxx-xxxx'
		});
    </script>
```

* * *

## API

### Table of contents


* [Methods](#methods)
    * [.init()](#gesturekitinitoptions--gid)
    * [.enable()](#gesturekitenable)
    * [.disable()](#gesturekitdisable)
    * [.on()](#gesturekitonevent-listener-once)
    * [.once()](#gesturekitonceevent-listener)
    * [.off()](#gesturekitoffevent-listener)
    * [.getListeners()](#gesturekitgetlistenersevent)
    * [.emit()](##gesturekitemitevent-arg1-arg2-)

</br>
* [Events](#events)
    * [load](#load)
    * [fail](#fail)
    - [enable](#enable)
    - [disable](#disable)
    - [recognize](#recognize)
    - [notrecognize](#noterecognize)
    - [pointerstart](#pointerstart)
    - [pointermove](#pointermove)
    - [pointerend](#pointerend)
    - [gesturestart](#gesturestart)
    - [gesturemotion](#gesturemotion)
    - [gestureend](#gestureend)
    
***

### Methods
<br/>
#### gesturekit#init(options | gid)
Initialize an instance of GestureKit. You could customize a GestureKit instance using the following options, and shown is their default value.
- `options`: A given options to customize an instance or a string indicating a GestureKit `GID`.
    - `gid`: A given string indicating a GestureKit `GID`.
    - `sensor`: An HTMLElement to use as recognizer sensor. Default: `document.documentElement`.
    - `enabled`: Enable or disable the gesture recognition. Default: `false`.
    - `threshold`: A given number of milliseconds to set a threshold to recognize a gesture. Default: `0`.

```javascript
gesturekit.init({
    'gid': 'xxxx-xxxx-xxxx',
    'enabled': false
});
```

```javascript
gesturekit.init('xxxx-xxxx-xxxx');
```

<br/>
#### gesturekit#enable()
Enables an instance of GestureKit.

```javascript
gesturekit.enable();
```

<br/>
#### gesturekit#disable()
 Disables an instance of GestureKit.

```javascript
gesturekit.disable();
```

<br/>
#### gesturekit#on(event, listener, [once])
Adds a `listener` to the collection for a specified `event`.
- `event`: [String] - The name of the event you want to add.
- `listener`: [Function] - Listener you want to add from given event.
- `once` (optional): [Boolean] - Indicates if the given listener should be executed only once.

```javascript
gesturekit.on('live', listener);
```

<br/>
#### gesturekit#once(event, listener)
Adds a one time `listener` to the collection for a specified `event`. It will execute only once.
- `event`: [String] - The name of the event.
- `listener`: [Function] - Listener you want to add from the given event.

```javascript
gesturekit.once('live', listener);
```

<br/>
#### gesturekit#off(event, listener)
Removes a `listener` from the collection for a specified `event`.
- `event`: [String] - The name of the event.
- `listener`: [Function] - Listener you want to remove from the given event.

```javascript
gesturekit.off('live', listener);
```

<br/>
#### gesturekit#getListeners(event)
Returns all `listeners` from the collection for a specified `event`.
- `event`: [String] - The name of the `event`.

```javascript
gesturekit.getListeners('live');
```

<br/>
#### gesturekit#emit(event, [arg1], [arg2], [...])
Execute each of the `listeners` collection in order with the given parameters.
All emitters emit the event `newListener` when new listeners are added.
- `event`: [String] - The name of the event you want to emit.

```javascript
gesturekit.emit('live', 'data1', 'data2');
```

***

### Events
GestureKit works as follows: By triggering and subscribing to the below events you can have total control of the touch and gesture interaction with the DOM. These are the available events:

#### load
Event emitted when all gestures are loaded.

```javascript
gesturekit.on('load', function (event) {
    // Some code here!
});
```
</br>

#### fail
Event emitted when the gestures load are failed.

```javascript
gesturekit.on('fail', function (event) {
    // Some code here!
});
```
</br>

#### enable
Event emitted when gesturekit is enable.

```javascript
gesturekit.on('enable', function (event) {
    // Some code here!
});
```
</br>

#### disable
Event emitted when gesturekit is disable.

```javascript
gesturekit.on('disable', function (event) {
    // Some code here!
});
```
</br>

#### recognize
Event emitted when a gesture is recognized.

```javascript
gesturekit.on('recognize', function (event) {
    // Some code here!
});
```
</br>

#### notrecognize
Event emitted when a gesture is not recognized.

```javascript
gesturekit.on('notrecognize', function (event) {
    // Some code here!
});
```
</br>

#### pointerstart
Event emitted when the user touch the sensor.

```javascript
gesturekit.on('pointerstart', function (event) {
    // Some code here!
});
```
</br>

#### pointermove
Event emitted when the user move your fingers over the sensor.

```javascript
gesturekit.on('pointermove', function (event) {
    // Some code here!
});
```
</br>

#### pointerend
Event emitted when the user stop to touch the sensor.

```javascript
gesturekit.on('pointerend', function (event) {
    // Some code here!
});
```
</br>

#### gesturestart
Event emitted when the recognition of a gesture is started.

```javascript
gesturekit.on('gesturestart', function (event) {
    // Some code here!
});
```
</br>

#### gesturemotion
Event emitted while the gesture motion is taken place.

```javascript
gesturekit.on('gesturemotion', function (event) {
    // Some code here!
});
```
</br>

#### gestureend
Event emitted when the recognition of a gesture is finished.

```javascript
gesturekit.on('gestureend', function (event) {
    // Some code here!
});
```
</br>

***

##  Development setup



  1. Install [Git](http://git-scm.com/) and [NodeJS](http://nodejs.org/).
  
  2. Open your terminal and clone `roamtouch/GestureKit` by running:
    ```
    $ git clone git@github.com:roamtouch/GestureKit.git
    ```
    
  3. Now go to the project's folder:
    ```
    $ cd GestureKit
    ```
    
  4. Install its dependencies:
    ```
    $ npm install
    ```
    
  5. Install `grunt-cli`:
    ```
    $ npm install grunt-cli -g
    ```

  6. Develop!
  
***  

## Grunt tasks
- `grunt dev`: Builds a development version.
- `grunt test`: Runs Jasmine tests.
- `grunt dist`: Creates a distrubution version of GestureKit. You should find two files: `.dist/gesturekit.js` and `.dist/gesturekit.min.js`.

***

## Maintained by
- Guille Paz (Front-end developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)

***
## Credits

<img src="http://www.gesturekit.com/assets/img/roamtouch.png" width="200" alt="RoamTouch logo">

***
## License
Licensed under Apache v2 License.

Copyright (c) 2014 [RoamTouch](http://github.com/RoamTouch).

