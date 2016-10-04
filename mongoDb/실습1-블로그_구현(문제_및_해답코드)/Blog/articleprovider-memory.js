/**
 * articleprovider-memory.js
 */
var articleCounter = 1;
ArticleProvider = function() {};
ArticleProvider.prototype.dummyData = [];
ArticleProvider.prototype.findAll = function(callback) {
	callback(null, this.dummyData);//배열 전체 리턴
};
ArticleProvider.prototype.findByid = function(id, callback) {
	var result = null;
	for (var i = 0; i < this.dummyData.length; i++) {
		if (this.dummyData[i]._id == id) {//동일한 아이디 값을 가지는 객체 찾기
			result = this.dummeyData[i];
			break;
		}
	}
	callback(null, result);
};
ArticleProvider.prototype.save = function(articles,callback) {
	var article = null;
	if (typeof(articles.length) == 'undefined') articles = [articles];//배열이 아니면 배열로바꿈
	for (var i = 0; i < articles.length; i++) {
		article = articles[i];
		article._id = articleCounter++;//아이디,날짜,댓글 추가
		article.created_at = new Date();
		article.comments = [];
		this.dummyData[this.dummyData.length] = article;//배열에 추가
	}
	callback(null,articles);
};
new ArticleProvider().save([ {title:'Post one',body:'Body one'},
                             {title:'Post two',body:'Body two'},
                             {title:'Post three',body:'Body three'}],
                             function(err, articles) {});
exports.ArticleProvider = ArticleProvider;