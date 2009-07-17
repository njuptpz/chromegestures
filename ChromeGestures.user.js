/** READ THIS BEFORE EDITING **/
//  Here you can create your own gestures. For the moment, how this works is that you create
//  a Gesture and an Action. 
//
//         _____________
//   _____/ Terminology |___________________________________________________________________________________________________________________________
//  |                                                                                                                                               |
//  |    Moves are either 'up', 'down', 'left', 'right' or 'click'.                                                                                 |
//  |                                                                                                                                               |
//  |    A Gesture is an array of Moves e.g.: myNewGesture = ["up","down","left"].                                                                  |
//  |        - You should never have a Gesture that has two identical consecutive moves. e.g.: ["left","right","right"] is not a valid Gesture.     |
//  |                                                                                                                                               |
//  |    An Action is a function that takes no parameters and has no return value. e.g.: myNewAction = function(){ alert("OMG!") }                  |
//  |                                                                                                                                               |
//  |    You can then configure ChromeGesture by modifying the myGestures array.                                                                    |
//  |    myGestures is an array where the index is your Gesture and the data is your Action. e.g.: myGestures[myNewGesture] = myNewAction;          |
//  |       - Do not use the same Gesture for two Actions.                                                                                          |
//  |                                                                                                                                               |
//   �����������������������������������������������������������������������������������������������������������������������������������������������
//
// In case of doubt, drop by the forums on chromeplugins.org and ask. We'll answer ;)
var us = (typeof(chrome.extension) == "undefined") //DO NOT EDIT
var gesturesHelp = new Array(); //DO NOT EDIT
// ============ BEGIN STUFF YOU CAN (AND SHOULD) EDIT ============
var newTabGesture           = ["down","right"];
var blankTabGesture         = ["down","right","down"];
var closeTabGesture         = ["down","left"];
var historyBackGesture      = ["left"];
var historyForwardGesture   = ["right"];
var hidePageGesture   		= ["click","click"];
var refreshGesture			= ["right","down","left","up","right"];
var refreshGesture2			= ["up","right","down","left","up"];
var refreshGesture3			= ["up","right","down","left","up","right"];
var helpGesture             = ["up","right","down","left","down"];
if(!us)var optionsGesture   = ["up","down"];

var newTabURL				= "http://google.com"; // Change the default URL for a newTabGesture

// TODO: Support for Chrome API
function  newTabAction() {
	window.open(newTabURL);
}

function  blankTabAction() {
	window.open("about:blank");
}

function closeTabAction() {
	window.open('', '_self');
    self.close();
}

function historyBackAction() {
    history.back();
}

function historyForwardAction() {
    history.forward();
}

function refreshAction() {
	location.reload();
}

var isHiding = false;
var bgImage = null;
function hidePageAction() {
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

function optionsAction(){
	window.open("chrome-extension://"+chrome.extension.id_+"/options.html","_blank",
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
		//Add entry to file
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
	//Aw come on..two seperate loops? really? D:
	//I had to do this cause adjusting the table's innerHTML was removing the canvas content..
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
			}else{
				tc.lineTo(nx,ny);
				lastx = nx; lasty = ny;
			}
		}
		tc.stroke();
	}
}

var myGestures = [];

myGestures[newTabGesture]           = newTabAction;
myGestures[blankTabGesture]         = blankTabAction;
myGestures[closeTabGesture]         = closeTabAction;
myGestures[historyBackGesture]      = historyBackAction;
myGestures[historyForwardGesture]   = historyForwardAction;
myGestures[hidePageGesture]   		= hidePageAction;
myGestures[refreshGesture]			= refreshAction;
myGestures[refreshGesture2]			= refreshAction;
myGestures[refreshGesture3]			= refreshAction;
if(!us)myGestures[optionsGesture]	= optionsAction;
myGestures[helpGesture]				= helpAction;

//Register to be in the Help File.
//Supply with ID, Description, Starting X position in drawing, Starting Y position in drawing, and the offsets in pixels from the last point according to the gestures
//If the gesture is a click, you supply the radius of the circle instead.
//You are limited to a 100x100 pixel canvas
registerForHelp(newTabGesture,"Open a new tab. You can set the homepage in options.",20,20,60,60);
registerForHelp(blankTabGesture,"Open a blank tab.",35,20,30,30,30);
registerForHelp(closeTabGesture,"Closes the current tab.",80,20,60,60);
registerForHelp(historyBackGesture,"Goes Back to the last visited page.",80,50,60);
registerForHelp(historyForwardGesture,"Goes Forward to the next visited page.",20,50,60);
registerForHelp(hidePageGesture,"Toggle page contents (use again to re-enable).",50,50,10,6);
registerForHelp(refreshGesture,"Refreshes the current page.<br/>Can also start with an upward motion instead of right.",20,20,60,60,60,50,50);
if(!us)registerForHelp(optionsGesture,"Opens the Chrome Gestures options.",50,70,50,60);
registerForHelp(helpGesture,"Opens the Chrome Gestures help file (this).",20,50,30,60,30,30,30);

// ============ UNLESS YOU KNOW WHAT YOU ARE DOING, DON'T EDIT PAST HERE :) ============



var logging = false;
function log(txt){if(logging){console.log(txt);}}
function warn(txt){if(logging){console.warn(txt);}}
function error(txt){if(logging){console.error(txt);}}
function debug(txt){if(logging){console.debug(txt);}}

