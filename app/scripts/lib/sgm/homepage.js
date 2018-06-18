import EventEmitter from 'events';
import axios from 'axios';

class sgmHomepage extends EventEmitter {
  constructor() {
    super();
    this.homepageDocument = null;
    this.XMLSerializer = new XMLSerializer();
  }

  async init() {
    this.jobInterval = setInterval(this.refreshHomepageData.bind(this), 60 * 1000); // TODO: make the refresh interval configurable?
    await this.refreshHomepageData();
  }

  async refreshHomepageData() {
    try {
      const { data } = await axios.get('https://www.seriousgmod.com/', {
        responseType: 'document'
      });
      this.lastUpdated = new Date().getTime();
      this.homepageDocument = data;
      this.emit('update', { action: 'sgmHomepageUpdate', lastUpdated: this.lastUpdated, document: this.document });
    } catch (err) {
      console.error('We were unable to update the homepage in the background, will try again later.', err)
    }
  }

  get document() {
    return this.XMLSerializer.serializeToString(this.homepageDocument);
  }
}

export default sgmHomepage;
