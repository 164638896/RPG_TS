
var scripts;
var scriptsloaded = false;
var bLayaInitDone = false;

function loadMainGame()
{
	console.log("do loadMainGame");
	if (!scriptsloaded)
	{
		var sizeJS = 10;
		
		scripts = [];
		scripts.push({path:"lylib/zlib.min.js?v=0.3", size:sizeJS, log:"zlib.min loaded"});
		scripts.push({path:"lylib/jszip.min.js?v=0.3", size:sizeJS, log:"jszip.min loaded"});
		scripts.push({path:"lylib/b3core.min.js?v=0.3", size:sizeJS, log:"b3core.min loaded"});
		scripts.push({path:"lylib/ZipUtil.js?v=0.3", size:sizeJS, log:"ZipUtil loaded"});
		scripts.push({path:"lylib/CfgCache.js?v=0.3", size:sizeJS, log:"CfgCache loaded"});
		scripts.push({path:"lylib/NetPacket.js?v=0.3", size:sizeJS, log:"NetPacket loaded"});
		scripts.push({path:"lylib/Connection.js?v=0.3", size:sizeJS, log:"Connection loaded"});
		scripts.push({path:"Main.max.js?v=0.3", size:sizeJS, log:"Main.max loaded"});
		
		loadNext();
		
		scriptsloaded = true;
	}
}

function loadNext()
{
	if(!scripts.length)
	{
		loadDone();
		return;
	}
	
	var toLoad = scripts.shift();
	loadOne(toLoad.path, toLoad.size, toLoad.log, function()
	{
		loadNext();
	});
}

function loadOne(path, size, log, onload)
{
	var st = Date.now();
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", path);
	document.body.appendChild(script);
	script.onload = function()
	{
		//sendLog(log, (Date.now() - st));
		//updateProgress(size);
		onload();
	};
}

function loadDone()
{
	console.log('loadDone');
	Main.onGameReady = onGameReady;
}

// 游戏加载完成
function onGameReady()
{
	console.log('onGameReady');
	bLayaInitDone = true;
	checkGameReady();
}

function checkGameReady()
{
	console.log('checkGameReady');
	if(loadingWidth >= 525 && bLayaInitDone)
	{
		document.getElementById("contain").style.display = "none";	
	}
}