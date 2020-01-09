import * as beautify from 'js-beautify';

/**
 * Funkce je převzata z adresy: https://stackoverflow.com/a/33928558
 *
 * @param value Hodnota, která se bude kopírovat
 */
export function copyToClipboard(value: {}) {
  const text = beautify(JSON.stringify(value));

  // Toto je Internet Explorer-specifický kód
  // @ts-ignore
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    // @ts-ignore
    return window.clipboardData.setData('Text', text);

  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy');  // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Data se nepodařilo zkopírovat do schránky!', ex);
      return false;
    }
    finally {
      document.body.removeChild(textarea);
    }
  }
}
