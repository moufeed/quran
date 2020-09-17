//----------------------------------------------------------------
//---------------------   GET  TAFSIR  ---------------------------
//----------------------------------------------------------------
$$.getTafsir = function (soura, aya, callback) {

    db.transaction(function (tx) {
        tx.executeSql("SELECT *,rowid as id  FROM tafsir_moysar WHERE sura =? AND aya =?", [soura,aya], function (tx, resultSet) {
            var obj;
            for(var x = 0; x < resultSet.rows.length; x++) {
                 obj = resultSet.rows.item(x);
            }
            if (callback, typeof (callback) == 'function') {
                callback(obj)
            }
            return obj;
        }, function (tx, error) {});
    }, function (error) {});



//        var tafsirObj = {};
//        $$.getJSON("./json/tafsir.json", function (data) {
//            if (data[soura][aya]) {
//                tafsirObj = {
//                    "soura": soura,
//                    "aya": aya,
//                    "tafsir": data[soura][aya]
//                }
//                if (callback, typeof (callback) == 'function') {
//                    callback(tafsirObj)
//                }
//                return tafsirObj;
//            } else {
//                app.alert('التفسير غير متوفر')
//            }
//        });

    }
    //----------------------------------------------------------------
    //---------------------   GET  TAFSIR  LIST ---------------------- 
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
    //---------------------   find  TAFSIR  ---------------------------
    //----------------------------------------------------------------
$$.findTafsir = function (soura, aya, calback) {
    var ayaText,obj;
        db.transaction(function (tx) {
            tx.executeSql(queries.g_aya, [soura,aya], function (tx, resultSet) {
                for(var x = 0; x < resultSet.rows.length; x++) {
                    ayaText = resultSet.rows.item(x).text;
                }
            }, function (tx, error) {
                console.log(error.message);
            });

            tx.executeSql(queries.g_tafsir, [soura,aya], function (tx, resultSet) {

                for(var x = 0; x < resultSet.rows.length; x++){
                    obj = resultSet.rows.item(x);
                }
            }, function (tx, error) {
                console.log(error.message);
            });
        }, function (error) {
            console.log(error.message);
        }, function (s){
            if ((soura == 1 && aya == 1) || soura == 9){
                obj.title = false;
            }
            else {
                obj.title = true;
            }
              obj.tafsir_name = 'تفسير الميسر';
              obj.ayatext = ayaText;
              var thtml = app.templates.tafsirtemplate(obj);
              app.popup(thtml);
              $$.tafsirList(soura, aya);
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
                            rowsBefore : 20,
                            rowsAfter : 20,
                            items: quranData.sura,
                            template: ' <li>' +
                                ' <a href="#" class="item-link item-content soura" data-s="{{index}}" data-en="{{tname}}" data-part="{{part}}" data-page="{{page}}">' +
                                ' <div class="index">{{index}}</div>' +
                                ' <div class="item-info">' +
                                ' <div class="name">{{name}}</div>' +
                                ' <div class="quantity">آياتها <strong>{{ayas}}</strong> </div>' +
                                ' </div>  </a> </li>',
                            searchAll: function (query,items) {
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
       var ayat=[];
//        $$('.searchbar-input').find('input').attr('type','number');
        var searchbar = app.searchbar('.searchbar-' + pageName, {
            searchList: '.ayat-list.virtual-list',
            searchIn : '.ayaNum'
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
                        '<a href="#"  class="item-link" data-s="'+item.sura+'" data-a="'+item.aya+'" >' +
                        ' <div class="info">' +
                        '<div class="title">'+item.text+'</div>' +
                        ' </div>' +
                        '<div class="ayaNum">'+item.aya+'</div>' +
                        '</a>' +
                        '</li>';
                },

                searchAll: function (query, items) {
                    console.log(query,items);
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
    }, function (e) {
        
    })
    $$(".page-on-center").once(animationEnd, function () {
        
        $$.layout(index, aya);
       
    });
});
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
$$.layout = function (soura, aya ) {
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
    }, null, function(){
        var tHtml = app.templates.tafsirAya(ayaObj);

        $$('.tafsir_aya_Page .content-block').html(tHtml).removeClass('animated fadeOut');

        $$('.tafsir_aya_Page .content-block').html(tHtml).addClass('animated fadeIn').once( animationEnd ,function(){
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
    var className ;
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
    
    $$('.tafsir_aya_Page .content-block').addClass('animated fadeOut').once( animationEnd ,function(){

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
//});

 


