// ======================================================== //
//	Script: ChromeGestures.user.js
//	Authors: Kyrax, Waha, Kryptyx
//	Website: http://code.google.com/p/chromegestures
// ======================================================== //

var us = (typeof(chrome.extension) == "undefined") // DO NOT EDIT
var gesturesHelp = new Array(); // DO NOT EDIT
var myGestures = new Array(); // DO NOT EDIT
var isHiding = false; // DO NOT EDIT
var bgImage = null; // DO NOT EDIT

var popupLoader = false; // Load options through popup window, true or false. If false options will not load.

// [Kryptyx] Revamped the way we define gestures, to define a new gesture simply call the newGesture function with the correct paramaters.
// newGesture("moves", action, "description", "coords");
// Moves = The pattern needed to trigger the gesture, seperate each move with a space. (ex. "left right click down")
// Action = The action that the gesture triggers, do not use quotes.
// Description = The description of the gesture for the help page, this is optional.
// Coords = The coords to draw the gesture on the help page, this is optional.

newGesture("down right", newTab, "Open a new tab. You can set the homepage in options.", "20,20,60,60");
newGesture("down right down", blankTab, "Open a blank tab.", "35,20,30,30,30");
newGesture("down left", closeTab, "Closes the current tab.", "80,20,60,60");
newGesture("left", historyBack, "Goes Back to the last visited page.", "80,50,60");
newGesture("right", historyForward, "Goes Forward to the next visited page.", "20,50,60");
newGesture("click click", hidePage, "Hide the current page.<br/>Use again to display it.", "50,50,10,6");
newGesture("right down left up right", refreshPage, "Refreshes the current page.", "20,20,60,60,60,50,50");
newGesture("up right down left up", refreshPage);
newGesture("up right down left up right", refreshPage);
newGesture("up right down left down", helpBox, "Opens the Chrome Gestures help file (this).", "20,50,30,60,30,30,30");
if(!us)newGesture("up down", optionsBox, "Opens the Chrome Gestures options.", "50,70,50,60");
newGesture("up", newSearch, "Search the selected text.", "50,80,60");
newGesture("left click right", runTest);

var newTabURL = "http://google.com"; // Default newTab page, feel free to change.

// DEFAULT ACTIONS

function  newTab() {
	window.open(newTabURL);
}

function  blankTab() {
	window.open("about:blank");
}

function closeTab() {
	window.open('', '_self');
    self.close();
}

function historyBack() {
    history.back();
}

function historyForward() {
    history.forward();
}

function refreshPage() {
	location.reload();
}

function hidePage() {
	if(isHiding){
		document.body.style.backgroundImage = bgImage;
		document.body.style.display = "block";
		isHiding = false;
	} else {
		document.body.style.display = "none";
		bgImage = document.body.style.backgroundImage;
		document.body.style.backgroundImage = "none";
		isHiding = true;
	}
}

