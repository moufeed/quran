
var app = new Framework7({
    init: false,
    tapHold: true,
    tapHoldDelay: 250,
    material: true,
    fastClicksDelayBetweenClicks : 100,
    preloadPreviousPage: false,
    materialRipple: false, 
    materialPageLoadDelay: 100,
    cache: false,
    uniqueHistory: true,
    showBarsOnPageScrollTop: true,
    showBarsOnPageScrollEnd: true,
    template7Pages: true,
    precompileTemplates: true,
    dynamicPageUrl: '{{name}}',
    modalTitle: " ",
    modalButtonOk: "موافق",
    modalButtonCancel: "إلغاء",
    modalPreloaderTitle: "جاري التحميل...",
    notificationCloseButtonText: "إغلاق",
    notificationCloseOnClick: true,
    notificationHold: 1000,
    scrollTopOnNavbarClick: true,
    modalTemplate : '<div class="modal {{#unless buttons}}modal-no-buttons{{/unless}} {{#if class}}{{class}}{{/if}}">'+
 ' <div class="modal-inner">'+
  '  {{#if title}}'+
   '   <div class="modal-title">{{title}}</div>'+
   ' {{/if}}'+
  '  {{#if text}}'+
     '  <div class="modal-text">{{text}}</div>'+
  '  {{/if}}'+
  '  {{#if afterText}}'+
   '   {{afterText}}'+
  '  {{/if}}'+
 ' </div>'+
 ' {{#if buttons}}'+
   ' <div class="modal-buttons">'+
        '{{#if aya}}'+
        '<span class="ayacount"> الاية <strong><strong></span>'+
        '{{/if}}'+
    '{{#if downloading}}'+
    '<span class="downloading"> جاري التحميل  <strong><strong></span>'+
    '{{/if}}'+
    '  {{#each buttons}}'+
    '    <span class="modal-button {{#if bold}}modal-button-bold{{/if}}">{{text}}</span>'+
  '    {{/each}}'+
    '</div>'+
  '{{/if}}'+
'</div>  ' ,
    onAjaxStart: function (xhr) {
        app.showIndicator()
    },
    onAjaxComplete: function (xhr) {
        app.hideIndicator()
    }
});
var $$ = Dom7,
     quranData ;



var mainView = app.addView('.view-main',{
    dynamicNavbar: true,
    domCache: true
});

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
var arabicNum = ['الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', '  العشرون', 'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون ', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', ' الثلاثون ', 'الحادي والثلاثون ', 'الثاني والثلاثون', 'الثالث والثلاثون', 'الرابع والثلاثون', 'الخامس والثلاثون', 'السادس والثلاثون', 'السابع والثلاثون', 'الثامن والثلاثون', 'التاسع والثلاثون', 'الأربعون', 'الحادي والأربعون', 'الثاني والأربعون', 'الثالث والأربعون', 'الرابع والأربعون', 'الخامس والأربعون', 'السادس والأربعون', 'السابع والأربعون', 'الثامن والأربعون', 'التاسع والأربعون', ' الخمسون', 'الحادي والخمسون', 'الثاني والخمسون', 'الثالث والخمسون', 'الرابع والخمسون', 'الخامس والخمسون', 'السادس والخمسون', 'السابع والخمسون', 'الثامن والخمسون', 'التاسع والخمسون', 'الستون'];

//----------------------------------------------------------------
//---------------------  REGISTER HELPERS  -----------------------
//----------------------------------------------------------------
Template7.registerHelper('arNum', function (index, options) {
    var num = arabicNum[index];
    return num;
});
//----------------------------------------------------------------
//----------------------------------------------------------------
Template7.registerHelper('ayaText', function (sura, aya, options) {
    var ayaTxt, listWord, ayaList, txt;
       ayaList =  $$.getAya(sura, aya ,function(data){
           ayaTxt = data.text;
            if (ayaTxt.search('۞') >= 0) {
                txt = ayaTxt.replace('۞', '');
            } else {
                txt = ayaTxt;
            }
            listWord = txt.split(' ');
            if (listWord.length > 12) { 
                ayaList = listWord.slice(0, 12).join(' ');
            } else {
                ayaList = listWord.join(' '); 
            } 
             return ayaList;
        });
     var time = setInterval(function(){
        if(typeof ayaList != undefined){
            clearInterval(time);
            return ayaList; 
        }
    },50);
      
}); 
//----------------------------------------------------------------
//----------------------------------------------------------------
Template7.registerHelper('suraTxt', function (index, options) {
    if(index){
    var suraIndex = parseInt(index);
    var sura = quranData.sura[suraIndex - 1];
    var suraName = sura.name;
    return suraName;
        }
});






