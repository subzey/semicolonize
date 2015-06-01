#!/usr/bin/env node
/*jshint node:true */
"use strict";

var modulePath = require('path').resolve.bind(null, __dirname, '..');
var semicolonize = require(modulePath('lib', 'semicolonize.js'));


var args = process.argv.slice(2);

if (args.indexOf('-h') !== -1 || args.indexOf('--help') !== -1 || args.indexOf('/?') !== -1){
	// Someone somewhere needs help
	var packageInfo = require(modulePath('package.json'));
	var executableName = 'node ' + __filename;
	if (packageInfo.bin && Object.keys(packageInfo.bin).length === 1){
		executableName = Object.keys(packageInfo.bin)[0];
	}

	console.log(packageInfo.name + ' v' + packageInfo.version);
	console.log(packageInfo.description);
	console.log('Usage:');
	console.log('\t' + executableName + ' <filename> [, <filename>, ...]');
	process.exit(1); // In case someone just ran it accidentally
}

var files = [];
var useStdin = false;

for (var i=0; i<args.length; i++){
	if (args[i].charAt(0) === '-'){
		console.error('Unknown option ' + args[i]);
		// There's no valid options actually
		process.exit(1);
	} else {
		files.push(args[i]);
	}
}

if (files.length === 0){
	useStdin = true;
}

if (useStdin){
	var buffers = [];
	process.stdin.on('readable', function(){
		var buffer = process.stdin.read();
		if (buffer){
			buffers.push(buffer);
		}
	});
	process.stdin.on('end', function(){
		process.stdout.write(semicolonize(Buffer.concat(buffers).toString('utf-8')));
	});
	process.stdin.read(0); // Force uncork
} else {
	var usedFilenames = [];
	files.forEach(function(filename){
		var fullFilename = require('path').resolve(filename);
		if (usedFilenames.indexOf(fullFilename) !== -1){
			// Do not try to process files twice
			return;
		}
		var buffers = [];
		var stream = require('fs').createReadStream(fullFilename);
		stream.on('readable', function(){
			var buffer = stream.read();
			if (buffer){
				buffers.push(buffer);
			}
		});
		stream.on('end', function(){
			var sourceCode = Buffer.concat(buffers).toString('utf-8');
			var processedCode;
			try {
				processedCode = semicolonize(sourceCode);
			} catch (e){
				console.error('Error parsing JS: ' + fullFilename);
				process.exitCode = 1;
				return;
			}
			if (processedCode === sourceCode){
				// Nothing changed
				return;
			}
			var writeStream = require('fs').createWriteStream(fullFilename);
			writeStream.on('error', function(){
					console.error('Error writing file back: ' + fullFilename);
					process.exitCode = 1;
				})
			;
			writeStream.write(processedCode);
			writeStream.end();
		});
		stream.on('error', function(e){
			console.error('Error reading file: ' + fullFilename);
			process.exitCode = 1;
		});
	});
}