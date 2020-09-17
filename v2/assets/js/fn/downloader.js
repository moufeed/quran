var downloading = false;
///---------------------- downloadAsset --------------
///---------------------------------------------------

/// download Sound files from http://www.everyayah.com/data
// ayaID [number]
// suraIndex [number]
// reciter   [obj]
// subtotal  [percentage | 0 ] 
$$.downloadAsset = function (ayaID, suraIndex, reciter, subtotal) {
    var currentCount = 1,
        maxCount = 20;
    var total, sura = quranData.sura[suraIndex - 1],
        ayatCount = parseInt(sura.ayas),
        percentage = 100 / ayatCount,
        suraFolder = cordova.file.externalRootDirectory + folder + '/' + reciter.subfolder + '/sura_' + suraIndex + '/',
        s = threeDigits(suraIndex),
        a = threeDigits(ayaID),
        file = s + a + '.mp3',
        URL = 'http://www.everyayah.com/data/' + reciter.subfolder + '/' + s + a + '.mp3';
    if ((ayaID <= ayatCount) && (downloading == true)) {
        window.resolveLocalFileSystemURL(suraFolder + file, function (s) {
            ayaID++;
            total = subtotal + percentage;

            $$('.download_modal_' + suraIndex + ' .downloading strong ').text(Math.floor(total) + " %");
            app.setProgressbar('.probar_' + suraIndex, total, 1000);

            $$.downloadAsset(ayaID, suraIndex, reciter, total);
        }, function (e) {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(URL, suraFolder + file,
                function (entry) {

                    ayaID++;
                    total = subtotal + percentage;

                    $$('.download_modal_' + suraIndex + ' .downloading strong ').text(Math.floor(total) + " %");

                    app.setProgressbar('.probar_' + suraIndex, total, 400);

                    if (total >= 99.9) {

                        var item = $$('.item-info[data-s="' + suraIndex + '"]');
                        item.find('.btn-down').addClass('btn-download downloaded');
                        item.find('.fa').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-download');
                        app.closeModal();
                        downloading = false;
                        return true;

                    }
                    $$.downloadAsset(ayaID, suraIndex, reciter, total);
                },
                function (err) {
                    console.log("Error", err);
                });
        });
    }
}

/// Open download modal To Start download Sura
/// reciter [obj]
/// suraIndex [number]
///---------------------------------------------------
$$.openDownloader = function (reciter, suraIndex) {
    var url, ayaID = 1,
        subtotal = 0;
    downloading = true;
    app.modal({
        title: 'سورة ' + quranData.sura[suraIndex - 1].name,
        text: '<span data-progress="0" class="progressbar probar_' + suraIndex + '"><span></span></span>',
        class: 'download_modal_' + suraIndex,
        downloading: true,
        buttons: [{
            text: 'إلغاء',
            bold: true,
            onClick: function (e) {
                downloading = false;
            }
        }]
    });
    $$('.download_modal_' + suraIndex).on('opened', function () {
        $$.downloadAsset(ayaID, suraIndex, reciter, subtotal);
    })
}