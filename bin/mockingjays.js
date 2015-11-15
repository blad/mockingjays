#!/usr/bin/env node
var Mockingjays = require('../mockingjays')
var OptionParser = require('./option_parser')
new Mockingjays().start(OptionParser.parse(process.argv));
