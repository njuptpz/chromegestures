/** READ THIS BEFORE EDITING **/
//  Here you can create your own gestures. For the moment, how this works is that you create
//  a Gesture and an Action. 
//
//	 _____________
//   _____/ Terminology |___________________________________________________________________________________________________________________________
//  |																	       |
//  |    Moves are either 'up', 'down', 'left', 'right' or 'click'.										 |
//  |																	       |
//  |    A Gesture is an array of Moves e.g.: myNewGesture = ["up","down","left"].								  |
//  |	- You should never have a Gesture that has two identical consecutive moves. e.g.: ["left","right","right"] is not a valid Gesture.     |
//  |																	       |
//  |    An Action is a function that takes no parameters and has no return value. e.g.: myNewAction = function(){ alert("OMG!") }		  |
//  |																	       |
//  |    You can then configure ChromeGesture by modifying the myGestures array.								    |
//  |    myGestures is an array where the index is your Gesture and the data is your Action. e.g.: myGestures[myNewGesture] = myNewAction;	  |
//  |       - Do not use the same Gesture for two Actions.											  |
//  |																	       |
//   ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
// 
//  AUTHORS: Kyrax, Waha, Kryptyx
//
// In case of doubt, drop by the forums on chromeplugins.org and ask. We'll answer ;)

var newTabGesture = {
	gesture: DOWN+RIGHT,
	action: newTabAction,
	help: "Open a new tab. You can set the homepage in options.",
	start: [20,20],
	offsets: [60,60]
}; addGesture(newTabGesture);

var blankTabGesture = {
	gesture: DOWN+RIGHT+DOWN,
	action: blankTabAction,
	help: "Open a blank tab.",
	start: [35,20],
	offsets: [30,30,30]
}; addGesture(blankTabGesture);

var closeTabGesture = {
	gesture: DOWN+LEFT,
	action: closeTabAction,
	help: "Closes the current tab.",
	start: [80,20],
	offsets: [60,60]
}; addGesture(closeTabGesture);

var historyBackGesture = {
	gesture: LEFT,
	action: historyBackAction,
	help: "Goes Back to the last visited page.",
	start: [80,50],
	offsets: [60]
}; addGesture(historyBackGesture);

var historyForwardGesture = {
	gesture: RIGHT,
	action: historyForwardAction,
	help: "Goes Forward to the next visited page.",
	start: [20,50],
	offsets: [60]
}; addGesture(historyForwardGesture);

var hidePageGesture = {
	gesture: CLICK+CLICK,
	action: hidePageAction,
	help: "Hide the current page.<br/>Use again to display it.",
	start: [50,50],
	offsets: [10,6]
}; addGesture(hidePageGesture);

var refreshGesture = {
	gesture: [RIGHT+DOWN+LEFT+UP+RIGHT, UP+RIGHT+DOWN+LEFT+UP, UP+RIGHT+DOWN+LEFT+UP+RIGHT],
	action: refreshAction,
	help: "Refreshes the current page.<br/>Can also start with an upward motion instead of right.",
	start: [20,20],
	offsets: [60,60,60,50,50]
}; addGesture(refreshGesture);

var helpGesture = {
	gesture: UP+RIGHT+DOWN+LEFT+DOWN,
	action: helpAction,
	help: "Opens the Chrome Gestures help file (this).",
	start: [20,50],
	offsets: [30,60,30,30,30]
}; addGesture(helpGesture);

var optionsGesture = {
	gesture: UP+DOWN,
	action: optionsAction,
	help: "Opens the Chrome Gestures options.",
	start: [50,70],
	offsets: [50,60]
}; addGesture(optionsGesture);

var searchGesture = {
	gesture: UP,
	action: searchAction,
	help: "Search the selected text.",
	start: [50,80],
	offsets: [60]
}; addGesture(searchGesture);

var newTabURL = "http://google.com";
function  newTabAction() {
	chrome.windows.getCurrent(function(win){
		chrome.tabs.create({url:newTabURL,windowId:win.id,selected:true},function(){});
	});
}

function  blankTabAction() {
	chrome.windows.getCurrent(function(win){
		chrome.tabs.create({url:"about:blank",windowId:win.id,selected:true},function(){});
	});
}

function closeTabAction() {
	chrome.windows.getCurrent(function(win){
		chrome.tabs.getSelected(win.id,function(tab){
			chrome.tabs.remove(tab.id);
		});
	});
}

function historyBackAction() {
    return "history.back();";
}

