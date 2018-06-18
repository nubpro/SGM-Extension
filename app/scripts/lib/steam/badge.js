import Steam from './api';

class steamBadge {
  constructor() {
    this.steamIconSrc = browser.extension.getURL('images/steam.png');
  }

  async init() {
    const steamIDs = [];
    const isMemberPage = new URL(document.location.href).pathname.startsWith('/members/');
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

        const steamProfileWrapperReplacement = this.generateSteamBadge(profile);

        for (let steamProfileWrapperLinkImage of steamProfileWrapperLinkImages) {
          const steamProfileWrapperLink = steamProfileWrapperLinkImage.parentElement;
          const steamProfileWrapper = steamProfileWrapperLink.parentElement;

          steamProfileWrapper.removeChild(steamProfileWrapperLink);

          steamProfileWrapper.classList.add('steamBadge');
          if (!isMemberPage && (profile.nickname.length > 20 || (profile.gameTitle && profile.gameTitle.length > 20))) steamProfileWrapper.classList.add('longUserName');
          if (isMemberPage) steamProfileWrapper.classList.add('steamBadge-profile');

          steamProfileWrapper.insertAdjacentHTML('beforeend', steamProfileWrapperReplacement);
        }
      }
    }
  }

  generateSteamBadge(profile) {
    return `
<div class="steamBadge-top"><a href="steam://url/SteamIDPage/${profile.steamID}" title="View user's Steam profile in client"></a><img src="${this.steamIconSrc}" class="steamBadge-logo"></div>
<div class="steamBadge-content">
    <div class="steamBadge-left"><a href="${profile.profileUrl}" target="_blank"><img src="${profile.avatarMedium}" class="steamBadge-avatar"></a></div>
    <div class="steamBadge-right">
        <div class="steamBadge-name" title="${profile.nickname}"><a href="${profile.profileUrl}" target="_blank">${profile.nickname}</a></div>
        <div class="steamBadge-activity"><span class="steamState-${profile.personaState.state}">${profile.personaState.stateText}</span></div>
        <div class="steamBadge-supplementary steamState-${profile.personaState.state}">${profile.gameTitle ? profile.gameTitle : profile.offline ? `Last Online: ${profile.lastLogOff}` : '&nbsp;'}</div>
    </div>
</div>`;
  }
}

export default new steamBadge();
