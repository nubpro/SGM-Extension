var xhr = new XMLHttpRequest();
var steamIDs = [];
$('a[href*="http://steamcommunity.com/profiles/"] img[src="styles/default/steam/steam_16.png"]').parent().each(function(i, ele) {
    var t_arr = ele.href.split('/');
    var sID = t_arr[t_arr.length - 1];
    if ($.inArray(sID, steamIDs) === -1) steamIDs.push(sID);
});
xhr.open('POST', 'https://sgmod.ext.steam.zikeji.com/', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status == 200 && xhr.responseText != null) {
        try {
            var data = JSON.parse(xhr.responseText);
            for (var i in data) {
                var player = data[i];
                $('a[href="http://steamcommunity.com/profiles/' + player.steamid + '"] img[src="styles/default/steam/steam_16.png"]').css('vertical-align', '-3px');
                $('a[href="http://steamcommunity.com/profiles/' + player.steamid + '"] img[src="styles/default/steam/steam_16.png"]').parent().append("&nbsp;(" + player.personaname + ")");
            }
        } catch (e) {console.log(e);}
    }
}
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({'steamID64': steamIDs}));
