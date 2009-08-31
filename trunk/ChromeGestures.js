var clickPast;
var clickNow;
var clickDiff;
var wind;
var alpha=1.0;
var logging = false;

function log(txt){if(logging){console.log(txt);}}
function warn(txt){if(logging){console.warn(txt);}}
function error(txt){if(logging){console.error(txt);}}
function debug(txt){if(logging){console.debug(txt);}}

function getData(delta,captime,clickto){
	ChromeGesture.MINIMUM_DELTAY = delta;
	ChromeGesture.MINIMUM_DELTAX = delta;
	ChromeGesture.DELAY_BETWEEN_CAPTURES = captime;
	ChromeGesture.CLICK_TIMEOUT = clickto;
}

// LOAD SAVED DATA
var port = chrome.extension.connect();
port.onMessage.addListener(function(arr){
	if(arr[0] == "load")getData(arr[1],arr[2],arr[3]);
	else if(arr[0] == "eval")eval(arr[1]);
});

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
		if (document.getElementById("ChromeGestureBox")){
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
}

// CONSTANTS

var ChromeGesture = {

	MINIMUM_DELTAY : 10,						// tweak this - Minimum Y distance that needs to be travelled between 2 captures for a move to be detected
	MINIMUM_DELTAX : 10,						// tweak this - Same for X
	DELAY_BETWEEN_CAPTURES : 10,				// tweak this - Time between captures
	CLICK_TIMEOUT : 1000,					   // tweak this - This is the timeout period between clicks (1000 = 1 second)
		
		//Globals
	LEFT_CLICK : 1,							 // Number associated with Left Click
	RIGHT_CLICK : 3,							// Number associated with Right Click
	pastX : 0,
	pastY : 0,
	currentGesture : [],
	pastTime : new Date(),
	lastGesture: "",

		// Functions
	captureGesture : function(event) {
		
		var currentTime = new Date();
		var diff = currentTime.getTime() - ChromeGesture.pastTime.getTime();
		
		var currentX = event.clientX;
		var currentY = event.clientY;
		
		//ChromeGesture.printLine(currentX, currentY);
				
		if( diff < ChromeGesture.DELAY_BETWEEN_CAPTURES ){
			return;
		} else {
			var deltaX = currentX - ChromeGesture.pastX;
			var deltaY = currentY - ChromeGesture.pastY;
			
			ChromeGesture.pastX = currentX;
			ChromeGesture.pastY = currentY;
			
			var move = ChromeGesture.determineMove(deltaX, deltaY);
			
			if( move != null && move != ChromeGesture.lastGesture){
				showGesture(move);
				clickPast = null;
				ChromeGesture.currentGesture+=" "+move;
				ChromeGesture.lastGesture = move;
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
			
			port.postMessage(ChromeGesture.currentGesture);
			
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