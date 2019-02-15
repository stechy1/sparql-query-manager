import * as beautify from 'js-beautify';

export function copyToClipboard(value: string) {
  // Vytvoření provizorního elementu 'textarea'
  const el = document.createElement('textarea');
  // Nastavení hodnoty
  el.value = beautify(JSON.stringify(value));
  // Připnutí elementu do dokumentu
  document.body.appendChild(el);
  // Vybrání celého obsahu v elementu
  el.select();
  // Zkopírování obsahu do schránky
  document.execCommand('copy');
  // Odstranění elementu z dokumentu
  document.body.removeChild(el);
}
