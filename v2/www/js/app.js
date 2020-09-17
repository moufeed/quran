var db, storeDB, dbName = 'quran.db',
	folder = 'Almorshed';
//---------------------------------------------------------------------------
//---------------------   onLoad ------------------------------------- 
//---------------------------------------------------------------------------
var queries = {
	"g_aya": "SELECT  *,rowid AS id FROM arabic_text WHERE sura =? AND aya =?",
	"g_sura": "SELECT  *,rowid AS id FROM arabic_text WHERE sura =?",
	"g_page": "SELECT  *,rowid AS id FROM arabic_text WHERE page  =?",
	"g_text": "SELECT  *,rowid AS id FROM arabic_text WHERE text2 like(?)",
	"g_tafsir": "SELECT  *,rowid AS id  FROM tafsir_moysar WHERE sura =? AND aya =?",
	"g_a_words": "SELECT  *,rowid AS id  FROM q_words WHERE sura =? AND aya =?",
	"g_a_word": "SELECT  *,rowid AS id  FROM q_words WHERE sura =? AND aya =? AND idx =?",
}

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}
//---------------------------------------------------------------------------
//---------------------   onDeviceReady ------------------------------------- 
//---------------------------------------------------------------------------
function onDeviceReady() {

	// StatusBar gloubal object from cordova-plugin-statusbar
	//hide on start
	StatusBar.hide();
	//--------
	FastClick.attach(document.body);

	//  cordova.plugins.ZoomControl.ZoomControl("true");
	// 	 // enabling built in zoom control
	//  cordova.plugins.ZoomControl.setBuiltInZoomControls("true");
	//  // enabling display zoom control
	//  cordova.plugins.ZoomControl.setDisplayZoomControls("false"); 

	document.addEventListener("backbutton", onBackKeyDown, false);
	//---------------------------------------------------------------------------
	// Check Almorshed Database exists and open it
	//---------------------------------------------------------------------------
	storeDB = cordova.file.applicationStorageDirectory + 'databases/';
	window.resolveLocalFileSystemURL(storeDB + dbName, function (db) {
		openDb();
	}, function (e) {
		// Transfer db to phone  and open it
		var assetURL = cordova.file.applicationDirectory + 'www/' + dbName;
		var fileTransfer = new FileTransfer();
		fileTransfer.download(assetURL, storeDB + dbName,
			function (entry) {
				openDb();
			},
			function (error) {
				console.log(error.message);
			});
	});
	//---------------------------------------------------------------------------
	// Check Almorshed Folder exists and create it
	//---------------------------------------------------------------------------
	var dir = cordova.file.externalRootDirectory + folder
	window.resolveLocalFileSystemURL(dir, function (dirEntry) {
		var directoryReader = dirEntry.createReader(); //success
	}, function (e) {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, createFolder, function (error) {
			console.log(error)
		});
	});
}




//---------------------------------------------------------------------------
//---------------------   createFolder -------------------------------------
//---------------------------------------------------------------------------
function createFolder(fs) {

	fs.root.getDirectory(folder + "/", {
		create: true,
		exclusive: true
	}, function (success) {
		console.log(success);
	}, function (error) {
		console.log(error);
	});
}
//---------------------------------------------------------------------------
//---------------------   open Database ------------------------------------- 
//--------------------------------------------------------------------------- 
function openDb() {
	db = window.sqlitePlugin.openDatabase({
			name: "quran.db",
			location: 'default'
		}, function (db) {
			$$.continueRead();
		},
		function (error) {
			console.log(error.message);
		});
}
//---------------------------------------------------------------------------
//---------------------   Close Database-------------------------------------
//---------------------------------------------------------------------------
function closeDB() {
	db.close(function () {
		//  console.log("DB closed!");
	}, function (error) {
		console.log("Error closing DB:" + error.message);
	});
}
//---------------------------------------------------------------------------
//---------------------  Back Key Down ------------------------------------- 
//---------------------------------------------------------------------------
function onBackKeyDown(e) {
	if ($$('.picker-modal.modal-in').length > 0)
		app.closeModal($$('.picker-modal.modal-in'));
	else if ($$('.popover.modal-in').length > 0)
		app.closeModal($$('.popover.modal-in'));
	else if ($$('.notification-item').length > 0) {
		$$.removeWords();
	} else if ($$('.tooltip_container_top').length > 0) {
		$$('.tooltip_container_top').remove();
		$$('.highlight').removeClass("highlight");
	} else if ($$('.highlight').length > 0)
		$$('.highlight').removeClass("highlight");
	else if ($$('.popup.modal-in').length > 0)
		app.closeModal($$('.popup.modal-in'));
	else if (document.getElementById('panel').getAttribute('class').includes('active')) {
		app.closePanel()
	} else if (app.mainView.activePage.name == 'index' && confirm('هل تريد إغلاق التطبيق؟', 'إغلاق التطبيق')) {
		navigator.app.exitApp();
	} else {
		app.mainView.router.back();
	}
}
//---------------------------------------------------------------------------
//---------------------  slect From Database --------------------------------
//---------------------------------------------------------------------------

function slectFromDB(query, request) {
	var returnedData;
	return new Promise(function (resolve, reject) {
		db.transaction(function (tx) {
			tx.executeSql(query, request, function (tx, resultSet) {
				returnedData = resultSet;
			}, function (tx, error) {
				console.log('SELECT Error: ' + error.message);
			});
		}, function (error) {
			console.log('transaction error: ' + error.message);
			reject(error);
		}, function () {
			resolve(returnedData)
		});
	});
};
var app = new Framework7({
    init: false,
    tapHold: true,
    tapHoldDelay: 250,
    material: true,
    fastClicksDelayBetweenClicks: 0,
    preloadPreviousPage: false,
    materialRipple: true,
    materialPageLoadDelay: 0,
    cache: true,
    uniqueHistory: true,
    showBarsOnPageScrollTop: true,
    showBarsOnPageScrollEnd: true,
    template7Pages: true,
    precompileTemplates: true,
    dynamicPageUrl: '{{name}}',
    modalTitle: " ",
    modalButtonOk: "موافق",
    modalButtonCancel: "إلغاء",
    modalPreloaderTitle: "جاري التحميل...",
    notificationCloseButtonText: "إغلاق",
    notificationCloseOnClick: true,
    notificationHold: 1000,
    scrollTopOnNavbarClick: true,
    modalTemplate: '<div class="modal {{#unless buttons}}modal-no-buttons{{/unless}} {{#if class}}{{class}}{{/if}}">' +
        ' <div class="modal-inner">' +
        '  {{#if title}}' +
        '   <div class="modal-title">{{title}}</div>' +
        ' {{/if}}' +
        '  {{#if text}}' +
        '  <div class="modal-text">{{text}}</div>' +
        '  {{/if}}' +
        '  {{#if afterText}}' +
        '   {{afterText}}' +
        '  {{/if}}' +
        ' </div>' +
        ' {{#if buttons}}' +
        ' <div class="modal-buttons">' +
        '{{#if aya}}' +
        '<span class="ayacount"> الاية <strong><strong></span>' +
        '{{/if}}' +
        '{{#if downloading}}' +
        '<span class="downloading"> جاري التحميل  <strong><strong></span>' +
        '{{/if}}' +
        '  {{#each buttons}}' +
        '    <span class="modal-button {{#if bold}}modal-button-bold{{/if}}">{{text}}</span>' +
        '    {{/each}}' +
        '</div>' +
        '{{/if}}' +
        '</div>  ',
    onAjaxStart: function (xhr) {
        app.showIndicator()
    },
    onAjaxComplete: function (xhr) {
        app.hideIndicator()
    }
});
var $$ = Dom7,
    quranData;



