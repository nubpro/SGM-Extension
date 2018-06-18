import elementReady from 'element-ready';
import removed from 'removed';

class shoutboxColorMod {
  static quotes = [
    'Wow, such color, much impressive!',
    `Don't cry because it's over, smile because it happened.`,
    'Be yourself. Everyone else is already taken.',
    'You only live once, but if you do it right, once is enough.',
    `If you tell the truth, you don't have to remember anything.`,
    'Always forgive your enemies; nothing annoys them so much.',
    'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    `Your time is limited, don't waste it living someone else's life.`,
    'Quality is much better than quantity. One home run is much better than two doubles.',
    'Stay hungry. Stay foolish.',
    `"Nothing says Valentines Day like your Uncle and a Mistletoe" - Asgore`,
  ];

  static getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static getRandomQuote() {
    return shoutboxColorMod.quotes[shoutboxColorMod.getRandomBetween(0, shoutboxColorMod.quotes.length - 1)];
  }

  async init() {
    await elementReady('#taigachat_colorpicker');
    this.colorPickerButton = document.getElementById('taigachat_colorpicker');
    this.messageField = document.getElementById('taigachat_message');
    this.messageField.style.position = 'relative';

    this.colorPickerButton.addEventListener('click', this.colorPickerButtonClicked.bind(this));
  }

  async colorPickerButtonClicked() {
    await elementReady('#colorpicker');
    this.messageField.style.zIndex = '10000';

    this.colorPickerInput = document.querySelector('#colorpicker input#color');
    this.originalColor = this.messageField.style.color;

    new MutationObserver(this.colorPickerColorInputChanged.bind(this)).observe(document.querySelector('#colorpicker div#preview'), {
      attributes: true,
      characterData: true,
      subtree: false,
      childList: false
    });

    if (!this.messageField.value) {
      this.messageField.value = shoutboxColorMod.getRandomQuote();
      this.quoteUsed = true
    }

    this.changed = false;
    document.querySelector('#colorpicker #insert').addEventListener('mouseup', this.colorPickerSubmitButtonClicked.bind(this));

    removed(document.querySelector('#colorpicker'), this.colorPickerClosed.bind(this));
  }

  colorPickerColorInputChanged() {
    const newColor = this.colorPickerInput.value;
    if (this.oldColor !== newColor) {
      this.oldColor = newColor;
      this.messageField.style.color = newColor;
    }
  }

  colorPickerSubmitButtonClicked() {
    this.changed = true;
  }

  colorPickerClosed() {
    this.messageField.style.zIndex = '1';
    if (!this.changed) this.messageField.style.color = this.originalColor;

    if (this.quoteUsed) {
      if (shoutboxColorMod.quotes.indexOf(this.messageField.value) >= 0) {
        this.messageField.value = '';
      }
    }

    this.quoteUsed = false;
  }

}

export default new shoutboxColorMod();
