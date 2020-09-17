var JsFiles =  [
            './assets/js/appstart.js',
            './assets/js/intro.js',
            './assets/js/fn/ayat.js',
            './assets/js/fn/tooltip.js',
            './assets/js/fn/btntools.js',
            './assets/js/fn/initApp.js',
            './assets/js/fn/global.js',
            './assets/js/fn/swiper.js',
            './assets/js/fn/sections.js',
            './assets/js/fn/searchbar.js',
            './assets/js/fn/search.js',
            './assets/js/fn/searchmeanings.js',
            './assets/js/fn/bookmark.js',
            './assets/js/fn/tafsir.js',
            './assets/js/fn/sour.js',
            './assets/js/fn/ayat.js',
            './assets/js/fn/words.js',
            './assets/js/fn/mediasound.js',
            './assets/js/fn/settings.js',
            './assets/js/recitations.js',
            './assets/js/fn/downloader.js',
            './assets/js/fn/page.js',
            './assets/js/globalPages.js',
            './assets/js/index.js',
            './assets/js/fn/test.js',
            './assets/js/init.js'
            ];

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    //-----------------------------------------------------------------------------
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            all: {
                options: {
                    outputStyle: 'expanded', //Output: nested, expanded, compact, compressed
                    sourceMap: true,
                    sourceComments: false
                },
                files: [{
                    expand: true,
                    cwd: './assets/scss',
                    src: ['**/*.scss'],
                    dest: 'www/css/',
                    ext: '.css'
}]
            }
        },
        postcss: {
            options: {
                processors: [
require('pixrem')(),
require('autoprefixer')({
                        browsers: ["last 2 versions", "Android >= 4.1", "Safari >= 7"]
                    }),
require('cssnano')()
]
            },
            all: {
                files: {
                    "www/css/style.min.css": "www/css/style.css",
                }
            },
        },
        'json-minify': {
            build: {
                files: './assets/json/**/*.json'

            }
        },
        svgmin: {
            p: {
                options: {
                    plugins: [{
                        removeViewBox: false
}, {
                        removeUselessStrokeAndFill: false
}, {
                        removeEmptyAttrs: true
}]
                },
                files: [{
                    expand: true,
                    cwd: './assets/images/',
                    src: ['**/*.svg'],
                    dest: 'www/img/',
}]
            }

        },

        concat: {
            options: {
                separator: ';\n',
                stripBanners: {
                    line: true,
                    block: true

                }
            },
            dist: {
                files: { 'www/js/app.js': JsFiles }
            },
        },
        uglify: {
            all: {
                options: {
                    sourceMap: false,
                    beautify: false,

                },
                files: {
                    'www/js/app.min.js': ['www/js/app.js']
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['./assets/js/**/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        watch: {
            options: {
                dateFormat: function (time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                },
                livereload: true,
            },
            scripts: {
                files: ['./assets/js/**/*.js', '!*.min.js'],
                tasks: ['concat', 'uglify'], //'exec:prepare'
                options: {
                    spawn: false,
                }
            },
            style: {
                files: ['assets/scss/**/*.scss'],
                tasks: ['sass', 'postcss'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            material: {
                files: ['framework7/src/less/material/**/*.less'],
                tasks: ['less:material'],
                options: {
                    spawn: false,
                }
            },
            ios: {
                files: ['framework7/src/less/ios/**/*.less'],
                tasks: ['less:ios'],
                options: {
                    spawn: false,
                }
            },
            svg: {
                files: ['assets/images/**/*.svg'],
                tasks: ['svgmin'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            //            www: {
            //                files: ['www/**/*.*'],
            //                tasks: ['exec:prepare'],
            //                options: {
            //                    spawn: false,
            //                    livereload: true
            //                }
            //            }
        },
        // less: {
        //     material: {
        //         files: {
        //             "www/css/framework7.material.colors.min.css": "framework7/src/less/material/framework7.material.colors.less",
        //             "www/css/framework7.material.min.css": "framework7/src/less/material/framework7.material.less",
        //             "www/css/framework7.material.rtl.min.css": "framework7/src/less/material/framework7.material.rtl.less",
        //         },
        //         options: {
        //             compress: true
        //         }
        //     },
        //     ios: {
        //         files: {
        //             "www/css/framework7.ios.colors.min.css": "framework7/src/less/ios/framework7.ios.colors.less",
        //             "www/css/framework7.ios.min.css": "framework7/src/less/ios/framework7.ios.less",
        //             "www/css/framework7.ios.rtl.min.css": "framework7/src/less/ios/framework7.ios.rtl.less",
        //         },
        //         options: {
        //             compress: true
        //         }
        //     }
        // },
        // exec: {
        //     prepare: {
        //         command: "cordova prepare",
        //         stdout: true,
        //         stderror: true
        //     },
        //     serve: {
        //         command: "cordova serve",
        //         stdout: true,
        //         stderror: true
        //     }
        // },
        concurrent: {
            Prepare: [],
            WatchAndServe: {
                tasks: ['watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    }); // grunt.initConfig End
    grunt.registerTask('default', ['concurrent']);
};
