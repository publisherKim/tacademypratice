var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var cleanAirSchema = new Schema({
	id : ObjectId,
	area:String,
	pm10:String,
	pm25:String,
	grade:String,
	material:String,
	date:String
});
var CleanAirModel = mongoose.model('cleanair', cleanAirSchema);
var request = require('request');
var cheerio = require('cheerio');
request({uri:'http://cleanair.seoul.go.kr/air_city.htm?method=measure', encoding:'binary'},
		function(err, res, body) {
	var strContents = new Buffer(body, 'binary');
	var $ = cheerio.load(strContents);
	$('tbody tr', '.tbl2').each(function() {
		var strArea = $(this).find('td').eq(0).html().replace(/\s+/, '');
		strArea = strArea.replace(/(\r\n|\n|\r)/gm, '');
		strArea = strArea.replace(/\s+/,'');
		var strVal10 = $(this).find('td').eq(1).html().replace(/\s+/,'');
		strVal10 = strVal10.replace(/(\r\n|\n|\r)/gm, '');
		strVal10 = strVal10.replace(/\s+/,'');
		var strVal2_5 = $(this).find('td').eq(2).html().replace(/\s+/,'');
		strVal2_5 = strVal2_5.replace(/(\r\n|\n|\r)/gm, '');
		strVal2_5 = strVal2_5.replace(/\s+/,'');
		var strStatus = $(this).find('td').eq(7).html().replace(/\s+/,'');
		strStatus = strStatus.replace(/(\r\n|\n|\r)/gm, '');
		strStatus = strStatus.replace(/\s+/,'');
		var strFactor = $(this).find('td').eq(8).html().replace(/\s+/,'');
		strFactor = strFactor.replace(/(\r\n|\n|\r)/gm, '');
		strFactor = strFactor.replace(/\s+/,'');
		var strVal9 = $(this).find('td').eq(9).html().replace(/\s+/,'');
		strVal9 = strVal9.replace(/(\r\n|\n|\r)/gm, '');
		strVal9 = strVal9.replace(/\s+/,'');
		strVal9 = strVal9.replace('</sub>','');
		strVal9 = strVal9.replace('<sub>3','^3');
		/////////////////////////////////////////////////////////
		var cleanair = new CleanAirModel();
		cleanair.area = strArea;
		cleanair.pm10 = strVal10;
		cleanair.pm25 = strVal2_5;
		cleanair.grade = strStatus;
		cleanair.material = strVal9;
		cleanair.date = new Date();
		cleanair.save(function(err) { if (err) return handleError(err); });
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
	CleanAirModel.find({}, function(err, docs) {
		res.render('index.jade', 
				{title:'Clean Air Information',contents:docs});
	});
});

module.exports = router;
