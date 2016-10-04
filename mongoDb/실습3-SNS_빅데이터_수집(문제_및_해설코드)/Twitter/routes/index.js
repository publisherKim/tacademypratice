var express = require('express');
var router = express.Router();

//Consumer Key (API Key)	
//Consumer Secret (API Secret)	

var twitterAPI = require('node-twitter-api');
var reqTok, reqTokSeq, accTok, accTokSec;
var pageMap = {};
var twitter = new twitterAPI({
	consumerKey:'consumerKey',
	consumerSecret:'consumerSecret',
	callback:'127.0.0.1:3000/getAccessToken'
});
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var twitSchema = new Schema({
	id:ObjectId, text:String, tw_date:String, rt_count:String, fv_count:String
});
var TwitModel = mongoose.model('twitter_item', twitSchema);
router.get('/timeline', function(req,res) {
	twitter.getTimeline(
			'user_timeline',
			{screen_name:'estima7'},
			accTok, accTokSec,
			function(err, data) {
				if (err) console.log(err);
				else {
					console.log('twitter getTimeline...');
					data.forEach(function(item) {
						//console.log(item.text);
						var twit = new TwitModel();
						twit.text = item.text;
						twit.tw_date = item.created_at;
						twit.rt_count = item.retweet_count;
						twit.fv_count = (item.retweeted_status?item.retweeted_status.favorite_count:'0');
						twit.save(function(err) { if (err) return handleError(err); });
					});
					res.send(data);
				
				}
			});
});
//Access Token	
//Access Token Secret	
router.get('/update', function(req,res) {
	var messageString = '이것은 Node.js에서 트윗 포스팅 샘플입니다.';
	twitter.statuses('update', {status:messageString},
			accTok,
			accTokSec,
			function(err, data, response) {
		if (err) console.log(err)
		else console.log('update complete!');
		res.redirect('/');
	});
});
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
	TwitModel.find({}, function(err, docs) {
		res.render('index.jade', 
				{title:'Twitter timeline', items:docs});
	});
});

module.exports = router;