var mainView = app.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
var arabicNum = ['الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', '  العشرون', 'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون ', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', ' الثلاثون ', 'الحادي والثلاثون ', 'الثاني والثلاثون', 'الثالث والثلاثون', 'الرابع والثلاثون', 'الخامس والثلاثون', 'السادس والثلاثون', 'السابع والثلاثون', 'الثامن والثلاثون', 'التاسع والثلاثون', 'الأربعون', 'الحادي والأربعون', 'الثاني والأربعون', 'الثالث والأربعون', 'الرابع والأربعون', 'الخامس والأربعون', 'السادس والأربعون', 'السابع والأربعون', 'الثامن والأربعون', 'التاسع والأربعون', ' الخمسون', 'الحادي والخمسون', 'الثاني والخمسون', 'الثالث والخمسون', 'الرابع والخمسون', 'الخامس والخمسون', 'السادس والخمسون', 'السابع والخمسون', 'الثامن والخمسون', 'التاسع والخمسون', 'الستون'];

//----------------------------------------------------------------
//---------------------  REGISTER HELPERS  -----------------------
//----------------------------------------------------------------
Template7.registerHelper('arNum', function (index, options) {
    var num = arabicNum[index];
    return num;
});
//----------------------------------------------------------------
//----------------------------------------------------------------
Template7.registerHelper('ayaText', function (sura, aya, options) {
    var ayaTxt, listWord, ayaList, txt;
    ayaList = $$.getAya(sura, aya, function (data) {
        ayaTxt = data.text;
        if (ayaTxt.search('۞') >= 0) {
            txt = ayaTxt.replace('۞', '');
        } else {
            txt = ayaTxt;
        }
        listWord = txt.split(' ');
        if (listWord.length > 12) {
            ayaList = listWord.slice(0, 12).join(' ');
        } else {
            ayaList = listWord.join(' ');
        }
        return ayaList;
    });
    var time = setInterval(function () {
        if (typeof ayaList != undefined) {
            clearInterval(time);
            return ayaList;
        }
    }, 50);

});
//----------------------------------------------------------------
//----------------------------------------------------------------
Template7.registerHelper('suraTxt', function (index, options) {
    if (index) {
        var suraIndex = parseInt(index);
        var sura = quranData.sura[suraIndex - 1];
        var suraName = sura.name;
        return suraName;
    }
});;
$$.getAya = function (sura, aya, callback) {
    var text;
    db.transaction(function (tx) {
            tx.executeSql(queries.g_aya, [sura, aya], function (tx, resultSet) {
                for (var x = 0; x < resultSet.rows.length; x++) {
                    text = resultSet.rows.item(x)
                    console.log(text);
                }
            }, null);
        }, null,
        function () {
            if (callback, typeof (callback) == 'function') {
                callback(text)
            }
            return text;
        });
};
//----------------------------------------------------------------
//------------------- GET PAGE AYAT -----------------------------
//----------------------------------------------------------------
// return array of page Ayat
//		[{
//		aya:num,
//    	id:num,
//    	page:num,
//    	sura:num,
//    	text:"String",
//    	text2:"String"
//    } , ...]
$$.getPageAyat = function (pageIndex, callback) {
    var ayat = [];
    db.transaction(function (tx) {
            tx.executeSql(queries.g_page, [pageIndex], function (tx, resultSet) {
                for (var x = 0; x < resultSet.rows.length; x++) {
                    ayat.push(resultSet.rows.item(x))
                }
            }, null);
        }, null,
        function () {
            if (callback, typeof (callback) == 'function') {
                callback(ayat)
            }
            return ayat;
        });
}
//----------------------------------------------------------------
//-------------------      AYA HIGHLIGHT --------------------------- 
//---------------------------------------------------------------- 
$$.fn.highlight = function (callback) {
    var target = $$('.tooltip');
    var span = $$(this);
    var parent = span.parents('.soura[data-sindex]').data('sindex'),
        aya = span.data('a');
    target.removeClass('highlight highlight2');
    span.toggleClass('highlight');
    if (callback, typeof (callback) == 'function') {
        callback(aya, parent, span)
    }
};
$$.fn.tooltip = function (options, callback) {
    var set = {
        'speed': 200,
        'mode': 'top',
        data: {},
    };
    options = options || {};
    $$.each(options, function (i, j) {
        if (set[i] != undefined)
            set[i] = j;
    });
    return this.each(function () {
        var tooltip_cont = '.tooltip_container_' + set.mode;
        var tooltip_show = true;
        $$('.tooltip_container_top').remove();
        $$('.tooltip_container_bottom').remove();
        if (tooltip_show) {
            //                event.stopPropagation();
            tooltip_show = false;
        } else {
            tooltip_show = true;
        }
        var ofst = this.offsetTop;
        if ($$('.navbar').hasClass('navbar-hidden') && ofst < 35) {
            set.mode = 'bottom'
        } else if (!$$('.navbar').hasClass('navbar-hidden') && ofst < 75) {
            set.mode = 'bottom'
        }
        var d_m = set.mode;
        if ($$(this).attr('data-mode')) {
            d_m = $$(this).attr('data-mode')
            tooltip_cont = '.tooltip_container_' + d_m;
        }
        set.data.d_m = d_m;
        var out = app.templates.tooltip(set.data);

        var fixtooltip=true;

        if(fixtooltip)
        {
            $$('.page').append(out);
            $$('.page').addClass('fixtooltip');
            $$('.tooltip_container').css({'z-index':'222222'});
        }
        else
        {
            $$(this).append(out);     

            if (out) {
                var ofstL = this.offsetLeft;
                var pos;
                var ww = $$(window).width() / 2;
                if (this.offsetWidth < 40) {
                    pos = Math.floor(this.offsetWidth / 2);
                } else {
                    pos = parseInt(this.offsetLeft + (this.offsetWidth / 2) - ($$(tooltip_cont).width() / 3))
                }
                if (ofstL < ww) {
                    var cs = {
                        //"left" : pos + 'px',
                        "top": (this.offsetTop - 70) + 'px'
                    }
                    $$(tooltip_cont).css(cs);
                }
                if (ofstL > ww) {
                    $$(tooltip_cont).css({
                        //'right': (pos / 4) + 'px',
                        "top": (this.offsetTop - 70) + 'px'
                    });
                }
            }
        }

        $$(tooltip_cont).show();
        $$('html').on("click", function () {
            $$('.tooltip_container_top').remove();
            $$('.tooltip_container_bottom').remove();
            tooltip_show = true;
        });
        if (callback, typeof (callback) == 'function') {
            callback(this, $$(out));
        }
    });
};;
$$.fn.btnsTools = function (aya, soura, span, pageNum, callback) {

    $$(this).on('click', '.btn-tafsir', function () {
        $$.findTafsir(soura, aya);
    });
    $$(this).on('click', '.btn-copy', function () {
        var textTocopy = $$(span).find('b').text();
        cordova.plugins.clipboard.copy(textTocopy);
        cordova.plugins.clipboard.paste(function (textTocopy) {
            app.addNotification({
                message: 'تم نسخ الاية'
            });
        });
    });
    //--------------------------------------------------------------------------
    $$(this).on('click', '.btn-bookmark', function () {
        $$.addBookmark(aya, soura, span, pageNum);
    });
    //--------------------------------------------------------------------------
    $$(this).on('click', '.btn-play', function () {
        var sora = quranData.sura[parseInt(soura) - 1];
        var reciter, reciterNum = localStorage.getItem('activeRecite');
        if (reciterNum == null) {
            reciter = quranData.recitations[1]
        } else {
            reciter = quranData.recitations[parseInt(reciterNum)];
        }
        var obj = {
            type: 'toolbar',
            page: pageNum,
            index: parseInt(quranData.sura[soura - 1].index),
            sura: sora,
            aya: parseInt(aya),
            reciter: reciter,
            subfolder: reciter.subfolder,
            ayatCount: parseInt(sora.ayas),
        }
        getFileURI(obj.subfolder, obj.index, obj.aya, function (src) {
            obj.path = src;
            audioPlayer(obj);
        })
    });
    //--------------------------------------------------------------------------
    $$(this).on('click', '.btn-word', function () {
        $$.appendWords(soura, aya, span, pageNum);

        app.addNotification({
            message: 'يمكنك النقر على الكلمة لعرض تفسيرها',
            button: {
                text: 'إغلاق',
                color: 'yellow'
            },
            hold: 360000,
            onClose: function () {
                $$.removeWords();
            }
        });
    });
    //--------------------------------------------------------------------------
    $$(this).on('click', '.btn-share', function () {
        var text = $$(span).find('b').text();
        var title = 'سورة ' + quranData.sura[soura - 1].name + ' / الاية' + aya;
        window.plugins.socialsharing.share(text, title);
    });
    //--------------------------------------------------------------------------
    if (callback, typeof (callback) == 'function') {
        callback()
    }
};;
$$.initApp = function (callback) {
    $$.pageStyle();

    // Index page  Search in  soursList for Name
    var searchbar = app.searchbar('.searchbar', {
        searchList: '#sour_list',
        searchIn: '.name'
    });

    //--------------------------------------------------------------------------------
    //------------  Index page Sour list    --------------------------------------
    //--------------------------------------------------------------------------------
    var soursList = app.virtualList('#sour_list.virtual-list', {
        rowsBefore: 30,
        rowsAfter: 30,
        items: quranData.sura,
        template: ' <li>' +
            ' <a href="#" class="item-link item-content soura" data-s="{{index}}" data-en="{{tname}}" data-part="{{part}}" data-page="{{page}}"> ' +
            ' <div class="index">{{index}}</div>' +
            ' <div class="item-info">' +
            ' <div class="name">{{name}}</div>' +
            '  <div class="type">{{type}}</div>' +
            ' <div class="quantity">آياتها <strong>{{ayas}}</strong> </div>' +
            ' </div>  </a> </li>',
        searchAll: function (query, items) {
            var foundItems = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].name.indexOf(query.trim()) >= 0) foundItems.push(i);
            }
            return foundItems;
        }
    });

    // Link to Sura
    $$(document).on('click', '#sour_list a', function () {
        var souraIndex = $$(this).data('s');
        var souraNum = quranData.pages[parseInt($$(this).data('page')) - 1].soura;
        var souraName = quranData.sura[souraNum - 1].name;

        $$.makepage({
            "page_name": $$(this).data('en'),
            "page_class": "q-page", // Quran Page
            "q_page": true,
            "S_name": souraName,
            "souraIndex": $$(this).data('s'),
            "juzNumber": arabicNum[$$(this).data('part')],
            "links": true,
            "pageNum": parseInt($$(this).data('page')),
            "layout": "swiper",
            "swiper": true,
            "highlight": 1,
            "contentClass": "borderpage"
        })
    });
    //--------------------------------------------------------------------------------
    //------------  Index page juz list      --------------------------------------
    //--------------------------------------------------------------------------------

    var juzList = app.virtualList('#juzList.virtual-list', {
        items: quranData.parts,
        renderItem: function (index, item) {
            return '<li>' +
                '<a href="#" class="item-link item-content" data-index="' + index + '" data-s="' + item.sora + '" data-a="' + item.aya + '" data-p="' + item.page + '">' +
                '<span class="index">' + parseInt(index + 1) + '</span>' +
                '<span class="name">  الجزء  ' + arabicNum[index] + '</span>' +
                '</a>' +
                '</li>'
        }
    });

    $$("#juzList li").on('click', 'a', function () {
        var souraNum = quranData.pages[parseInt($$(this).data('p')) - 1].soura;
        var souraName = quranData.sura[souraNum - 1].name;
        var aya = parseInt($$(this).data('a'));
        $$.makepage({
            "page_name": 'part-' + $$(this).data('index'),
            "page_class": "j-page q-page",
            "q_page": true,
            "S_name": souraName,
            "souraIndex": $$(this).data('s'),
            "juzNumber": arabicNum[$$(this).data('index')],
            "links": true,
            "pageNum": parseInt($$(this).data('p')),
            "layout": "swiper",
            "swiper": true,
            "highlight": aya,
            "contentClass": "borderpage"
        })
    });

    //--------------------------------------------------------------------------------
    //------------  Index page Hizb  list      --------------------------------------
    //--------------------------------------------------------------------------------
    var Hizblist = app.virtualList('#Hizblist.virtual-list', {
        items: quranData.Hizb,
        renderItem: function (index, item) {
            return '<li>' +
                '<a href="#' + index + '" class="item-link item-content" data-index="' + index + '">' +
                '<span class="index">' + parseInt(index + 1) + '</span>' +
                '<span class="name">  الحزب  ' + arabicNum[index] + '</span>' +
                '</a>' +
                '</li>'
        }
    });
    $$('#Hizblist').on('click', 'a', function () {
        var hizbIndex = parseInt($$(this).attr('href').replace('#', ''));
        // open Picker 
        $$.hizbPicker(hizbIndex, function () {
            $$('.hizb-picker #hizbSections').on('click', 'a', function () {

                var souraNum = quranData.pages[parseInt($$(this).data('p')) - 1].soura;
                var souraName = quranData.sura[souraNum - 1];
                var aya = parseInt($$(this).data('a'));
                $$.makepage({
                    "page_name": souraName.tname,
                    "page_class": "q-page",
                    "q_page": true,
                    "S_name": souraName.name,
                    "souraIndex": $$(this).data('s'),
                    "juzNumber": false,
                    "hizbNumber": arabicNum[hizbIndex],
                    "links": true,
                    "pageNum": parseInt($$(this).data('p')),
                    "layout": "swiper",
                    "swiper": true,
                    "highlight": aya,
                    "contentClass": "borderpage"
                })
                setTimeout(function () {
                    app.closeModal('.picker-modal.modal-in');
                }, 100)
            })
        });
    });
    if (callback, typeof (callback) == 'function') {
        callback()
    }
}

$$.continueRead = function () {

    //--------------------------------------------------------------------------------
    //------------  continue reading      --------------------------------------
    //--------------------------------------------------------------------------------
    var continueRes = $$.getPageAya();
    if (continueRes.continue) {
        // if(confirm('هل تريد متابعة القراءة؟'))
        if (localStorage['reloadindex'] == undefined) {

            var pageNum = parseInt(continueRes["pageNum"]);
            var highlight = 1;

            var souraNum = quranData.pages[parseInt(pageNum) - 1].soura;
            var souraName = quranData.sura[souraNum - 1].name;
            $$.makepage({
                "page_name": quranData.sura[souraNum - 1].tname,
                "page_class": "q-page",
                "q_page": true,
                "S_name": souraName,
                "souraIndex": souraNum,
                "juzNumber": arabicNum[quranData.pages[pageNum - 1].part],
                "links": true,
                "pageNum": pageNum,
                "layout": "swiper",
                "swiper": true,
                "highlight": parseInt(highlight),
                "contentClass": "borderpage"
            }, function (page) {
                $$(document).once(animationEnd, function () {
                    setTimeout(function () {
                        var a = $$('.content-' + page.pageNum).find('.tooltip[data-a="' + page.highlight + '"]');
                        $$('.page-background').scrollTop(a.offset().top - 40, 300);
                    }, 200);
                });
            })
             app.confirm('هل تريد العودة إلى الفهرس؟', ' ', function() {
                app.mainView.router.back(); 
            });

            // app.addNotification({
            //     message: 'اضغط هنا للعودة الى الفهرس',
            //     button: {
            //         text: 'إغلاق',
            //         color: 'yellow'
            //     },
            //     hold: 6000,
            //     onClick: function () {
            //         app.mainView.router.back();
            //     }
            // });
        }
        localStorage.removeItem('reloadindex');
        // else{
        //     localStorage.removeItem('pageNum');
        // }
    }
};
//--------------------------------------------------------------------------------
//------------  save page      --------------------------------------
//--------------------------------------------------------------------------------
$$.savePageAya = function (page) {
    if (page) {
        localStorage['pageNum'] = page;
    } else {
        //localStorage.removeItem('pageNum');
    }
};

//--------------------------------------------------------------------------------
//------------  get page ,aya      --------------------------------------
//--------------------------------------------------------------------------------
$$.getPageAya = function () {
    var res = {
        continue: true
    };
    if (localStorage['pageNum']) {
        res['pageNum'] = localStorage['pageNum'];
    } else {
        res.continue = false;
    }
    return res;

};;
////////////////////////////////////

$$.sliceTxt = function (text, len, callback) {
    var listWord, newTxt, txt;
    if (text.search('۞') >= 0) {
        txt = text.replace('۞', '');
    } else {
        txt = text;
    }
    listWord = txt.split(' ');
    if (listWord.length > len) {
        newTxt = listWord.slice(0, len).join(' ');
    } else {
        newTxt = listWord.join(' ');
    }

    if (callback, typeof (callback) == 'function') {
        callback(newTxt)
    }
    return newTxt;
};

//-------------------- REMOVE HISTORY -----------------
//------------------------------------------------------

$$.cleanHistoryItem = function (item) {
    var hList = mainView.history;
    for (var i = 0; i < hList.length; i++) {
        if (hList[i] === item) hList.splice(i, 1);
    }
}
//-------------------- REMOVE BASMALAH -----------------
//------------------------------------------------------

function removeBasmalah(text) {
    return text.replace(/^(([^ ]+ ){4})/g, '');
}
//-------------------- EXTEND --------------------------
//------------------------------------------------------
$$.extend = function (obj, props) {
    for (var prop in props) {
        if (props.hasOwnProperty(prop)) {
            obj[prop] = props[prop];
        }
    }
    return obj;
};
//-------------------- getArabicNumbers --------------------------
//------------------------------------------------------


var arabicNumbersMap = [
    "&\#1632;", "&\#1633;", "&\#1634;", "&\#1635;", "&\#1636;",
    "&\#1637;", "&\#1638;", "&\#1639;", "&\#1640;", "&\#1641;"
];

function getArabicNumbers(str) {
    var newStr = "";
    str = String(str);
    for (i = 0; i < str.length; i++) {
        newStr += arabicNumbersMap[parseInt(str.charAt(i))];
    }
    return newStr;
}


//-------------------- show tooltip --------------------------
//------------------------------------------------------
$$(document).on('taphold', '.tooltip[data-a]', function () {
    var pNum = parseInt($$(this).parents('.swiper-slide-active').data('pn'));
    $$.removeWords(pNum);
    $$(this).highlight(function (aya, soura, span) {
        var text = $$(span).text();
        span.tooltip({
            data: {
                "s_id": soura,
                "a_id": aya
            }
        });
        $$('.tooltip_container a').btnsTools(aya, soura, span, pNum);

    });
});

$$(document).on('click', '.tooltip[data-a]', function () {
    $$('.tooltip[data-a]').removeClass('highlight2');
    if (!$$(this).is('.highlight') && !$$(this).hasClass('has_words')) {
        $$(this).addClass('highlight2');
        $$.removeWords();
    }
})
//-------------------- show highlight ------------------ 
//------------------------------------------------------
$$(document).on("click", function (e) {

    if (!$$(e.target).hasClass('highlight') && !$$(e.target).hasClass('modal-overlay')) {
        $$("span").removeClass("highlight");
    }
});

