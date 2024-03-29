/**
 * @license
 * Copyright (C) 2020-2021 Pryv S.A. https://pryv.com 
 * This file is part of Open-Pryv.io and released under BSD-Clause-3 License
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lib = require('./lib/');

module.exports.hash = function hash(access, algorithm) {
  var a = stringifyAccess0(access);
  return 'ACCESS:0:' + lib.hash(a, algorithm);
};

module.exports.stringify = function (access) {
  return stringifyAccess0(access);
};

module.exports.key = function key(access) {
  if (access.modified == null) {
    var deletedTime = cleanDeleted(access.deleted)
    return 'ACCESS:0:' + access.id + ':' + deletedTime;
  }
  return 'ACCESS:0:' + access.id + ':' + access.modified;
};

module.exports.compute = function (access) {
  return { key: this.key(access), integrity: this.hash(access) }
};

// -- Internal to Pryv.io 
function cleanDeleted(deleted) {
  return (deleted instanceof Date) ? deleted.getTime() / 1000 : deleted;
}

// -- add null properties of accesss

function stringifyAccess0(access) {
  // costlty but portable cloning
  var a = JSON.parse(JSON.stringify(access));

  // remove integrity for computation :) 
  delete a.integrity;

  // delete lastUsed for computation .. 
  delete a.lastUsed; 

   // delete calls for computation .. 
   delete a.calls;

  // delete apiEndPoint for computation .. 
  delete a.apiEndpoint; 

  // remove null deleted property
  if (a.deleted == null) {
    delete a.deleted;
  } else {
    a.deleted = cleanDeleted(access.deleted)
  }
  
  return lib.stringify(a, true);
}