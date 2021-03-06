/*
 * Copyright (c) 2016-2017 Untu, Inc.
 * This code is licensed under Eclipse Public License - v 1.0.
 * The full license text can be found in LICENSE.txt file and
 * on the Eclipse official site (https://www.eclipse.org/legal/epl-v10.html).
 */

'use strict';

var common = require('../utils/common.js');
var P = require('bluebird');
var _ = require('underscore');

/**
 * Abstract actor reference marshaller.
 */
class AbstractActorReferenceMarshaller {
  /**
   * @param {ActorSystem} system Actor system.
   */
  constructor(system) {
    this.system = system;
    this.refs = {}; // Existing actor references.
  }

  /**
   * Marshalls an actor instance.
   *
   * @param {Actor} actor Actor to marshall.
   * @returns {Promise} Data transfer object promise.
   */
  marshall(actor) {
    var id = actor.getId();
    var refPromise = this.refs[id];

    if (!refPromise) {
      var ref = this._createReferenceTarget(actor);
      refPromise = this.refs[id] = ref.initialize(this.system).return(ref);
    }

    return refPromise.then(ref => ref.toJSON());
  }

  /**
   * Un-marshalls actor reference from data transfer object.
   *
   * @param {Object} msg Data transfer object.
   * @returns {Promise} Un-marshalled actor reference instance promise.
   */
  unmarshall(msg) {
    var id = msg.actorId;
    var refPromise = this.refs[id];

    if (!refPromise) {
      var ref = this._createReferenceSource(msg);
      refPromise = this.refs[id] = ref.initialize(this.system).return(ref);
    }

    return refPromise.then(ref => ref.toActorProxy(this.system));
  }

  /**
   * Destroys this marshaller, closing all references and freeing all resources.
   *
   * @returns {Promise} Operation promise.
   */
  destroy() {
    return P.map(_.values(this.refs), ref => ref.destroy());
  }

  /**
   * Creates a new instance of reference target. Should be implemented in sub-class.
   *
   * @param {Actor} actor Reference target actor.
   * @returns {Object} Reference target instance.
   * @protected
   */
  _createReferenceTarget(actor) {
    return common.abstractMethodError('_createReferenceTarget', actor);
  }

  /**
   * Creates a new instance of reference source. Should be implemented in sub-class.
   *
   * @param {Object} msg Reference data transfer object message.
   * @returns {Object} Reference source instance.
   * @private
   */
  _createReferenceSource(msg) {
    return common.abstractMethodError('_createReferenceSource', msg);
  }
}

module.exports = AbstractActorReferenceMarshaller;