var express = require('express');
var router = express.Router();
var request = require('superagent');
var _logicPuzzleList = [
  'logic-puzzle/1',
  'logic-puzzle/5',
  'logic-puzzle/8',
  'logic-puzzle/14',
  'logic-puzzle/26',
  'logic-puzzle/33',
  'logic-puzzle/36',
  'logic-puzzle/41',
  'logic-puzzle/47',
  'logic-puzzle/49'
];

router.get('/', function(req, resp) {

  request
      .get(apiServer+_logicPuzzleList[req.query.orderIndex])
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        resp.send({
          initializedBox: JSON.parse(res.body.initializedBox),
          questionZh: res.body.questionZh,
          descriptionZh: JSON.parse(res.body.descriptionZh),
          chartPath: res.body.chartPath
        });
      });
});

module.exports = router;