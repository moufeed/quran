//----------------------------------------------------------------
//---------------------   GET  AYAT  ---------------------------
//---------------------------------------------------------------
$$.getAya = function (sura, aya,callback) {
    var text;
      db.transaction(function (tx) {
            tx.executeSql(queries.g_aya, [sura,aya], function (tx, resultSet) {
                for (var x = 0; x < resultSet.rows.length; x++) {
                    text = resultSet.rows.item(x)
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
//-------------------      AYA TOOLTIP --------------------------- 
//----------------------------------------------------------------

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
        var out = app.templates.tooltip( set.data);
         
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
                    "left" : pos + 'px',
                    "top": (this.offsetTop - 25) + 'px'
               }
                 
                $$(tooltip_cont).css(cs);
            }
            if (ofstL > ww) {
                $$(tooltip_cont).css({
                    'right': (pos / 4) + 'px',
                    "top": (this.offsetTop - 25) + 'px'
                });
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


};

//-------------------- HIGHLIGHT AYA -------------------
 //------------------------------------------------------
// function highlightAya(ayaIndex, souraIndex) {
//    console.log(souraIndex);
//     $$('.highlight2').removeClass('highlight2');
//     $$("[data-sindex='" + souraIndex + "']").find("[data-aya='" + ayaIndex + "']").addClass('highlight2');
// }

//----------------------------------------------------------------
//-------------------      AYA HIGHLIGHT --------------------------- 
//---------------------------------------------------------------- 
 $$.fn.highlight = function(callback){
     var target = $$('.tooltip');
       var  span = $$(this);
    
          var parent = span.parents('.soura[data-sindex]').data('sindex'),
              aya = span.data('a');
              target.removeClass('highlight highlight2');
              span.toggleClass('highlight');
          if (callback, typeof (callback) == 'function') {
                callback(aya,parent,span)
            }
 }
 

//----------------------------------------------------------------
//-------------------      AYA btnsTools --------------------------- 
//---------------------------------------------------------------- 
 $$.fn.btnsTools = function (aya, soura, span,pageNum, callback) {
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
     $$(this).on('click', '.btn-bookmark', function () {
         
          $$.addBookmark(aya, soura, span,pageNum);
     });
     $$(this).on('click', '.btn-play', function () {
         var sora = quranData.sura[parseInt(soura) - 1];
         var reciter , reciterNum = localStorage.getItem('activeRecite');
                if(reciterNum == null){
                   reciter = quranData.recitations[1]
                }else{
                   reciter = quranData.recitations[parseInt(reciterNum)];
                }
         var obj = {
             type       : 'toolbar',
             page       : pageNum,
             index      : parseInt(quranData.sura[soura - 1].index),
             sura       : sora,
             aya        : parseInt(aya),
             reciter    : reciter,
             subfolder  : reciter.subfolder,
             ayatCount  : parseInt(sora.ayas),
        }
         getFileURI(obj.subfolder, obj.index, obj.aya, function (src) {
             obj.path = src;
             audioPlayer(obj);
         })
     });
     if (callback, typeof (callback) == 'function') {
         callback()
     }
 };

