 app.onPageInit('index', function () {
    
     if (!quranData) {
         $$.getJSON("./json/quran-data.json", function (data) {
             quranData = data.quran;
             $$.initApp(); 
         });
     } else {
         $$.initApp(); 
     }
 }) 

 $$(document).on('click','.index-link',function(){
     mainView.router.back({url: mainView.history[0], force: true});
    document.location.reload();
    //  mainView.router.loadPage('index.html');
 });
 


 