//--------------------------- --------------------------- 
//function -------------- validateEmail   --------------
//--------------------------- ---------------------------
function validateEmail(input) {
    var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    var emailID = input.val();
    if (!emailID.match(regex)) {
        var target = input;
        var buttons = [{
            text: 'الرجاء إدخال عنوان بريد إلكتروني صالح',

        }];
        app.actions(target, buttons);
        return false;
    }
    return (true);
}

//-------------------- show highlight ------------------ 
//------------------------------------------------------
$$(".open-panel").on("click", function (e) {
    if ($$('.picker-modal.modal-in').length > 0)
        app.closeModal($$('.picker-modal.modal-in'));
});

//--------------------------- ---------------------------;
$$.initQswiper = function (Qswiper, pageNum, callback) {

    $$.qs_append(Qswiper, pageNum);
    if (pageNum > 5 && pageNum <= 598) {
        for (var i = 1; i <= 5; i++) {
            $$.qs_prepend(Qswiper, pageNum - i);
            $$.qs_append(Qswiper, pageNum + i);
        }
        Qswiper.slideTo(5, 0);
    } else if (pageNum < 6) {
        for (var i = 1; i <= pageNum - 1; i++) {
            $$.qs_prepend(Qswiper, pageNum - i);
        }
        for (var i = 1; i <= 5; i++) {
            $$.qs_append(Qswiper, pageNum + i);
        }
        Qswiper.slideTo(pageNum - 1, 0);
    } else if (pageNum >= 599) {
        for (var i = 1; i <= 604 - pageNum; i++) {
            $$.qs_append(Qswiper, pageNum + i);
        }
        for (var i = 1; i <= 5; i++) {
            $$.qs_prepend(Qswiper, pageNum - i);
        }
    }
    if (callback, typeof (callback) == 'function') {
        callback(Qswiper)
    }
}
//----------------------------------------------------------------
//---------------------   SWIPER  APPEND SLIDE  ------------------
//----------------------------------------------------------------
$$.qs_append = function (qs, pageNum) {
    var suras, context, sHtml;
    context = quranData.pages[pageNum - 1];
    context.pagenum = pageNum;
    context.s = quranData.sura[context.soura]
    sHtml = app.templates.swiperSlideTmp(context);
    qs.appendSlide(sHtml);
    $$.showQPage(pageNum)
}
//----------------------------------------------------------------
//---------------------   SWIPER  PREPEND SLIDE  ------------------
//----------------------------------------------------------------
$$.qs_prepend = function (qs, pageNum) {
    var suras, context, sHtml;
    context = quranData.pages[pageNum - 1];
    context.pagenum = pageNum;
    context.s = quranData.sura[context.soura]
    sHtml = app.templates.swiperSlideTmp(context);
    qs.prependSlide(sHtml);
    $$.showQPage(pageNum)
}
//----------------------------------------------------------------
//---------------------   SWIPER  APPEND SLIDES ------------------
//----------------------------------------------------------------
$$.addSlides = function (swiper, lastPageNum, callback) {
    var StoRemove = [];
    var sAct;
    var loop = (lastPageNum <= 599) ? 5 : (604 - lastPageNum);
    if ((swiper.activeIndex == swiper.slides.length - 2) && lastPageNum < 604) {
        sAct = swiper.activeIndex - loop;
        for (var i = 0; i < loop; i++) {
            StoRemove.push(i)
        }
        swiper.once('slideChangeEnd', function () {
            swiper.removeSlide(StoRemove);
            if (loop > 0) {
                setTimeout(function () {
                    for (var x = 1; x <= loop; x++) {
                        $$.qs_append(swiper, lastPageNum + x);
                    }
                    swiper.slideTo(sAct, 0, false);
                    swiper.update();
                    swiper.updateSlidesSize()
                }, 50)
            }
        })
    }

    if (callback, typeof (callback) == 'function') {
        callback(swiper, sAct)
    }
}
//----------------------------------------------------------------
//---------------------   SWIPER  PREPEND SLIDES  ----------------
//----------------------------------------------------------------
$$.preAddSlides = function (swiper, firstPageNum, callback) {
    var StoRemove = [],
        SActive;
    var loop = (firstPageNum >= 6) ? 5 : (firstPageNum - 1);
    if ((swiper.activeIndex == 1 || swiper.isBeginning) && firstPageNum >= 5) {
        SActive = swiper.activeIndex + loop;
        for (var i = swiper.slides.length - 1; i > loop; i--) {
            StoRemove.push(i)
        }
        swiper.once('slideChangeEnd', function () {
            swiper.removeSlide(StoRemove);
            if (loop > 0) {
                setTimeout(function () {
                    for (var x = 1; x <= loop; x++) {
                        $$.qs_prepend(swiper, firstPageNum - x);
                    }
                }, 50)
                //                    swiper.slideTo(SActive,0,false);
                swiper.update();
                swiper.updateSlidesSize()
            }
        })
    }

    if (callback, typeof (callback) == 'function') {
        callback(swiper, SActive)
    }
}

//----------------------------------------------------------------
//---------------------   SWIPER     ------------------
//------------------------  ----------------------------------------
$$.makeSwiper = function (context, calback) {
    $$.pageStyle();
    var Qswiper;
    var pageNum = parseInt(context.pageNum);
    var pageAyat;
    var swiperContainer = '#souar-continer-' + pageNum;
    var swiperStings = {
        initialSlide: 1,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 300,
        autoHeight: true,
        nextButton: ".nextPage",
        prevButton: ".previousPage",
        hashnav: true,
        lazyLoading: true,
        threshold: 20
    };
    if(localStorage['verticalMode'] &&localStorage['verticalMode'] =='y')
    {
        swiperStings.direction='vertical';
    }
    $$.getPageAyat(pageNum, function (ayat) {
        pageAyat = ayat;
        // REMOVE 

        $$.initQswiper(Qswiper, pageNum);
    });
    Qswiper = new Swiper('.swiper-container-' + pageNum, swiperStings);
    var zoomtime = 0;
    $('.swiper-container').panzoom({
        minScale: 1,
        maxScale: 1.001,
        onZoom: function (e, panzoom) {
            var matrix = panzoom.getMatrix();
            var operation = matrix[0] == '1' ? 'smaller' : 'larger';
            if (!(zoomtime % 10))
                $$.baseResizeText(operation);
            zoomtime++;
        },
        disablePan: true
    });
    var act, pre, activeSlide, slideNum, listChild, firstChild, lastpage, SLength, firstpage, preSlide;

    Qswiper.on('slideChangeEnd', function (swiper) {
        var index = swiper.activeIndex;
        var activeSlide = $$(swiper.slides[index]);
        var pNum = parseInt(activeSlide.data('pn'));
        //
        if ($$('.tooltip_container_top').length > 0) {
            $$('.tooltip_container_top').remove();
            $$('.highlight').removeClass("highlight");
        } 

        $$.savePageAya(pNum);
        if (Dmedia != null) {
            var btn = $$('.toolbar-player').find('.backToPage');
            if (Dmedia.page != pNum) {
                if (btn.hasClass('hidden')) {
                    btn.removeClass('hidden');
                    btn.on('click', function () {
                        $$.gotoPage(Qswiper, Dmedia.page, pNum, function () {
                            setTimeout(function () {
                                $$('.content-' + Dmedia.page).find("span[data-a='" + Dmedia.aya + "']").addClass('highlight3');
                                btn.addClass('hidden')
                            }, 100)
                        });

                    })
                }
            } else if (Dmedia.page == pNum) {
                if (!btn.is('.hidden')) {
                    btn.addClass('hidden');
                }
            }
        }
    });

    Qswiper.on('TransitionStart', function () {
        //$$('#overlay').css('display','block');
    })
    Qswiper.on('TransitionEnd', function () {
        $$('.page-background').scrollTop(0, 200);
        // $$('#overlay').css('display','none');
    })
    Qswiper.on('slideChangeStart', function (swiper) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        pre = swiper.previousIndex;
        SLength = swiper.slides.length;
        act = swiper.activeIndex;
        activeSlide = $$(swiper.slides[act]);
        preSlide = $$(swiper.slides[pre]);
        slideNum = parseInt(activeSlide.data('pn'));
        firstChild = $$(swiper.slides[0]);
        listChild = $$(swiper.slides[SLength - 1]);
        lastpage = parseInt(listChild.data('pn'));
        firstpage = parseInt(firstChild.data('pn'));
        $$('.swiper-pageNum .current_page').text(slideNum);
        if ($$('.title-navbar small').is('.juzNumber')) {
            var part = parseInt(activeSlide.data('p'));
            var prepart = parseInt(preSlide.data('p'));
            if (part != prepart) {
                $$('.page-on-center .title-navbar').find('.juzNumber').text('الجزء ' + arabicNum[part])
            }
        }
        if ($$('.title-navbar small').is('.hizbNumber')) {
            var index = Qswiper.activeIndex;
            var activeSlide = $$(Qswiper.slides[index]);
            var pNum = parseInt(activeSlide.data('pn'));
            $$.hizbName(pNum);
        }
        var preSNum = parseInt(preSlide.data('s')) - 1;
        var activeSNum = parseInt(activeSlide.data('s')) - 1;
        if (preSNum != activeSNum) {
            var activeSName = quranData.sura[activeSNum].name;
            $$('.page-on-center .title-navbar').find('.souraName').text('سورة ' + activeSName);
        }
    });



    Qswiper.on('SlideNextStart', function (e) {
        $$.addSlides(Qswiper, lastpage);
    });
    Qswiper.on('SlidePrevStart', function (e) {
        $$.preAddSlides(Qswiper, firstpage);
    });
    if (context.highlight) {
        setTimeout(function () {
            var Qai = Qswiper.activeIndex;
            var Qslide = $$(Qswiper.slides[Qai]);
            var sIndex = parseInt(context.souraIndex);
            Qslide.find('.soura[data-sindex="' + sIndex + '"]').find('.tooltip[data-a="' + context.highlight + '"]').addClass('highlight');
        }, 100)
    }
    //    if ($$('.title-navbar small').is('.hizbNumber')) {
    //            var index = Qswiper.activeIndex;
    //            var activeSlide = $$(Qswiper.slides[index]);
    //            var pNum = parseInt(activeSlide.data('pn'));
    //              $$.hizbName(pNum);
    //        }

};

//--------------------------------------------------------------------------
//------- initialize Quran page   ------------------------------------------ 
//--------------------------------------------------------------------------
$$(document).on('click', '.q-page .current_page', function (e) {
    var Swiper = $$('[data-layout="swiper"] .swiper-container')[0].swiper;
    var currentPage = parseInt($$(this).text());
    e.preventDefault();
    var modal = app.modal({
        title: 'الانتقال للصفحة',
        text: 'أدخل رقم الصفحة المطلوبة',
        afterText: '<div class="input-field">' +
            '<input type="number" class="modal-text-input pageNum" min="1" max="604" value="">' +
            '</div>',
        buttons: [{
                text: 'إلغاء'
            },
            {
                text: 'إنتقال',
                bold: true,
                onClick: function () {
                    var val = $$('.modal-text-input.pageNum').val();
                    var pNum = parseInt(val);
                    if (pNum == currentPage) return false;
                    if (pNum > 0 && pNum < 605) {
                        $$.gotoPage(Swiper, pNum, currentPage);
                    } else {
                        if (val == "") return false;
                        else
                            app.alert('الصفحة المطلوبة غير موجودة');
                    }
                }
            },
        ]
    });
    $$('.modal-text-input.pageNum').focus();
});;
$$(document).on('click', '.tab-link', function (e) {
    if ($$(e.target).parents('.picker-modal').length === 0 && $$('.picker-modal.modal-in').length > 0) {
        app.closeModal('.picker-modal.modal-in');
    }
})


$$.hizbPicker = function (index, callback) {
    if ($$('.picker-modal.modal-in').length > 0) {
        app.closeModal('.picker-modal.modal-in');
    }
    var count = 0;
    var sections = [];
    var Hizb = quranData.Hizb[index];
    delete Hizb.index;
    db.transaction(function (tx) {
            $$.each(Hizb, function (e, h) {
                h.type = e;
                tx.executeSql(queries.g_aya, [h.sura, h.aya], function (tx, resultSet) {
                    for (var x = 0; x < resultSet.rows.length; x++) {
                        h.text = $$.sliceTxt(resultSet.rows.item(x).text, 12, function (txt) {
                            sections.push(h);
                        });
                    }
                }, null)
            });
        }, null,
        function () {
            Hizb.sections = sections;
            var picker = app.templates.h_picker(Hizb);
            app.pickerModal(picker);
            $$('.picker-modal.modal-in').find('.left').html('الحزب ' + arabicNum[index]);
            if (callback, typeof (callback) == 'function') {
                callback()
            }
        });
}
//----------------------------------------------------------------
//---------------------   hizbName     ------------------
//------------------------  ----------------------------------------
// write hizb Name in html
$$.hizbName = function (pageNum, callback) {
    var hp = pageNum - 1;
    var hizPage = quranData.pages[hp].hizb;
    if (typeof hizPage === 'undefined') {
        for (var x = 0; x < 10; x++) {
            hizPage = quranData.pages[hp - x].hizb;
            if (typeof hizPage != 'undefined')
                break;
        }
    }
    setTimeout(function () {
        var hs = hizPage.split('_');
        var name;
        switch (hs[1]) {
            case "i":
                name = 'الحزب';
                break;
            case "q":
                name = 'ربع الحزب';
                break;
            case "h":
                name = 'نصف الحزب';
                break;
            case "t":
                name = 'ثلاثه ارباع الحزب';
                break;
        }
        $$('.page-on-center .title-navbar').find('.hizbNumber').text(name + ' ' + arabicNum[hs[0]])
    }, 150);
    if (callback, typeof (callback) == 'function')
        callback();
};
var searchbar = app.searchbar('.searchbar', {
    searchList: '#sour_list',
    searchIn: '.name'
});
//--------------------Show/Hide Searchbar-------------------------
//----------------------------------------------------------------
$$(document).on('click', '.toolbar-gold a', function () {
    var href = $$(this).attr('href').replace('#', '');
    if (href == 'souarlist') {
        app.showToolbar('.search-bar');
    } else {
        app.hideToolbar('.search-bar');
    }
});
// Slice 12 characters from aya text 
$$.ayaText = function (sura, aya, ayaTxt, query) {
    var txt, listWord, index, ayaList;
    ayaTxt = ayaTxt;
    listWord = ayaTxt.split(' ');
    if (listWord.length > 12) {
        ayaList = listWord.slice(0, 12).join(' ');
    } else {
        ayaList = listWord.join(' ');
    }
    return ayaList;
}
var Qsearch, maxItems, lastIndex = $$('.search-result li').length;

