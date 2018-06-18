import sgmHomepage from '../sgm/homepage';

class background {
  async init() {
    this.ports = [];

    this.sgmHomepage = new sgmHomepage();
    this.sgmHomepage.on('update', this.postMessage.bind(this));

    await Promise.all([this.sgmHomepage.init()]);

    browser.runtime.onConnect.addListener(this.connected.bind(this));
  }

  // handle a new content script port
  connected(port) {
    this.ports.push(port);
    port.onMessage.addListener(this.message.bind(this));
    port.onDisconnect.addListener(this.disconnected.bind(this));
  }

  // handle messages from a port
  message(message, port) {
    if (!message.action) return;
    port = this.ports.find(p => p.sender.tab.id === port.sender.tab.id); // get the current port in the array

    switch (message.action) {
      case 'wants':
        // update the wants (this is what the port wants in terms of data)
        port.wants = message.wants;
        break;
      case 'getSgmHomepage':
        // new tab wants the currently loaded homepage
        port.postMessage({ action: 'sgmHomepageUpdate', lastUpdated: this.sgmHomepage.lastUpdated, document: this.sgmHomepage.document });
        break;
    }
  }

  // port closed, remove port from ports away
  disconnected(port) {
    port = this.ports.find(p => p.sender.tab.id === port.sender.tab.id);
    if (port) this.ports.splice(this.ports.indexOf(port), 1);
  }

  // send a message to any ports that want message.action
  postMessage(message) {
    if (!message.action) return;

    for (const port of this.ports) {
      if (port.wants && port.wants.includes(message.action)) {
        port.postMessage(message);
      }
    }
  }
}

export default new background();
