import axios from 'axios';
import steamProfile from './steamProfile';

class Steam {
  constructor(url) {
    this.url = url || 'https://sgmod.ext.steam.zikeji.com/';
  }

  async getProfiles(steamIDs) {
    const { data } = await axios.post(this.url, { steamID64: steamIDs });

    const players = [];
    for (let rawPlayer of data) {
      players.push(new steamProfile(rawPlayer));
    }
    return players;
  }
}

export default new Steam();
