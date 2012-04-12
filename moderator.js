Questions = new Meteor.Collection("questions");

if (Meteor.is_client) {

  Session.set("user_id", Math.floor(Math.random()*10000));

  Template.board.questions = function(){
    return Questions.find({}, {sort: {votes: -1}});
  };

  Template.question.has_not_vote = function () {
    var question = Questions.findOne({_id: this._id});
    return question.voters.indexOf(Session.get("user_id")) === -1;
  };

  Template.question.events = {
    'click div.up': function () {
      if(Questions.findOne({_id: this._id}).voters.indexOf(Session.get("user_id"))) 
        Questions.update(this._id, {$inc: {votes: 1}, $push: {voters: Session.get("user_id")}});
    },
    'click div.down': function () {
      if(Questions.findOne({_id: this._id}).voters.indexOf(Session.get("user_id")) !== -1) 
        Questions.update(this._id, {$inc: {votes: -1}, $pop: {voters: Session.get("user_id")}});
    }
  };

   Template.board.events = {
    'click div.add': function () {
      var text = document.getElementById("text").value;
      Questions.insert({text: text, votes: 1, voters: []});
    }
  };

}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Questions.find().count() === 0) {
      Questions.insert({text: "Is Mix-it the awesomest conference ?", votes: 1, voters: []});
    }
  });
}