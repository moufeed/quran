//------------------------------------------------------
function threeDigits(num) {
	var temp = '000' + num;
	return temp.substr(temp.length - 3);
}
//------------------------------------------------------
function fail(error) {
	console.log('error', error.code);
}
//------------------------------------------------------
//if file exists in internal storage return Path it
//else return url to everyayah  website
function getFileURI(subfolder, s, a, callback) {
	var sura = threeDigits(s);
	var aya = threeDigits(a);
	var src;
	var file = folder + '/' + subfolder + '/sura_' + s + '/' + sura + aya + '.mp3'
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		fileSystem.root.getFile(file, {
			create: false,
			exclusive: true
		}, function (soundFile) {
			src = folder + '/' + subfolder + '/sura_' + s + '/' + sura + aya + '.mp3';
			if (callback, typeof (callback) == 'function') {
				callback(src)
			}
		}, function (error) {
			src = 'http://www.everyayah.com/data/' + subfolder + '/' + sura + aya + '.mp3';
			if (callback, typeof (callback) == 'function') {
				callback(src)
			}
		});
	}, fail);
}
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
var isPlaying, Dmedia;
var audioPlayer = function (options) {
	var defaults = {
		type: 'modal', //  Type of layout [modle = > recitations page | toolbar => Quran page ]
		page: null, // Quran page Number
		media: null,
		mediaTimer: null,
		isPlaying: false,
		index: null,
		sura: null,
		aya: null,
		reciter: null,
		subfolder: null,
		downloaded: null,
		ayatCount: null,
		path: null,
	}
	if (isPlaying) {
		Dmedia.stop(Dmedia);
	}
	var _media = $$.extend(defaults, options)
	Dmedia = _media;
	// Create layout
	_media.layout = function (_media) {
		if (_media.type == 'modal') {
			var obj = {
				name: _media.sura.name,
				ayat: _media.sura.ayas
			}
			app.modal({
				title: app.templates.mediaData(obj),
				text: app.templates.modalPlayer({}),
				class: 'audioPlayer',
				aya: true,
				buttons: [{
					text: 'إغلاق',
					bold: true,
					onClick: function (e) {
						Dmedia.stop(_media);
					}
				}]
			});
			var modal = $$('.reciter_page.page-on-center').find('.modal')
			$$('.audioPlayer').on('opened', function () {
				if (_media.media === null) {
					_media.initmedia(_media);
				}
				$$('.button.play').on('click', function () {
					var $this = $$(this);
					if ($this.hasClass('pause')) {
						Dmedia.pause(Dmedia);
					} else {
						Dmedia.play(Dmedia);
					}
				});
				$$('.button.forward').on('click', function () {
					var $this = $$(this);
					Dmedia.forward(Dmedia);
				});
				$$('.button.backward').on('click', function () {
					var $this = $$(this);
					Dmedia.backward(Dmedia);
				});
			});
		}
		if (_media.type == "toolbar") {
			var $toolbar = $$('.q-page .toolbar-inner');
			if ($$('.toolbar-player').length == 0) {
				$toolbar.css('display', 'none');
				var html = app.templates.navPlayer({});
				$$(html).insertAfter('.q-page .toolbar-inner');
				setTimeout(function () {
					if (!Dmedia || Dmedia.media == null) {
						_media.initmedia(_media);
						var pageName = mainView.activePage.name;
					}
				}, 100)
				$$('.toolbar-player').on('click', '.button.play', function () {
					var $this = $$(this);
					if ($this.hasClass('pause')) {
						Dmedia.pause(Dmedia);
					} else {
						Dmedia.play(Dmedia);
					}
				});
				$$('.toolbar-player').on('click', '.button.stop', function () {
					Dmedia.stop(Dmedia);
					$$('.toolbar-player').remove();
					$toolbar.removeAttr('style');
				});
				$$('.toolbar-player').on('click', '.button.backward', function () {
					var $this = $$(this);
					Dmedia.backward(Dmedia);
				});
				$$('.toolbar-player').on('click', '.button.forward', function () {
					var $this = $$(this);
					Dmedia.forward(Dmedia);
				});
			} else {
				setTimeout(function () {
					if (Dmedia.media != null) {
						Dmedia.stop(Dmedia)
					}
					Dmedia.initmedia(Dmedia);
				}, 100)
			}
		}
	}
	// Initialize Media
	_media.initmedia = function (_media) {
		isPlaying = true;
		Dmedia = _media;
		if (_media.type == 'modal') {
			$$('.audioPlayer .ayacount').find('strong').html(_media.aya);
		}
		_media.media = new Media(_media.path,
			function (success) {},
			function (error) {
				app.alert('لايمكن تشغيل الصوت حاليا');
				console.log(error);
			},
			function (status) {
				var duration;
				if (status == 2) {
					if (_media.type == "toolbar") {
						$$('.swiper-slide').find('span.tooltip').removeClass('highlight3');
						$$('.soura[data-sindex="' + _media.index + '"]').find('span[data-a="' + _media.aya + '"]').addClass('highlight3');
						if (_media.page != null) {
							var pageNum = quranData.pages[_media.page - 1];
							if (_media.aya == pageNum.endAya + 1 && (pageNum.soura == _media.index || pageNum.endSoura == _media.index)) {
								var swiper = $$('.swiper-container')[1].swiper;
								var Qai = swiper.activeIndex;
								var Qslide = $$(swiper.slides[Qai]);
								var pn = parseInt(Qslide.data('pn'));
								if (_media.page == pn) {
									swiper.slideNext();
									_media.page++;
								}
							}
						}
					}
					if (_media.aya < _media.ayatCount) {
						var counter = 0,
							d;
						var timerDur = setInterval(function () {
							counter = counter + 100;
							if (counter > 2000) {
								clearInterval(timerDur);
							}
							duration = _media.media.getDuration();
							d = Math.floor(duration * 1000);
							if (duration > 0) {
								clearInterval(timerDur);
							}
						}, 100);
						_media.mediaTimer = setInterval(function () {
							if (!_media.media) {
								clearInterval(_media.mediaTimer);
								return;
							}
							_media.media.getCurrentPosition(function (CurrentPosition) {
								var cp = Math.floor(CurrentPosition * 1000);
								if (cp > (d - 250) || cp < 0) {
									clearInterval(_media.mediaTimer);
									_media.mediaTimer = null;
									_media.aya++;
									getFileURI(_media.subfolder, _media.index, _media.aya, function (src) {
										console.log('obj:', src);
										_media.path = src;
										_media.initmedia(_media);
									});
								}
							});
						}, 750);
					}
				}
				if (status == 4) {
					if (_media.aya >= _media.ayatCount) {
						clearInterval(_media.mediaTimer);
						_media.mediaTimer = null;
					}
				}
			});
		_media.play(_media);
	};
	//  Stop and Play next aya 
	_media.forward = function (_media) {
		if (_media.aya < _media.ayatCount && _media.index <= 114) {
			_media.stop(_media);
			_media.aya++;
			getFileURI(_media.subfolder, _media.index, _media.aya, function (src) {
				console.log('obj:', src);
				_media.path = src;
				_media.initmedia(_media);
			});
		} else {
			return false;
		}
	};
	// stop and play previous
	_media.backward = function (_media) {
		if (_media.aya > 1 && _media.index > 1) {
			_media.stop(_media);
			_media.aya--;
			getFileURI(_media.subfolder, _media.index, _media.aya, function (src) {
				console.log('obj:', src);
				_media.path = src;
				_media.initmedia(_media);
			});
		} else {
			return false;
		}
	};
	// Stop MediaPlay
	_media.stop = function (_media) {
		if (_media.isPlaying === true) {
			clearInterval(_media.mediaTimer);
			_media.mediaTimer = null;
			if (_media.type == 'toolbar') {
				$$('.swiper-slide').find('span.tooltip').removeClass('highlight3');
			}
			_media.media.stop();
			_media.media.release();
			_media.media = null;
			_media.isPlaying = false;
			Dmedia = null;
			isPlaying = false;
		}
	};
	// play
	_media.play = function (_media) {
		_media.media.play();
		_media.isPlaying = true;
		if (_media.type == 'modal') {
			$$('.button.play').addClass('pause');
		}
		if (_media.type == 'toolbar') {
			$$('.toolbar-player .button.play').addClass('pause');
		}
	};
	//pause
	_media.pause = function (_media) {
		_media.media.pause();
		if (_media.type == 'modal') {
			$$('.modal-player .button.play').removeClass('pause');
		}
		if (_media.type == 'toolbar') {
			$$('.toolbar-player .button.play').removeClass('pause');
		}
	};
	_media.layout(_media);
}