// Quran Metadata 
//"Hizb": [{
// 			 "index": 0,
// 			 "hizb": {"page": 1,"aya": 1,"sura": 1},
// 			 "quarter": {...},
// 			 "half": {...},
// 			 "threeQuarters": {...}
//        }...],
//"sura": [{
//            "index": "1",
//            "ayas": "7",
//            "start": "0",
//            "name": "الفاتحة",
//            "tname": "Al-Faatiha",
//            "ename": "The Opening",
//            "type": "مكيّة",
//            "order": "5",
//            "rukus": "1",
//            "page": 1,
//            "part": 0
//        },...],
//"parts": [{
//           "sora": 1,
//           "aya": 1,
//           "page": 1
//      	 }, ...],
//"pages": [{
//           "soura": 1,
//           "startAya": 1,
//           "endAya": 7,
//           "endSoura": 1,
//           "part": 0,
//           "hizb": "0_i"
//       }, ...]
//"recitations": [{
//            "subfolder": "Abdul_Basit_Murattal_192kbps",
//            "name": "Abdul Basit Murattal",
//            "arname": "عبد الباسط عبد الصمد",
//            "bitrate": "192kbps",
//            "type": "Murattal"
//            }, ... ]

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
// back to Home and Reload app 
$$(document).on('click', '.index-link', function () {
    localStorage['reloadindex'] = true;
    mainView.router.back({
        url: mainView.history[0],
        force: true
    });
    document.location.reload();
    //  mainView.router.loadPage('index.html');
});