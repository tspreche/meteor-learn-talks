Talks = new Meteor.Collection("talks");

Meteor.methods({
  upvote: function (talkId) {
    if (! this.userId){
      return new Meteor.Error(403)
    }
    var talk = Talks.findOne(talkId)
    Talks.update(talkId,
      {$set: {votes: talk.votes+1}}
    );
  },
  downvote: function (talkId) {
    if (! this.userId){
      return new Meteor.Error(403)
    }
    var talk = Talks.findOne(talkId)
    Talks.update(talkId,
      {$set: {votes: talk.votes-1}}
    );
  },
  delete: function (talkId) {
    if (! this.userId){
      return new Meteor.Error(403)
    }
    Talks.remove(talkId);
  }

})

if(Meteor.isServer){

  Talks.allow({
      insert: function (userId,talk) {
        return userId && talk.votes === 0;
      }
  });

  Meteor.publish("talks", function() {
    return Talks.find();
  });

}else if (Meteor.isClient) {

  Meteor.subscribe("talks");

  Template.talksList.talks = function () {
    return Talks.find({}, { sort: { votes: -1 } });
  };

  Template.talksList.events({
    "click .upvote": function() {
        Meteor.call("upvote", this._id);
    },
    "click .downvote": function() {
        Meteor.call("downvote", this._id);
    },
    "click .delete": function() {
        Meteor.call("delete", this._id);
    }
  });

  Template.newTalk.events({
    "submit .newTalkForm": function(evt) {
        evt.preventDefault();
        Talks.insert({
          title: $(".title").val(),
          speaker: $(".speaker").val(),
          votes: 0
        }, function (err) {
          if(! err){
            $("input[type=text]").val();
          }
        });
    }
  })


}