function optionsBox() {
	window.open("chrome-extension://"+chrome.extension.id_+"/options.html","_blank",
		"directories=no,height=210,width=500,left=10,top=10,location=no,"+
		"menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
}

function helpBox() {
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
	/* [Waha] Canvas Hack */
	for(var i in gesturesHelp){
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

function newSearch(){
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
	if (selectedTxt==''){
		return;
	} else {
		if (isURL(selectedTxt)){
			selectedTxt=selectedTxt.replace(/^http:\/\//, "");
			window.open("http://"+selectedTxt);
		} else {
			var searchString=selectedTxt.replace(/ /g, "+");
			window.open("http://www.google.com/search?q="+searchString);
		}
	}
}

function runTest(){
	alert(ChromeGesture.MINIMUM_DELTAY);
}

// ============ UNLESS YOU KNOW WHAT YOU ARE DOING, DON'T EDIT PAST HERE ============ //

var clickPast;
var clickNow;
var clickDiff;
var wind;
var alpha=1.0;
var logging = false;

function newGesture(moves, action, description, coords){
	moves=moves.replace(/ /g, ",");
	moves=moves.split(",");
	if (arguments.length > 2) {
		registerForHelp(moves, description, coords);
	}
	return myGestures[moves] = action;
}

function log(txt){if(logging){console.log(txt);}}
function warn(txt){if(logging){console.warn(txt);}}
function error(txt){if(logging){console.error(txt);}}
function debug(txt){if(logging){console.debug(txt);}}

function registerForHelp(gestures,desc,coords){

	coords=coords.split(",");
	var startx=coords[0];
	var starty=coords[1];
	
	if(coords.length-2 != gestures.length){
		alert("Error registering help for \""+gestures+"\": Not enough offsets given.");
		return;
	}
	
	var i = gesturesHelp.length;
	gesturesHelp[i] = new Object();
	gesturesHelp[i].d = desc;
	gesturesHelp[i].g = gestures;
	gesturesHelp[i].x = startx;
	gesturesHelp[i].y = starty;
	gesturesHelp[i].pnts = new Array();
	for(var j=0;j<gestures.length;j++){
		if(gestures[j] == "click")gesturesHelp[i].pnts[j] = new Array("c",coords[j+2]);
		else{
			if(gestures[j] == "left")startx -= coords[j+2];
			else if(gestures[j] == "right")startx += coords[j+2];
			else if(gestures[j] == "up")starty -= coords[j+2];
			else if(gestures[j] == "down")starty += coords[j+2];
			gesturesHelp[i].pnts[j] = new Array(startx,starty);
		}
	}
}


function getData(ntpurl,delta,captime,clickto){
	newTabURL = ntpurl;
	ChromeGesture.MINIMUM_DELTAY = delta;
	ChromeGesture.MINIMUM_DELTAX = delta;
	ChromeGesture.DELAY_BETWEEN_CAPTURES = captime;
	ChromeGesture.CLICK_TIMEOUT = clickto;
	if(popupLoader && contentWindow.CHROMEGESTURES_loadData){
		wind.close();
		contentWindow.CHROMEGESTURES_loadData = false
		wind = null;
		
	}
}
if(!us)contentWindow.CHROMEGESTURES_setData = getData;

// LOAD SAVED DATA

if(!us){
	if(popupLoader){
		contentWindow.CHROMEGESTURES_loadData = true;
		wind = window.open("chrome-extension://"+chrome.extension.id_+"/options.html","_blank",
			"directories=no,height=1,width=1,left=-100,top=-100,location=no,"+
			"menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
	}
	/*var port = chrome.extension.connect();
	port.onMessage.addListener(function(arr){
		getData(arr[0],arr[1],arr[2],arr[3]);
	});*/
}

function showGesture(move){
	if (!document.getElementById("ChromeGestureBox")){
		gestureDiv = document.createElement('div');
		gestureDiv.id = "ChromeGestureBox";
		gestureDiv.className = "gesture_"+move;
		document.body.appendChild(gestureDiv);
	} else {
		document.getElementById("ChromeGestureBox").className="gesture_"+move;
	}
}

function hideGesture(){
	if(alpha>0){
		alpha-=.1;
		document.getElementById("ChromeGestureBox").style.opacity=alpha;
		setTimeout(function(){hideGesture();},40); 
	} else {
		alpha=1.0;
		document.getElementById("ChromeGestureBox").style.opacity=alpha;
		document.getElementById("ChromeGestureBox").className="gesture_hide";
	}
}

var ChromeGesture = {
    // SETTINGS
    MINIMUM_DELTAY : 10,			// tweak this - Minimum Y distance that needs to be travelled between 2 captures for a move to be detected
    MINIMUM_DELTAX : 10,			// tweak this - Same for X
    DELAY_BETWEEN_CAPTURES : 10, 	// tweak this - Time between captures
	CLICK_TIMEOUT : 1000,			// tweak this - This is the timeout period between clicks (1000 = 1 second)
	
	// GLOBALS
    LEFT_CLICK : 1,					// Number associated with Left Click
    RIGHT_CLICK : 3,				// Number associated with Right Click
    pastX : 0,
    pastY : 0,
    currentGesture : [],
    pastTime : new Date(),

	// FUNCTIONS
    captureGesture : function(event) {
        
        var currentTime = new Date();
        var diff = currentTime.getTime() - ChromeGesture.pastTime.getTime();
        
        var currentX = event.clientX;
        var currentY = event.clientY;
        
        ChromeGesture.printLine(currentX, currentY);
		
        if( diff < ChromeGesture.DELAY_BETWEEN_CAPTURES ){
            return;
        } else {
            
            var deltaX = currentX - ChromeGesture.pastX;
            var deltaY = currentY - ChromeGesture.pastY;
            
            ChromeGesture.pastX = currentX;
            ChromeGesture.pastY = currentY;
            
            var move = ChromeGesture.determineMove(deltaX, deltaY);
            
            if( move != null ){
                if( move != ChromeGesture.currentGesture[ChromeGesture.currentGesture.length - 1]){
					showGesture(move);
					clickPast = null;
                    ChromeGesture.currentGesture.push(move);
                }
            }            
            ChromeGesture.pastTime = currentTime;
        }
    },
	
    determineMove : function(deltaX, deltaY) {
        var absDeltaX = Math.abs(deltaX);
        var absDeltaY = Math.abs(deltaY);
        if( absDeltaX < ChromeGesture.MINIMUM_DELTAX && absDeltaY < ChromeGesture.MINIMUM_DELTAY ){ 
			return null;						
        } else {
			document.oncontextmenu = function(){return false;} // [Kryptyx] Gesture detected, hide the context menu.
		}
        
        if( absDeltaY > absDeltaX ){
            if( deltaY < 0 ){
                return "up"
            } else {
                return "down"
            }
        } else {
            if( deltaX > 0 ){
                return "right"
            } else {
                return "left"
            }
        }
    },

    mouseButtonDown : function(event){
        if (event.which == ChromeGesture.RIGHT_CLICK){        
        // [Kyrax] TODO: Don't stop propagation if time between mouseup / mousedown is < CONSTANT        
            document.oncontextmenu = function(){return true;} // [Kryptyx] Right-Click detected, enable the context menu.   
            ChromeGesture.pastX = event.clientX;
            ChromeGesture.pastY = event.clientY;
			ChromeGesture.lfGesture = true;
            window.addEventListener("mousemove", ChromeGesture.captureGesture);			
        }
    },

    mouseButtonUp : function(event){ 
        if(event.which == ChromeGesture.RIGHT_CLICK){
            
            event.preventDefault();
            event.stopPropagation();			
			
			setTimeout(function(){hideGesture();}, 1000); // [Kryptyx] Right-Click released, hide the gesture visual.			
			clickPast = null;
			
            warn("Gesture Executed : [" + ChromeGesture.currentGesture +"]");			
            window.removeEventListener("mousemove", ChromeGesture.captureGesture);
            
            if(myGestures[ChromeGesture.currentGesture]){
                // [Kyrax] TODO: Support passing of parameters based on the origin of the gesture and such.
                myGestures[ChromeGesture.currentGesture]();
            }
            
            ChromeGesture.currentGesture = [];
			ChromeGesture.lfGesture = false;
        } else if (event.which == ChromeGesture.LEFT_CLICK && ChromeGesture.lfGesture){
			if (!clickPast)
			{
				clickPast = new Date();
			}
			clickNow = new Date();
        	clickDiff = Math.abs(clickPast.getTime() - clickNow.getTime());
			if (clickDiff < ChromeGesture.CLICK_TIMEOUT)
			{
				showGesture("click");
				ChromeGesture.currentGesture.push("click");
				document.oncontextmenu = function(){return false;} // [Kryptyx] Gesture detected, hide the context menu.
			}
			clickPast = clickNow;
		}
    },
    
    printLine : function() {
        // [Kyrax] TODO: Print stuff next to cursor, track cursor position, append a div with text in document.
    }
}
// Initialization
window.addEventListener("mousedown", ChromeGesture.mouseButtonDown, false);
window.addEventListener("mouseup", ChromeGesture.mouseButtonUp, false);