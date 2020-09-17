$$.setRecite = function (recite) {
    if (localStorage.getItem('activeRecite') == null) {
        localStorage.setItem('activeRecite', (typeof recite == "undefined") ? 1 : recite);
    } else if (recite) {
        localStorage.setItem('activeRecite', recite);
    }
}
$$.nightVersion = function (check) {
    if (localStorage.getItem('nightVersion') == null) {
        localStorage.setItem('nightVersion', (typeof font == "undefined") ? 'n' : check);
    } else if (check) {
        localStorage.setItem('nightVersion', check);
    }
    if (check && $$('.q-page .page-background').length > 0) {
        if (check == 'n') {
            $$('.q-page .page-background.nightVersion').each(function (i, v) {
                $$(v).removeClass('nightVersion');
            });
        } else {
            $$('.q-page .page-background[data-layout="swiper"]').each(function (i, v) {
                $$(v).addClass('nightVersion');
            });
        }
    }
}
$$.pageStyle = function () {
    var recite, font, nightV;
    recite = localStorage.getItem('activeRecite');
    font = localStorage.getItem('activeFont');
    nightV = localStorage.getItem('nightVersion');
    border = localStorage.getItem('border');
    if (recite == null) $$.setRecite(1);
    if (font == null) $$.setFont('hafs');
    if (nightV == null) $$.nightVersion('n');

    if (nightV == 'y')
        $$('.q-page .page-background').addClass('nightVersion');
    else
        $$('.q-page .page-background').removeClass('nightVersion');
    if (font)
        $$('.q-page .page-background').css('font-family', font);
    $$.FontSize();
    $$.setborder();
};
$$.setFont = function (font) {
        if (localStorage.getItem('activeFont') == null) {
            localStorage.setItem('activeFont', (typeof font == "undefined") ? 'hafs' : font);
        } else if (font) {
            localStorage.setItem('activeFont', font);
        }
    if (font && $$('.q-page .page-background[data-layout="swiper"]').length > 0) {
            $$('.q-page .page-background[data-layout="swiper"]').each(function (i, v) {
                $$(v).css('font-family', font);
            });
        }
    }
    //-------------------- RESIZE TEXT ---------------------
    //------------------------------------------------------
$$.toRem = function (size) {
    var obj, line;
    line = size * 1.6;
    return obj = {
        'font-size': (size / 16) + 'rem',
        'line-height': (line / 16) + 'rem'
    };
}
$$.FontSize = function (size, set) {
    var fontSize = (typeof size == "undefined") ? 16 : size,
        preview = $$('.font-preview');
    if (localStorage.getItem('fontSize') == null) {
        localStorage.setItem('fontSize', fontSize);
    } else if (set) {
        localStorage.setItem('fontSize', fontSize);
    } else {
        fontSize = localStorage.getItem('fontSize');
    }
    preview.css('font-size', fontSize + 'px');
    if (fontSize != 16) {
        if ($$('.reset').length == 0)
            preview.removeClass('disabled').prepend('<i class="fa fa-refresh reset"></i>');
    }
    if ($$('.q-page .page-background[data-layout="swiper"]').length > 0) {
        var obj = $$.toRem(fontSize);
        $$('.q-page .page-background[data-layout="swiper"]').each(function (i, v) {
            $$(v).css(obj);
        });
    }
}
$$.resizeText = function (obj) {
    var $this = $$(obj),
        preview = $$('.font-preview'),
        operation = $this.data('op'),
        size = 16,
        max = 34,
        min = 13;
    if (localStorage.getItem('fontSize')) {
        size = parseInt(localStorage.getItem('fontSize'));
    };
    if (size <= max && operation == 'larger')
        $$.FontSize(size + 1, true);
    if (size >= min && operation == 'smaller')
        $$.FontSize(size - 1, true);
}
$$(document).on('click', '.font-control-btn', function (e) {
    $$.resizeText(this);
});
$$(document).on('click', '.font-preview', function (e) {
    if ($$(this).attr('style') != null) {
        app.confirm('العودة للحجم الافتراضي ؟', 'إعدادات الخط', function () {
            $$.FontSize(16, true)
            $$('.font-preview').addClass('disabled');
            if ($$('.reset').length != 0)
                $$('.fa-refresh.reset').remove();
        });
    }
});
//--------------------------------------------------------------------
  $$.setborder = function(border , set){
      var pageBorder =  (typeof border == "undefined") ? 1 : border;
      if (localStorage.getItem('border') == null) {
         localStorage.setItem('border',pageBorder);
        } else if (set) {
            localStorage.setItem('border', pageBorder);
      }else{
          pageBorder = localStorage.getItem('border');
      }
      if ($$('.borderpage[data-layout="swiper"]').length > 0) {
          $$('.borderpage[data-layout="swiper"]').each(function (i, v) {
            for(var x= 1;x<=7;x++){
                if($$(v).hasClass('bg-'+x)) $$(v).removeClass('bg-'+x);
            }
            $$(v).addClass('bg-'+pageBorder);
        });
    }
  }

//--------------------------------------------------------------------
//--------------------------------------------------------------------
$$.settingPage = function () {
    var html = app.templates.settingPage({});
    $$('.setting_content ul').html(html);
    var activeRecite = localStorage.getItem('activeRecite');
    if (activeRecite) {
        $$('#reciteSelect select').find('[value="' + activeRecite + '"]').prop('selected', true);
        var name = quranData.recitations[activeRecite].arname;
        $$('.smart-select#reciteSelect .item-after').text(name);
    }
    $$('#reciteSelect select').on('change', function () {
        var val = parseInt($$(this).val());
        $$.setRecite(val);
    })
    var acFont = localStorage.getItem('activeFont');
    if (acFont) {
        $$('#fontsList select').find('[value="' + acFont + '"]').prop('selected', true);
        var fontList = {
            "hafs": "حفص",
            "noorehira": "نور حراء",
            "noorehuda": "نور الهدى",
            "saleem": "سليم",
            "a-Regular": "الاميري"
        }
        $$('.smart-select#fontsList .item-after').text(fontList[acFont]);
    }
    $$('#fontsList select').on('change', function () {
        var fontname = $$(this).val();
        $$('#fontsList select').find('[value="' + fontname + '"]').prop('selected', true);
        $$('.smart-select#fontsList .item-after').text(fontList['' + fontname]);
        $$.setFont(fontname);
    })
    var nightV = localStorage.getItem('nightVersion');
    if (nightV) {
        $$('#nightCheckbox').prop('checked', (nightV == 'y') ? true : false);
    }
    $$('#nightCheckbox').on('change', function () {
        $$.nightVersion((this.checked) ? 'y' : 'n')
    })

     var border = localStorage.getItem('border');
    if (border) {
        var option =  $$('#pageBorder select').find('[value="' + border + '"]');
         option.prop('selected', true);
        $$('.smart-select#pageBorder .item-after').text(option.text());
    }
    $$('#pageBorder select').on('change', function () {
        var border = $$(this).val();
        $$('#pageBorder select').find('[value="' + border + '"]').prop('selected', true);

        $$.setborder(border,true);
    })
};


//
//$$.managPage = function(e){
//
//};
