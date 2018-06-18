class Helpers {

  /**
   * Run code on the page context, not the contentscript context.
   * @param {string} code Code to eval.
   */
  static runScriptPageContext(code) {
    const script = document.createElement('script');
    script.textContent = code;
    script.type = 'text/javascript';
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  }
}

export default Helpers;
