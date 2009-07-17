/* Slider Lib by Wa
 * Call initSliding() to initialize all current positions for sliders and to set displayed values.
 * Use the following HTML to declare a slider on your page:
<div class="sliderbar"><span class="slider" id="YOURSLIDER'SNAME"></span></div>
 * And the following in your JavaScript to declare the values for it:
 scroll_info["YOURSLIDER'SNAME"] = new Array(Min limit, Max limit, Interval, Current value);
  * And make sure to include these BEFORE your JavaScript:
<script type="text/javascript" src="sliderlib.js"></script>
<link rel="stylesheet" type="text/css" href="slider.css" />
 * Slider lib will call a "slidersUpdated" function if one exists when the user releases a slider.
 */
var is_sliding = null;
var diff = new Object();
var scroll_info = new Array();

function absoluteLeft(obj){
	var left = 0;
	while(obj.offsetParent) {
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
    return left;
}

function getWidth(obj,pc){
	var w = "0";
	if(typeof(pc) == "undefined")pc = 1;
	if(obj == document.body.parentNode)w = window.innerWidth;
	else if(obj.style.width != "")w = obj.style.width;
	else if(typeof(obj.attributes["class"]) != "undefined"){
		var ss = document.styleSheets;
		for(var i=0;i<ss.length;i++){
			var cssr = document.styleSheets[i]['cssRules'];
			for(var j=0;j<cssr.length;j++){
				if(document.styleSheets[i]['cssRules'][j].selectorText == "."+obj.attributes["class"].nodeValue){
					w = document.styleSheets[i]['cssRules'][j].style.width;
				}
			}
		}
	}
	if(w.indexOf("%") != -1)
		return getWidth(obj.parentNode,w.replace(/%/,"")/100)*pc;
	return w.replace(/[^0-9]/g,"")*pc;
}

var sint;
function beginslide(){
	if(is_sliding == null){
		var e = window.event;
		is_sliding = this;
		diff.l = absoluteLeft(this.parentNode);
		diff.w = getWidth(this.parentNode)-10;
		diff.n = this.attributes["id"].nodeValue;
		sint = setInterval(function(){document.getSelection().removeAllRanges();},100);
	}
}

function slide(){
	if(is_sliding != null){
		var e = window.event;
		var mx = 1;
		var tmp = scroll_info[diff.n][2];
		while(Math.round(tmp) != tmp){
			tmp *= 10;
			mx *= 10;
		}
		var unrounded = scroll_info[diff.n][0]+((e.clientX-diff.l-5)/diff.w*(scroll_info[diff.n][1]-scroll_info[diff.n][0]));
		unrounded = Math.round(unrounded*mx);
		var moveby = unrounded%tmp;
		if(moveby > tmp/2)unrounded += (tmp-moveby);
		else unrounded -= moveby;
		//Fail safe
		scroll_info[diff.n][3] = Math.min(Math.max(unrounded/mx,scroll_info[diff.n][0]),scroll_info[diff.n][1]);
		is_sliding.innerHTML = scroll_info[diff.n][3]+"";
		is_sliding.style.left = ((scroll_info[diff.n][3]-scroll_info[diff.n][0])/(scroll_info[diff.n][1]-scroll_info[diff.n][0])*diff.w)+"px";
	}
}

function endslide(){
	if(is_sliding != null){
		slide();
		is_sliding = null;
		clearInterval(sint);
		if(typeof(slidersUpdated) == "function")slidersUpdated();
	}
}

function initSliding(){
	for(var i in scroll_info){
		var tmp = document.getElementById(i);
		tmp.innerHTML = scroll_info[i][3];
		tmp.style.left = ((scroll_info[i][3]-scroll_info[i][0])/(scroll_info[i][1]-scroll_info[i][0])*(getWidth(tmp.parentNode)-10))+"px";
		tmp.addEventListener("mousedown",beginslide,true);
		tmp.addEventListener("mousemove",slide,true);
		tmp.addEventListener("mouseup",endslide,true);
		tmp.parentNode.addEventListener("mousemove",slide,true);
		tmp.parentNode.addEventListener("mouseup",endslide,true);
	}
}