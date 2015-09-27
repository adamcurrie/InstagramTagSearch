module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dev: {
                files: {
                    'public/javascripts/bundle.js': ['views/react/*.jsx']
                },
                options: {
                    transform: [
                        'babelify', 'reactify'
                    ]
                },
            }
        },
        watch: {
            src: {
                files: ['views/react/**/*.jsx'],
                tasks: ['browserify:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('start:dev', ['browserify', 'watch']);

    grunt.registerTask('default', 'browserify');
};