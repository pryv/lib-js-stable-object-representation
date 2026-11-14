/**
 * @license
 * Copyright (C) 2020-2021 Pryv S.A. https://pryv.com 
 * This file is part of Open-Pryv.io and released under BSD-Clause-3 License
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*global describe, it, before*/

var bcLib = require('../../src');
var should = require('should');


describe('Access', function () {
  var validHash = 'ACCESS:0:sha256-VflZ9u3yegxJKbdQLRErRXklqmtcxTqh7ydKP1EFs94=';

  describe('Hash', function () {
    it('Compute as expected', function (done) {
      var { integrity }  = bcLib.access.compute(require('../data/accessA-valid.json'));
      validHash.should.equal(integrity);
      done();
    });
  });



  describe('Stringfy', function () {

    it('Valid JSON', function (done) {
      var original = require('../data/accessA-valid.json');
      var resultStr = bcLib.access.stringify(original);
      JSON.parse(resultStr);
      // TODO test could be completed with deep equals

      done();
    });
  });


  describe('Compute', function () {
    it('Valid Object', function (done) {
      var original = require('../data/accessA-valid.json');
      var result = bcLib.access.compute(original);
      should.exist(result.key);
      ('ACCESS:0:ckqhvwb5t0006bmpvyrqud5gr:1624961123.201').should.equal(result.key);
      should.exist(result.integrity);
      result.integrity.should.equal(validHash);
      done();
    });


    it('Valid Object with ignored properties', function (done) {
      var ignored = require('../data/accessA-valid-ignored.json');
      var result = bcLib.access.compute(ignored);
      should.exist(result.key);
      ('ACCESS:0:ckqhvwb5t0006bmpvyrqud5gr:1624961123.201').should.equal(result.key);
      should.exist(result.integrity);
      result.integrity.should.equal(validHash);
      done();
    });

    it('Ignores usage', function () {
      var withUsage = Object.assign({}, require('../data/accessA-valid.json'), {
        usage: { total: 3, reads: 2, writes: 1, session: 0, other: 0, byMethod: { 'events.get': 2, 'events.create': 1 } }
      });
      bcLib.access.compute(withUsage).integrity.should.equal(validHash);
      bcLib.access.hash(withUsage).should.equal(validHash);
    });

    it('Uses the given algorithm', function () {
      var original = require('../data/accessA-valid.json');
      var result = bcLib.access.compute(original, 'sha512');
      result.integrity.should.startWith('ACCESS:0:sha512-');
      result.integrity.should.equal(bcLib.access.hash(original, 'sha512'));
      result.key.should.equal(bcLib.access.key(original));
    });

    it('Works when detached from the module', function () {
      var compute = bcLib.access.compute;
      compute(require('../data/accessA-valid.json')).integrity.should.equal(validHash);
    });
  });

});

