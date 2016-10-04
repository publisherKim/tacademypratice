/**
 * articleprovider-mongodb.js
 */
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ArticleProvider = function(host, port) {
	this.db = new Db('test', 
			new Server(host, port, {auto_reconnection:true}),
			{safe:false});
	this.db.open(function(err) {
		if (!err) console.log('connected');
		else console.log(err);
	});
};
ArticleProvider.prototype.getCollection = function(callback) {
	this.db.collection('articles', function(err, article_collection) {
		if (err) callback(err);
		else callback(null, article_collection);
	});
};
ArticleProvider.prototype.findAll = function(callback) {
	this.getCollection(function(err, article_collection) {
		if (err) callback(err);
		else {
			article_collection.find().toArray(function(err, results) {
				if (err) callback(err);
				else callback(null, results);
			});
		}
	});
};
ArticleProvider.prototype.findById = function(id,callback) {
	this.getCollection(function(err, article_collection){
		if (err) callback(err);
		else {
			article_collection.findOne({_id:ObjectID.createFromHexString(id)},
					function(err,result){
				if (err) callback(err);
				else callback(null, result);
			});
		}
	});
};
ArticleProvider.prototype.save = function(articles,callback) {
	this.getCollection(function(err, article_collection){
		if (err) callback(err);
		else {
			if (typeof(articles.length) == 'undefined') articles = [articles];
			for (i = 0; i < articles.length; i++) {
				article = articles[i];
				article.created_at = new Date();
				article.comments = [];
			}
			article_collection.insert(articles, function () {
				callback(null, articles);
			});
		}
	});
};
ArticleProvider.prototype.addComment = function(id, comment, callback) {
	this.getCollection(function(err,article_collection) {
		if (err) callback(err);
		else {
			article_collection.update({_id:ObjectID.createFromHexString(id)},
					{'$push':{comments:comment}},
					function(err,article) {
						if (err) callback(err);
						else callback(null, article);
					});
		}
	});
};
ArticleProvider.prototype.removeComment = function(id, comment, callback) {
	this.getCollection(function(err,article_collection) {
		if (err) callback(err);
		else {
			article_collection.update({_id:ObjectID.createFromHexString(id)},
					{'$pull':{comments:comment}},
					function(err,article) {
						if (err) callback(err);
						else callback(null, article);
					});
		}
	});
};
ArticleProvider.prototype.remove = function(id,callback) {
	this.getCollection(function(err, article_collection){
		if (err) callback(err);
		else {
			article_collection.remove({_id:ObjectID.createFromHexString(id)},
					function(err,result){
				if (err) callback(err);
				else callback(null, result);
			});
		}
	});
};
exports.ArticleProvider = ArticleProvider;