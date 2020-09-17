var db,storeDB , dbName = 'quran.db', folder = 'Almorshed';
//---------------------------------------------------------------------------
//---------------------   onLoad ------------------------------------- 
//---------------------------------------------------------------------------
var queries = {
    "g_aya"    : "SELECT  *,rowid AS id FROM arabic_text WHERE sura =? AND aya =?",
    "g_sura"   : "SELECT  *,rowid AS id FROM arabic_text WHERE sura =?",
    "g_page"   : "SELECT  *,rowid AS id FROM arabic_text WHERE page  =?",
    "g_text"   : "SELECT  *,rowid AS id FROM arabic_text WHERE text2 like(?)",
    "g_tafsir" : "SELECT  *,rowid as id  FROM tafsir_moysar WHERE sura =? AND aya =?"
}



function onLoad(){ 
  document.addEventListener("deviceready", onDeviceReady, false);
}
//---------------------------------------------------------------------------
//---------------------   onDeviceReady ------------------------------------- 
//---------------------------------------------------------------------------
function onDeviceReady(){
    document.addEventListener("backbutton", onBackKeyDown, false);
    storeDB = cordova.file.applicationStorageDirectory + 'databases/';
    window.resolveLocalFileSystemURL(storeDB + dbName, function(db){
        openDb();
    },function(e){
         
            var assetURL = cordova.file.applicationDirectory + 'www/' + dbName;
            var fileTransfer = new FileTransfer();
            fileTransfer.download(assetURL, storeDB + dbName,  
            function(entry) {
                openDb(); 
            },function(error){
               console.log(error.message);
            }); 
    }); 

    var dir = cordova.file.externalRootDirectory + folder
    window.resolveLocalFileSystemURL(dir,function(dirEntry){
        var directoryReader = dirEntry.createReader(); //success
  //  directoryReader.readEntries(success,function(e){console.log(e)});

    },function(e){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,createFolder,function(error){console.log(error)});
    });
}  


//---------------------------------------------------------------------------
//---------------------   openDb -------------------------------------
//---------------------------------------------------------------------------
function createFolder(fs){
    var fr =    folder +"/"
    fs.root.getDirectory( fr , {create: true,exclusive: true},function(success){
        console.log(success);
    },function(error){
        console.log(error);
    });
}
//---------------------------------------------------------------------------
//---------------------   openDb ------------------------------------- 
//--------------------------------------------------------------------------- 
function openDb(){
    db = window.sqlitePlugin.openDatabase({name: "quran.db" , location: 'default'},function(db){},function(error){
         console.log(error.message);
    });
}
//---------------------------------------------------------------------------
//---------------------   CloseDb -------------------------------------
//---------------------------------------------------------------------------
function closeDB() {
    db.close(function () {
      //  console.log("DB closed!");
    }, function (error) {
        console.log("Error closing DB:" + error.message);
    });
}
//---------------------------------------------------------------------------
//---------------------   onBackKeyDown ------------------------------------- 
//---------------------------------------------------------------------------
 function onBackKeyDown(e) {
     if (app.mainView.activePage.name == 'index' && confirm('إغلاق التطبيق')) {
         navigator.app.exitApp();
     } else {
         app.mainView.router.back();
     }
 }