var loading = false;
var itemsPerLoad = 20;
var limit = 0;
// link to search page 
$$(document).on('click', '.searchPage-link', function () {
    $$.makepage({
        "page_name": "searchPage",
        "page_class": "searchpage ",
        "navbar": true,
        "page_title": 'البحث',
        "toolbar": false,
        "searchbar": false,
        "layout": "list",
        "customID": false,
        "contentClass": 'infinite-scroll',
        "blockClass": 'search_content',
        "infinite": true,
        "infinitedist": 75,
        "actionbotton": true
    });
})



/*

$$('.page-content').on('scroll', function(e){
         if($$(this).scrollTop() > 50 && show == false) {
               show = true;
              console.log(e)
           }
},true)
$$('.page-content.infinite-scroll').on('scroll', function(e){
    if($$(this).scrollTop() > 50 && $$('.floating-button').length == 0) {
        $$('<a href="#" class="floating-button color-green" ><i class="icon icon-upload"></i></a>').insertAfter('.page-content.infinite-scroll');
    }
},true)
*/

//------------------------   queryError   -----------------------------
//----------------------------------------------------------------------
function queryError(err) {
    console.log('Failed:', err);
    console.log('message:', err.message);
}
//------------------------   appendResult   -----------------------------
//----------------------------------------------------------------------
function appendResult(tx, res) {
    for (var x = 0; x < res.rows.length; x++) {

        var obj = {
            n: quranData.sura[res.rows.item(x).sura - 1].name,
            s: res.rows.item(x).sura,
            a: res.rows.item(x).aya,
            p: res.rows.item(x).page,
            t: $$.sliceTxt(res.rows.item(x).text, 12)
        }
        var htm = app.templates.searchitemstemplate(obj);
        $$('.search-result ul').append(htm);
    }
    app.hideIndicator();
}
//------------------------   append resultCount   -----------------------------
//----------------------------------------------------------------------
function appendCount(count) {
    if (count > 0) {
        maxItems = count;
        $$('.result-count').css('display', 'block').text('تم العثور على  ' + (count) + ' اية تحتوى على نص البحث');
        $$('.infinite-scroll-preloader').css('display', 'none');
    } else {
        $$('.result-count').css('display', 'block').text('لم يتم العثور على نتيجة');
        $$('.infinite-scroll-preloader').css('display', 'none');
    }
}
//------------------------   resultCount   -----------------------------
//----------------------------------------------------------------------
function resultCount(tx, text, sura) {
    if (sura) {
        var executeQuery = 'SELECT count(*) as count FROM arabic_text WHERE sura =? AND text2 like(?)';
        tx.executeSql(executeQuery, [sura, text], function (tx, res) {
            for (var x = 0; x < res.rows.length; x++) {
                var result = res.rows.item(x);
            }
            appendCount(result.count);
        }, queryError);
    } else {
        var executeQuery = 'SELECT count(*) as count FROM arabic_text where text2 like(?)';
        tx.executeSql(executeQuery, [text], function (tx, res) {
            for (var x = 0; x < res.rows.length; x++) {
                var result = res.rows.item(x);
            }
            appendCount(result.count);
        }, queryError);
    }
}
//------------------------   searchInSura   ----------------------------
//----------------------------------------------------------------------
function searchInSura(tx, text, sura, limit) {
    var executeQuery;
    if (limit) {
        executeQuery = 'SELECT *,rowid AS id FROM arabic_text WHERE sura =? AND text2 like(?) limit ' + limit + ', ' + itemsPerLoad;

    } else {
        executeQuery = 'SELECT *,rowid AS id FROM arabic_text WHERE sura =? AND text2 like(?) limit ' + itemsPerLoad;
    }
    tx.executeSql(executeQuery, [sura, text], appendResult, queryError);
}

//------------------------   searchInQuran   ------------------------------
//----------------------------------------------------------------------
function searchInQuran(tx, text, limit) {
    var executeQuery;
    if (limit) {
        executeQuery = 'SELECT  *,rowid AS id FROM arabic_text WHERE text2 like(?) limit ' + limit + ', ' + itemsPerLoad;

    } else {
        executeQuery = 'SELECT  *,rowid AS id FROM arabic_text WHERE text2 like(?) limit ' + itemsPerLoad;
    }

    tx.executeSql(executeQuery, [text], appendResult, queryError);
}
//------------------------   searchpage   ------------------------------
//----------------------------------------------------------------------
$$.searchpage = function () {
    var html = app.templates.searchtemplate({});
    $$('.search_content').html(html);

    $$('#searchform').on('submit', function (event) {
        event.preventDefault();
    });
    $$('#searchform').on('keydown', function (event) {
        if (event.keyCode == 13) {
            $$('.search-btn').trigger('click');
            return false;
        }
    });

    var val, select, text;
    $$('.search-btn').click(function () {
        app.attachInfiniteScroll($$('.infinite-scroll'));
        app.showIndicator();
        var foundItems;
        $$('.search-result ul').html(' ');
        limit = 0;
        $$('.result-count').css('display', 'none')
        val = $$('.page-on-center #searchform').find('input').val();
        select = parseInt($$('.page-on-center #searchform').find('select').val());
        text = '%' + val + '%';


        setTimeout(function () {
            if (val.length > 0) {
                db.transaction(function (tx) {
                    if (select > 0) {
                        searchInSura(tx, text, select);
                        resultCount(tx, text, select);
                    } else {
                        searchInQuran(tx, text);
                        resultCount(tx, text, false);
                    }
                }, queryError, function (e) {
                    // console.log('done');
                });
            } else {
                app.hideIndicator();
                $$('.result-count').css('display', 'block').text('أدخل كلمة البحث');
                $$('.infinite-scroll-preloader').css('display', 'none');
            }

        }, 100);
    });
    $$('#searchform input[type="text"]').on('change', function (e) {
        $$('.result-count').css('display', 'none');
        $$('.search-result ul').html(' ');
        var foundItems = [];
    });

    ///-----------------------------------------------------------------
    ///------------- search In Sura  -----------------------
    ///-----------------------------------------------------------------
    $$('#searchform ').on('change', 'select', function (e) {
        if ($$('#searchform').find('input').val().length > 0) {
            $$('.result-count').css('display', 'none');
            $$('.search-result ul').html(' ');
            var foundItems = [];
            $$('.search-btn').trigger('click');
        }

    });

    ///-----------------------------------------------------------------
    ///------------- load more results -----------------------
    ///-----------------------------------------------------------------
    $$('.infinite-scroll').on('infinite', function () {
        console.log(lastIndex, maxItems);
        if (loading) return;
        loading = true;

        setTimeout(function () {
            $$('.infinite-scroll-preloader').css('display', 'block');
            if (lastIndex >= maxItems) {
                app.detachInfiniteScroll($$('.infinite-scroll'));
                $$('.infinite-scroll-preloader').css('display', 'none');
                return;
            } else {
                limit += 20;

            }
            lastIndex = $$('.search-result li').length;

            db.transaction(function (tx) {

                if (select > 0) {
                    searchInSura(tx, text, select, limit);
                } else {
                    searchInQuran(tx, text, limit);
                }
            }, queryError, function (e) {

                loading = false;
            });

        }, 50);
    });

    ///-----------------------------------------------------------------
    ///------------- back To Top  button -----------------------
    ///-----------------------------------------------------------------
    $$('.page-content.infinite-scroll').on('scroll', function (e) {
        if ($$(this).scrollTop() > 220 && $$('.backtotop').is('.in') == false) {
            $$('.backtotop').addClass('in');
            $$('.floating-button').click(function () {
                $$('.page-content.infinite-scroll').scrollTop(0, 300);
            });
        }
        if ($$(this).scrollTop() < 220 && $$('.backtotop').is('.in') == true) {
            $$('.backtotop').removeClass('in');
        }
    });


};

$$(document).on('click', '.search-result a', function () {
    var souraIndex = $$(this).data('s');
    var souraNum = quranData.pages[parseInt($$(this).data('p')) - 1].soura;
    var souraName = quranData.sura[souraNum - 1].name;
    $$.makepage({
        "page_name": quranData.sura[souraNum - 1].tname,
        "page_class": "q-page",
        "q_page": true,
        "S_name": souraName,
        "souraIndex": $$(this).data('s'),
        "juzNumber": arabicNum[$$(this).data('part')],
        "links": true,
        "pageNum": parseInt($$(this).data('p')),
        "layout": "swiper",
        "swiper": true,
        "highlight": parseInt($$(this).data('a')),
        "contentClass": "borderpage"
    }, function (page) {
        $$(document).once(animationEnd, function () {
            setTimeout(function () {
                var a = $$('.content-' + page.pageNum).find('.tooltip[data-a="' + page.highlight + '"]');
                $$('.page-background').scrollTop(a.offset().top - 40, 300);
            }, 200);
        });
    })
});



// autocomplete;
// Slice 12 characters from aya text 
$$.ayaText = function (sura, aya, ayaTxt, query) {
    var txt, listWord, index, ayaList;
    ayaTxt = ayaTxt;
    listWord = ayaTxt.split(' ');
    if (listWord.length > 12) {
        ayaList = listWord.slice(0, 12).join(' ');
    } else {
        ayaList = listWord.join(' ');
    }
    return ayaList;
}
//---------------------------------------- Meanings
var QsearchMeanings, maxItemsMeanings, lastIndexMeanings = $$('.search-result li').length;

var loadingMeanings = false;
var itemsPerLoadMeanings = 20;
var limitMeanings = 0;
// link to search page 
$$(document).on('click', '.searchMeaningsPage-link', function () {
    $$.makepage({
        "page_name": "searchMeaningsPage",
        "page_class": "searchpage ",
        "navbar": true,
        "page_title": 'البحث بمعاني المرشد',
        "toolbar": false,
        "searchbar": false,
        "layout": "list",
        "customID": false,
        "contentClass": 'infinite-scroll',
        "blockClass": 'search_content',
        "infinite": true,
        "infinitedist": 75,
        "actionbotton": true
    });
})




/*

$$('.page-content').on('scroll', function(e){
         if($$(this).scrollTop() > 50 && show == false) {
               show = true;
              console.log(e)
           }
},true)
$$('.page-content.infinite-scroll').on('scroll', function(e){
    if($$(this).scrollTop() > 50 && $$('.floating-button').length == 0) {
        $$('<a href="#" class="floating-button color-green" ><i class="icon icon-upload"></i></a>').insertAfter('.page-content.infinite-scroll');
    }
},true)
*/

