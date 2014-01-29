module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        'banner': {
            'full': [
                '/*!',
                ' * GestureKit v<%= pkg.version %>',
                ' * http://gesturekit.com/',
                ' *',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>, RoamTouch',
                ' * Released under the Apache v2 License.',
                ' * http://gesturekit.com/',
                ' */\n'
            ].join('\n'),
            'min': '/*! GestureKit v<%= pkg.version %> http://gesturekit.com/ | Released under the Apache v2 License. */'
        },

        'browserify': {
            'options': {
                'standalone': 'gesturekit'
            },

            'dist': {
                'files': {
                    'build/gesturekit.js': ['./src/index.js']
                }
            }
        },

        'concat': {
            'options': {
                'stripBanners': {
                    'options': {
                        'block': true,
                        'line': true
                    }
                }
            },

            'js': {
                'options': {
                    'banner': '<%= banner.full %>'
                },
                'src': ['./build/gesturekit.js'],
                'dest': './dist/gesturekit.js'
            }
        },

        'uglify': {
            'options': {
                'mangle': true,
                'banner': '<%= banner.min %>'
            },

            'js': {
                'src': ['<%= concat.js.src %>'],
                'dest': './dist/gesturekit.min.js'
            }

        },

        'jslint': { // configure the task
            'files': ['<%= concat.js.dest %>'],
            'directives': {
                'browser': true,
                'nomen': true,
                'todo': true
            },
            'options': {
                'errorsOnly': true, // only display errors
                'failOnError': false, // defaults to true
                'shebang': true, // ignore shebang lines
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jslint');

    // Resgister task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('dev', ['browserify']);
    grunt.registerTask('lint', ['dev', 'concat', 'jslint']);
    grunt.registerTask('dist', ['dev', 'concat', 'uglify']);
};