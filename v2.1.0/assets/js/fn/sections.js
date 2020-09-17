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
}
