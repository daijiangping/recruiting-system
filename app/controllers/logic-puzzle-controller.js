'use strict';

var logicPuzzle = require('../models/logic-puzzle');
var constant = require('../mixin/constant');
var time = require('../mixin/time');
var async = require('async');
var apiRequest = require('../services/api-request');
var httpCode = require('../mixin/constant');

function LogicPuzzleController() {
}

LogicPuzzleController.prototype.getLogicPuzzle = function (req, res) {
  var orderId = req.query.orderId;
  var userId = req.session.user.id;

  logicPuzzle.getLogicPuzzle(orderId, userId)
      .then((data) => {
        res.send(data);
      });
};

LogicPuzzleController.prototype.saveAnswer = function (req, res) {
  var orderId = req.body.orderId;
  var userAnswer = req.body.userAnswer;
  var userId = req.session.user.id;
  async.waterfall([
    function (done) {
      logicPuzzle.findOne({userId: userId}, done);
    }, function (data, done) {

      if (orderId > data.quizExamples.length - 1) {
        data.quizItems[orderId - data.quizExamples.length].userAnswer = userAnswer;
        data.save((err, doc)=> {
          done(err, doc);
        });
      } else {
        done(null, 'doc');
      }
    }, function (doc, done) {
      done();
    }
  ], function (err) {
    if (!err) {
      res.sendStatus(constant.OK);
    } else {
      res.sendStatus(constant.INTERNAL_SERVER_ERROR);
    }
  });
};

LogicPuzzleController.prototype.submitPaper = function (req, res) {
  var examerId = req.session.user.id;
  var endTime = Date.parse(new Date()) / time.SECONDS;
  var scoreSheetUri = 'scoresheets';
  var data;
  async.waterfall([
    function (done) {
      logicPuzzle.findOne({userId: examerId}, done);
    },
    function (doc, done) {
      var itemPosts = [];
      data = doc;
      data.quizItems.forEach(function (quizItem) {
        itemPosts.push({answer: quizItem.userAnswer, quizItemId: quizItem.id});
      });
      var body = {
        examerId: examerId,
        paperId: data.paperId,
        blankQuizSubmits: [
          {
            blankQuizId: data.blankQuizId,
            itemPosts: itemPosts
          }
        ]
      };
      done(null, body);
    },
    function (body, done) {
      apiRequest.post(scoreSheetUri, body, done);
    },
    function (responds, done) {
      data.endTime = endTime;
      data.isCommited = true;
      data.save((err, doc)=> {
        done(err, doc);
      });
    }
  ], function (err) {
    if (!err) {
      res.send({status: httpCode.OK});
    }
  });

};

module.exports = LogicPuzzleController;