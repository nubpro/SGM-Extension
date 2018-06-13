import elementReady from 'element-ready';

class shoutboxScrollFix {
  async init() {
    await elementReady('#taigachat_box');
    this.shoutbox = document.getElementById('taigachat_box');
    this.shoutbox.style.overflowAnchor = "none";
    this.shoutbox.style.overflowX = "hidden";
  }
}

export default new shoutboxScrollFix();
