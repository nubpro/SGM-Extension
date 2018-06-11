var xhr = new XMLHttpRequest();
var steamIDs = [];
var steamIcon = chrome.extension.getURL("images/steam.png");

/**var data = [
    {
        "steamid": "76561198005534001",
        "steamID": "76561198005534001",
        "personaname": "Opalium",
        "nickname": "Opalium",
        "avatar": {
            "small": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b7/b7be993bed8098745fa8bd6e17be20cf45c9223b.jpg",
            "medium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b7/b7be993bed8098745fa8bd6e17be20cf45c9223b_medium.jpg"
        },
        "lastLogOff": 1527970128,
        "visibilityState": 3,
        "personaState": 1
    }
];**/

personaStates = {
	0: ["Offline"],
	1: ["Online", "#7fb900"],
	2: ["Busy"],
	3: ["Away"],
	4: ["Snooze"],
	5: ["Online", "#7fb900"],
	6: ["Online", "#7fb900"]
}

function getActivity(s) {
	var state = personaStates[s];
	
	if (state.length > 1) {
		return '<span style="color:' +state[1]+ '">' +state[0]+ '</span>';
	}
	
	return state[0];
}


$('a[href*="http://steamcommunity.com/profiles/"] img[src="styles/default/steam/steam_16.png"]').parent().each(function (i, ele) {
	var t_arr = ele.href.split('/');
    var sID = t_arr[t_arr.length - 1];
    if ($.inArray(sID, steamIDs) === -1) steamIDs.push(sID);
});
if (steamIDs.length > 0) {
    xhr.open('POST', 'https://sgmod.ext.steam.zikeji.com/', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200 && xhr.responseText != null) {
            try {
                var data = JSON.parse(xhr.responseText);
                for (var i in data) {
                    var player = data[i];
					var player_weburl = 'http://steamcommunity.com/profiles/' + player.steamID;
					
					// Retrieve DOMs
					var avtr_link = $('a[href="' +player_weburl+ '"] img[src="styles/default/steam/steam_16.png"]').parent();
					var main = avtr_link.parent();
					
					avtr_link.remove();
					
					var snippet;
					snippet  = '<div class="steamBadge-top"><a href="steam://url/SteamIDPage/' +player.steamID+ '" title="View profile on Steam"></a><img src="' +steamIcon+ '" class="steamBadge-logo"/></div>';
					snippet += '<div class="steamBadge-content">';
					snippet += '<div class="steamBadge-left"><a href="' +player_weburl+ '" target="_blank"><img src="' +player.avatar.medium+ '" class="steamBadge-avatar"></a></div>';
					snippet += '<div class="steamBadge-right"><div class="steamBadge-name"><a href="' +player_weburl+ '" target="_blank">' +player.nickname+ '</a></div>';
					snippet += '<div class="steamBadge-activity">' +getActivity(player.personaState)+ '</div>';
					snippet += '</div></div>';
					
					main.addClass('steamBadge');
					main.append(snippet);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        'steamID64': steamIDs
    }));
}