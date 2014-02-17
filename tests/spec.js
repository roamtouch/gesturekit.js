describe('GestureKit', function () {
    gesturekit.init();

    it('should be defined.', function () {
        expect(typeof gesturekit).toEqual('object');
    });
});

describe('GestureKit should have the following methods:', function () {
    var methods = ['on', 'off', 'emit', 'once', 'getListeners', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(gesturekit[methods[i]]).not.toEqual(undefined);
                expect(typeof gesturekit[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('GestureKit version', function () {
    it('should be defined.', function () {
        expect(typeof gesturekit.version).toEqual('string');
    });
});

describe('GestureKit emitter', function () {
    var listener,
        listener2,
        listener3;

    beforeEach(function() {
        listener = jasmine.createSpy('listener'),
        listener2 = jasmine.createSpy('listener2'),
        listener3 = jasmine.createSpy('listener3');
    });

    describe('.on(event, listener)', function () {

        it('Should call all listeners when it emits an event', function () {
            gesturekit.on('something', listener);
            gesturekit.on('something', listener2);

            gesturekit.emit('something');

            expect(listener).toHaveBeenCalled();
            expect(listener2).toHaveBeenCalled();
        });

    });

    describe('.once(event, listener)', function () {
        it('Should call listener only one time', function () {
            gesturekit.once('something', listener3);

            expect(gesturekit.getListeners('something').length).toEqual(3);

            gesturekit.emit('something');

            expect(gesturekit.getListeners('something').length).toEqual(2);
        });
    });


    describe('.off(event, listener)', function () {

        it('Should remove a listener', function () {
            gesturekit.on('something', listener);
            gesturekit.off('something', listener);
            gesturekit.emit('something');

            expect(listener).not.toHaveBeenCalled();
        });

    });

    describe('.getListeners()', function () {

        it('Should return a collection', function () {
            gesturekit.on('something', listener);

            expect(function(){
                gesturekit.getListeners('something');
            }).not.toThrow();

            expect(typeof gesturekit.getListeners('something')).toEqual("object");

        });
    });

    describe('.emit(event, param1, param2, ..., paramsN)', function () {
        beforeEach(function () {
            gesturekit.on('something', listener);
            gesturekit.on('something', listener2);
        });

        it('Should emit call all listeners', function () {
            gesturekit.emit('something');

            expect(listener).toHaveBeenCalled();
            expect(listener2).toHaveBeenCalled();
        });

        it('Should emit call all listeners with parameters', function () {
            gesturekit.emit('something', 'param1');

            expect(listener).toHaveBeenCalledWith('param1');
        });
    });
});