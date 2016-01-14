'use strict';

var mongoose = require('mongoose');

var superAgent = require('superagent');
var agent = require('superagent-promise')(superAgent, Promise);
var apiServer = require('../configuration').apiServer;

var Schema = mongoose.Schema;

var userPuzzleSchema = new Schema({
  userId: Number,
  startTime: Number,
  quizItems: [{
    id: Number,
    question: String,
    description: String,
    chartPath: String,
    initializedBox: String,
    userAnswer: String
  }],
  quizExamples: [{
    id: Number,
    question: String,
    answer: String,
    description: String,
    chartPath: String,
    initializedBox: String
  }],
  blankQuizId: Number,
  paperId: Number,
  isCommited: Boolean,
  endTime: String
});

userPuzzleSchema.statics.isPaperCommited = function (userId, callback) {
  var isPaperCommited;

  this.findOne({userId: userId}, (err, userPuzzle) => {
    if (err || !userPuzzle) {
      isPaperCommited = false;
    } else {

      var THOUSAND_MILLISECONDS = 1000;
      var TOTAL_TIME = 5400;

      var startTime = userPuzzle.startTime || Date.parse(new Date()) / THOUSAND_MILLISECONDS;
      var now = Date.parse(new Date()) / THOUSAND_MILLISECONDS;
      var usedTime = now - startTime;

      isPaperCommited = userPuzzle.isCommited || parseInt(TOTAL_TIME - usedTime) <= 0 ? true : false;
    }

    callback(isPaperCommited);
  });
};

userPuzzleSchema.statics.getUserPuzzle = function (orderId, userId) {
  var userAnswer;
  var itemsCount;

  return this.findOne({userId: userId})
      .then(function (data) {
        data.quizExamples.forEach(function (example) {
          example.isExample = true;
        });
        data.quizItems.forEach(function (item) {
          item.isExample = false;
        });
        var quizAll = data.quizExamples.concat(data.quizItems);
        itemsCount = quizAll.length;
        return quizAll;
      })
      .then(function (quizAll) {
        userAnswer = quizAll[orderId].userAnswer || quizAll[orderId].answer || null;
        var userPuzzle = {
          item: {
            id: quizAll[orderId].id,
            initializedBox: JSON.parse(quizAll[orderId].initializedBox),
            question: quizAll[orderId].question,
            description: JSON.parse(quizAll[orderId].description),
            chartPath: quizAll[orderId].chartPath
          },
          userAnswer: userAnswer,
          itemsCount: itemsCount,
          isExample: quizAll[orderId].isExample
        };
        return userPuzzle;
      });
};

userPuzzleSchema.statics.submitPaper = function (req, res) {
  var examerId = req.session.user.id;
  var THOUSAND_MILLISECONDS = 1000;
  var endTime = Date.parse(new Date()) / THOUSAND_MILLISECONDS;
  this.findOne({userId: examerId})
      .then(function (data) {

        var itemPosts = [];
        data.quizItems.forEach(function (quizItem) {
          itemPosts.push({answer: quizItem.userAnswer, quizItemId: quizItem.id});
        });
        return agent.post(apiServer + 'scoresheets')
            .set('Content-Type', 'application/json')
            .send({
              examerId: examerId,
              paperId: data.paperId,
              blankQuizSubmits: [
                {
                  blankQuizId: data.blankQuizId,
                  itemPosts: itemPosts
                }
              ]
            })
            .end((err) => {
              if(err){
                console.log(err);
              }else {
                data.endTime = endTime;
                data.isCommited = true;

                return data.save();
              }
            });
      })
      .then(function (data) {
        res.send({status: 200});
      });
};

userPuzzleSchema.statics.saveAnswer = function (orderId,userAnswer,userId) {
  return this.findOne({userId: userId})
      .then(function (data) {

        if (orderId > data.quizExamples.length - 1) {
          data.quizItems[orderId - data.quizExamples.length].userAnswer = userAnswer;
          data.save(function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
      })
      .then(function () {
        return true;
      });
};

module.exports = mongoose.model('UserPuzzles', userPuzzleSchema);
