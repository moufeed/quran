$$(document).on('click', '.about-link', function () {
    $$.makepage({
        "page_name": "aboutPage",
        "page_class": "aboutpage",
        "navbar": true,
        "page_title": 'عن المرشد',
        "toolbar": false,
        "searchbar": false,
        "layout": "page",
        "customID": false,
        "contentClass": 'about-page',
        "blockClass": 'about_content'
    }); 
}) 

$$(document).on('click', '.setting-link', function () {
    $$.makepage({
        "page_name": "settingPage",
        "page_class": "settingPage",
        "navbar": true,
        "page_title": 'الاعدادات',
        "toolbar": false,
        "layout": "list",
        "blockClass": 'setting_content'
    }); 
}) 
$$(document).on('click', '.contact-link', function () {
    $$.makepage({
        "page_name": "contactUs",
        "page_class": "contactUs",
        "navbar": true,
        "page_title": 'إتصل بنا',
        "toolbar": false,
        "layout": "page",
        "contentClass": 'content-page',
        "blockClass": 'contact_content'
    }); 
});
$$(document).on('click', '.help-link', function () {
    $$.makepage({
        "page_name": "helpPage",
        "page_class": "helpPage",
        "navbar": true,
        "page_title": 'المساعدة',
        "toolbar": false,
        "layout": "page",
        "contentClass": 'helpPage-page',
        "blockClass": 'helpPage_content'
    }); 
});


$$(document).on('click', '.management-link', function () {
    $$.makepage({
        "page_name": "managementPage",
        "page_class": "management",
        "navbar": true,
        "page_title": 'إدارة الصوتيات',
        "toolbar": false,
        "layout": "list",
        "contentClass": 'management-page',
        "blockClass": 'management_content'
    },function(page){
            $$.soundmanager(page);

    });
});



//------------------------------------------------------------------
//-------------------------- aboutPage ----------------------------- 
//------------------------------------------------------------------
$$.aboutPage = function(){
    var html = app.templates.abouttemplate({});
    $$('.about_content').html(html);
    
};
//------------------------------------------------------------------
//-------------------------- helpPage ----------------------------- 
//------------------------------------------------------------------
 $$.helpPage = function(){
    var html = app.templates.helptemplate({});
    $$('.helpPage_content').html(html);

     var questions = [
         {
         'question' : "كيف أحصل على تفسير للاية مخصصة",
         'answer' : "اضغط مطولا على  الاية التى تريد الحصول على تفسيرها قائمة الاداوت و تضغط على <i class='fa fa-book'></i>"
         },{
        'question' : "كيف يمكنني تكبير الخط ؟",
        'answer' : "هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان و حجم و لون الخط هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان"
    },{
        'question' : "طريقة حفظ علامة مرجعية",
        'answer' : "هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان و حجم و لون الخط هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان"
    },{
        'question' : "ما طريقة البحث في  القران ؟",
        'answer' : "هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان و حجم و لون الخط هذا نص تجريبي لاختبار شكل و حجم النصوص و طريقة عرضها في هذا المكان"
    }]
    $$.each(questions,function(i,v){
        var qhtml =app.templates.accordiontemplate(v)
        $$('.questionslist').append(qhtml);
    })
};
//------------------------------------------------------------------
//-------------------------- contactPage ---------------------------  
//------------------------------------------------------------------
$$.contactPage = function(){
    
    
   
    
    var html = app.templates.contacttemplate({});
   
    $$('.contact_content').html(html);
      $$('.show-tab-1').on('click', function () {
       app.showTab('#tab1');
    });
    $$('.show-tab-2').on('click', function () {
        app.showTab('#tab2');
    });
    $$('.send-message').on('click',function(event){
  
        $$('#contactForm').find('input,textarea').each(function(i,v){
             if($$(v).val().length == 0){
                 $$(this).css('border-bottom','1px solid red');
                     $$(v).on('keyup keydown change ',function(){ 
                     $$(this).css('border-bottom-color','transparent');
                   });
                      event.preventDefault();
                     return false;
              } 
             var type = $$(this).attr('type');
                 if(type == 'email')  validateEmail($$(this));
         });
         var formData =   app.formToJSON('#contactForm') ;
          
    });
};
//------------------------------------------------------------------
//-------------------------- settingPage --------------------------- 
//------------------------------------------------------------------
