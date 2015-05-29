/*jshint node:true */
"use strict";
function semicolonize(sourceCode) {
	var acorn = require('acorn');

	var insertions = [];
	var removals = [];

	var ast = acorn.parse(sourceCode, {
		ecmaVersion: 6, // Nothing too bad would happen
		allowImportExportEverywhere: true,
		allowHashBang: true,
		onInsertedSemicolon: function onInserted(index) {
			insertions.push(index);
		}
	});

	var walker = require('acorn/dist/walk').simple(ast, {
		EmptyStatement: function onEmptyStatement(node) {
			removals.push(node.start);
		}
	});

	if (insertions.length === 0 && removals.length === 0){
		return sourceCode;
	}

	var semicolonizedCode = '';

	// Evil replacement logic
	var removalIndex = 0;
	var insertionIndex = 0;
	var sourceOffset = 0;
	while (true) {
		var removalsLeft = (removalIndex < removals.length);
		var insertionsLeft = (insertionIndex < insertions.length);
		if (!removalsLeft && !insertionsLeft) {
			break;
		}

		if (!insertionsLeft || removals[removalIndex] < insertions[insertionIndex]) {
			semicolonizedCode += sourceCode.substring(sourceOffset, removals[removalIndex]);
			sourceOffset = removals[removalIndex] + 1;
			removalIndex++;
		} else {
			semicolonizedCode += sourceCode.substring(sourceOffset, insertions[insertionIndex]) + ';';
			sourceOffset = insertions[insertionIndex];
			insertionIndex++;
		}
	}
	semicolonizedCode += sourceCode.substring(sourceOffset);
	return semicolonizedCode;
}

module.exports = semicolonize;
