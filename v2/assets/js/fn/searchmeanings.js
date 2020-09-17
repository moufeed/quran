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
});