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
            this.trigger({success: true});
            this.trigger({isRespond: false});
            this.trigger({oldPassword:'',newPassword: '', confirmPassword: ''});
          } else if (req.body.status === constant.httpCode.BAD_REQUEST) {
            this.trigger({oldPasswordError: constant.changePassword.ERROR});
            this.trigger({isRespond: false});
          } else {
            console.log('error');
          }
        });
  }
});

module.exports = ChangePasswordStore;
