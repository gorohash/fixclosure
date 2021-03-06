goog.provide('goog.provide.dup');
goog.provide('goog.provide.dup');
goog.provide('goog.provide.ignore'); // fixclosure: ignore
goog.provide('goog.provide.unnecessary');

goog.require('goog.require.dup');
goog.require('goog.require.dup');
goog.require('goog.require.ignore'); // fixclosure: ignore
goog.require('goog.require.unnecessary');

goog.requireType('goog.requireType.dup');
goog.requireType('goog.requireType.dup');
goog.requireType('goog.requireType.ignore'); // fixclosure: ignore
goog.requireType('goog.requireType.unnecessary');

goog.forwardDeclare('goog.forwardDeclare.dup');
goog.forwardDeclare('goog.forwardDeclare.dup');
goog.forwardDeclare('goog.forwardDeclare.ignore'); // fixclosure: ignore
goog.forwardDeclare('goog.forwardDeclare.unnecessary');

/**
 * @param {goog.requireType.dup} a
 * @param {goog.forwardDeclare.dup} b
 * @param {goog.require.dup} c
 */
goog.provide.dup.foo = function(a, b, c) {
    goog.require.dup.foo();
};

/**
 * @param {goog.requireType.missing} a
 * @param {goog.forwardDeclare.missing} b
 */
goog.provide.missing.foo = function(a, b) {
    goog.require.missing.foo();
};
