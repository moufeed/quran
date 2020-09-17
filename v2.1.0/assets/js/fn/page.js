//-------------------- APP PAGES  -------------------
//------------------------------------------------------
$$.makepage = function (data, callback) { 
    var defaults = {
        "page_name": "page",
        "page_class": "",
        "navbar": true,
        "q_page": false,
        "S_name": false,
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
        "infinite" : false
    }
    var pageContext = $$.extend(defaults, data);
    mainView.router.load({
        template: app.templates.pageLayout,
        context: pageContext,
        ignoreCache: false
    });

    if (pageContext.highlight, typeof (pageContext.highlight) == 'number') {
        $$(document).once(animationEnd, function(){
            setTimeout(function(){
                $$('.slide-'+pageContext.pageNum).find('div[data-sindex="'+pageContext.souraIndex+'"]').find('span[data-a="'+ pageContext.highlight +'"]').addClass('highlight');
            },150);
        })

    }


    if (callback, typeof (callback) == 'function') {
        callback(pageContext)
    }
}


$$.pageSuras = function (ayat,callback) { 
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
         $$.pageSuras(ayat ,function(data){
             suras = data ;
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
        //     if(pageNum == 604) 
        //         toolbar.find('.nextPage').addClass('disabled');
        //      
        //     if(pageNum == 1)
        //         toolbar.find('.previousPage').addClass('disabled');
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
    }else{
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
                if(isPlaying && Dmedia.type == "toolbar" &&  Dmedia.isPlaying == true){
                     var $toolbar = $$('.q-page .toolbar-inner');
                        if ($$('.toolbar-player').length == 0) {
                            Dmedia.layout(Dmedia);
                        }
                }

            $$(document).once(animationEnd, function () {
                if(isPlaying && Dmedia.type == "toolbar" &&  Dmedia.isPlaying == true){
                    var $toolbar = $$('.q-page.page-on-center  .toolbar-inner');
                    if ($$('.page-on-center .toolbar-player').length == 0) {
                        Dmedia.layout(Dmedia);

                        var btn = $$('.page-on-center .toolbar-player').find('.backToPage');
                        if(btn.hasClass('hidden')){
                            btn.removeClass('hidden');
                            btn.on('click',function(){
                                var len =  parseInt( $$('.swiper-container').length -1);
                                var Qsper = $$('.swiper-container')[len].swiper;
                                $$.gotoPage(Qsper, Dmedia.page, context.pageNum,function(){
                                    setTimeout(function(){
                                        $$('.content-'+ Dmedia.page).find("span[data-a='" + Dmedia.aya + "']").addClass('highlight3');
                                        btn.addClass('hidden')
                                    },100);
                                });

                            })
                        }
                    }
                    setTimeout(function(){
                        $$('.page-on-center .toolbar-player').find('.button.play').addClass('pause');
                    },100)
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
    if(activePage == 'searchPage'){
        $$.searchpage(page);
    }
    if(activePage == 'aboutPage'){
        $$.aboutPage(page);
    }
    if(activePage == 'settingPage'){
        $$.settingPage(page);
    } 
    if(activePage == 'contactUs'){
        $$.contactPage(page);
    } if(activePage == 'helpPage'){
        $$.helpPage(page);
    }
    if(activePage == "recitations"){
        $$.recitationsPage(page);
    }
     if(activePage == "reciterPage"){
        $$.reciterPage(page);
    }  
    if(activePage == "managementPage"){
//        $$.soundmanager(page);
    }


//REMOVE  testPage
    if(activePage == "testPage"){
        $$.testPage(page);
    }

})



$$(document).on('pageAfterBack', function(e){
    var page = e.detail.page;

    setTimeout(function(){
        var len =   mainView.history.length;
        if(len == 1){
            $$('.toolbar-gold a[href="#souarlist"]').click();
        }
    },50)

})



