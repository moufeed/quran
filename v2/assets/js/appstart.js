var db, storeDB, dbName = 'quran.db',
	folder = 'Almorshed';
//---------------------------------------------------------------------------
//---------------------   onLoad ------------------------------------- 
//---------------------------------------------------------------------------
var queries = {
	"g_aya": "SELECT  *,rowid AS id FROM arabic_text WHERE sura =? AND aya =?",
	"g_sura": "SELECT  *,rowid AS id FROM arabic_text WHERE sura =?",
	"g_page": "SELECT  *,rowid AS id FROM arabic_text WHERE page  =?",
	"g_text": "SELECT  *,rowid AS id FROM arabic_text WHERE text2 like(?)",
	"g_tafsir": "SELECT  *,rowid AS id  FROM tafsir_moysar WHERE sura =? AND aya =?",
	"g_a_words": "SELECT  *,rowid AS id  FROM q_words WHERE sura =? AND aya =?",
	"g_a_word": "SELECT  *,rowid AS id  FROM q_words WHERE sura =? AND aya =? AND idx =?",
}

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}
//---------------------------------------------------------------------------
//---------------------   onDeviceReady ------------------------------------- 
//---------------------------------------------------------------------------
function onDeviceReady() {

	// StatusBar gloubal object from cordova-plugin-statusbar
	//hide on start
	StatusBar.hide();
	//--------
	FastClick.attach(document.body);

	//  cordova.plugins.ZoomControl.ZoomControl("true");
	// 	 // enabling built in zoom control
	//  cordova.plugins.ZoomControl.setBuiltInZoomControls("true");
	//  // enabling display zoom control
	//  cordova.plugins.ZoomControl.setDisplayZoomControls("false"); 

	document.addEventListener("backbutton", onBackKeyDown, false);
	//---------------------------------------------------------------------------
	// Check Almorshed Database exists and open it
	//---------------------------------------------------------------------------
	storeDB = cordova.file.applicationStorageDirectory + 'databases/';
	window.resolveLocalFileSystemURL(storeDB + dbName, function (db) {
		openDb();
	}, function (e) {
		// Transfer db to phone  and open it
		var assetURL = cordova.file.applicationDirectory + 'www/' + dbName;
		var fileTransfer = new FileTransfer();
		fileTransfer.download(assetURL, storeDB + dbName,
			function (entry) {
				openDb();
			},
			function (error) {
				console.log(error.message);
			});
	});
	//---------------------------------------------------------------------------
	// Check Almorshed Folder exists and create it
	//---------------------------------------------------------------------------
	var dir = cordova.file.externalRootDirectory + folder
	window.resolveLocalFileSystemURL(dir, function (dirEntry) {
		var directoryReader = dirEntry.createReader(); //success
	}, function (e) {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, createFolder, function (error) {
			console.log(error)
		});
	});
}




//---------------------------------------------------------------------------
//---------------------   createFolder -------------------------------------
//---------------------------------------------------------------------------
function createFolder(fs) {

	fs.root.getDirectory(folder + "/", {
		create: true,
		exclusive: true
	}, function (success) {
		console.log(success);
	}, function (error) {
		console.log(error);
	});
}
//---------------------------------------------------------------------------
//---------------------   open Database ------------------------------------- 
//--------------------------------------------------------------------------- 
function openDb() {
	db = window.sqlitePlugin.openDatabase({
			name: "quran.db",
			location: 'default'
		}, function (db) {
			$$.continueRead();
		},
		function (error) {
			console.log(error.message);
		});
}
//---------------------------------------------------------------------------
//---------------------   Close Database-------------------------------------
//---------------------------------------------------------------------------
function closeDB() {
	db.close(function () {
		//  console.log("DB closed!");
	}, function (error) {
		console.log("Error closing DB:" + error.message);
	});
}
//---------------------------------------------------------------------------
//---------------------  Back Key Down ------------------------------------- 
//---------------------------------------------------------------------------
function onBackKeyDown(e) {
	if ($$('.picker-modal.modal-in').length > 0)
		app.closeModal($$('.picker-modal.modal-in'));
	else if ($$('.popover.modal-in').length > 0)
		app.closeModal($$('.popover.modal-in'));
	else if ($$('.notification-item').length > 0) {
		$$.removeWords();
	} else if ($$('.tooltip_container_top').length > 0) {
		$$('.tooltip_container_top').remove();
		$$('.highlight').removeClass("highlight");
	} else if ($$('.highlight').length > 0)
		$$('.highlight').removeClass("highlight");
	else if ($$('.popup.modal-in').length > 0)
		app.closeModal($$('.popup.modal-in'));
	else if (document.getElementById('panel').getAttribute('class').includes('active')) {
		app.closePanel()
	} else if (app.mainView.activePage.name == 'index' && confirm('هل تريد إغلاق التطبيق؟', 'إغلاق التطبيق')) {
		navigator.app.exitApp();
	} else {
		app.mainView.router.back();
	}
}
//---------------------------------------------------------------------------
//---------------------  slect From Database --------------------------------
//---------------------------------------------------------------------------

function slectFromDB(query, request) {
	var returnedData;
	return new Promise(function (resolve, reject) {
		db.transaction(function (tx) {
			tx.executeSql(query, request, function (tx, resultSet) {
				returnedData = resultSet;
			}, function (tx, error) {
				console.log('SELECT Error: ' + error.message);
			});
		}, function (error) {
			console.log('transaction error: ' + error.message);
			reject(error);
		}, function () {
			resolve(returnedData)
		});
	});
}