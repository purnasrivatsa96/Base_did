/**
* methods for reading and writing files, traversing the filesystem and finding files by matching globbing patterns. 
* Many of these methods are wrappers around built-in Node.js file functionality, but with additional error handling, logging and character encoding normalization.
*/

'use strict';

module.exports = function(grunt){

	require('time-grunt')(grunt);

	require('jit-grunt')(grunt, {useminPrepare: 'grunt-usemin'});

	const sass = require('node-sass');

	grunt.initConfig({
		sass: {
			options: {
	            implementation: sass,
	            sourceMap: true
        		},
			dist: {
				files: {
					'css/styles.css': 'css/styles.scss'
				}
			}
		},
		// watch: {
		// 	files: 'css/*.scss',
		// 	tasks: ['sass'] 
		// },
		browserSync: {
			dev: {
				bsFiles: {
					src: [
						'css/*.css',
						'*.html',
						'js/*.js'
					]
				},
				options: {
					watchTask: true,
					server: {
						baseDir: './'
					}
			   }
			},
		},
		copy: {
				html: {
					files: [{
						expand: true,
						dot: true,
						cwd: './',
						src: ['*.html'],
						dest: 'dist'
					}]
				},
				fonts: {
					files: [{
						expand: true,
						dot: true,
						cwd: 'node_modules/font-awesome',
						src:['fonts/*.*'],
						dest:'dist'
					}]
				},
				backend: {
					files: [{
					  cwd: 'dist',  // set working folder / root to copy
					  src: ['**/*'],           // copy all files and subfolders
					  dest: '../backend/public',    // destination folder
					  expand: true           // required when using cwd
					}]
				  }
			},
		clean: {
			build :{
				src: [ 'dist/']
			}
		},
		imagemin: {
			dynamic:{
				files: [{
					expand: true,
					dot: true,
					cwd: './',
					src: ['img/*.{png,jpg,gif,svg}'],
					dest: 'dist/'
				}]
			} 
		},
		useminPrepare:{
			foo: {
				dest: 'dist',
                src: ['index.html']
			},
			options: {
				flow: {
					steps: {
						css: ['cssmin'],
						js: ['uglify']
					},
					post: {
						css: [{
							name: 'cssmin',
							createConfig: function (context, block){
								var generated  = context.options.generated;
								generated.options = {
									keepSpecialComments: 0,rebase:false
								};
							}
						}]
					}
				}
			}
		},
		concat : {
			options: {
				separator: ';'
			},
			dist: {}
		},
		uglify: {
			dist: {}
		},
		cssmin: {
			dist: {}
		},
		filerev : {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 20
			},
			release: {
				files: [{
					src: [
					'dist/js/*.js',
					'dist/css/*.css',
					]
				}]
			}
		},
		usemin : {
			html: ['dist/index.html','dist/details.html','dist/login.html'],
			options: {
                assetsDirs: ['dist', 'dist/css','dist/js']
            }
		},
		htmlmin: {                                         // Task
            dist: {                                        // Target
                options: {                                 // Target options
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'dist/index.html',  // 'destination': 'source'
                    'dist/details.html': 'dist/details.html',
                    'dist/login.html': 'dist/login.html',
                }
            }
        },
		watch: {
			files: [
				'css/*.css',
				'*.html',
				'js/*.js'
			],
			tasks: [
				'clean',
				'copy:html',
				'copy:fonts',
				'imagemin',
				'useminPrepare',
				'concat',
				'cssmin',
				'uglify',
				'filerev',
				'usemin',
				'htmlmin',
				'copy:backend'
				]
		}
	});

	grunt.registerTask('css',['sass']);
	grunt.registerTask('default', ['browserSync', 'watch']);
	grunt.registerTask('build',[
		'clean',
		'copy',
		'imagemin',
		'useminPrepare',
		'concat',
		'cssmin',
		'uglify',
		'filerev',
		'usemin',
		'htmlmin'
		]);
	grunt.registerTask('watchrebuild', ['watchrebuild']);
};
