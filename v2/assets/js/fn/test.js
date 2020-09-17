//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
// convert word to pattren  for REGEXP
//var UChars = {
//    HAMZA: '\u0621',
//    ALEF_WITH_MADDA_ABOVE: '\u0622',
//    ALEF_WITH_HAMZA_ABOVE: '\u0623',
//    WAW_WITH_HAMZA_ABOVE: '\u0624',
//    ALEF_WITH_HAMZA_BELOW: '\u0625',
//    YEH_WITH_HAMZA: '\u0626',
//    ALEF: '\u0627',
//    BEH: '\u0628',
//    MARBUTA: '\u0629',
//    TEH: '\u062A',
//    THEH: '\u062B',
//    JEMM: '\u062C',
//    HAH: '\u062D',
//    KHAH: '\u062E',
//    DAL: '\u062F',
//    THAL: '\u0630',
//    REH: '\u0631',
//    ZAIN: '\u0632',
//    SEEN: '\u0633',
//    SHEEN: '\u0634',
//    SAD: '\u0635',
//    DAD: '\u0636',
//    TAH: '\u0637',
//    ZAH: '\u0638',
//    AIN: '\u0639',
//    GHAIN: '\u063A',
//    TATWEEL: '\u0640',
//    FEH: '\u0641',
//    QAF: '\u0642',
//    KAF: '\u0643',
//    LAM: '\u0644',
//    MEEM: '\u0645',
//    NOON: '\u0646',
//    HEH: '\u0647',
//    WAW: '\u0648',
//    ALEF_MAKSURA: '\u0649',
//    YEH: '\u064A',
//    FATHATAN: '\u064B',
//    DAMMATAN: '\u064C',
//    KASRATAN: '\u064D',
//    FATHA: '\u064E',
//    DAMMA: '\u064F',
//    KASRA: '\u0650',
//    SHADDA: '\u0651',
//    SUKUN: '\u0652',
//    MADDA: '\u0653',
//    HAMZA_ABOVE: '\u0654',
//    HAMZA_BELOW: '\u0655',
//    SMALL_ALEF: '\u065F',
//    SUPERSCRIPT_ALEF: '\u0670',
//    ALEF_WASLA: '\u0671',
//    HIGH_SALA: '\u06D6',
//    HIGH_GHALA: '\u06D7',
//    HIGH_MEEM_INITIAL_FORM: '\u06D8',
//    HIGH_LA: '\u06D9',
//    HIGH_JEMM: '\u06DA',
//    HIGH_THREE_DOT: '\u06DB',
//    HIGH_SEEN: '\u06DC',
//    RUB_EL_HIZB: '\u06DE',
//    HIGH_ROUNDED_ZERO: '\u06DF',
//    HIGH_UPRIGHT_ZERO: '\u06E0',
//    HIGH_DOTLESS_KHAH: '\u06E1',
//    HIGH_MEEM: '\u06E2',
//    LOW_SEEN: '\u06E3',
//    SMALL_WAW: '\u06E5',
//    SMALL_YEH: '\u06E6',
//    HIGH_YEH: '\u06E7',
//    HIGH_NOON: '\u06E8',
//    SAJDAH: '\u06E9',
//    LOW_STOP: '\u06EA',
//    HIGH_STOP: '\u06EB',
//    HIGH_STOP_FILLED: '\u06EC',
//    LOW_MEEM: '\u06ED',
//    HAMZA_ABOVE_ALEF: '\u0675',
//    DOTLESS_BEH: '\u066E',
//    ZWNJ: '\u200C',
//    NBSP: '\u00A0',
//    NNBSP: '\u202F',
//    FARSI_YEH: '\u06CC',
//    FARSI_KEHEH: '\u06A9',
//    HEH_DOACHASHMEE: '\u06BE',
//    SWASH_KAF: '\u06AA',
//    YEH_BARREE: '\u06D2'
//}
//var UGroups = {
//    LETTER: "[$HAMZA-$YEH]",
//    HARAKA: "[$FATHATAN-$MADDA$SUPERSCRIPT_ALEF]",
//    HARAKAT: "[$FATHATAN-$MADDA$SUPERSCRIPT_ALEF$TATWEEL]",
//    SPACE: "[\\s$HIGH_SALA-$LOW_MEEM]*\\s",
//    HAMZA_SHAPE: "[$HAMZA_ABOVE$HAMZA$ALEF_WITH_HAMZA_ABOVE-$YEH_WITH_HAMZA]",
//    LETTER_HARAKA: "[$HAMZA-$ALEF_WASLA]"
//}
//var TextTools = {
//    matchingRules: [["$HAMZA_SHAPE", "$HAMZA_SHAPE"], ["$ALEF_MAKSURA", "YY"], ["$ALEF", "[$ALEF$ALEF_MAKSURA$ALEF_WITH_MADDA_ABOVE$ALEF_WITH_HAMZA_ABOVE$ALEF_WITH_HAMZA_BELOW$ALEF_WASLA]"], ["[$TEH$MARBUTA]", "[$TEH$MARBUTA]"], ["$HEH", "[$HEH$MARBUTA]"], ["$WAW", "[$WAW$WAW_WITH_HAMZA_ABOVE$SMALL_WAW]"], ["$YEH", "[$YEH$ALEF_MAKSURA$YEH_WITH_HAMZA$SMALL_YEH]"], ["YY", "[$ALEF_MAKSURA$YEH$ALEF]"], [" ", "$SPACE"]],
//    wildcardRegs: [["\\.", "P"], ["\\*", "S"], ["[?؟]", "Q"], ["S+", "S"]],
//    wildcards: [["S", "$LETTER_HARAKA*"], ["Q", "$LETTER"], ["P", "$LETTER"]],
//    preProcess: [["[$FARSI_YEH$YEH_BARREE]", "$YEH"], ["[$FARSI_KEHEH$SWASH_KAF]", "$KAF"], ["$HEH_DOACHASHMEE", "$HEH"], ["$NOON$SUKUN", "$NOON"], ["([$KASRA$KASRATAN])($SHADDA)", "$2$1"]],
//    init: function() {
//        for (var i in UGroups)
//            UGroups[i] = this.regTrans(UGroups[i]);
//    },
//    enrichPattern: function(pattern, ignoreHaraka) {
//        if (ignoreHaraka)
//            pattern = this.pregReplace("$HARAKA", '', pattern);
//        pattern = this.pregReplace('$TATWEEL', '', pattern);
//        pattern = pattern.replace(/\-/g, '!');
//        pattern = this.regTrans(pattern);
//        pattern = this.handleSpaces(pattern);
//        pattern = this.applyRules(this.preProcess, pattern);
//        pattern = this.applyRules(this.wildcardRegs, pattern);
//        pattern = this.pregReplace("(.)", "$1$HARAKAT*", pattern);
//        pattern = this.applyRules(this.matchingRules, pattern);
//        pattern = this.applyRules(this.wildcards, pattern);
//        return pattern;
//    },
//    handleSpaces: function(pattern) {
//        var prev = '';
//        if (pattern == '')
//            return pattern;
//        pattern = pattern.replace(/\s+/g, ' ');
//        while (pattern != prev) {
//            prev = pattern;
//            pattern = pattern.replace(/^(([^"]*"[^"]*")*)([^"\s]*) /g, '$1$3+');
//        }
//        pattern = pattern.replace(/_/g, ' ');
//        pattern = pattern.replace(/"/g, ' ');
//        pattern = pattern.replace(/^[+|]+/g, '').replace(/[+|!]+$/g, '');
//        pattern = pattern.replace(/\+*([+|!])\+*/g, '$1');
//        return pattern;
//    },
//
//    regTrans: function(str) {
//        return str.replace(/\$([A-Z_]+)/g, function(s, i, ofs, all) {
//            return UGroups[i] || UChars[i] || '';
//        });
//    },
//    pregReplace: function(fromExp, toExp, str) {
//        fromExp = new RegExp(this.regTrans(fromExp),'g');
//        toExp = this.regTrans(toExp);
//        return str.replace(fromExp, toExp);
//    },
//    applyRules: function(rules, str) {
//        for (var i in rules)
//            str = this.pregReplace(rules[i][0], rules[i][1], str);
//        return str;
//    }
//}
//
//var Search = {
//    query: '',
//    type: '',
//    pattern: '',
//    go: function() {
//		 TextTools.init();
//        var query = 'الواقعة';
//        if (query.trim() == '') {
//            alert(_('Search string is empty.'));
//            return;
//        }
//        this.query =  query;
//        this.update();
//    },
//	  update: function() {
//        this.pattern = TextTools.enrichPattern(this.query);
//    }
//};
//-------------------------------------------------------------------------
//-------------------------------------------------------------------------