module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    console: true,
                    module: true
                }
          }
        },
        
        clean: {
            build: ["build/"]
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                expand: true, // Enable dynamic expansion.
                cwd: 'src/', // Src matches are relative to this path.
                src: ['**/*.js'], // Actual pattern(s) to match.
                dest: 'build/', // Destination path prefix.
                ext: '.js' // Dest filepaths will have this extension.
            }
        },

        shell: {
            install: {
                options: {
                    stdout:true,
                    stderr: true,
                    failOnError: true
                },
                command: [
                    'mkdir -p <%= baseDir %>',
                    'cp -rf build config public views package.json <%= baseDir %>',
                    'cd <%= baseDir %>',
                    'npm install --production'
                ].join('&&')
            },
            uninstall: {
                options: {
                    stdout:true,
                    stderr: true,
                    failOnError: true
                },
                command: 'rm -rf <%= baseDir %>'
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['test']
        },
        
        baseDir: '/data/apps/<%=pkg.name%>'
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');


    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('build', ['jshint', 'mochaTest', 'clean:build', 'uglify']);
    grunt.registerTask('deploy', ['build', 'shell:uninstall', 'shell:install']);
    grunt.registerTask('default', ['test']);
    
};