function historyForwardAction() {
    return "history.forward();";
}

function refreshAction() {
	chrome.windows.getCurrent(function(win){
		chrome.tabs.getSelected(win.id,function(tab){
			chrome.tabs.update(tab.id,{url:tab.url,selected:true},function(){});
		});
	});
}

var isHiding = false;
var bgImage = null;
function hidePageAction() {
	if(isHiding){
		return 'document.body.style.backgroundImage = bgImage;\
		document.body.style.display = "block";\
		isHiding = false;'
	} else {
		return 'document.body.style.display = "none";\
		bgImage = document.body.style.backgroundImage;\
		document.body.style.backgroundImage = "none";\
		isHiding = true;'
	}
}

function optionsAction(){
	window.open("options.html","_blank",
		"directories=no,height=210,width=500,left=10,top=10,location=no,"+
		"menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
}

function helpAction(){
	var win = window.open("about:blank","_blank",
		"directories=no,height=500,width=500,left=10,top=10,location=no,"+
		"menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
	var helps = "";
	win.document.write("<html><head><title>Chrome Gestures - Help Page</title>"+
		"<style type=\"text/css\">canvas { border-right: 2px solid #000000; }</style>"+
		"</head><body><ul><li>In the image, gestures start at the red dot.</li>"+
		"<li>Circles represent clicks.</li></ul>"+
		"<table id=\"tbl\" style=\"border:2px solid #000000;width:100%;\"></table></body></html>");
	var tbl = win.document.getElementById("tbl");
	for(var i in gesturesHelp){
		// [Waha] Add entry to file
		var g = "",len=gesturesHelp[i].g.length;
		for(var j=0;j<len;j++){
			g += gesturesHelp[i].g[j].substr(0,1).toUpperCase()+gesturesHelp[i].g[j].substr(1);
			if(j+1 < len)g += " -> ";
		}
		var moar = "";
		if(i != 0)moar = "border-top:2px solid #000000;";
		tbl.innerHTML += "<tr><td rowspan=\"2\" style=\"width:100px\"><canvas style=\""+moar+"\" id=\"ges"+i+"\" width=\"100\" height=\"100\" /></td>"+
			"<td style=\"height:76px;vertical-align:top;"+moar+"\">"+gesturesHelp[i].d+"</td></tr>"+
			"<tr><td style=\"border-top:2px solid #000000;height:20px;\"><b>"+g+"</b></td></tr>";
	}
	/* [Waha] Aw come on..two seperate loops? really? D:
	I had to do this cause adjusting the table's innerHTML was removing the canvas content...*/
	for(var i in gesturesHelp){
		//Draw gesture
		var tc = win.document.getElementById("ges"+i).getContext('2d');
		tc.beginPath();
		var lastx=gesturesHelp[i].x,lasty=gesturesHelp[i].y;
		tc.fillStyle = "red";
		tc.arc(lastx,lasty,2,0,Math.PI*2,true);
		tc.fill();
		tc.beginPath();
		tc.moveTo(lastx,lasty);
		for(var j in gesturesHelp[i].pnts){
			var nx=gesturesHelp[i].pnts[j][0],ny=gesturesHelp[i].pnts[j][1];
			//var c = "black"; if(j == 0)c = "red";
			if(nx == "c"){
				tc.arc(lastx,lasty,ny,0,Math.PI*2,true);
			} else {
				tc.lineTo(nx,ny);
				lastx = nx; lasty = ny;
			}
		}
		tc.stroke();
	}
}
function isURL(str) {
	var regexp = /(http:\/\/|w{3}\.)(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(str);
}
function searchAction()
{
	var selectedTxt = '';
	if (window.getSelection){
		selectedTxt = window.getSelection().toString();
	}
	else if (document.getSelection){
		selectedTxt = document.getSelection().toString();
	}
	else if (document.selection){
		selectedTxt = document.selection.createRange().text.toString();
	}
	if (selectedTxt!=''){
		var toOpen = "";
		if (isURL(selectedTxt)){
			selectedTxt=selectedTxt.replace(/^http:\/\//, "");
			toOpen = "http://"+selectedTxt;
		} else {
			var searchString=escape(selectedTxt.replace(/ /g, "+"));
			toOpen = "http://www.google.com/search?q="+searchString;
		}
		chrome.windows.getCurrent(function(win){
			chrome.tabs.create({url:toOpen,windowId:win.id,selected:true},function(){});
		});
	}
}