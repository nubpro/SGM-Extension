import Steam from './lib/steam';

const main = async function () {
  const steamIDs = [];
  const steamIconSrc = browser.extension.getURL('images/steam.png');
  const elements = document.querySelectorAll('a[href*="http://steamcommunity.com/profiles/"] img[src="styles/default/steam/steam_16.png"]');

  for (let element of elements) {
    const url = new URL(element.parentElement.getAttribute('href'));
    const splitPath = url.pathname.split('/');
    const steamID = splitPath[splitPath.length - 1];

    if (!steamIDs.includes(steamID)) steamIDs.push(steamID);
  }

  if (steamIDs.length > 0) {
    const profiles = await Steam.getProfiles(steamIDs);

    for (let profile of profiles) {
      const steamProfileWrapperLinkImages = document.querySelectorAll(`a[href*="${profile.steamID}"] img[src="styles/default/steam/steam_16.png"]`);

      const steamProfileWrapperReplacement = `
<div class="steamBadge-top"><a href="steam://url/SteamIDPage/${profile.steamID}" title="View user's Steam profile in client"></a><img src="${steamIconSrc}" class="steamBadge-logo"></div>
<div class="steamBadge-content">
    <div class="steamBadge-left"><a href="${profile.profileUrl}" target="_blank"><img src="${profile.avatarMedium}" class="steamBadge-avatar"></a></div>
    <div class="steamBadge-right">
        <div class="steamBadge-name" title="${profile.nickname}"><a href="${profile.profileUrl}" target="_blank">${profile.nickname}</a></div>
        <div class="steamBadge-activity"><span class="steamState-${profile.personaState.state}">${profile.personaState.stateText}</span></div>
    </div>
</div>
<div class="steamBadge-supplementary steamState-${profile.personaState.state}">${profile.gameTitle ? profile.gameTitle : profile.offline ? `Online: ${profile.lastLogOff}` : ' '}</div>
`;

      for (let steamProfileWrapperLinkImage of steamProfileWrapperLinkImages) {
        const steamProfileWrapperLink = steamProfileWrapperLinkImage.parentElement;
        const steamProfileWrapper = steamProfileWrapperLink.parentElement;

        steamProfileWrapper.removeChild(steamProfileWrapperLink);

        steamProfileWrapper.classList.add('steamBadge');
        steamProfileWrapper.insertAdjacentHTML('beforeend', steamProfileWrapperReplacement);
      }
    }
  }

};

main().catch(console.error);
