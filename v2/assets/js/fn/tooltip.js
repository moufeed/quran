//----------------------------------------------------------------
//-------------------      AYA TOOLTIP ---------------------------
//----------------------------------------------------------------
// hold aya tooltip

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
        var out = app.templates.tooltip(set.data);

        var fixtooltip=true;

        if(fixtooltip)
        {
            $$('.page').append(out);
            $$('.page').addClass('fixtooltip');
            $$('.tooltip_container').css({'z-index':'222222'});
        }
        else
        {
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
                        //"left" : pos + 'px',
                        "top": (this.offsetTop - 70) + 'px'
                    }
                    $$(tooltip_cont).css(cs);
                }
                if (ofstL > ww) {
                    $$(tooltip_cont).css({
                        //'right': (pos / 4) + 'px',
                        "top": (this.offsetTop - 70) + 'px'
                    });
                }
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