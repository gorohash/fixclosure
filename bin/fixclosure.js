#!/usr/bin/env node

var clc = require('cli-color');
var program = require('commander');
var fs = require('fs');
var _ = require('underscore');
var fixclosure = require('../');
var Parser = fixclosure.Parser;

function list(val) {
  return val.split(',');
}

function map(val) {
  var map = {};
  val.split(',').forEach(function(item) {
    var entry = item.split(':');
    map[entry[0]] = entry[1];
  });
  return map;
}

program
  .version(require('../package.json').version, '-v, --version')
  .usage('[options] files...')
  .option('-f, --fix-in-place', 'Fix the file in-place.')
  .option('--roots <roots>', 'Root of target package to provide and require separated by comma. Dafault: "goog"', list)
  .option('--packageMethods <methods>', 'Method exprted as a package itself. Comma separated list.', list)
  .option('--replaceMap <map>', 'Method replace map. Like "before1:after1,before2:after2"', map)
  .parse(process.argv);

if (program.args.length < 1) {
  program.outputHelp();
  process.exit(1);
}

program.args.forEach(function(file) {
  console.log(clc.yellow('File: ' + file + '\n'));
  var src = fs.readFileSync(file, 'utf-8');
  var options = {
    roots: program.roots,
    packageMethods: program.packageMethods,
    replaceMap: program.replaceMap
  };
  var parser = new Parser(options);
  var info = parser.parse(src);
  console.log(clc.green('Provided:'));
  console.log(info.provided.join('\n'));
  console.log('');
  console.log(clc.green('Required:'));
  console.log(info.required.join('\n'));
  console.log('');

  var needToFix = false;

  var dupProvide = getDuplicated(info.provided);
  if (dupProvide.length > 0) {
    needToFix = true;
    console.log(clc.red('Duplicated Provide:'));
    console.log(_.uniq(dupProvide).join('\n'));
    console.log('');
  }

  var missingProvide = _.difference(info.toProvide, info.provided);
  if (missingProvide.length > 0) {
    needToFix = true;
    console.log(clc.red('Missing Provide:'));
    console.log(missingProvide.join('\n'));
    console.log('');
  }

  var unnecessaryProvide = _.difference(info.provide, info.toProvide);
  if (unnecessaryProvide.length > 0) {
    needToFix = true;
    console.log(clc.red('Not Provided Actually:'));
    console.log(unnecessaryProvide.join('\n'));
    console.log('');
  }

  var dupRequire = getDuplicated(info.required);
  if (dupRequire.length > 0) {
    needToFix = true;
    console.log(clc.red('Duplicated Require:'));
    console.log(_.uniq(dupRequire).join('\n'));
    console.log('');
  }

  var missingRequire = _.difference(info.toRequire, info.required);
  if (missingRequire.length > 0) {
    needToFix = true;
    console.log(clc.red('Missing Require:'));
    console.log(missingRequire.join('\n'));
    console.log('');
  }

  var unnecessaryRequire = _.difference(info.required, info.toRequire);
  if (unnecessaryRequire.length > 0) {
    needToFix = true;
    console.log(clc.red('Not Required Actually:'));
    console.log(unnecessaryRequire.join('\n'));
    console.log('');
  }

  if (needToFix) {
    console.log(clc.red('FAIL!'));
    if (program.fixInPlace) {
        fixclosure.fix(file, info);
        console.log(clc.green('Fixed!'));
    }
  } else {
    console.log(clc.green('GREEN!'));
  }
});

function getDuplicated(namespaces) {
  var dups = [];
  namespaces.reduce(function(prev, cur) {
    if (prev === cur) {
      dups.push(cur);
    }
    return cur;
  }, null);
  return dups;
}