//------------------------   queryError   -----------------------------
//----------------------------------------------------------------------
function queryError(err) {
    console.log('Failed:', err);
    console.log('message:', err.message);
}
//------------------------   appendResultMeanings   -----------------------------
//----------------------------------------------------------------------
function appendResultMeanings(tx, res) {
    for (var x = 0; x < res.rows.length; x++) {

        var obj = {
            n: quranData.sura[res.rows.item(x).sura - 1].name,
            s: res.rows.item(x).sura,
            a: res.rows.item(x).aya,
            p: res.rows.item(x).page,
            t: $$.sliceTxt(res.rows.item(x).text, 12),
            t_word: res.rows.item(x).t_word,
            a_word: res.rows.item(x).a_word
        }
        //add class select
        //obj.t_word = obj.t_word.replace(val,'<span class="">'+val+'</span>')
        var htm = app.templates.searchMeaningsitemstemplate(obj);
        $$('.searchMeanings-result ul').append(htm);
    }
    app.hideIndicator();
}
//------------------------   append resultCountMeanings   -----------------------------
//----------------------------------------------------------------------
function appendCountMeanings(count) {
    if (count > 0) {
        maxItemsMeanings = count;
        $$('.result-count').css('display', 'block').text('تم العثور على  ' + (count) + ' مفردة تحتوى على نص البحث');
        $$('.infinite-scroll-preloader').css('display', 'none');
    } else {
        $$('.result-count').css('display', 'block').text('لم يتم العثور على نتيجة');
        $$('.infinite-scroll-preloader').css('display', 'none');
    }
}
//------------------------   resultCountMeanings   -----------------------------
//----------------------------------------------------------------------
function resultCountMeanings(tx, text, sura) {
    var executeQuery = `SELECT count(*) as count FROM arabic_text 
    INNER JOIN q_words ON (arabic_text.sura = q_words.sura And arabic_text.aya = q_words.aya  ) `;
    if (sura) {
         executeQuery += ' WHERE sura =? AND t_word like(?)';
        tx.executeSql(executeQuery, [sura, text], function (tx, res) {
            for (var x = 0; x < res.rows.length; x++) {
                var result = res.rows.item(x);
            }
            appendCountMeanings(result.count);
        }, queryError);
    } else {
         executeQuery += ' WHERE t_word like(?)';
        tx.executeSql(executeQuery, [text], function (tx, res) {
            for (var x = 0; x < res.rows.length; x++) {
                var result = res.rows.item(x);
            }
            appendCountMeanings(result.count);
        }, queryError);
    }
}
//------------------------   searchMeaningsInSura   ----------------------------
//----------------------------------------------------------------------
function searchMeaningsInSura(tx, text, sura, limit) {
    var executeQuery = `SELECT *,rowid AS id FROM arabic_text
     INNER JOIN q_words ON (arabic_text.sura = q_words.sura And arabic_text.aya = q_words.aya  ) 
     WHERE sura =? AND t_word like(?)`;
    if (limit) {
        executeQuery += ' limit ' + limit + ', ' + itemsPerLoadMeanings;

    } else {
        executeQuery += ' limit ' + itemsPerLoadMeanings;
    }
    tx.executeSql(executeQuery, [sura, text], appendResultMeanings, queryError);
}
//------------------------   searchInQuran   ------------------------------
//----------------------------------------------------------------------
function searchMeaningsInQuran(tx, text, limit) {
    var executeQuery = `SELECT  * FROM arabic_text
         INNER JOIN q_words ON (arabic_text.sura = q_words.sura And arabic_text.aya = q_words.aya  ) 
         WHERE t_word like(?)`;
    if (limit) {
         executeQuery += ' limit '+ limit + ', ' + itemsPerLoadMeanings;

    } else {
        executeQuery += ' limit ' + itemsPerLoadMeanings;
    }
    tx.executeSql(executeQuery, [text], appendResultMeanings, queryError);
}
//------------------------   searchMeaningspage   ------------------------------
//----------------------------------------------------------------------
var val, select, text;
$$.searchMeaningspage = function () {
    var html = app.templates.searchMeaningstemplate({});
    $$('.search_content').html(html);

    $$('#searchMeaningsform').on('submit', function (event) {
        event.preventDefault();
    });
    $$('#searchMeaningsform').on('keydown', function (event) {
        if (event.keyCode == 13) {
            $$('.searchMeanings-btn').trigger('click');
            return false;
        }
    });


    $$('.searchMeanings-btn').click(function () {
        app.attachInfiniteScroll($$('.infinite-scroll'));
        app.showIndicator();
        var foundItems;
        $$('.searchMeanings-result ul').html(' ');
        limitMeanings = 0;
        $$('.result-count').css('display', 'none')
        val = $$('.page-on-center #searchMeaningsform').find('input').val();
        select = parseInt($$('.page-on-center #searchMeaningsform').find('select').val());
        text = '%' + val + '%';


        setTimeout(function () {
            if (val.length > 0) {
                db.transaction(function (tx) {
                    if (select > 0) {
                        searchMeaningsInSura(tx, text, select);
                        resultCountMeanings(tx, text, select);
                    } else {
                        searchMeaningsInQuran(tx, text);
                        resultCountMeanings(tx, text, false);
                    }
                    app.hideIndicator();
                }, queryError, function (e) {
                    app.hideIndicator();
                });
            } else {
                app.hideIndicator();
                $$('.result-count').css('display', 'block').text('أدخل كلمة البحث');
                $$('.infinite-scroll-preloader').css('display', 'none');
            }

        }, 100);
    });
    $$('#searchMeaningsform input[type="text"]').on('change', function (e) {
        $$('.result-count').css('display', 'none');
        $$('.searchMeanings-result ul').html(' ');
        var foundItems = [];
    });

    ///-----------------------------------------------------------------
    ///------------- searchMeanings In Sura  -----------------------
    ///-----------------------------------------------------------------
    $$('#searchMeaningsform ').on('change', 'select', function (e) {
        if ($$('#searchMeaningsform').find('input').val().length > 0) {
            $$('.result-count').css('display', 'none');
            $$('.searchMeanings-result ul').html(' ');
            var foundItems = [];
            $$('.searchMeanings-btn').trigger('click');
        }

    });

    ///-----------------------------------------------------------------
    ///------------- load more results -----------------------
    ///-----------------------------------------------------------------
    $$('.infinite-scroll').on('infinite', function () {
        console.log( lastIndexMeanings, maxItemsMeanings);
        if (loadingMeanings) return;
        loadingMeanings = true;

        setTimeout(function () {
            $$('.infinite-scroll-preloader').css('display', 'block');
            if ( lastIndexMeanings >= maxItemsMeanings) {
                app.detachInfiniteScroll($$('.infinite-scroll'));
                $$('.infinite-scroll-preloader').css('display', 'none');
                return;
            } else {
                limitMeanings += 20;

            }
             lastIndexMeanings = $$('.searchMeanings-result li').length;

            db.transaction(function (tx) {
                if (select > 0) {
                    searchMeaningsInSura(tx, text, select, limitMeanings);
                } else {
                    searchMeaningsInQuran(tx, text, limitMeanings);
                }
            }, queryError, function (e) {
                loadingMeanings = false;
            });

        }, 150);
    });

    ///-----------------------------------------------------------------
    ///------------- back To Top  button -----------------------
    ///-----------------------------------------------------------------
    $$('.page-content.infinite-scroll').on('scroll', function (e) {
        if ($$(this).scrollTop() > 220 && $$('.backtotop').is('.in') == false) {
            $$('.backtotop').addClass('in');
            $$('.floating-button').click(function () {
                $$('.page-content.infinite-scroll').scrollTop(0, 300);
            });
        }
        if ($$(this).scrollTop() < 220 && $$('.backtotop').is('.in') == true) {
            $$('.backtotop').removeClass('in');
        }
    });


};

