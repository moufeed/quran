$$.addBookmark = function (aya, soura, span, pageNum, callback) {

	$$.deleteBookmarks();

	var index = $$(span).data('i');
	var bookmark = 'bk-' + (index - 1);
	if (localStorage.getItem(bookmark) === null) {
		localStorage.setItem(bookmark, soura + '-' + aya + '-' + pageNum);
		app.addNotification({
			message: 'تم إضافتها بنجاح',
			button: {
				text: 'إغلاق',
				color: 'yellow'
			}
		});
	} else {
		app.alert('تم إضافتها مسبقا ')
	}
	if (callback, typeof (callback) == 'function')
		callback();
}
$$.deleteBookmarks = function () {
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).slice(0, 2) === 'bk') {
			localStorage.removeItem(localStorage.key(i));
		}
	}
}
$$.getBookmark = function () {
	$$("#bookMarks ").html('<ul>  </ul>')
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).slice(0, 2) === 'bk') {
			var bkmark = localStorage.key(i).split('-');
			var markkey = localStorage.getItem(localStorage.key(i)).split('-');
			var bookmark = app.templates.bookmarklist({
				index: bkmark[1],
				page: markkey[2],
				sura: parseInt(markkey[0]),
				suraName: quranData.sura[parseInt(markkey[0] - 1)].tname,
				s_name: quranData.sura[parseInt(markkey[0] - 1)].name,
				aya: markkey[1]
			})
			$$("#bookMarks > ul").append(bookmark)
		}
	}
}
$$.removeBookmark = function (index) {
	localStorage.removeItem('bk-' + index);
}
$$(document).on('click', '.removeBookmark', function () {
	var idx = $$(this).data('index');
	$$.removeBookmark(idx);
})
$$(document).on('deleted', '.swipeout', function () {
	setTimeout(function () {
		var bookmarkLength = $$("#bookMarks > ul").find('li').length;
		if (bookmarkLength <= 0) {
			$$("#bookMarks").removeClass('list-block').addClass('content-block');
			var emptyB = app.templates.bookmarkempty({})
			$$("#bookMarks").html(emptyB)
		}
	}, 200)
});
$$(document).on('click', '.bk-link', function () {
	var idx = parseInt($$(this).data('index')),
		page = parseInt($$(this).data('p')),
		soura = parseInt($$(this).data('s')),
		aya = parseInt($$(this).data('a')),
		currentPage = parseInt($$(this).text()),
		swr = $$('div.swiper-container');
	if (swr.length > 1 && $$('.page-on-left:not(.cached)').hasClass('q-page')) {
		var Swiper = $$('.page-on-left:not(.cached) .swiper-container')[0].swiper;
		var currentPage = parseInt($$('.page-on-left:not(.cached) [data-layout="swiper"]').data('p'));
		mainView.router.back();
		$$.gotoPage(Swiper, page, currentPage, function () {
			$$(document).once(animationEnd, function () {
				setTimeout(function () {
					$$('.slide-' + page).find('div[data-sindex="' + soura + '"]').find('span[data-a="' + aya + '"]').addClass('highlight');
				}, 100);
			})
		});
	} else {
		$$.makepage({
			"page_name": $$(this).data('en'),
			"page_class": "q-page",
			"q_page": true,
			"S_name": quranData.sura[soura - 1].name,
			"souraIndex": quranData.sura[soura - 1].index,
			"juzNumber": quranData.pages[page - 1].part,
			"toolbar": true,
			"links": true,
			"pageNum": page,
			"swiper": true,
			"layout": "swiper",
			"highlight": aya,
			"contentClass": "borderpage"
		}, function () {
			setTimeout(function () {
				$$('.bookmarks-page').remove();
				$$.cleanHistoryItem('#bookmarks');
			}, 300)
		})
	}
})
//-------------------- BOOKMARK PAGE   -------------------
//------------------------------------------------------
$$(document).on('click', '.open-bookmark', function () {
	$$.makepage({
		"page_name": "bookmarks",
		"page_class": "bookmarks-page",
		"navbar": true,
		"q_page": false,
		"S_name": false,
		"souraIndex": false,
		"juzNumber": false,
		"hizbNumber": false,
		"page_title": 'العلامات المرجعية',
		"toolbar": false,
		"links": false,
		"pageNum": false,
		"swiper": false,
		"layout": "list",
		"customID": "bookMarks"
	});
	if ($$('.picker-modal.modal-in').length > 0)
		app.closeModal($$('.picker-modal.modal-in'));
})