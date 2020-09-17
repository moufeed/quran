//function fail(error) {
//    console.log('error', error);
//}
//
//function removeFolder(folder ,callback){
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
//        fs.root.getDirectory(folder,{create : true, exclusive : false},function(entry){
//            entry.removeRecursively(function() {
//                if (callback, typeof (callback) == 'function') {
//                    callback()
//                }
//            }, fail);
//        });
//    }, fail);
//}
//
//function surscCount(count, entries) {
//    var reciter = entries[count];
//    var len = entries.length;
//    if (count < len) {
//        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + reciter.fullPath, function (dir) {
//            var reader = dir.createReader();
//            reader.readEntries(function (dirs) {
//                $$('.management_content  ul a[data-id="' + (count + 1) + '"]').find('.count').find('b').text(dirs.length);
//                if(count == len) return;
//                count++;
//                surscCount(count, entries);
//            }, fail);
//        }, fail);
//    }
//}
//
//$$.reciterFolder = function(reciterId){
//    var reciter = quranData.recitations[reciterId - 1 ];
//    var subfolder = cordova.file.externalRootDirectory + folder +'/'+ reciter.subfolder;
//    window.resolveLocalFileSystemURL(subfolder, function(dir){
//        var read = dir.createReader();
//        read.readEntries(function(entries){
//            var len = entries.length;
//
//            for (var i = 0; i < len; i++) {
//                var name = entries[i].name;
//                var id  =  name.split('_');
//                var sura = quranData.sura[parseInt(id[1]) -1 ];
//                sura.idCount = i +1;
//                sura.folder =  name;
//                sura.reciter =  reciterId;
//                var htm = app.templates.s_sura_Template(sura);
//                $$('.popup-sound .reciter_block').append(htm);
//
//                window.resolveLocalFileSystemURL(dir.nativeURL + entries[i].name + '/' , function(folder){
//                     console.log(folder);
//                    var reader = folder.createReader();
//                    reader.readEntries(function(files){
//                        var lenth = files.length;
//                        console.log(lenth);
//                    });
//
//
//                },fail);
//
//            }
//
//
//
//            $$('a.folder-delete').on('click',function(){
//                var parent =  $$(this).parents('.suraitem');
//                var index  =   parent.data('s');
//                var reciter=  quranData.recitations[parseInt(parent.data('r')) - 1 ];
//                var sfolder =  parent.data('folder');
//                var subfolder =   folder +'/'+ reciter.subfolder+'/'+ sfolder + '/'
//                removeFolder(subfolder,function(){
//                    var sitems = $$('.reciter_block li');
//                    parent.remove();
//                    sitems.each(function(e,v){
//                        $$(v).find('span.index').text(e+1);
//                    });
//
//                     setTimeout(function(){
//                          console.log(sitems.length);
//                     },150);
//
//                    var recicout = $$('.management_content a[data-index="'+reciterId+'"] .count b');
//                    var cou = parseInt(recicout.text()) - 1;
//                    if(cou >= 0){
//                        recicout.text(cou)
//                    }
//                });
//            });
//        }, fail);
//    }, fail);
//}
//
//// points.sort(function(a, b){return a-b});
//$$.soundmanager = function (page) {
//    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + folder, function(fs){
//        var reader = fs.createReader();
//        reader.readEntries(function(entries) {
//            $$('.management_content  ul').html(' ');
//            var count = 0;
//            var len = entries.length;
//            if(len  >  0 ){
//            surscCount(count, entries)
//             for (var i = 0; i < len; i++) {
//                for (var x = 0; x < quranData.recitations.length; x++) {
//                    if (quranData.recitations[x].subfolder == entries[i].name) {
//                        quranData.recitations[x].index = x + 1;
//                        quranData.recitations[x].id = i + 1;
//                        var htm = app.templates.soundsTemplate(quranData.recitations[x]);
//                        $$('.management_content  ul').append(htm);
//                    }
//                }
//            }
//           setTimeout(function(){
//               $$('.removerecit').click(function(){
//
//                   var idR = parseInt($$(this).data('recite'));
//                   var reciter = quranData.recitations[idR - 1 ];
//                   removeFolder(folder +'/'+ reciter.subfolder+'/',function(){
//                    $$('.management_content ul li').each(function(e,v){
//                        $$(v).find('span.index').text(e+1);
//                    });
//                   });
//               });
//
//
////               $$('.management_content a.recitefolder').click(function(){
////                   var idx     = parseInt($$(this).data('index'));
////                   var reciter = quranData.recitations[idx - 1 ];
////                   var obj ={
////                       'reciter_name' :reciter.arname,
////                       'reciter'  : idx
////                   }
////                   var shtml = app.templates.popupSound(obj);
////                   app.popup(shtml);
////                   $$('.popup-sound').on('opened', function () {
////                       // console.log('About Popup opened')
////                       $$.reciterFolder(idx);
////                   });
////
////               });
//           },100);
//            }else{
//                app.alert('لا يوجد سور محملة بعد',function(){
//                    mainView.router.back();
//                });
//            }
//        }, fail);
//
//    }, fail);
//}
//
