/* Chrome Saving Lib by Wa
 * A simple library for saving data in a Chrome extension! Use in a toolstrip, background page, or arbitrary html page in your extension.
 * NOT your content script!
 * Use saveData(Variable Name,Data to Save); to save your data.
 * Use loadData(Variable Name,Default Value if entry is non-existant); to load your data if any exists.
 */

function saveData(name,data){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+366);
	exdate = exdate.toGMTString();
	document.cookie = name+"="+escape(data)+";expires="+exdate;
}

function loadData(name,def){
	var parse = document.cookie;
	var loc = parse.indexOf("; "+name+"=")+name.length+3;
	if(loc == name.length+2){
		if(parse.substr(0,name.length+1) == name+"=")loc = name.length+1;
		else return def;
	}
	var lo2 = parse.indexOf(";",loc);
	lo2 = (lo2==-1)?parse.length:lo2;
	return unescape(parse.substring(loc,lo2));
}

function removeData(name){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()-2);
	exdate = exdate.toGMTString();
	document.cookie = name+"= ;expires="+exdate;
}