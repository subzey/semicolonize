# Semicolonize

Semicolonize is a simple command line tool to fix semicolons in your JS code.

This tool does exactly what it is expected to do, missing semicolons are inserted,
extra semicolons are removed. Nothing else.

All formatting and whitespaces (including trailing ones) are preserved.
The diff would only contain added or removed semicolons.


## Installation

Run `npm install semicolonize -g`. It is expected you already have node and npm installed.


## Usage

	semicolonize [filename] [filename] […]

The "standalone" version takes provided files, fixes semicolons and **writes the result back into the same file**.

If no filenames were provided, semicolonize works reads source from stdin and writes to stdout.

Currently there's no options (except `--help`).


## As a module

Semicolonize can be used in node environment as a module.
`require('semicolonize')` returns a function with following signature:

	semicolonize(/*string */ sourceCode)

Returns a string, the code with corrected semicolons.
