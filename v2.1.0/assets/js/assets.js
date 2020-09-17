//var db,storeDB,fileName = 'quran.db'; 
// 
//function onLoad(){
//     document.addEventListener("deviceready", onDeviceReady, false);
// }
//
//function onDeviceReady(){
//    console.log('DeviceReady'); 
//    storeDB = cordova.file.applicationStorageDirectory+'databases/';
//    window.resolveLocalFileSystemURL(storeDB +fileName, function(db){
//        openDb();
//    },function(e){
//            var assetURL = cordova.file.applicationDirectory + 'www/' + fileName;
//            var fileTransfer = new FileTransfer();
//            fileTransfer.download(assetURL, storeDB + fileName, 
//            function(entry) {
//                openDb(); 
//            },error); 
//    }); 
//}
// 
//function successDB(db){} 
//function error(error){}
//
//
////------------------  OPEN  DATABASE  -------------------------
////-------------------------------------------------------------
//function openDb(){
//    db = window.sqlitePlugin.openDatabase({name: "quran.db" , location: 'default'},successDB,error);
//}
// 
// 
// 
//  
////var db;  // cordova.file.applicationStorageDirectory 
////function onLoad() {
////     document.addEventListener("deviceready", onDeviceReady, false);
//// }
////-------------------------------------------------------------
////-------------------------------------------------------------
//// function onDeviceReady() {
////     
////     document.addEventListener("backbutton", onBackKeyDown, false);
//// }
////
//////-------------------------------------------------------------
//////-------------------------------------------------------------
// function onBackKeyDown(e) {
//     if (app.mainView.activePage.name == 'index' && confirm('إغلاق التطبيق')) {
//         navigator.app.exitApp();
//     } else {
//         app.mainView.router.back();
//     }
// }
//////-------------------------------------------------------------
//////-------------------------------------------------------------
////function error(err){
////    console.log('ERROR: ' + JSON.stringify(err));
////}
//////-------------------------------------------------------------
//////-------------------------------------------------------------
////function successDB(db){
////    db.transaction(function(tx){
////        var executeQuery = 'CREATE TABLE IF NOT EXISTS arabic_text (sura integer ,aya integer,text text,primary key(sura , aya))';
////        tx.executeSql(executeQuery,[],function(tx,res){
////            console.log('Table created successfully');
////        },function(err){
////            console.log('Create Table Failed:',err);
////        }); 
////    },error); 
////}
//////------------------------------------------------------------- 
//////-------------------------------------------------------------
////var time = setInterval(function(){
////    if(quranText){
//        $$.each(quranText ,function(a,v){
//                     addItem(v.s,v.a,v.t);
//        })
////        clearInterval(time);
////    } 
////},300);
////
//////--------------------  ADD ITEM ------------------------------ 
//////-------------------------------------------------------------
//function addItem(sura, aya, text) {
//    db.transaction(function (tx) {
//        var query = "INSERT INTO arabic_text (sura, aya , text) VALUES (?,?,?)";
//        tx.executeSql(query, [sura, aya, text], function(tx, res) {
//            console.log("insertId: " + res.insertId + " -- probably 1");
//            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
//        }, function(tx, error) {});
//    }, function(error) {});
//}
//////--------------------  GET ITEM ------------------------------ 
//////-------------------------------------------------------------
////function getData(sura,aya) {
//    db.transaction(function (tx) {
//        var query = "SELECT rowid , * FROM arabic_text WHERE sura =? AND aya =?";
//        tx.executeSql(query, [sura,aya], function (tx, resultSet) {
//            for(var x = 0; x < resultSet.rows.length; x++) {
//               return  resultSet.rows.item(x)
//            }
//        }, function (tx, error) {});
//    }, function (error) {});
//}
////
//
///*
//var t = '%' + 'الله' + '%';
//var z = db.transaction(function(tx){
//        var executeQuery = 'SELECT count(*) FROM arabic_text where text2 like(?) ';
//        tx.executeSql(executeQuery, [t],function(tx,res){
//            console.log(' successfully'); 
//           for(var x = 0; x < res.rows.length; x++) {
//               console.log( res.rows.item(x))
//            }
//
//        },function(err){
//            console.log('Failed:',err);
//        }); 
//    },function(a){console.log(a.message);}); 
//    
//    
//    
//    var t = '%' + 'الله' + '%';
//var z = db.transaction(function(tx){
//        var executeQuery = 'SELECT * FROM arabic_text where text2 like(?) limit 10,20';
//        tx.executeSql(executeQuery, [t],function(tx,res){
//            console.log(' successfully'); 
//           for(var x = 0; x < res.rows.length; x++) {
//               console.log( res.rows.item(x))
//            }
//
//        },function(err){
//            console.log('Failed:',err);
//        }); 
//    },function(a){console.log(a.message);}); 
//*/
////
////
//// function gData() {
////    db.transaction(function (tx) {
////        var query = "SELECT rowid , * FROM arabic_text WHERE text like(%ذَٰلِكَ%)";
////        tx.executeSql(query, [], function (tx, resultSet) {
////            for(var x = 0; x < resultSet.rows.length; x++) {
////               console.log(esultSet.rows.item(x));
////            }
////        }, function (tx, error) {});
////    }, function (error) {});
////}
////  
////
//////-----------------------------------------------------------------***
//////var mapp = {
//////    data : 'Almorshed_Data',
//////    folder : ''
//////};
//////var store;
////////-------------------------------------------------------------
////////-------------------------------------------------------------
////////-------------------------------------------------------------
//////
//////
////////-------------------------------------------------------------
////////-------------------------------------------------------------
////////-------------------------------------------------------------
//////
//////
////// function onDeviceReady() {
//////     
//////     document.addEventListener("online", checkConnection, false);
//////     document.addEventListener("offline", checkConnection, false);
//////     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
//////    db = window.sqlitePlugin.openDatabase({name: "quran_text.db" , location: 'default'},successcb,errorcb);
//////   
////// }
//////function gotFS(fileSystem) {
//////  //  console.log(fileSystem);
//////   fileSystem.root.getDirectory( mapp.data, {create: true, exclusive: false},gotDir, fail);
//////}
////// function gotDir(dirEntry) {
////// //   console.log(dirEntry);
//////}
//////function fail(error){
//////  //  console.log(error);
//////}
//////
//////
////////-------------------------------------------------------------
////////-------------------------------------------------------------
//////function createFolder(){
//////
//////} 
//////function getFSFail(evt) {
//////    console.log(evt.target.error.code);
//////}
////////-------------------------------------------------------------
////////-------------------------------------------------------------
////////-------------------------------------------------------------
//////
//////
////// 
////// 
//////function appStart(){
//////    console.log('obj');
//////}
//////
//////
//////  function checkConnection() {
//////    var networkState = navigator.connection.type;
//////    var activePage   = mainView.activePage.name;
//////    var states = {};
//////    states[Connection.UNKNOWN]  = 'Unknown connection';
//////    states[Connection.ETHERNET] = 'Ethernet connection';
//////    states[Connection.WIFI]     = 'WiFi connection';
//////    states[Connection.CELL_2G]  = 'Cell 2G connection';
//////    states[Connection.CELL_3G]  = 'Cell 3G connection';
//////    states[Connection.CELL_4G]  = 'Cell 4G connection';
//////    states[Connection.CELL]     = 'Cell generic connection';
//////    states[Connection.NONE]     = 'No network connection';
//////
//////
//////      if(networkState == Connection.NONE){
//////          if(activePage == "reciterPage"){
//////               $$.each($$('.reciter_block').find('li'),function(i,v){
//////                    var item = $$(v).find('.item-info');
//////                    var downloaded = item.data('d');
//////                    if(downloaded == 'false'){
//////                        item.find('.button').addClass('disabled');
//////                    }
//////                });
//////          }
//////      }
//////      if(networkState != Connection.NONE){
//////           if(activePage == "reciterPage"){
//////               $$.each($$('.reciter_block').find('li'),function(i,v){
//////                    var item = $$(v).find('.item-info');
//////                    var downloaded = item.data('d');
//////                    if(downloaded == 'false'){
//////                        item.find('.button').removeClass('disabled');
//////                    }
//////                });
//////          }
//////      }
//////}
////
/////*
////
//// 
////            var fileObject;
////            document.addEventListener("deviceready", onDeviceReady, true);
////            function onDeviceReady() {
////            window.requestFileSystem(LocalFileSystem.PERSISTENT,0,  onFileSystemSuccess, onError);
////            }
////
////function onFileSystemSuccess(fs) {
////                //Create Files
////                fs.root.getDirectory("someDirectory",
////                { create: true, exclusive: false },
////                null,onError);
////                fs.root.getFile("pgtest.txt",
////                { create: true, exclusive: false },
////                null,onError);
////                var dirReader = fs.root.createReader();
////                // Get a list of all the entries in the directory
////                dirReader.readEntries(success,onError);
////            }
////
//////Create List
////            function success(entries) {
////                var i;
////                var objectType;
////
////
////for (i=0; i < entries.length; i++) {
////                    if(entries[i].isDirectory == true) {
////                        objectType = 'Directory'; 
////                    } else {
////                        objectType = 'File';
////                    }
////                    $('#dirList').append('<li>n
////                                    <h3>' + entries[i].name + '</h3>n
////                                    <p>' + entries[i].toURI() + '</p>n
////                     <p class="ui-li-aside">Type:<strong>' + objectType + '</strong></p>n
////                      </li>');
////                }
////                $('#dirList').listview("refresh");
////            }
////
////  
////            //Error
////            function onError(error) {
////                alert("Failed to list directory contents: " + error.code);
////            }
////   
////
////*/
