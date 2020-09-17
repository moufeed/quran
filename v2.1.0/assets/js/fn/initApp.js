$$.initApp = function (callback) {
    $$.pageStyle();
    var searchbar = app.searchbar('.searchbar', {
        searchList: '#sour_list',
        searchIn: '.name'
    });
    var soursList = app.virtualList('#sour_list.virtual-list', {
        rowsBefore : 20,
        rowsAfter : 20,
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

    $$(document).on('click', '#sour_list a', function () {
        var souraIndex = $$(this).data('s');
        var souraNum = quranData.pages[parseInt($$(this).data('page')) - 1].soura;
        var souraName = quranData.sura[souraNum - 1].name;
        $$.makepage({
            "page_name": $$(this).data('en'),
            "page_class": "q-page",
            "q_page": true,
            "S_name": souraName,
            "souraIndex": $$(this).data('s'),
            "juzNumber": arabicNum[$$(this).data('part')],
            "links": true,
            "pageNum": parseInt($$(this).data('page')),
            "layout": "swiper",
            "swiper": true,
            "highlight": 1 ,
            "contentClass" : "borderpage"
        })
    });
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
         
      var juzList = app.virtualList('#juzList.virtual-list', {
       
        items: quranData.parts,
           renderItem: function (index, item) {
               return '<li>'+
            '<a href="#" class="item-link item-content" data-index="'+index+'" data-s="'+item.sora+'" data-a="'+item.aya+'" data-p="'+item.page+'">'+
               '<span class="index">'+parseInt(index+1)+'</span>'+
               '<span class="name">  الجزء  '+arabicNum[index]+'</span>'+
          '</a>'+
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
            "contentClass" : "borderpage"
        })
    });
    
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
     var Hizblist = app.virtualList('#Hizblist.virtual-list', {
        items: quranData.Hizb,
           renderItem: function (index, item) {
            return '<li>'+
            '<a href="#'+index+'" class="item-link item-content" data-index="'+index+'">'+
               '<span class="index">'+parseInt(index+1)+'</span>'+
               '<span class="name">  الحزب  '+arabicNum[index]+'</span>'+
              '</a>'+
             '</li>' 
           }
    });
    $$('#Hizblist').on('click', 'a', function () {
        var hizbIndex = parseInt($$(this).attr('href').replace('#', ''));
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
                    "contentClass" : "borderpage"
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
