/** Chat Color **/
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

/** Shoutbox Scroll Fix **/
var shoutbox = document.getElementById("taigachat_box")
shoutbox.style.overflowAnchor = "none";
shoutbox.style.overflowX = "hidden";