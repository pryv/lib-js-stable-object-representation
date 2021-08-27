/**
 * @license
 * Copyright (C) 2020-2021 Pryv S.A. https://pryv.com 
 * This file is part of Open-Pryv.io and released under BSD-Clause-3 License
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*global describe, it, before*/

var bcLib = require('../../src/');
var should = require('should');


describe('Event', function () {
  var validHash = 'EVENT:0:sha256-+xTTV7/rlK5muxnopZoW+Y8ECaZbxYW9+DQjEtIbpis=';

  describe('Hash', function () {
    it('Compute as expected', function (done) {
      var { payload }  = bcLib.event.compute(require('../data/eventA-v1-valid.json'));
      validHash.should.equal(payload);
      done();
    });

    it('Identical hash for two differtly shapped events json', function (done) {
      var hash1 = bcLib.event.hash(require('../data/eventA-v1-valid.json'));
      var hash2 = bcLib.event.hash(require('../data/eventA-v2-valid.json'));
      hash1.should.equal(hash2);
      done();
    });
  });

  describe('Key', function () {
    it('event.key()', function (done) { 
      var key = bcLib.event.key(require('../data/eventA-v1-valid.json'));
      ('EVENT:0:ciusga35r000sgwg4o1sr1j5q:1477575221.247').should.equal(key);
      done();
    });
  });


  describe('Stringify', function () {

    it('Valid JSON', function (done) {
      var original = require('../data/eventA-v1-valid.json');
      var resultStr = bcLib.event.stringify(original);
      JSON.parse(resultStr);
      // TODO test could be completed with deep equals

      done();
    });

  });



  describe('Stringfy', function () {

    it('Valid JSON', function (done) {
      var original = require('../data/eventB-valid.json');
      var resultStr = bcLib.event.stringify(original);
      JSON.parse(resultStr);
      // TODO test could be completed with deep equals

      done();
    });
  });


  describe('Compute', function () {
    it('Valid Object', function (done) {
      var original = require('../data/eventA-v1-valid.json');
      var result = bcLib.event.compute(original);
      should.exist(result.key);
      ('EVENT:0:ciusga35r000sgwg4o1sr1j5q:1477575221.247').should.equal(result.key);
      should.exist(result.payload);
      result.payload.should.equal(validHash);


      done();
    });
  });

});