$$(document).on('click', '.searchMeanings-result a', function () {
    var souraIndex = $$(this).data('s');
    var souraNum = quranData.pages[parseInt($$(this).data('p')) - 1].soura;
    var souraName = quranData.sura[souraNum - 1].name;
    $$.makepage({
        "page_name": quranData.sura[souraNum - 1].tname,
        "page_class": "q-page",
        "q_page": true,
        "S_name": souraName,
        "souraIndex": $$(this).data('s'),
        "juzNumber": arabicNum[$$(this).data('part')],
        "links": true,
        "pageNum": parseInt($$(this).data('p')),
        "layout": "swiper",
        "swiper": true,
        "highlight": parseInt($$(this).data('a')),
        "contentClass": "borderpage"
    }, function (page) {
        $$(document).once(animationEnd, function () {
            setTimeout(function () {
                var a = $$('.content-' + page.pageNum).find('.tooltip[data-a="' + page.highlight + '"]');
                $$('.page-background').scrollTop(a.offset().top - 40, 300);
            }, 200);
        });
    })
});;
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
});
$$.getTafsir = function (soura, aya, callback) {
	return slectFromDB(queries.g_tafsir, [soura, aya]).then(function (resultSet) {
		var obj;
		for (var x = 0; x < resultSet.rows.length; x++) {
			obj = resultSet.rows.item(x);
		}
		if (callback, typeof (callback) == 'function') {
			callback(obj)
		}
		return obj;
	})
}
//----------------------------------------------------------------
//---------------------   GET  TAFSIR PAGE LIST  -----------------
//----------------------------------------------------------------
$$.tafsirList = function (soura, aya, callback) {
	$$.getJSON('./json/tafsirLast.json', function (data) {
		var inter = data.interpreter;
		for (var z = 0; z < inter.length; z++) {
			var html = app.templates.tafsirlist(inter[z]);
			$$("#tfasier_list").append(html);
		}
	});
}
//----------------------------------------------------------------
//---------------------   find  TAFSIR  --------------------------
//----------------------------------------------------------------
$$.findTafsir = function (soura, aya, calback) {
	var ayaText, obj, words = [];
	db.transaction(function (tx) {
		tx.executeSql(queries.g_aya, [soura, aya], function (tx, resultSet) {
			for (var x = 0; x < resultSet.rows.length; x++) {
				ayaText = resultSet.rows.item(x).text;
			}
		}, function (tx, error) {
			console.log(error.message);
		});
		tx.executeSql(queries.g_tafsir, [soura, aya], function (tx, resultSet) {
			for (var x = 0; x < resultSet.rows.length; x++) {
				obj = resultSet.rows.item(x);
			}
		}, function (tx, error) {
			console.log(error.message);
		});

		tx.executeSql(queries.g_a_words, [soura, aya], function (tx, resultSet) {
			for (var x = 0; x < resultSet.rows.length; x++) {
				words.push(resultSet.rows.item(x))
			}

		}, function (tx, error) {
			console.log(error.message);
		});

	}, function (error) {
		console.log(error.message);
	}, function (s) {
		if ((soura == 1 && aya == 1) || soura == 9) {
			obj.title = false;
		} else {
			obj.title = true;
		}
		obj.tafsir_name = 'تفسير الميسر';
		obj.ayatext = ayaText;
		obj.words = words;
		var thtml = app.templates.tafsirtemplate(obj);
		app.popup(thtml);
		// $$.tafsirList(soura, aya);
	});
}
//----------------------------------------------------------------
//---------------------  TAFSIR  Page  ---------------------------
//----------------------------------------------------------------
$$.maketafsirList = function (customID) {
	var Tlist;
	var page = $$('.page-on-center');
	var continer;
	if (customID) {
		continer = customID;
	} else {
		var type = page.find('.page-content').data('layout');
		if (type == 'list')
			var conID = page.find('.list-block').attr('id');
		continer = "#" + conID + ' ul';
	}
	$$.getJSON('./json/tafsirLast.json', function (data) {
		var inter = data.interpreter;
		var tafsir = {
			"id": inter.length,
			"name": "تفسير الميُسر",
			"name_en": "Tafsir Almisr",
			"api": "./json/tafsir.json"
		}
		inter.push(tafsir);
		for (var z = 0; z < inter.length; z++) {
			var html = app.templates.tafsirlist(inter[z]);
			$$(continer).append(html);
		}
		Tlist = inter;
	});
	$$(continer).on('click', 'a', function () {
		var id = $$(this).attr('id');
		$$.openTafsir(id, Tlist);
	})
};
//----------------------------------------------------------------
//---------------------  OPEN  TAFSIR  --------------------------- 
//----------------------------------------------------------------
var TafsirBook;
$$.openTafsir = function (id, Tlist, callback) {
	app.showIndicator()
	var interpreter;
	for (var i = 0; i < Tlist.length; i++) {
		if (Tlist[i].id == id) {
			interpreter = Tlist[i];
			break;
		}
	}
	if (interpreter) {
		$$.getJSON(interpreter.api, function (data) {
			TafsirBook = data;
			app.hideIndicator();
			var Tname = interpreter.name_en.replace(' ', '_');
			$$.makepage({
				"page_name": Tname,
				"page_class": "interpreter-page",
				"page_title": interpreter.name,
				"toolbar": false,
				"searchbar": true,
				"layout": "list",
				"contentClass": 'souar-list',
				"customID": 'souar-list',
				"blockClass": 'virtual-list'
			}, function (e) {
				app.onPageAfterAnimation(e.page_name, function () {
					var newsearchbar = app.searchbar('.searchbar-' + Tname, {
						searchList: '#souar-list',
						searchIn: '.name'
					});
					var soursList = app.virtualList('#souar-list.virtual-list', {
						rowsBefore: 20,
						rowsAfter: 20,
						items: quranData.sura,
						template: ' <li>' +
							' <a href="#" class="item-link item-content soura" data-s="{{index}}" data-en="{{tname}}" data-part="{{part}}" data-page="{{page}}">' +
							' <div class="index">{{index}}</div>' +
							' <div class="item-info">' +
							' <div class="name">{{name}}</div>' +
							' <div class="quantity">آياتها <strong>{{ayas}}</strong> </div>' +
							' </div>  </a> </li>',
						searchAll: function (query, items) {
							var foundItems = [];
							for (var i = 0; i < items.length; i++) {
								if (items[i].name.indexOf(query.trim()) >= 0) foundItems.push(i);
							}
							return foundItems;
						}
					});
				})
			});
		});
	}
	//
	setTimeout(function () {
		if ($$('.preloader-indicator-modal').length > 0);
		app.hideIndicator();
	}, 4000);
	if (callback, typeof (callback) == 'function') {
		callback(Tlist)
	}
}
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
$$(document).on('click', '.tafsirlist-link', function () {
	$$.makepage({
		"page_name": "tafsirlist",
		"page_class": "tafsir-page",
		"page_title": 'التفاسير',
		"toolbar": false,
		"customID": 'interpreterList',
		"layout": "list",
	});
})
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
$$(document).on('click', '.interpreter-page .item-link', function () {
	var index = parseInt($$(this).data('s'));
	var soura = quranData.sura[index - 1];
	var pageName = soura.tname.replace(/'|\s|"|-/g, '_');
	var title = soura.name;
	$$.makepage({
		"page_name": pageName,
		"page_class": "ayat-page",
		"page_title": title,
		"toolbar": false,
		"layout": "list",
		"blockClass": 'virtual-list ayat-list',
		"searchbar": true
	}, function (page) {
		$$.virtualList(soura);
		// $$.cleanHistoryItem("#tafsirlist");
	});
});
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
$$.virtualList = function (soura) {
	var souraIndex = parseInt(soura.index);
	var Llength = parseInt(soura.ayas);
	var ayatList = [];
	var pageName = soura.tname.replace(/'|\s|"|-/g, '_');
	app.onPageAfterAnimation(pageName, function (page) {
		var ayat = [];
		//        $$('.searchbar-input').find('input').attr('type','number');
		var searchbar = app.searchbar('.searchbar-' + pageName, {
			searchList: '.ayat-list.virtual-list',
			searchIn: '.ayaNum'
		});
		db.transaction(function (tx) {
			tx.executeSql(queries.g_sura, [souraIndex], function (tx, resultSet) {
				for (var x = 0; x < resultSet.rows.length; x++) {
					ayat.push(resultSet.rows.item(x))
				}
			}, null);
		}, null, function () {
			$$('.searchbar-' + pageName).find('input').attr('placeholder', 'رقم أية من 1- ' + Llength);
			var myList = app.virtualList('.ayat-list.virtual-list', {
				items: ayat,
				renderItem: function (index, item) {
					return ' <li>' +
						'<a href="#"  class="item-link" data-s="' + item.sura + '" data-a="' + item.aya + '" >' +
						' <div class="info">' +
						'<div class="title">' + item.text + '</div>' +
						' </div>' +
						'<div class="ayaNum">' + item.aya + '</div>' +
						'</a>' +
						'</li>';
				},
				searchAll: function (query, items) {
					console.log(query, items);
					var foundItems = [];
					for (var i = 0; i < items.length; i++) {
						if (items[i].a.indexOf(query.trim()) >= 0) foundItems.push(i);
					}
					return foundItems;
				}
			});
		});
	});
}
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
$$(document).on('click', '.ayat-page .item-link', function () {
	var tsr;
	var aya = parseInt($$(this).data('a'));
	var index = parseInt($$(this).data('s'));
	var soura = quranData.sura[index - 1];
	var pageName = soura.tname.replace(/'|\s|"|-/g, '_');
	var title = soura.name;
	$$.makepage({
		"page_name": "tafsir_" + pageName,
		"page_class": "tafsirAyaPage",
		"navbar": true,
		"page_title": title,
		"toolbar": true,
		"links": true,
		"pageNum": aya,
		"layout": "page",
		"customID": "aya-" + index,
		"contentClass": 'tafsir_aya_Page',
		"blockClass": false
	}, function (e) {})
	$$(".page-on-center").once(animationEnd, function () {
		$$.layout(index, aya);
	});
});
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
$$.layout = function (soura, aya) {
	var ayaObj = {};
	db.transaction(function (tx) {
		tx.executeSql(queries.g_aya, [soura, aya], function (tx, resultSet) {
			for (var x = 0; x < resultSet.rows.length; x++) {
				ayaObj.text = resultSet.rows.item(x).text;
			}
		}, null);
		tx.executeSql(queries.g_tafsir, [soura, aya], function (tx, resultSet) {
			for (var x = 0; x < resultSet.rows.length; x++) {
				ayaObj.tafsir = resultSet.rows.item(x).text;
			}
		}, null);
	}, null, function () {
		var tHtml = app.templates.tafsirAya(ayaObj);
		$$('.tafsir_aya_Page .content-block').html(tHtml).removeClass('animated fadeOut');
		$$('.tafsir_aya_Page .content-block').html(tHtml).addClass('animated fadeIn').once(animationEnd, function () {
			$$('.tafsir_aya_Page .content-block').removeClass('animated fadeIn');
		});
	});
}
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
$$(document).on('click', '.tafsirAyaPage a:not(.current_page) ', function (event) {
	var aya = parseInt($$('.tafsirAyaPage .current_page').text());
	var soura = parseInt($$('.tafsir_aya_Page').find('.content-block').attr('id').replace('aya-', ''));
	var newSoura = parseInt(quranData.sura[soura - 1].ayas);
	var className;
	if ($$(this).is('.previousPage')) {
		if (aya - 1 == 0) {
			if (soura - 1 == 0) {
				event.preventDefault();
				return false;
			} else {
				soura--;
				aya = parseInt(quranData.sura[soura - 1].ayas);
				$$('.tafsir_aya_Page').find('.content-block').attr('id', 'aya-' + soura);
				var sName = quranData.sura[soura - 1].name;
				$$('.page-on-center .navbar-inner').find('.center span').text(sName);
			}
		} else {
			aya--;
			if (aya == 1 && soura == 1) {
				$$('.previousPage').addClass('disabled');
			}
			if ($$('.nextPage').is('.disabled')) {
				$$('.nextPage').removeClass('disabled');
			}
		}
	}
	if ($$(this).is('.nextPage')) {
		if (aya + 1 > newSoura) {
			if (soura + 1 == 115) {
				event.preventDefault();
				return false;
			} else {
				soura++;
				aya = 1;
				$$('.tafsir_aya_Page').find('.content-block').attr('id', 'aya-' + soura);
				var sName = quranData.sura[soura - 1].name;
				$$('.page-on-center .navbar-inner').find('.center span').text(sName);
			}
		} else {
			aya++;
			if (aya == 6 && soura == 114) {
				$$('.nextPage').addClass('disabled');
			}
			if ($$('.previousPage').is('.disabled')) {
				$$('.previousPage').removeClass('disabled');
			}
		}
	}
	$$('.tafsirAyaPage .current_page').text(aya);
	$$('.tafsir_aya_Page .content-block').addClass('animated fadeOut').once(animationEnd, function () {
		$$.layout(soura, aya);
	});
});
//var startx = 0;
//var starty = 0;
//// var opacity = 100;
//$$(document).on("touchstart",'.tafsir_aya_Page', function (e) {
//     var touchobj = e.changedTouches[0];
//           startx = parseInt(touchobj.clientX);
//           starty = parseInt(touchobj.clientY);
//       $$('.page-on-center').find('.content-block').attr('data-id','tomove').css('position' ,"fixed");
//});
//$$(document).on("touchmove",'.tafsir_aya_Page', function (e) {
//     var touchobj = e.changedTouches[0];
//     var dist = parseInt(touchobj.clientX) - startx  ;
////     opacity--;
//     var cs = {
//        'transform' : 'translate3d('+ dist +'px,0px,0)',
//        'transition-duration' : 0+'ms',
////         'opacity' : opacity / 100  
//     }
// 
//    $$('[data-id ="tomove"]').css(cs)
//     
//});
//$$(document).on("touchend",'.tafsir_aya_Page', function (e) {
//        var touchobj = e.changedTouches[0];
//        var PY = parseInt(touchobj.clientY) - starty;
//        if(startx < parseInt(touchobj.clientX) && ( PY <= 50 && PY > -50 )){
//              $$('.page-on-center').find('.nextPage').trigger('click');
//        }
//        if(startx > parseInt(touchobj.clientX) && ( PY <= 50 && PY > -50 )){
//             $$('.page-on-center').find('.previousPage').trigger('click');
//        }
//    setTimeout(function(){
//        $$('[data-id ="tomove"]').removeAttr('style').removeAttr('data-id');
////         opacity = 100;
//    },200)
//});;
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
};
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
};
$$.setRecite = function (recite) {
    if (localStorage.getItem('activeRecite') == null) {
        localStorage.setItem('activeRecite', (typeof recite == "undefined") ? 1 : recite);
    } else if (recite) {
        localStorage.setItem('activeRecite', recite);
    }
}
// convert app  to night version
$$.nightVersion = function (check) {
    if (localStorage.getItem('nightVersion') == null) {
        localStorage.setItem('nightVersion', (typeof font == "undefined") ? 'n' : check);
    } else if (check) {
        localStorage.setItem('nightVersion', check);
    }
    if (check && $$('.q-page .page-background').length > 0) {
        if (check == 'n') {
             $$('body').removeClass('nightVersion');
        }
        else
        {
            $$('body').addClass('nightVersion');
        }
        // if (check == 'n') {
        //     $$('.q-page .page-background.nightVersion').each(function (i, v) {
        //         $$(v).removeClass('nightVersion');
        //     });
        // } else {
        //     $$('.q-page .page-background[data-layout="swiper"]').each(function (i, v) {
        //         $$(v).addClass('nightVersion');
        //     });
        // }
    }
}

// active all custom style like  fontsize, borders ,font
$$.pageStyle = function () {
    var recite, font, nightV;
    recite = localStorage.getItem('activeRecite');
    font = localStorage.getItem('activeFont');
    nightV = localStorage.getItem('nightVersion');
    border = localStorage.getItem('border');
    if (recite == null) $$.setRecite(1);
    if (font == null) $$.setFont('hafs');
    if (nightV == null) $$.nightVersion('n');

    if (nightV == 'y')
        // $$('.q-page .page-background').addClass('nightVersion');
        $$('body').addClass('nightVersion');
    else
        // $$('.q-page .page-background').removeClass('nightVersion');
         $$('body').removeClass('nightVersion');

    if (font)
        $$('.q-page .page-background').css('font-family', font);
    $$.FontSize();
    $$.setborder();
};

// Change Quran Font
$$.setFont = function (font) {
    if (localStorage.getItem('activeFont') == null) {
        localStorage.setItem('activeFont', (typeof font == "undefined") ? 'hafs' : font);
    } else if (font) {
        localStorage.setItem('activeFont', font);
    }
    if (font && $$('.q-page .page-background[data-layout="swiper"]').length > 0) {
        $$('.q-page .page-background[data-layout="swiper"]').each(function (i, v) {
            $$(v).css('font-family', font);
        });
    }
}
//-------------------- convert  PX To REM --------------
//------------------------------------------------------
$$.toRem = function (size) {
    var obj, line;
    line = size * 1.6;
    return obj = {
        'font-size': (size / 16) + 'rem',
        'line-height': (line / 14) + 'rem'
    };
}
//-------------------- RESIZE TEXT ---------------------
//------------------------------------------------------
$$.FontSize = function (size, set) {
    var fontSize = (typeof size == "undefined") ? 16 : size,
        preview = $$('.font-preview');
    if (localStorage.getItem('fontSize') == null) {
        localStorage.setItem('fontSize', fontSize);
    } else if (set) {
        localStorage.setItem('fontSize', fontSize);
    } else {
        fontSize = localStorage.getItem('fontSize');
    }
    preview.css('font-size', fontSize + 'px');
    if (fontSize != 16) {
        if ($$('.reset').length == 0)
            preview.removeClass('disabled').prepend('<i class="fa fa-refresh reset"></i>');
    }
    if ($$('.q-page .page-background[data-layout="swiper"]').length > 0) {
        var obj = $$.toRem(fontSize);
        $$('.q-page .page-background[data-layout="swiper"]').each(function (i, v) {
            $$(v).css(obj);
        });
    }
}
$$.resizeText = function (obj) {
    var $this = $$(obj),
        preview = $$('.font-preview'),
        operation = $this.data('op');
    $$.baseResizeText(operation);
}
$$.baseResizeText = function (operation) {
    var size = 16,
        max = 34,
        min = 13;
    if (localStorage.getItem('fontSize')) {
        size = parseInt(localStorage.getItem('fontSize'));
    };
    if (size <= max && operation == 'larger')
        $$.FontSize(size + 1, true);
    if (size >= min && operation == 'smaller')
        $$.FontSize(size - 1, true);
}
// double tap doubletap
var tapped = false;
$$(document).on('click', '.tooltip[data-a]', function (e) {
    if (!tapped) {
        tapped = setTimeout(function () {
            tapped = null;
        }, 300);
    } else {
        $$.FontSize(16, true);


        clearTimeout(tapped);
        tapped = null;

    }


});

$$(document).on('click', '.font-control-btn', function (e) {
    $$.resizeText(this);
});
$$(document).on('click', '.font-preview', function (e) {
    if ($$(this).attr('style') != null) {
        app.confirm('العودة للحجم الافتراضي ؟', 'إعدادات الخط', function () {
            $$.FontSize(16, true)
            $$('.font-preview').addClass('disabled');
            if ($$('.reset').length != 0)
                $$('.fa-refresh.reset').remove();
        });
    }
});

// set Quran page border 

$$.setborder = function (border, set) {
    var pageBorder = (typeof border == "undefined") ? 1 : border;
    if (localStorage.getItem('border') == null) {
        localStorage.setItem('border', pageBorder);
    } else if (set) {
        localStorage.setItem('border', pageBorder);
    } else {
        pageBorder = localStorage.getItem('border');
    }
    if ($$('.borderpage[data-layout="swiper"]').length > 0) {
        $$('.borderpage[data-layout="swiper"]').each(function (i, v) {
            for (var x = 1; x <= 7; x++) {
                if ($$(v).hasClass('bg-' + x)) $$(v).removeClass('bg-' + x);
            }
            $$(v).addClass('bg-' + pageBorder);
        });
    }
}

//--------------------------------------------------------------------
//------initialize setting page --------------------------------------
//--------------------------------------------------------------------
$$.settingPage = function () {
    var html = app.templates.settingPage({});
    $$('.setting_content ul').html(html);
    var activeRecite = localStorage.getItem('activeRecite');
    if (activeRecite) {
        $$('#reciteSelect select').find('[value="' + activeRecite + '"]').prop('selected', true);
        var name = quranData.recitations[activeRecite].arname;
        $$('.smart-select#reciteSelect .item-after').text(name);
    }
    $$('#reciteSelect select').on('change', function () {
        var val = parseInt($$(this).val());
        $$.setRecite(val);
    })
    var acFont = localStorage.getItem('activeFont');
    if (acFont) {
        $$('#fontsList select').find('[value="' + acFont + '"]').prop('selected', true);
        var fontList = {
            "hafs": "حفص",
            "noorehira": "نور حراء",
            "noorehuda": "نور الهدى",
            "saleem": "سليم",
            "a-Regular": "الاميري"
        }
        $$('.smart-select#fontsList .item-after').text(fontList[acFont]);
    }
    $$('#fontsList select').on('change', function () {
        var fontname = $$(this).val();
        $$('#fontsList select').find('[value="' + fontname + '"]').prop('selected', true);
        $$('.smart-select#fontsList .item-after').text(fontList['' + fontname]);
        $$.setFont(fontname);
    })
    var nightV = localStorage.getItem('nightVersion');
    if (nightV) {
        $$('#nightCheckbox').prop('checked', (nightV == 'y') ? true : false);
    }
    $$('#nightCheckbox').on('change', function () {
        $$.nightVersion((this.checked) ? 'y' : 'n')
    })

    //---------------- verticalMode
    var verticalMode = localStorage.getItem('verticalMode');
    if (verticalMode) {
        $$('#verticalModeCheckbox').prop('checked', (verticalMode == 'y') ? true : false);
    }
    $$('#verticalModeCheckbox').on('change', function () {
        //$$.verticalMode((this.checked) ? 'y' : 'n')

        localStorage['verticalMode'] = (this.checked) ? 'y' : 'n';

        //localStorage['reloadindex'] = true;
        document.location.reload();
    });
    //----------------

    var border = localStorage.getItem('border');
    if (border) {
        var option = $$('#pageBorder select').find('[value="' + border + '"]');
        option.prop('selected', true);
        $$('.smart-select#pageBorder .item-after').text(option.text());
    }
    $$('#pageBorder select').on('change', function () {
        var border = $$(this).val();
        $$('#pageBorder select').find('[value="' + border + '"]').prop('selected', true);

        $$.setborder(border, true);
    })
};;
function fail(error) {
    console.log('error', error);
}
// Remove App Folder 
function removeFolder(folder, callback) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        fs.root.getDirectory(folder, {
            create: false,
            exclusive: false
        }, function (entry) {
            entry.removeRecursively(function () {
                if (callback, typeof (callback) == 'function') {
                    callback()
                }
            }, fail);
        });
    }, fail);
}




