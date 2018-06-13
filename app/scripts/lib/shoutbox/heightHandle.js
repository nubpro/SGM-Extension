import elementReady from 'element-ready';

class shoutboxHeightHandle {
  static minShoutboxHeight = 150;
  static maxShoutboxHeight = 635;

  constructor() {
    this.resizing = false;
    this.shouldButtonFloatRight = false;
  }

  async init() {
    // load the saved shoutbox height from the extension storage
    const data = await browser.storage.local.get('shoutboxHeight');
    this.height = data.shoutboxHeight || shoutboxHeightHandle.minShoutboxHeight;

    // wait for the box to finish loading
    await elementReady('#taigachat_box');

    this.shoutbox = document.getElementById('taigachat_box');

    // apply the height before the user notices
    this.shoutbox.style.height = `${this.height}px`;

    // wait for the rest to load
    await elementReady('#taigachat_full');

    // set toolbar var
    this.toolbar = document.getElementById('taigachat_toolbar');

    // if unset (not found) create a stand in
    if (!this.toolbar) {
      this.createToolbar();
    }

    // create the resize handle
    this.createHandle();
  }

  createToolbar() {
    const controls = document.createElement('div');
    controls.id = 'taigachat_controls';

    const toolbar = document.createElement('div');
    toolbar.id = 'taigachat_toolbar';

    controls.appendChild(toolbar);
    this.shoutbox.parentNode.appendChild(controls);
    this.shouldButtonFloatRight = true;

    this.toolbar = document.getElementById('taigachat_toolbar');
  }

  createHandle() {
    const button = document.createElement('button');
    button.classList.add('button', 'taigachat_bbcode', 'xenForoSkin');

    const icon = document.createElement('span');
    icon.classList.add('shoutboxHandle');
    icon.style.backgroundImage = `url(${browser.extension.getURL('images/resize.png')})`;

    button.appendChild(icon);

    if (this.shouldButtonFloatRight) {
      button.style.cssFloat = 'right';
    }

    this.toolbar.appendChild(button);

    button.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  /**
   * @param {MouseEvent} event
   */
  handleMouseDown(event) {
    this.resizing = true;
    this.height = this.shoutbox.clientHeight;
    this.initialPageY = event.pageY;
  }

  /**
   * @param {MouseEvent} event
   */
  handleMouseMove(event) {
    if (!this.resizing) return;

    let y = event.pageY - this.initialPageY;
    let adjustHeight = this.height + y;
    this.shoutbox.style.height = `${adjustHeight}px`;
    this.shoutbox.scrollTop = this.shoutbox.scrollHeight;

    if (adjustHeight < shoutboxHeightHandle.minShoutboxHeight) this.shoutbox.style.height = `${shoutboxHeightHandle.minShoutboxHeight}px`;
    if (adjustHeight > shoutboxHeightHandle.maxShoutboxHeight) this.shoutbox.style.height = `${shoutboxHeightHandle.maxShoutboxHeight}px`;
  }

  async handleMouseUp() {
    if (this.resizing) {
      this.resizing = false;
      await browser.storage.local.set({ shoutboxHeight: parseInt(this.shoutbox.style.height.slice(0, -2)) });
    }
  }
}

export default new shoutboxHeightHandle();
