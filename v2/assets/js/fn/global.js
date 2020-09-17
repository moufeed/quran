//
// Query  sql request
//request  request data  like sura aya text

////////////////////////////////////

$$.sliceTxt = function (text, len, callback) {
    var listWord, newTxt, txt;
    if (text.search('۞') >= 0) {
        txt = text.replace('۞', '');
    } else {
        txt = text;
    }
    listWord = txt.split(' ');
    if (listWord.length > len) {
        newTxt = listWord.slice(0, len).join(' ');
    } else {
        newTxt = listWord.join(' ');
    }

    if (callback, typeof (callback) == 'function') {
        callback(newTxt)
    }
    return newTxt;
};

//-------------------- REMOVE HISTORY -----------------
//------------------------------------------------------

$$.cleanHistoryItem = function (item) {
    var hList = mainView.history;
    for (var i = 0; i < hList.length; i++) {
        if (hList[i] === item) hList.splice(i, 1);
    }
}
//-------------------- REMOVE BASMALAH -----------------
//------------------------------------------------------

function removeBasmalah(text) {
    return text.replace(/^(([^ ]+ ){4})/g, '');
}
//-------------------- EXTEND --------------------------
//------------------------------------------------------
$$.extend = function (obj, props) {
    for (var prop in props) {
        if (props.hasOwnProperty(prop)) {
            obj[prop] = props[prop];
        }
    }
    return obj;
};
//-------------------- getArabicNumbers --------------------------
//------------------------------------------------------


var arabicNumbersMap = [
    "&\#1632;", "&\#1633;", "&\#1634;", "&\#1635;", "&\#1636;",
    "&\#1637;", "&\#1638;", "&\#1639;", "&\#1640;", "&\#1641;"
];

function getArabicNumbers(str) {
    var newStr = "";
    str = String(str);
    for (i = 0; i < str.length; i++) {
        newStr += arabicNumbersMap[parseInt(str.charAt(i))];
    }
    return newStr;
}


//-------------------- show tooltip --------------------------
//------------------------------------------------------
$$(document).on('taphold', '.tooltip[data-a]', function () {
    var pNum = parseInt($$(this).parents('.swiper-slide-active').data('pn'));
    $$.removeWords(pNum);
    $$(this).highlight(function (aya, soura, span) {
        var text = $$(span).text();
        span.tooltip({
            data: {
                "s_id": soura,
                "a_id": aya
            }
        });
        $$('.tooltip_container a').btnsTools(aya, soura, span, pNum);

    });
});

$$(document).on('click', '.tooltip[data-a]', function () {
    $$('.tooltip[data-a]').removeClass('highlight2');
    if (!$$(this).is('.highlight') && !$$(this).hasClass('has_words')) {
        $$(this).addClass('highlight2');
        $$.removeWords();
    }
})
//-------------------- show highlight ------------------ 
//------------------------------------------------------
$$(document).on("click", function (e) {

    if (!$$(e.target).hasClass('highlight') && !$$(e.target).hasClass('modal-overlay')) {
        $$("span").removeClass("highlight");
    }
});

//--------------------------- --------------------------- 
//function -------------- validateEmail   --------------
//--------------------------- ---------------------------
function validateEmail(input) {
    var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    var emailID = input.val();
    if (!emailID.match(regex)) {
        var target = input;
        var buttons = [{
            text: 'الرجاء إدخال عنوان بريد إلكتروني صالح',

        }];
        app.actions(target, buttons);
        return false;
    }
    return (true);
}

//-------------------- show highlight ------------------ 
//------------------------------------------------------
$$(".open-panel").on("click", function (e) {
    if ($$('.picker-modal.modal-in').length > 0)
        app.closeModal($$('.picker-modal.modal-in'));
});

//--------------------------- ---------------------------