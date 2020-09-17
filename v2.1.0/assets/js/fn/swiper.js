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
    //---------------------   SWIPER  PREPEND SLIDES ------------------
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
     var pageAyat ;
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
        threshold: 20
    }; 
    $$.getPageAyat(pageNum ,function(ayat){
        pageAyat = ayat;
// REMOVE 
        
         $$.initQswiper(Qswiper, pageNum);
    });
     Qswiper = new Swiper('.swiper-container-' + pageNum, swiperStings);
    
    var act, pre, activeSlide, slideNum, listChild, firstChild, lastpage, SLength, firstpage, preSlide;

    Qswiper.on('slideChangeEnd', function (swiper) {
        var index = swiper.activeIndex;
        var activeSlide = $$(swiper.slides[index]);
        var pNum = parseInt(activeSlide.data('pn'));

        if(Dmedia != null ){
            var btn = $$('.toolbar-player').find('.backToPage');
            if(Dmedia.page != pNum){
                if(btn.hasClass('hidden')){
                    btn.removeClass('hidden');
                    btn.on('click',function(){
                        $$.gotoPage(Qswiper, Dmedia.page, pNum,function(){
                            setTimeout(function(){
                                $$('.content-'+ Dmedia.page).find("span[data-a='" + Dmedia.aya + "']").addClass('highlight3');
                                btn.addClass('hidden')
                            },100)
                        });

                    })
                }
            }else if(Dmedia.page == pNum){
                if(!btn.is('.hidden')){
                    btn.addClass('hidden');
                }
            }
        }
    });

    Qswiper.on('TransitionStart', function () {
        //$$('#overlay').css('display','block');
    })
    Qswiper.on('TransitionEnd', function () {
        $$('.page-background').scrollTop(0,200);
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
    //--------------------------------------------------------------------------
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
        buttons: [
            {
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
});
