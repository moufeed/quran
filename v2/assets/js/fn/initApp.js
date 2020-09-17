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

};