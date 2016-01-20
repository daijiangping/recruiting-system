'use strict';

var Reflux = require('reflux');
var React = require('react');
var markdown = require('markdown').markdown;
var HomeworkIntroductionStore = require('../store/homework-introduction-store');


var HomeworkIntroduction = React.createClass({
  mixins:[Reflux.connect(HomeworkIntroductionStore)],

  getInitialState: function() {
    return {
      desc: ''
    };
  },
  
  render() {
    var desc = this.state.desc;
    function content() { return {__html: markdown.toHTML(desc)}}
    return (
        <div>
          <div id="introduction" dangerouslySetInnerHTML={content()}></div>
          <div id="templateRepo">{this.state.templateRepo}</div>
        </div>
    );
  }
});


module.exports = HomeworkIntroduction;