//----------------------------------------------------------------
//---------------------   GET  AYA  ---------------------------
//---------------------------------------------------------------
// return obj of aya 
//    {
//		aya:num,
//    	id:num,
//    	page:num,
//    	sura:num,
//    	text:"String",
//    	text2:"String"
//    }
$$.getAya = function (sura, aya, callback) {
    var text;
    db.transaction(function (tx) {
            tx.executeSql(queries.g_aya, [sura, aya], function (tx, resultSet) {
                for (var x = 0; x < resultSet.rows.length; x++) {
                    text = resultSet.rows.item(x)
                    console.log(text);
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
// return array of page Ayat
//		[{
//		aya:num,
//    	id:num,
//    	page:num,
//    	sura:num,
//    	text:"String",
//    	text2:"String"
//    } , ...]
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
//-------------------      AYA HIGHLIGHT --------------------------- 
//---------------------------------------------------------------- 
$$.fn.highlight = function (callback) {
    var target = $$('.tooltip');
    var span = $$(this);
    var parent = span.parents('.soura[data-sindex]').data('sindex'),
        aya = span.data('a');
    target.removeClass('highlight highlight2');
    span.toggleClass('highlight');
    if (callback, typeof (callback) == 'function') {
        callback(aya, parent, span)
    }
}