///---------------------- downloadAsset --------------
///---------------------------------------------------
$$.downloadAsset = function (ayaID, suraIndex ,reciter,subtotal) {
    var currentCount = 1, maxCount = 20;
    var total,sura = quranData.sura[suraIndex - 1],
        ayatCount = parseInt(sura.ayas),
        percentage =100/ayatCount,
        suraFolder = cordova.file.externalRootDirectory + folder + '/' + reciter.subfolder + '/sura_' + suraIndex + '/',
        s = threeDigits(suraIndex),
        a = threeDigits(ayaID),
        file = s + a + '.mp3',
        URL = 'http://www.everyayah.com/data/' + reciter.subfolder + '/' + s + a + '.mp3';
    if ((ayaID <= ayatCount) && (downloading==true)) {
        window.resolveLocalFileSystemURL(suraFolder + file, function (s) {
            ayaID++;
            total = subtotal + percentage;
//            $$('.reciter_block #prograss_'+suraIndex).find('.radial-progress-cover').attr('stroke-dashoffset', total +'px');
            $$('.download_modal_'+suraIndex +' .downloading strong ').text(Math.floor(total)  + " %");
            app.setProgressbar('.probar_'+suraIndex ,total, 1000);
             
            $$.downloadAsset(ayaID, suraIndex ,reciter,  total );
        }, function (e) {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(URL, suraFolder + file, 
              function (entry) { 

                ayaID++; 
                total = subtotal + percentage;
//                $$('.reciter_block #prograss_'+suraIndex).find('.radial-progress-cover').attr('stroke-dashoffset', total +'px');
                $$('.download_modal_'+suraIndex+' .downloading strong ').text(Math.floor(total) + " %");
                
                app.setProgressbar('.probar_'+suraIndex ,total, 400);

                if(total>=99.9){

                        var item = $$('.item-info[data-s="' + suraIndex + '"]');
                        item.find('.btn-down').addClass('btn-download downloaded');
                        item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
                        app.closeModal();
                        downloading = false;
                        return true;

                }
                $$.downloadAsset(ayaID,suraIndex,reciter,total);
            },
                                  function (err) {
                console.log("Error", err);
            });
        });
    }
}

///---------------------- downloader -----------------
///---------------------------------------------------
$$.openDownloader = function ( reciter ,suraIndex) {
    var url, ayaID = 1,subtotal = 0 ;
    downloading = true;
    app.modal({
        title: 'سورة ' + quranData.sura[suraIndex - 1].name,
        text: '<span data-progress="0" class="progressbar probar_'+suraIndex+'"><span></span></span>',
        class: 'download_modal_'+suraIndex,
        downloading: true,
        buttons: [{
            text: 'إلغاء',
            bold: true,
            onClick: function (e) {
                downloading = false;
            }
        }]
    });
    $$('.download_modal_'+suraIndex).on('opened', function () {
        $$.downloadAsset(ayaID, suraIndex ,reciter,subtotal);
    })
}
//var url, ayaID = 1,subtotal = 0 ;
//
//$$.downloader = function(reciter,suraIndex){
//    var networkState = navigator.connection.type ,
//        total,sura = quranData.sura[(suraIndex) ? suraIndex - 1 : 0],
//        ayatCount = parseInt(sura.ayas),
//        percentage =100/ayatCount,
//        suraFolder = cordova.file.externalRootDirectory + folder + '/' + reciter.subfolder + '/sura_' + (suraIndex) ? suraIndex : 1 + '/',
//        s = threeDigits(suraIndex),
//        a = threeDigits(ayaID),
//        file = s + a + '.mp3',
//        url = 'http://www.everyayah.com/data/' + reciter.subfolder + '/' + s + a + '.mp3';
//       
//    if ((ayaID <= ayatCount) && (downloading==true) && (networkState != Connection.NONE)) {
//
//        window.resolveLocalFileSystemURL(suraFolder + file, function (s){
//            ayaID++;
//            total = subtotal + percentage;
//            if(suraIndex){
//                $$('.download_modal_'+suraIndex +' .downloading strong ').text(Math.floor(total)  + " %");
//            }else{
//                $$('.download_modal_qrn .downloading strong ').text(Math.floor(total)  + " %");
//            }
//
//        },function (e){
//
//        });
//    }
//}
//var radius = 14, circumference = 2 * radius * Math.PI; 
//$$.downloadSura = function(reciter,suraIndex){
//    downloading = true;
////    $$('.reciter_block .swipeout[data-s="'+suraIndex+'"]').find('.buttons-row').addClass('hidden');
////    $$('.reciter_block #prograss_'+suraIndex).removeClass('hidden');
//    
////    var els = $$('.reciter_block #prograss_'+suraIndex).find('circle');
////    $$.each(els,function(i,el){
////        $$(el).attr('stroke-dasharray', circumference + 'px');
////        $$(el).attr('r', radius + 'px');
////    })
////    $$('.reciter_block #prograss_'+suraIndex).find('.radial-progress-center').attr('r', (radius + 'px'));
//  
//    //
//    
//    
//    app.modal({
//        title: 'سورة ' + quranData.sura[suraIndex - 1].name,
//        text: '<span data-progress="0" class="progressbar probar_'+suraIndex+'"><span></span></span>',
//        class: 'download_modal_'+suraIndex,
//        downloading: true,
//        buttons: [{
//            text: 'إلغاء',
//            bold: true,
//            onClick: function (e) {
//                downloading = false;
//            }
//        }]
//    });
//    $$('.download_modal_'+suraIndex).on('opened', function () {
//        $$.downloader(reciter,suraIndex);
//    })
//}
//$$.downloadQuran = function(reciter){
//
// }



/*






var ctx = document.getElementById('my_canvas').getContext('2d');
var al = 0;
var start = 4.72;
var cw = ctx.canvas.width;
var ch = ctx.canvas.height; 
var diff;
function progressSim(){
	diff = ((al / 100) * Math.PI*2*10).toFixed(2);
	ctx.clearRect(0, 0, cw, ch);
	ctx.lineWidth = 10;
	ctx.fillStyle = '#09F';
	ctx.strokeStyle = "#09F";
	ctx.textAlign = 'center';
	ctx.fillText(al+'%', cw*.5, ch*.5+2, cw);
	ctx.beginPath();
	ctx.arc(35, 35, 30, start, diff/10+start, false);
	ctx.stroke();
	if(al >= 100){
		clearTimeout(sim);
	    // Add scripting here that will run when progress completes
	}
	al++;
}
var sim = setInterval(progressSim, 50);

*/