function typetext(type) {
    switch (type) {
        case 'Murattal':
            return 'ترتيل';
        case 'Mujawwad':
            return 'تجويد';
        case 'Muallim':
            return 'تعليم';
    }
}
///---------------------------------------------------
///----------------- link to recitations page -------- 
///---------------------------------------------------
$$(document).on('click', '.recitations-link', function () {
    $$.makepage({
        "page_name": "recitations",
        "page_class": "recitationspage",
        "navbar": true,
        "page_title": 'التلاوات',
        "toolbar": false,
        "searchbar": false,
        "layout": "list",
        "customID": false,
        "contentClass": 'recitations-page',
        "blockClass": 'recitations_content'
    });
});

///---------------------------------------------------
///----------Initialize recitations Page -------------
///---------------------------------------------------
$$.recitationsPage = function (page) {

    $$.each(quranData.recitations, function (i, v) {
        var reciter = quranData.recitations[i];
        reciter.index = i + 1;
        var htm = app.templates.recitationstemplate(reciter);
        $$('.recitations_content ul').append(htm);
    })

    //  Not working  --> check html template for layout
    $$('.btn-download').click(function () {
        var $parent = $$(this).parent('.reciteItem');
        var recite = quranData.recitations[parseInt($parent.data('index'))];
        //  $$.downloadQuran(recite);
    })

    $$('.btn-remove').click(function () {
        var $parent = $$(this).parent('.reciteItem');
        var reciter = quranData.recitations[parseInt($parent.data('index'))];
        var subfolder = folder + '/' + reciter.subfolder + '/';
        removeFolder(subfolder, function () {
            app.addNotification({
                message: 'تم الحذف ',
                button: {
                    text: 'إغلاق',
                    color: 'yellow'
                }
            });
        });
        app.swipeoutClose(app.swipeoutOpenedEl);
    })
    // <-----

    ///---------------------------------------------------
    ///----------linke  to reciter  Page -------------
    ///---------------------------------------------------
    $$('.recitations_content ').on('click', '.item-link', function () {
        $$.makepage({
            "page_name": 'reciterPage',
            "page_class": "reciter_page",
            "navbar": true,
            "page_title": $$(this).data('t'),
            "toolbar": false,
            "searchbar": false,
            pageNum: $$(this).data('index'),
            "layout": "list",
            "customID": false,
            "contentClass": 'reciter-content',
            "blockClass": 'reciter_block',
            "download_suras": 0
        });
    });
}

///---------------------------------------------------
///---------------------------------------------------
///---------------------------------------------------
/// check if all sound files of sura is downloaded to show play btn or download btn
/// sourafolder : folder of sura
/// $$.fileExist : fn to check aya file is downloaded
///
$$.suraExist = function (folder, count, status) {
    if (count <= 114 && status == true) {
        var sourafolder = 'sura_' + count;
        folder.getDirectory(sourafolder, {
            create: false
        }, function (suraFolder) {
            var ayacount = 0;
            $$.fileExist(suraFolder, count, ayacount);
            count++;
            $$.suraExist(folder, count, true);
        }, function (err) {
            var item = $$('.item-info[data-s="' + count + '"]');
            item.find('.btn-down').addClass('btn-download');
            item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
            count++;
            $$.suraExist(folder, count, true);
        });
    }
}
///---------------------------------------------------
///---------------------------------------------------

///  check if aya sound files of sura is downloaded
/// suraFolder : folder of sura
/// souraId : sura id
/// ayacount : aya index

$$.fileExist = function (suraFolder, souraId, ayacount) {
    var ayatlength = parseInt(quranData.sura[souraId - 1].ayas);
    var sura = threeDigits(souraId);
    var aya = threeDigits(ayacount);
    var file = sura + aya + '.mp3';
    var dirReader = suraFolder.createReader();
    dirReader.readEntries(function (entries) {
        if (entries.length >= ayatlength) {
            var item = $$('.item-info[data-s="' + souraId + '"]');
            item.find('.btn-down').addClass('btn-download downloaded');
            item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
        } else {
            var item = $$('.item-info[data-s="' + souraId + '"]');
            item.find('.btn-down').addClass('btn-download');
            item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
        }
    }, fileError);

    function fileError(error) {
        console.log('error:', error);
    }
}


///---------------------------------------------------
///----------Initialize reciter  Page -------------
///---------------------------------------------------
$$.reciterPage = function (page) {
    var index = parseInt(page.context.pageNum);
    var reciter = quranData.recitations[index];
    var suors = {};
    $$('.reciter_block ul ').html('');
    $$.each(quranData.sura, function (i, v) {
        suors[i] = v;
        suors[i].reciter = index;
        var htm = app.templates.stemplate(suors[i]);
        $$('.reciter_block ul ').append(htm);
    });
    //--------------------------------------------------------------
    var strat = false,
        count = 1,
        files_missing = [];
    var subfolder = folder + '/' + reciter.subfolder + '/';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory(subfolder, {
            create: false,
            exclusive: true
        }, function (folder) {
            $$.suraExist(folder, count, true);
        }, function (error) {
            // Reciter folder not found
            $$.each(quranData.sura, function (i, v) {
                var item = $$('.item-info[data-s="' + (i + 1) + '"]');
                item.find('.btn-down').addClass('btn-download');
                item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
            });
        });
    }, function (error) {});
    //--------------------------------------------------------------
    $$('.button.btn-down').click(function () {
        var parent = $$(this).parents('.item-info');
        var reciter = quranData.recitations[parseInt(parent.data('r'))];
        var suraNum = parseInt(parent.data('s'));
        var suraFolder = cordova.file.externalRootDirectory + folder + '/' + reciter.subfolder + '/';
        window.resolveLocalFileSystemURL(suraFolder, function (dirEntry) {
            $$.openDownloader(reciter, suraNum);
        }, function (e) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                var Sfolder = folder + '/' + reciter.subfolder;
                fs.root.getDirectory(Sfolder, {
                    create: true,
                    exclusive: true
                }, function (sdir) {
                    $$.openDownloader(reciter, suraNum);
                }, function (error) {
                    console.log('error : ', error);
                });
            }, function (error) {
                console.log(error)
            });
        });
    });

    $$('.reciter_block .btnremove').click(function () {
        var sura = $$(this).data('s');
        var reciter = quranData.recitations[parseInt($$(this).data('r'))];
        var subfolder = folder + '/' + reciter.subfolder + '/sura_' + sura;
        removeFolder(subfolder, function () {

            var item = $$('.item-info[data-s="' + sura + '"]');
            item.find('.btn-down').removeClass('downloaded');
            app.addNotification({
                message: 'تم الحذف ',
                button: {
                    text: 'إغلاق',
                    color: 'yellow'
                }
            });
            ///downloaded
        });
        app.swipeoutClose(app.swipeoutOpenedEl);
    });

}
//  Not working  -->
var missingfiles = [];
// <-- 
//  play sura sound 
$$(document).on('click', '.button.btn-play', function () {
    var parent = $$(this).parents('.item-info');
    var soura = parseInt(parent.data('s'));
    var done = parent.data('d');
    var reciter = parseInt(parent.data('r'));
    var obj = {
        index: parseInt(quranData.sura[soura - 1].index),
        sura: quranData.sura[soura - 1],
        aya: 1,
        reciter: quranData.recitations[reciter],
        subfolder: quranData.recitations[reciter].subfolder,
        downloaded: (done == true) ? 1 : 0,
        ayatCount: parseInt(quranData.sura[soura - 1].ayas),
    }


    getFileURI(obj.subfolder, obj.index, obj.aya, function (src) {
        obj.path = src;
        audioPlayer(obj);
    })
});
var downloading = false;
///---------------------- downloadAsset --------------
///---------------------------------------------------

/// download Sound files from http://www.everyayah.com/data
// ayaID [number]
// suraIndex [number]
// reciter   [obj]
// subtotal  [percentage | 0 ] 
$$.downloadAsset = function (ayaID, suraIndex, reciter, subtotal) {
    var currentCount = 1,
        maxCount = 20;
    var total, sura = quranData.sura[suraIndex - 1],
        ayatCount = parseInt(sura.ayas),
        percentage = 100 / ayatCount,
        suraFolder = cordova.file.externalRootDirectory + folder + '/' + reciter.subfolder + '/sura_' + suraIndex + '/',
        s = threeDigits(suraIndex),
        a = threeDigits(ayaID),
        file = s + a + '.mp3',
        URL = 'http://www.everyayah.com/data/' + reciter.subfolder + '/' + s + a + '.mp3';
    if ((ayaID <= ayatCount) && (downloading == true)) {
        window.resolveLocalFileSystemURL(suraFolder + file, function (s) {
            ayaID++;
            total = subtotal + percentage;

            $$('.download_modal_' + suraIndex + ' .downloading strong ').text(Math.floor(total) + " %");
            app.setProgressbar('.probar_' + suraIndex, total, 1000);

            $$.downloadAsset(ayaID, suraIndex, reciter, total);
        }, function (e) {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(URL, suraFolder + file,
                function (entry) {

                    ayaID++;
                    total = subtotal + percentage;

                    $$('.download_modal_' + suraIndex + ' .downloading strong ').text(Math.floor(total) + " %");

                    app.setProgressbar('.probar_' + suraIndex, total, 400);

                    if (total >= 99.9) {

                        var item = $$('.item-info[data-s="' + suraIndex + '"]');
                        item.find('.btn-down').addClass('btn-download downloaded');
                        item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
                        app.closeModal();
                        downloading = false;
                        return true;

                    }
                    $$.downloadAsset(ayaID, suraIndex, reciter, total);
                },
                function (err) {
                    console.log("Error", err);
                });
        });
    }
}

