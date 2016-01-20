'use strict';

var Reflux = require('reflux');
var HomeworkActions = require('../actions/homework-actions');
var request = require('superagent');
var constant = require('../../../mixin/constant');


var HomeworkAppStore = Reflux.createStore({
  listenables: [HomeworkActions],

  onGetFocus: function (orderId) {
    this.trigger(orderId);
  }

});

module.exports = HomeworkAppStore;