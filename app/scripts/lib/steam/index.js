import steamProfile from './steamProfile'

class Steam {
  static _get(url, data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status !== 200) reject(new Error('Invalid status code'));
          if (xhr.responseText === null) reject(new Error('No response'));
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            reject(new Error(`Unable to parse data, ${e}`))
          }
        }
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    });
  }

  constructor(url) {
    this.url = url || 'https://sgmod.ext.steam.zikeji.com/';
  }

  async getProfiles(steamIDs) {
    const data = await Steam._get(this.url, { steamID64: steamIDs });

    const players = [];
    for (let rawPlayer of data) {
      players.push(new steamProfile(rawPlayer));
    }
    return players;
  }
}

export default new Steam()
