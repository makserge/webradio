#!/usr/bin/env node
'use strict';
require('babel-polyfill');
require('babel-register');

const processor = require('./processor').default;
processor(process.argv.slice(2));
