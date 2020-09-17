function fail(error) {
    console.log('error', error);
}
function removeFolder(folder ,callback){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
        fs.root.getDirectory(folder,{create : false, exclusive : false},function(entry){
            entry.removeRecursively(function() {
                if (callback, typeof (callback) == 'function') {
                    callback()
                }
            }, fail);
        });
    }, fail);
}


var downloading = false;

function typetext(type) {
    switch (type) {
    case 'Murattal':
        return 'ترتيل';
        break;
    case 'Mujawwad':
        return 'تجويد';
        break;
    case 'Muallim':
        return 'تعليم';
        break;
    }
}
///---------------------------------------------------
///---------------------------------------------------
$$(document).on('click', '.recitations-link', function () {
    $$.makepage({
        "page_name": "recitations",
        "page_class": "recitationspage",
        "navbar": true,
        "page_title": 'التلاوات',
        "toolbar": false,
        "searchbar": false,
        "layout": "list",
        "customID": false,
        "contentClass": 'recitations-page',
        "blockClass": 'recitations_content'
    });
});
///---------------------------------------------------
///---------------------------------------------------
$$.recitationsPage = function (page) {
        $$.each(quranData.recitations, function (i, v) {
            var reciter = quranData.recitations[i];
                reciter.index = i + 1;
            var htm = app.templates.recitationstemplate(reciter);
            $$('.recitations_content ul').append(htm);
        })

        $$('.btn-download').click(function(){
            console.log('obj'); 
            var $parent = $$(this).parent('.reciteItem');
            var recite   =  quranData.recitations[parseInt($parent.data('index'))];
          //  $$.downloadQuran(recite);
        })  
        $$('.btn-remove').click(function(){
            var $parent = $$(this).parent('.reciteItem');
            var reciter   =  quranData.recitations[parseInt($parent.data('index'))];
            var subfolder =  folder +'/'+ reciter.subfolder+'/';
            removeFolder(subfolder,function(){
                app.addNotification({
                    message: 'تم الحذف ',
                    button: {
                        text: 'إغلاق',
                        color: 'yellow'
                    }
                });
            });
            app.swipeoutClose(app.swipeoutOpenedEl);
        })

        $$('.recitations_content ').on('click', '.item-link', function () {
            $$.makepage({
                "page_name": 'reciterPage',
                "page_class": "reciter_page",
                "navbar": true,
                "page_title": $$(this).data('t'),
                "toolbar": false,
                "searchbar": false,
                pageNum: $$(this).data('index'),
                "layout": "list",
                "customID": false,
                "contentClass": 'reciter-content',
                "blockClass": 'reciter_block',
                "download_suras" : 0
            });
        });
    }
///---------------------------------------------------
    ///---------------------------------------------------
$$.suraExist = function (folder, count, status) {
        if (count <= 114 && status == true) {
            var sourafolder = 'sura_' + count;
            folder.getDirectory(sourafolder, {
                create: false
            }, function (suraFolder) {
                var ayacount = 0;
                $$.fileExist(suraFolder, count, ayacount);
                count++;
                $$.suraExist(folder, count, true);
            }, function (err) {
                var item = $$('.item-info[data-s="' + count + '"]');
                item.find('.btn-down').addClass('btn-download');
                item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
                count++;
                $$.suraExist(folder, count, true);
            }); 
        }
    }
    ///---------------------------------------------------
    ///---------------------------------------------------
$$.fileExist = function (suraFolder, souraId, ayacount) {
    var ayatlength = parseInt(quranData.sura[souraId - 1].ayas);
    var sura = threeDigits(souraId);
    var aya = threeDigits(ayacount);
    var file = sura + aya + '.mp3';
    var dirReader = suraFolder.createReader();
    dirReader.readEntries(function (entries) {
        if (entries.length >= ayatlength) {
            var item = $$('.item-info[data-s="' + souraId + '"]');
            item.find('.btn-down').addClass('btn-download downloaded');
            item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
        } else {
            var item = $$('.item-info[data-s="' + souraId + '"]');
            item.find('.btn-down').addClass('btn-download');
            item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
        }
    }, fileError);

    function fileError(error) {
        console.log('error:', error);
    }
}
$$.reciterPage = function (page) {
    var index = parseInt(page.context.pageNum);
    var reciter = quranData.recitations[index];
    var suors = {};
    $$('.reciter_block ul ').html('');
    $$.each(quranData.sura, function (i, v) {
        suors[i] = v;
        suors[i].reciter = index;
        var htm = app.templates.stemplate(suors[i]);
        $$('.reciter_block ul ').append(htm);
    });
    //--------------------------------------------------------------
    var strat = false,
        count = 1,
        files_missing = [];
    var subfolder = folder + '/' + reciter.subfolder + '/';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory(subfolder, {
            create: false,
            exclusive: true
        }, function (folder) {
            $$.suraExist(folder, count, true);
        }, function (error) {
            // Reciter folder not found
            $$.each(quranData.sura, function (i, v) {
                var item = $$('.item-info[data-s="' + (i + 1) + '"]');
                item.find('.btn-down').addClass('btn-download');
                item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
            });
        });
    }, function (error) {});
    //--------------------------------------------------------------
    $$('.button.btn-down').click(function () {
        var parent = $$(this).parents('.item-info');
        var reciter = quranData.recitations[parseInt(parent.data('r'))];
        var suraNum = parseInt(parent.data('s'));
        var suraFolder = cordova.file.externalRootDirectory + folder + '/' + reciter.subfolder + '/';
        window.resolveLocalFileSystemURL(suraFolder, function (dirEntry) {
            $$.openDownloader(reciter , suraNum);
        }, function (e) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                var Sfolder = folder + '/' + reciter.subfolder;
                fs.root.getDirectory(Sfolder, {
                    create: true,
                    exclusive: true
                }, function (sdir) {
                    $$.openDownloader(reciter , suraNum);   
                }, function (error) {
                    console.log('error : ', error);
                });
            }, function (error) {
                console.log(error)
            });
        });
    });

    $$('.reciter_block .btnremove').click(function (){
        var sura  = $$(this).data('s');
        var reciter   =  quranData.recitations[parseInt($$(this).data('r'))];
        var subfolder =  folder +'/'+ reciter.subfolder+'/sura_'+sura   ;
        removeFolder(subfolder,function(){

            var item = $$('.item-info[data-s="' + sura + '"]');
            item.find('.btn-down').removeClass('downloaded');
            app.addNotification({
                message: 'تم الحذف ',
                button: {
                    text: 'إغلاق',
                    color: 'yellow'
                }
            });
            ///downloaded
        });
        app.swipeoutClose(app.swipeoutOpenedEl);
    });

}
var missingfiles = [];







$$(document).on('click', '.button.btn-play', function () {
    var parent = $$(this).parents('.item-info');
    var soura = parseInt(parent.data('s'));
    var done = parent.data('d');
    var reciter = parseInt(parent.data('r'));
    var obj = {
        index: parseInt(quranData.sura[soura - 1].index),
        sura: quranData.sura[soura - 1],
        aya: 1,
        reciter: quranData.recitations[reciter],
        subfolder: quranData.recitations[reciter].subfolder,
        downloaded: (done == true) ? 1 : 0,
        ayatCount: parseInt(quranData.sura[soura - 1].ayas),
    }
    getFileURI(obj.subfolder, obj.index, obj.aya, function (src) {
        obj.path = src;
        audioPlayer(obj);
    })
})
