/*
	Twitter jQuery Feed
	Version 1.0
	By: Josh Santomieri (http://www.santsys.com/)

	Options:
		user - The twitter user
		num - The number of tweets to display

	CSS:
		div.tweet - Main tweet container
		div.image - User profile image
		div.text - Tweet content

	Documentaion on the twitter feeds here:
	https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
*/

(function ($) {
	jQuery.fn.twitterfeed = function (options) {
		var settings = $.extend({
			'user': '',
			'num': 10
		}, options);

		if (this.length <= 0) return;

		var _this = this;
		var _url = 'http://api.twitter.com/1/statuses/user_timeline.json';
		_url += '?screen_name=' + escape(settings.user);
		_url += '&count=' + settings.num;
		_url += '&exclude_replies=true';
		_url += '&callback=?';
		
		$.ajax({
			url: _url,
			type: 'GET',
			dataType: 'jsonp',
			crossDomain: true,
			cache: false,
			contentType: 'application/javascript',
			jsonpCallback: 'parseTwitterFeed',
			success: function (json) {
				if (json == null) {
					_this.text('No response from feed!');
				}
				else {

					if (json instanceof Array) {
						var html = '';
						var months = [
							"JAN", "FEB", "MAR",
							"APR", "MAY", "JUN",
							"JUL", "AUG", "SEP",
							"OCT", "NOV", "DEC"
						];

						for (var i = 0; i < json.length; i++) {
							var tweet = json[i];
							
							var date = new Date(tweet.created_at);
							var replyLink = 'https://twitter.com/intent/tweet';
							replyLink += '?in_reply_to=' + tweet.id;
							replyLink += '&tw_i=' + tweet.id;
							replyLink += '&tw_e=reply';
							replyLink += '&tw_p=tweetembed';
							replyLink += '&source=tweetembed';

							html += '<div class="tweet">';
							html += '		<div class="t-head">';
							html += '			<a href="https://twitter.com/' + tweet.user.screen_name + '">';
							html += '				<span class="t-avatar"><img src="' + tweet.user.profile_image_url_https + '" alt=""></span>';
							html += '				<span class="t-name">' + tweet.user.name + '</span>';
							html += '				<span class="t-nickname">@<b>' + tweet.user.screen_name + '</b></span>';
							html += '			</a>';
							html += '		</div>';
							html += '		<div class="t-body">';
							html += '			<div class="t-content">' + parseTweet(tweet.text) + '</div>';
							html += '</div>';
							html += '<div class="t-foot">';
							html += '	<a class="t-details" href="https://twitter.com/twitterapi/statuses/' + tweet.id + '">';
							html += ' <span class="t-updated " title="' + date.toLocaleDateString() + '">';
							html += date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear().toString().substr(2, 2);
							html += '	</span></a>';
							html += '	<ul class="t-actions">';
							html += '		<li><a href="' + replyLink + '" class="t-reply" title="Reply"><i></i><b>Reply</b></a></li>';
							html += '		<li><a href="https://twitter.com/intent/retweet?tweet_id=' + tweet.id + '" class="t-retweet" title="Retweet"><i></i><b>Retweet</b></a></li>';
							html += '		<li><a href="https://twitter.com/intent/favorite?tweet_id=' + tweet.id + '" class="t-favorite" title="Favorite"><i></i><b>Favorite</b></a></li>';
							html += '	</ul>';
							html += '</div>';
							html += '<div class="clear"></div>';
							html += '</div>';
						}

						_this.html(html);
					}
					else {
						alert('not a JSON array');
						_this.text(json.error);
					}
				}
			}
		});

		function parseTweet(text) {
			var result = [];
			var out = text;

			var rx = new RegExp("http[s]?:\/\/[a-zA-Z0-9\-\/\.]+", "gi");
			while (result = rx.exec(text)) {
				out = out.replace(result[0], '<a href="' + result[0] + '">' + result[0] + '</a>');
			}

			rx = new RegExp("#[a-zA-Z0-9]+", "gi");
			while (result = rx.exec(text)) {
				out = out.replace(result[0], '<a href="https://twitter.com/search/?src=hash&q=' + escape(result[0]) + '">' + result[0] + '</a>');
			}

			return out;
		}
	};
})(jQuery);