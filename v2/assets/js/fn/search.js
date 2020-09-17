/*
 var ayaTxt, listWord, ayaList, txt;
*/
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



// autocomplete