/// Open download modal To Start download Sura
/// reciter [obj]
/// suraIndex [number]
///---------------------------------------------------
$$.openDownloader = function (reciter, suraIndex) {
    var url, ayaID = 1,
        subtotal = 0;
    downloading = true;
    app.modal({
        title: 'سورة ' + quranData.sura[suraIndex - 1].name,
        text: '<span data-progress="0" class="progressbar probar_' + suraIndex + '"><span></span></span>',
        class: 'download_modal_' + suraIndex,
        downloading: true,
        buttons: [{
            text: 'إلغاء',
            bold: true,
            onClick: function (e) {
                downloading = false;
            }
        }]
    });
    $$('.download_modal_' + suraIndex).on('opened', function () {
        $$.downloadAsset(ayaID, suraIndex, reciter, subtotal);
    })
};
$$.makepage = function (data, callback) {
	app.showIndicator();
	var defaults = {
		"page_name": "page",
		"page_class": "",
		"navbar": true,
		"q_page": false, // [false | string ]
		"S_name": false, // [false | string ]
		"souraIndex": false,
		"juzNumber": false,
		"hizbNumber": false,
		"page_title": false,
		"toolbar": true,
		"searchbar": false,
		"links": false,
		"pageNum": 0,
		"swiper": false,
		"layout": "page",
		"customID": false,
		"highlight": false,
		"contentClass": false,
		"blockClass": false,
		"infinite": false,
		"infinitedist": false
	}
	var pageContext = $$.extend(defaults, data);
	var options = {
		"direction": "up", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
		"duration": 0, // in milliseconds (ms), default 400

	};


	//setTimeout(function () {
		mainView.router.load({
			template: app.templates.pageLayout,
			context: pageContext,
			ignoreCache: false
		});

	//}, 50);
	
	window.plugins.nativepagetransitions.fade(
		options);

	// mainView.router.load({
	// 	template: app.templates.pageLayout,
	// 	context: pageContext,
	// 	ignoreCache: false
	// });
	$$.savePageAya(pageContext["pageNum"]);
	if (pageContext.highlight, typeof (pageContext.highlight) == 'number') {
		$$(document).once(animationEnd, function () {
			setTimeout(function () {
				$$('.slide-' + pageContext.pageNum).find('div[data-sindex="' + pageContext.souraIndex + '"]').find('span[data-a="' + pageContext.highlight + '"]').addClass('highlight');
			}, 150);
		})
	}
	if (callback, typeof (callback) == 'function') {
		callback(pageContext)
	}
	app.hideIndicator();
}
$$.pageSuras = function (ayat, callback) {
	var soura = quranData.sura[ayat[0].sura - 1];
	var suras = [soura];
	soura.ayat = [ayat[0]];
	soura.showTitle = ayat[0].aya == "1";
	for (var i = 1; i < ayat.length; i++) {
		if (ayat[i].sura != soura.index) {
			soura = quranData.sura[ayat[i].sura - 1];
			soura.ayat = [];
			soura.showTitle = true;
			suras.push(soura);
		}
		soura.ayat.push(ayat[i]);
	}
	if (callback, typeof (callback) == 'function') {
		callback(suras)
	}
	return suras;
}
//------------------------------------------------------


//------------------------------------------------------
$$.showQPage = function (pageNum, callback) {
	var suras;
	var pageayat = $$.getPageAyat(pageNum, function (ayat) {
		$$.pageSuras(ayat, function (data) {
			suras = data;
			$$.each(suras, function (i, sura) {
				$$('.content-' + pageNum).append(app.templates.souratemplate(sura));
			});
		});
	});
	if (callback, typeof (callback) == 'function') {
		callback(suras)
	}
}
//--------------------------------------------------------------------------
//----------------------------   gotoPage   ----------------------------
//--------------------------------------------------------------------------
// jumb to Page in Quran page
$$.gotoPage = function (swiper, pageNum, cPage, callback) {
	var context = quranData.pages[pageNum - 1];
	var activeSName = quranData.sura[context.soura - 1].name;
	var TitleSName = quranData.sura[context.soura - 1].tname;
	// soura
	$$('.page-on-center .title-navbar').find('.souraName').text('سورة ' + activeSName);
	// jzu
	if ($$('.title-navbar small').is('.juzNumber')) {
		$$('.page-on-center .title-navbar').find('.juzNumber').text('الجزء ' + arabicNum[context.part])
	}
	// hizb
	if ($$('.title-navbar small').is('.hizbNumber')) {
		$$.hizbName(pageNum);
	}
	var container = $$('.q-page.page-on-center');
	var swiperLayout = container.find('.page-content[data-layout="swiper"]');
	var toolbar = container.find('.toolbar');
	swiperLayout.attr({
		'data-p': pageNum,
		'data-s': context.soura,
	});
	swiperLayout.find('#souar-continer-' + cPage).attr('id', '#souar-continer-' + pageNum);
	swiperLayout.find('.swiper-container').removeClass('swiper-container-' + cPage).addClass('swiper-container-' + pageNum);
	toolbar.find('.previousPage').attr('href', '#page-' + (pageNum - 1));
	toolbar.find('.nextPage').attr('href', '#page-' + (pageNum + 1));
	toolbar.find('.current_page').text(pageNum);
	container.attr('data-page', TitleSName);
	if (mainView.history.length > 1)
		mainView.history[mainView.history.length - 1] = "#" + TitleSName;
	swiper.removeAllSlides();
	$$.initQswiper(swiper, pageNum, callback);
}
//-------------------- APP PAGES Init  -------------------
//------------------------------------------------------
$$(document).on('pageInit', function (e) {
	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	var activePage = mainView.activePage.name;
	var page = e.detail.page;
	if (activePage == 'index') {
		$$('.index-link').addClass('disabled')
	} else {
		$$('.index-link').removeClass('disabled')
	}
	if (activePage != 'index') {
		if (page.context) {
			var context = page.context;
			var QPage = context.q_page;
			var PLayout = context.layout;
		}
		if (QPage && PLayout == 'swiper') {
			$$.pageStyle();
			$$.makeSwiper(context);
			if (isPlaying && Dmedia.type == "toolbar" && Dmedia.isPlaying == true) {
				var $toolbar = $$('.q-page .toolbar-inner');
				if ($$('.toolbar-player').length == 0) {
					Dmedia.layout(Dmedia);
				}
			}
			$$(document).once(animationEnd, function () {
				//ckeck and show mediabar if sound is playing when quran page load
				if (isPlaying && Dmedia.type == "toolbar" && Dmedia.isPlaying == true) {
					var $toolbar = $$('.q-page.page-on-center  .toolbar-inner');
					if ($$('.page-on-center .toolbar-player').length == 0) {
						Dmedia.layout(Dmedia);
						var btn = $$('.page-on-center .toolbar-player').find('.backToPage');
						if (btn.hasClass('hidden')) {
							btn.removeClass('hidden');
							btn.on('click', function () {
								var len = parseInt($$('.swiper-container').length - 1);
								var Qsper = $$('.swiper-container')[len].swiper;
								$$.gotoPage(Qsper, Dmedia.page, context.pageNum, function () {
									setTimeout(function () {
										$$('.content-' + Dmedia.page).find("span[data-a='" + Dmedia.aya + "']").addClass('highlight3');
										btn.addClass('hidden')
									}, 100);
								});
							})
						}
					}
					setTimeout(function () {
						$$('.page-on-center .toolbar-player').find('.button.play').addClass('pause');
					}, 100)
				}
			})
		}
	}
	if (activePage == 'bookmarks') {
		$$.getBookmark(page);
	}
	if (activePage == 'tafsirlist') {
		$$(document).once(animationEnd, function () {
			$$.maketafsirList(false);
		})
	}
	if (activePage == 'searchPage') {
		$$.searchpage(page);
	}
	if (activePage == 'searchMeaningsPage') {
		$$.searchMeaningspage(page);
	}
	if (activePage == 'aboutPage') {
		$$.aboutPage(page);
	}
	if (activePage == 'settingPage') {
		$$.settingPage(page);
	}
	if (activePage == 'contactUs') {
		$$.contactPage(page);
	}
	if (activePage == 'helpPage') {
		$$.helpPage(page);
	}
	if (activePage == "recitations") {
		$$.recitationsPage(page);
	}
	if (activePage == "reciterPage") {
		$$.reciterPage(page);
	}
	if (activePage == "managementPage") {
		//$$.soundmanager(page);
	}
	//REMOVE  testPage
	if (activePage == "testPage") {
		$$.testPage(page); // this for development
	}
})

//active sorus list tap in index Page 
$$(document).on('pageAfterBack', function (e) {
	var page = e.detail.page;
	setTimeout(function () {
		var len = mainView.history.length;
		if (len == 1) {
			$$('.toolbar-gold a[href="#souarlist"]').click();
		}
	}, 50)
});
$$(document).on('click', '.about-link', function () {
    $$.makepage({
        "page_name": "aboutPage",
        "page_class": "aboutpage",
        "navbar": true,
        "page_title": 'عن المرشد',
        "toolbar": false,
        "searchbar": false,
        "layout": "page",
        "customID": false,
        "contentClass": 'about-page',
        "blockClass": 'about_content'
    });
})
//---------------------------------------------------------------------------
//---------------- linke to setting page ------------------------------------
//---------------------------------------------------------------------------
$$(document).on('click', '.setting-link', function () {
    $$.makepage({
        "page_name": "settingPage",
        "page_class": "settingPage",
        "navbar": true,
        "page_title": 'الاعدادات',
        "toolbar": false,
        "layout": "list",
        "blockClass": 'setting_content'
    });
})
//---------------------------------------------------------------------------
//---------------- linke to contact page ------------------------------------
//---------------------------------------------------------------------------
$$(document).on('click', '.contact-link', function () {
    $$.makepage({
        "page_name": "contactUs",
        "page_class": "contactUs",
        "navbar": true,
        "page_title": 'إتصل بنا',
        "toolbar": false,
        "layout": "page",
        "contentClass": 'content-page',
        "blockClass": 'contact_content'
    });
});
//---------------------------------------------------------------------------
//---------------- linke to help page ---------------------------------------
//---------------------------------------------------------------------------
$$(document).on('click', '.help-link', function () {
    $$.makepage({
        "page_name": "helpPage",
        "page_class": "helpPage",
        "navbar": true,
        "page_title": 'المساعدة',
        "toolbar": false,
        "layout": "page",
        "contentClass": 'helpPage-page',
        "blockClass": 'helpPage_content'
    });
});
//---------------------------------------------------------------------------
//---------------- linke to management page ---------------------------------
//---------------------------------------------------------------------------
$$(document).on('click', '.management-link', function () {
    $$.makepage({
        "page_name": "managementPage",
        "page_class": "management",
        "navbar": true,
        "page_title": 'إدارة الصوتيات',
        "toolbar": false,
        "layout": "list",
        "contentClass": 'management-page',
        "blockClass": 'management_content'
    }, function (page) {
        $$.soundmanager(page);

    });
});

//------------------------------------------------------------------
//-------------------------- AboutPage html -----------------
//------------------------------------------------------------------
$$.aboutPage = function () {
    var html = app.templates.abouttemplate({});
    $$('.about_content').html(html);
};
//------------------------------------------------------------------
//-------------------------- helpPage html  -------------------
//------------------------------------------------------------------
$$.helpPage = function () {
    var html = app.templates.helptemplate({});
    $$('.helpPage_content').html(html);

    var questions = [{
        'question': "كيف أحصل على تفسير للاية مخصصة",
        'answer': "اضغط مطولا على  الاية التى تريد الحصول على تفسيرها قائمة الاداوت و تضغط على <i class='fa fa-book'></i>"
    }, {
        'question': "كيف يمكنني تكبير الخط ؟",
        'answer': "في اسفل القائمة الرئيسية الموجودة على يمين التطبيق يمكنك تكبير وتصغير الخط بالضغط على زر ال + او ال -"
    }, {
        'question': "طريقة حفظ علامة مرجعية",
        'answer': "اضغط مطولا على الآية التي تريد حفظها كعلامة مرجعية, من قائمة الأدوات اضغط على 'حفظ' <i class='fa fa-bookmark'></i>"
    }, {
        'question': "ما طريقة البحث في  القران ؟",
        'answer': "هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان و حجم و لون الخط هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان"
    }]
    $$.each(questions, function (i, v) {
        var qhtml = app.templates.accordiontemplate(v)
        $$('.questionslist').append(qhtml);
    })
};
//------------------------------------------------------------------
//-------------------------- contactPage  html---------------------------  
//------------------------------------------------------------------
$$.contactPage = function () {
    var html = app.templates.contacttemplate({});
    $$('.contact_content').html(html);
    $$('.show-tab-1').on('click', function () {
        app.showTab('#tab1');
    });
    $$('.show-tab-2').on('click', function () {
        app.showTab('#tab2');
    });
    $$('.send-message').on('click', function (event) {

        $$('#contactForm').find('input,textarea').each(function (i, v) {
            if ($$(v).val().length == 0) {
                $$(this).css('border-bottom', '1px solid red');
                $$(v).on('keyup keydown change ', function () {
                    $$(this).css('border-bottom-color', 'transparent');
                });
                event.preventDefault();
                return false;
            }
            var type = $$(this).attr('type');
            if (type == 'email') validateEmail($$(this));
        });
        var formData = app.formToJSON('#contactForm');

    });
};
////------------------------------------------------------------------
////-------------------------- testPage ---------------------------
////------------------------------------------------------------------
//$$(document).on('click', '.test-link', function () {
//    $$.makepage({
//        "page_name": "testPage",
//        "page_class": "testPage",
//        "navbar": true,
//        "page_title": 'testPage',
//        "toolbar": false,
//        "searchbar": false,
//        "layout": "page",
//        "customID": false,
//        "contentClass": 'about-testPage',
//        "blockClass": 'testPage_content'
//    });
//});
app.onPageInit('index', function () {

    if (!quranData) {
        $$.getJSON("./json/quran-data.json", function (data) {
            quranData = data.quran;
            $$.initApp();
        });
    } else {
        $$.initApp();
    }
})
// back to Home and Reload app 
$$(document).on('click', '.index-link', function () {
    localStorage['reloadindex'] = true;
    mainView.router.back({
        url: mainView.history[0],
        force: true
    });
    document.location.reload();
    //  mainView.router.loadPage('index.html');
});;
//-------------------------------------------------------------------------;
app.init();