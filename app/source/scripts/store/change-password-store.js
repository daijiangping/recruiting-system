'use strict';

var Reflux = require('reflux');
var ChangePasswordActions = require('../actions/change-password-actions');
var request = require('superagent');
var page = require('page');
var constant = require('../../../mixin/constant');

var ChangePasswordStore = Reflux.createStore({
  listenables: [ChangePasswordActions],

  onChangePassword: function (passwordInfo) {
    this.trigger({isRespond: true});
    request.put('/user-detail/change-password')
        .set('Content-Type', 'application/json')
        .send({
          data: passwordInfo
        })
        .end((err, req) => {
          if (req.body.status === constant.httpCode.OK) {
            this.trigger({
              success: true,
              isRespond: false,
              oldPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          } else if (req.body.status === constant.httpCode.BAD_REQUEST) {
            this.trigger({
              isRespond: false,
              oldPasswordError: constant.changePassword.ERROR
            });
          } else {
            console.log('error');
          }
        });
  }
});

module.exports = ChangePasswordStore;
