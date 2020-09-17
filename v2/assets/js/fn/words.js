//----------------------------------------------------------------
//----------- get all words and tifsir of aya  -------------------
//----------------------------------------------------------------
$$.getWords = function (sura, aya, callback) {
	return slectFromDB(queries.g_a_words, [sura, aya]).then(function (data) {
		var words = [];
		for (var x = 0; x < data.rows.length; x++) {
			words.push(data.rows.item(x))
		}
		if (callback, typeof (callback) == 'function')
			callback(words)
	});
};
//----------------------------------------------------------------
//----------- get one word and tifsir from  aya ------------------
//----------------------------------------------------------------
$$.getWord = function (sura, aya, index, callback) {
	return slectFromDB(queries.g_a_word, [sura, aya, index]).then(function (data) {
		var word;
		for (var x = 0; x < data.rows.length; x++) {
			word = data.rows.item(x)
		}
		if (callback, typeof (callback) == 'function') {
			callback(word)
		}
		return word;
	});
};
// append words to span
$$.appendWords = function (sura, aya, span, callback) {
	var html;
	if ($$(span).hasClass('has_words'))
		return;
	$$.getWords(sura, aya, function (data) {
		if (data.length > 0) {
			$$(span).addClass('has_words');
			$$(span).find('b').addClass('hide_aya');
			$$('<span class="words" data-s="' + sura + '" data-a="' + aya + '"></span>').insertAfter($$(span).find('b'));
			$$.each(data, function (index, value) {
				html = app.templates.aya_word(value);
				$$(span).find('.words').append(html);
			});
			$$.wordsPopOver(sura, aya, span);
		}
	})
}
$$.wordsPopOver = function (sura, aya, span) {
	$$(document).find('.words').on('click', 'i', function () {
		var clickedLink = this;
		var idx = parseInt($$(this).data('index'));
		$$.getWord(sura, aya, idx, function (data) {
			console.log(data);
			var HTML = app.templates.wordspopover(data);
			app.popover(HTML, clickedLink);
		});
	})
};
$$.removeWords = function (pagenum) {
	var span;
	if (pagenum)
		span = $$('.content-' + pagenum + ' .tooltip');
	else
		span = $$('.tooltip');

	$$.each(span, function (i, item) {
		if ($$(item).hasClass('has_words')) {
			$$(item).removeClass('has_words');
			$$(item).find('b').removeClass('hide_aya');
			$$(item).find('.words').remove();
		}
	});
	$$('.notification-item').remove();
};

$$(document).on('click', '.wordshare', function () {
	var dataset = $$(this).dataset();
	console.log(dataset);
	shareWord(dataset)
});


function shareWord(obj) {
	var title = 'سورة ' + quranData.sura[obj.sura - 1].name + ' / الاية' + obj.aya;
	var text = obj.aword + " : \n " + obj.tword;
	window.plugins.socialsharing.share(text, title);
}