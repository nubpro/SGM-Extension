import friendlyTime from 'friendly-time';

class steamProfile {
  static visibilityStates = [
    { state: 1, private: true },
    { state: 3, private: false }
  ];

  static personaStates = [
    { state: 0, stateText: 'Offline' },
    { state: 1, stateText: 'Online' },
    { state: 2, stateText: 'Busy' },
    { state: 3, stateText: 'Away' },
    { state: 4, stateText: 'Snooze' },
    { state: 5, stateText: 'Looking to Trade' },
    { state: 6, stateText: 'Looking to Play' },
    { state: 9999, stateText: 'In-Game' } // custom state for in-game
  ];

  static _enumVisibilityState(v) {
    return steamProfile.visibilityStates.find(vS => vS.state === v);
  }

  static _enumPersonaState(v) {
    return steamProfile.personaStates.find(pS => pS.state === v);
  }

  constructor(data) {
    this._data = data;
  }

  get steamID() {
    return this._data.steamID;
  }

  get profileUrl() {
    return `https://steamcommunity.com/profiles/${this.steamID}`;
  }

  get nickname() {
    return this._data.nickname;
  }

  get avatarSmall() {
    return this._data.avatar.small;
  }

  get avatarMedium() {
    return this._data.avatar.medium;
  }

  get lastLogOff() {
    return friendlyTime(new Date(this._data.lastLogOff * 1000));
  }

  get visibilityState() {
    return steamProfile._enumVisibilityState(this._data.visibilityState);
  }

  get personaState() {
    return this.inGame ? steamProfile._enumPersonaState(9999) : steamProfile._enumPersonaState(this._data.personaState);
  }

  get offline() {
    return this._data.personaState === 0;
  }

  get inGame() {
    return !!this._data.game;
  }

  get gameID() {
    return this.inGame ? this._data.game.id || null : null;
  }

  get gameTitle() {
    return this.inGame ? this._data.game.extraInfo || null : null;
  }

  get gameServerIP() {
    return this.inGame ? this._data.game.serverIP || null : null;
  }
}

export default steamProfile;
