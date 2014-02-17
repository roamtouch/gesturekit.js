# [GestureKit v1.1.0](http://gesturekit.com) [![Build Status](https://secure.travis-ci.org/RoamTouch/GestureKit.png)](http://travis-ci.org/RoamTouch/GestureKit) [![devDependency Status](https://david-dm.org/RoamTouch/GestureKit/dev-status.png)](https://david-dm.org/RoamTouch/GestureKit#info=devDependencies)

> A JavaScript library to recognize advanced gestures on web browsers.

Advantages:

- It's small and standalone.
- Dependency-free.
- Just 3 kb (min & gzip).
- Multi-device support.
- Easy-implementation.
- Made it with love.

## API

### Table of contents
- Properties
    - [.version](#)
    - [.sensor](#)

- Methods
    - [.init()](#)
    - [.enable()](#)
    - [.disable()](#)
    - [.on()](#)
    - [.once()](#)
    - [.off()](#)
    - [.getListeners()](#)
    - [.emit()](#)

- Events
    - [load](#)
    - [fail](#)
    - [enable](#)
    - [disable](#)
    - [recognize](#)
    - [notrecognize](#)
    - [pointerstart](#)
    - [pointermove](#)
    - [pointerend](#)
    - [gesturestart](#)
    - [gesturemotion](#)
    - [gestureend](#)

#### gesturekit#init(options | uid)
Initialize an instance of GestureKit.
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

Copyright (c) 2013 [RoamTouch](http://github.com/RoamTouch).