function registerForHelp(gestures,desc,startx,starty){
	if(arguments.length-4 != gestures.length){
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
		if(gestures[j] == "click")gesturesHelp[i].pnts[j] = new Array("c",arguments[j+4]);
		else{
			if(gestures[j] == "left")startx -= arguments[j+4];
			else if(gestures[j] == "right")startx += arguments[j+4];
			else if(gestures[j] == "up")starty -= arguments[j+4];
			else if(gestures[j] == "down")starty += arguments[j+4];
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
	if(contentWindow.CHROMEGESTURES_loadData){
		//wind.close();
		//contentWindow.CHROMEGESTURES_loadData = false
		//wind = null;
	}
}
if(!us)contentWindow.CHROMEGESTURES_setData = getData;

// LOAD SAVED DATA
// (Waha) This is a hack to get around the current broken communication system.
// Once this is fixed, we can implement a background page to handle the loading instead
// then it can also update all currently active background scripts rather than forcing the user to reload tabs after changes.
var wind;
if(!us){
	//contentWindow.CHROMEGESTURES_loadData = true;
	//Commenting this to prevent popup -Kryptyx
	/*wind = window.open("chrome-extension://"+chrome.extension.id_+"/options.html","_blank",
		"directories=no,height=1,width=1,left=-100,top=-100,location=no,"+
		"menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");*/
}

// SHOW GESTURE
// (Kryptyx) This is to be built upon more in the future. This is the how the gestures will be displayed to the user as they
// perform a new gesture.

function showGesture(move){
	if (!document.getElementById("ChromeGestureBox")){
		gestureDiv = document.createElement('div');
		gestureDiv.id = "ChromeGestureBox";
		gestureDiv.className = "gesture_"+move;
		document.body.appendChild(gestureDiv);
	}else{		
		document.getElementById("ChromeGestureBox").className="gesture_"+move;
	}
}
function hideGesture(){
	document.getElementById("ChromeGestureBox").className="gesture_hide";
}


/* Old Way... boy was I overthinking this, I'm keeping this code for possible future use.
var newDiv;
var direction = new Array();
direction[1] = "left";
direction[2] = "right";
direction[3] = "up";
direction[4] = "down";
function showGesture(move){
	for (var i = 1; i < 5; i++){
		if (direction[i]==move){continue;}
		var gest = document.getElementById("ChromeGesture_"+direction[i]);
		if (gest){gest.style.display="none";}
	}
	
	if (!document.getElementById("ChromeGesture_"+move)){
		newDiv = document.createElement('div');
		newDiv.id = "ChromeGesture_"+move;
		document.body.appendChild(newDiv);
	}else{		
		document.getElementById("ChromeGesture_"+move).style.display='block';
	}
}
function hideGesture(){
	for (var i = 1; i < 5; i++){
		var gest = document.getElementById("ChromeGesture_"+direction[i]);
		if (gest){gest.style.display="none";}
	}
}
*/



// CONSTANTS
var clickPast;
var clickNow;
var clickDiff;
var ChromeGesture = {

    // If you think the Gesture detection sensitity too low, make these higher.
    MINIMUM_DELTAY : 10,			// tweak this - Minimum Y distance that needs to be travelled between 2 captures for a move to be detected
    MINIMUM_DELTAX : 10,			// tweak this - Same for X
    DELAY_BETWEEN_CAPTURES : 10, 	// tweak this - Time between captures
	CLICK_TIMEOUT : 1000,			// tweak this - This is the timeout period between clicks (1000 = 1 second)

    // Global variables
    LEFT_CLICK : 1,					// Number associated with Left Click
    RIGHT_CLICK : 3,				// Number associated with Right Click
    pastX : 0,
    pastY : 0,
    currentGesture : [],
    pastTime : new Date(),

    // Functions
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
					showGesture(move); // Kryptyx was here...
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

        if( absDeltaX < ChromeGesture.MINIMUM_DELTAX && absDeltaY < ChromeGesture.MINIMUM_DELTAY ) { 
			return null;						
        }
		else {
			document.oncontextmenu = function(){return false;} // Gesture detected, hide the context menu
		}
        
        if( absDeltaY > absDeltaX ) {
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

    mouseButtonDown : function(event) {
        if (event.which == ChromeGesture.RIGHT_CLICK){ 
        
        //TODO: Don't stop propagation if time between mouseup / mousedown is < CONSTANT
        
            document.oncontextmenu = function(){return true;} // Right-click detected, enable the context menu
        
            ChromeGesture.pastX = event.clientX;
            ChromeGesture.pastY = event.clientY;
			ChromeGesture.lfGesture = true;
            window.addEventListener("mousemove", ChromeGesture.captureGesture);			
        }
    },

    mouseButtonUp : function(event) { 
        if(event.which == ChromeGesture.RIGHT_CLICK){
            
            event.preventDefault();
            event.stopPropagation();			
			
			setTimeout(function(){hideGesture();}, 750);
			
			clickPast = null;
        
            warn("Gesture Executed : [" + ChromeGesture.currentGesture +"]");
			
            window.removeEventListener("mousemove", ChromeGesture.captureGesture);
            
            if(myGestures[ChromeGesture.currentGesture]){
                // TODO: Support passing of parameters based on the origin of the gesture and such.
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
				document.oncontextmenu = function(){return false;} // Gesture detected, hide the context menu
			}
			clickPast = clickNow;
		}
    },
    
    printLine : function() {
        // TODO: Print stuff next to cursor, track cursor position, append a div with text in document.
    }

}
// Initialization
window.addEventListener("mousedown", ChromeGesture.mouseButtonDown, false);
window.addEventListener("mouseup", ChromeGesture.mouseButtonUp, false);