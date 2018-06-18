import elementReady from 'element-ready';
import helpers from '../helpers';

class shoutboxSidebarMod {
  constructor() {
    this.DOMParser = new DOMParser();
  }

  async init() {
    await elementReady('aside > .sidebar');
    this.sidebar = document.querySelector('aside > .sidebar');

    // inject the CSS for the sidebar
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'https://www.seriousgmod.com/css.php?css=thread_list_simple&style=8&dir=LTR';
    document.querySelector('html > head').appendChild(css);

    this.port = browser.runtime.connect();
    this.port.onMessage.addListener(this.message.bind(this));
    this.port.postMessage({ action: 'wants', wants: ['sgmHomepageUpdate'] });
    this.port.postMessage({ action: 'getSgmHomepage' });
  }

  message(message) {
    this.document = this.DOMParser.parseFromString(message.document, 'text/html');
    this.lastUpdated = message.lastUpdated;
    this.updateSidebar();
  }

  updateSidebar() {
    const oldThreadList = document.querySelector('.section.threadList');
    const threadList = this.document.querySelector('.section.threadList');

    threadList.querySelectorAll('a').forEach(el => el.target = '_blank');

    if (oldThreadList) {
      this.sidebar.replaceChild(threadList, oldThreadList);
      helpers.runScriptPageContext(`XenForo.activate(document.querySelector('.section.threadList'));`);
    } else {
      this.sidebar.appendChild(threadList);
      window.addEventListener('load', () => {
        helpers.runScriptPageContext(`XenForo.activate(document.querySelector('.section.threadList'));`)
      });
    }
  }
}

export default new shoutboxSidebarMod();
