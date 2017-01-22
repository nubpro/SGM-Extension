/**
 * https.js
 * 
 * Redirect non-HTTPS to HTTPS before navigation occurs to fix the SGMOD logout bug.
 */

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        var url = document.createElement('a');
        url.href = details.url;
        if (url.protocol != 'https:') {
            url.protocol = 'https:';
            return {
                redirectUrl: url.href.toString()
            };
        }
    }, {
        urls: ["*://*.seriousgmod.com/", "*://*.seriousgmod.com/*"]
    },
    ["blocking"]
)