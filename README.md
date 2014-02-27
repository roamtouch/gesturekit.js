# [GestureKit v1.1.0](http://gesturekit.com) [![Build Status](https://secure.travis-ci.org/RoamTouch/GestureKit.png)](http://travis-ci.org/RoamTouch/GestureKit) [![devDependency Status](https://david-dm.org/RoamTouch/GestureKit/dev-status.png)](https://david-dm.org/RoamTouch/GestureKit#info=devDependencies)

> A JavaScript library to recognize advanced gestures on web browsers.

Advantages:

- It's small and standalone.
- Dependency-free.
- Just 3 kb (min & gzip).
- Multi-device support.
- Easy-implementation.
- Made it with love.

## Compatibility
- iOS
 - iPhone/iPod iOS 6
 - iPad/iPhone iOS 7
- Android
 - Default browser
 - Chrome
 - Firefox

##Usage
### Add gesturekit.js into your HTML file.
You should {download} the library or use our link and reference the JavaScript file using a `<script>` tag somewhere on your HTML pages.
```html
<script src="http://libs.gesturekit.com/gesturekit.min.js"></script>
```

### Define your gesture listeners.
Once added the library you can create your listeners with the same name you have defined the gesture with `GK_` prefix.
```js
gesturekit.on('GK_NAME', function (event) {
    // Some code here!
});
```

### Initialize gesturekit.
Initializes the gesturekit library using the .init() method passing your `UID` as parameter.
```js
gesturekit.init({
    'uid': 'xxxx-xxxx-xxxx'
});
```

## API

### Table of contents

- [Methods](#methods)
    - [.init()](#gesturekitinitoptions--uid)
    - [.enable()](#gesturekitenable)
    - [.disable()](#gesturekitdisable)
    - [.on()](#gesturekitonevent-listener-once)
    - [.once()](#gesturekitonceevent-listener)
    - [.off()](#gesturekitoffevent-listener)
    - [.getListeners()](#gesturekitgetlistenersevent)
    - [.emit()](##gesturekitemitevent-arg1-arg2-)

- [Events](#events)
    - [load](#load)
    - [fail](#fail)
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

### Methods
#### gesturekit#init(options | uid)
Initialize an instance of GestureKit. You could customize a GestureKit instance using the following options, and shown is their default value.
- `options`: A given options to customize an instance or a string indicating a GestureKit UID.
    - `uid`: A given string indicating a GestureKit UID.
    - `sensor`: An HTMLElement to use as recognizer sensor. Default: `document.documentElement`.
    - `enabled`: Enable or disable the gesture recognition. Default: `false`.
    - `threshold`: A given number of milliseconds to set a threshold to recognize a gesture. Default: `0`.

```js
gesturekit.init({
    'uid': 'xxxx-xxxx-xxxx',
    'enabled': false
});
```

```js
gesturekit.init('xxxx-xxxx-xxxx');
```

#### gesturekit#enable()
Enables an instance of GestureKit.

```js
gesturekit.enable();
```

#### gesturekit#disable()
 Disables an instance of GestureKit.

```js
gesturekit.disable();
```

#### gesturekit#on(event, listener, [once])
Adds a `listener` to the collection for a specified `event`.
- `event`: [String] - The name of the event you want to add.
- `listener`: [Function] - Listener you want to add from given event.
- `once` (optional): [Boolean] - Indicates if the given listener should be executed only once.

```js
gesturekit.on('live', listener);
```

#### gesturekit#once(event, listener)
Adds a one time `listener` to the collection for a specified `event`. It will execute only once.
- `event`: [String] - The name of the event.
- `listener`: [Function] - Listener you want to add from the given event.

```js
gesturekit.once('live', listener);
```

#### gesturekit#off(event, listener)
Removes a `listener` from the collection for a specified `event`.
- `event`: [String] - The name of the event.
- `listener`: [Function] - Listener you want to remove from the given event.

```js
gesturekit.off('live', listener);
```

#### gesturekit#getListeners(event)
Returns all `listeners` from the collection for a specified `event`.
- `event`: [String] - The name of the `event`.

```js
gesturekit.getListeners('live');
```

#### gesturekit#emit(event, [arg1], [arg2], [...])
Execute each of the `listeners` collection in order with the given parameters.
All emitters emit the event `newListener` when new listeners are added.
- `event`: [String] - The name of the event you want to emit.

```js
gesturekit.emit('live', 'data1', 'data2');
```

### Events
GestureKit works as follows: By triggering and subscribing to the below events you can have total control of the touch and gesture interaction with the DOM. These are the available events:

#### load
Event emitted when all gestures are loaded.

```js
gesturekit.on('load', function (event) {
    // Some code here!
});
```

#### fail
Event emitted when the gestures load are failed.

```js
gesturekit.on('fail', function (event) {
    // Some code here!
});
```

#### enable
Event emitted when gesturekit is enable.

```js
gesturekit.on('enable', function (event) {
    // Some code here!
});
```

#### disable
Event emitted when gesturekit is disable.

```js
gesturekit.on('disable', function (event) {
    // Some code here!
});
```

#### recognize
Event emitted when a gesture is recognized.

```js
gesturekit.on('recognize', function (event) {
    // Some code here!
});
```

#### notrecognize
Event emitted when a gesture is not recognized.

```js
gesturekit.on('notrecognize', function (event) {
    // Some code here!
});
```

#### pointerstart
Event emitted when the user touch the sensor.

```js
gesturekit.on('pointerstart', function (event) {
    // Some code here!
});
```

#### pointermove
Event emitted when the user move your fingers over the sensor.

```js
gesturekit.on('pointermove', function (event) {
    // Some code here!
});
```

#### pointerend
Event emitted when the user stop to touch the sensor.

```js
gesturekit.on('pointerend', function (event) {
    // Some code here!
});
```

#### gesturestart
Event emitted when the recognition of a gesture is started.

```js
gesturekit.on('gesturestart', function (event) {
    // Some code here!
});
```

#### gesturemotion
Event emitted while the gesture motion is taken place.

```js
gesturekit.on('gesturemotion', function (event) {
    // Some code here!
});
```

#### gestureend
Event emitted when the recognition of a gesture is finished.

```js
gesturekit.on('gestureend', function (event) {
    // Some code here!
});
```

## Development setup
1. Install [Git](http://git-scm.com/) and [NodeJS](http://nodejs.org/).
2. Open your terminal and clone `roamtouch/GestureKit` by running:

        $ git clone git@github.com:roamtouch/GestureKit.git

3. Now go to the project's folder:

        $ cd GestureKit

4. Install its dependencies:

        $ npm install

5. Install `grunt-cli`:

        $ npm install grunt-cli -g

6. Develop! :)

## Grunt tasks
- `grunt dev`: Builds a development version.
- `grunt test`: Runs Jasmine tests.
- `grunt dist`: Creates a distrubution version of GestureKit. You should find two files: `.dist/gesturekit.js` and `.dist/gesturekit.min.js`.

## Maintained by
- Guille Paz (Front-end developer | Web standards lover)
- E-mail: [guille87paz@gmail.com](mailto:guille87paz@gmail.com)
- Twitter: [@pazguille](http://twitter.com/pazguille)
- Web: [http://pazguille.me](http://pazguille.me)

## Credits

<img src="http://www.gesturekit.com/assets/img/roamtouch.png" width="200" alt="RoamTouch logo">

## License
Licensed under Apache v2 License.

Copyright (c) 2014 [RoamTouch](http://github.com/RoamTouch).