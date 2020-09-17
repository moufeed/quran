//----------------------------------------------------------------
//-------------------      AYA btnsTools ---------------------------
//----------------------------------------------------------------
// btnsTools showing in tooltip of aya  [tafsir - copy - bookmark - playSound]

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
};