/**  SHOUT BOX ADJUSTABLE HEIGHT **/
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
	
	if (adjustHeight <= 100) shoutbox.style.height = "100px" // minimum height
	if (adjustHeight >= 635) shoutbox.style.height = 635 + "px" // maximum height
}

document.onmouseup = function(e) {
	if (resizing) {
		resizing =  false
		chrome.storage.sync.set({"shoutbox_Height": shoutbox.style.height})
	}
}

chrome.storage.sync.get("shoutbox_Height", function(result) {
	var storedHeight = result["shoutbox_Height"]
		
	if (typeof storedHeight == "undefined") {
		return
	}
	
	shoutbox.style.height = storedHeight	
})
/**  END OF SHOUT BOX ADJUSTABLE HEIGHT **/

/** SCROLL FIX **/
document.onclick = function(e) {
	var target = e.target
	if (target.getAttribute("class") == "bbCodeImage LbImage") {
		var scrollY = document.body.scrollTop
		var fs = document.getElementsByClassName("bbCodeImageFullSize")
		for (var i = 0; i < fs.length; i++) {
				fs[i].onclick = function() {
				document.body.scrollTop = scrollY
			}			
		}
	}
}
/** END OF SCROLL FIX **/

/** PREVIEW CHAT COLOR **/
function getRandomArbitrary(min, max) {
	return Math.floor(Math.random() * (max - min +1)) + min
}

var quotes = [
	"Wow, such color, much impressive!", 
	"Don't cry because it's over, smile because it happened.", 
	"Be yourself. Everyone else is already taken.",
	"You only live once, but if you do it right, once is enough.",
	"If you tell the truth, you don't have to remember anything.",
	"Always forgive your enemies; nothing annoys them so much.",
	"Live as if you were to die tomorrow. Learn as if you were to live forever.",
	"Your time is limited, don't waste it living someone else's life.",
	"Quality is much better than quantity. One home run is much better than two doubles.",
	"Stay hungry. Stay foolish.",
	"\"Nothing says Valentines Day like your Uncle and a Mistletoe\" - Asgore",
	]

var colorpicker = document.getElementById("taigachat_colorpicker")

if (colorpicker) {

	colorpicker.onmousedown = function() {
		
		var messageField = document.getElementById("taigachat_message")
		messageField.style.position = "relative"
		messageField.style.zIndex = "10000"
		
		var quoteN = quotes.length
		var quoteEnabled = false
		var randomN = getRandomArbitrary(0, quoteN - 1)
		var quote = quotes[randomN]
		
		if (!messageField.value) {
			messageField.value = quote
			quoteEnabled = true
		}
		
		setTimeout( function() {
			var old
			var IntV = setInterval( function() {
				var c = document.querySelector("#colorpicker #color")
				if (!c) {
					messageField.style.zIndex = "1"
					clearInterval(IntV)
					for (var i = 0; i < quoteN; i++) {
						if (messageField.value  == quotes[i] && quoteEnabled) {
							messageField.value = "" // clear field
						}
					}
					return
				}
				if (old != c.value) {
					messageField.style.color = c.value
				}
				old = c.value
			}, 100)		
		}, 1500)
	}

}
/** END OF PREVIEW CHAT COLOR **/