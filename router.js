Router.map(function() {
	this.route('home', {path: '/'});
	this.route('about');
	this.route('talksList');
	this.route('newTalk');
	//this.route('updateBookForm');	
	this.route('talk', { 
	  path: '/talk/:_id',
	  data: function() { return Talks.findOne(this.params._id); }
	});  
});