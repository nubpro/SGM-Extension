/**  Shoutbox Height Modifier **/
var minShoutboxHeight = "150px";
var maxShoutboxHeight = "635px";

var button  = document.createElement("button")
button.setAttribute("class", "button taigachat_bbcode xenForoSkin")

var iconURL = chrome.extension.getURL("icon.png")
var icon =  document.createElement("span")
icon.setAttribute("class", "shoutboxHandle")
icon.style.backgroundImage = "url(" + iconURL + ")"

var toolbar = document.getElementById("taigachat_toolbar")
button.appendChild(icon)

var height, pY, resizing = false
var shoutbox = document.getElementById("taigachat_box")

if ( toolbar == null) {
	var controls = document.createElement("div")
	controls.setAttribute("id", "taigachat_controls")

	
	var toolbar = document.createElement("div")
	toolbar.setAttribute("id", "taigachat_toolbar")
	
	controls.appendChild(toolbar)
	shoutbox.parentNode.appendChild(controls)
	
	button.style.cssFloat = "right"
}

toolbar.appendChild(button)

button.onmousedown = function(e) {
	height = shoutbox.clientHeight
	pY = e.pageY
	resizing = true
}

document.onmousemove = function(e) {
	if (!resizing) return
	
	var y = e.pageY - pY
	var adjustHeight = height + y
	shoutbox.style.height = adjustHeight + "px"
	shoutbox.scrollTop = shoutbox.scrollHeight
	
	if (adjustHeight < 150) shoutbox.style.height = minShoutboxHeight // minimum height
	if (adjustHeight > 635) shoutbox.style.height = maxShoutboxHeight // maximum height
}

document.onmouseup = function(e) {
	if (resizing) {
		resizing =  false
		
		document.cookie = "shoutboxHeight="+shoutbox.style.height+"; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
	}
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

window.onload = function() {
	shoutbox.style.height = readCookie("shoutboxHeight") || minShoutboxHeight;
}