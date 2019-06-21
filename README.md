# Sparql query and result manager

![Browser](https://github.com/stechy1/sparql-query-manager/blob/master/img/sparql_browser.png)

Webový nástroj pro uchovávání a správu databáze SPARQL dotazů. 
Nástroj umožní jednotlivé dotazy vykonat vůči vybraným typům 
SPARQL endpointů a zobrazit jejich výsledek.

## Základní funkcionalita
- vytvoření / editace / mazání dotazu včetně metadat

- **metadata**: 
  - název
  - popis
  - cílový endpoint
  - datum vytvoření
  - datum posledního běhu
  - tagy (volný text)
  - autor
- jako paměť pro dotazy bude použita HTML5 Web Storage
- export / import databáze dotazů do / z textového souboru

- **možnosti importu**:
  - kompletní přepsání
  - přidání na konec (s poloautomatickým řešením duplicit)
- podpora API dotazu na SPARQL endpointy z:
  - Jena Fuseki 3.10
  - Virtuoso 07.20.3217
- výsledek dotazu se zobrazí do HTML, případně CSS / TTL
- zobrazení chyby přijaté ze serveru:
  - syntax error
  - server down
  - timeout
  - jiná obecná chyba
- podpora pro parametrizované dotazy - v textu dotazu se bude nacházet pseudoproměnná `$VARIABLE_NAME$`, za kterou uživatel v GUI dosadí hodnotu, případně se nahradí za výchozí hodnotu
- dotazy lze seskupovat dle:
  - endpointu
  - tagu (dotaz s více tagy zobrazit ve všech skupinách)
- řažení dotazů v seznamu dle:
  - posledního spuštění
  - datumu vytvoření
  - počtu spuštění
  - abecedně (dle názvu)
- podpora pro fulltextové vyhledávání v dotazu a jeho metadatech

### Extra funkcionalita
Tyto funkce budou možná zahrnuty do projektu, ale nemusí

- export / import databáze dotazů z cloudu, nebo vzdáleného serveru
- vložení části metadat do těla dotazu (zakomentované za '#')
- k uloženému dotazu budou vedeny statistiky pro každé vykonání dotazu:
  - datum a čas
  - doba běhu
  - ok/ko (úspěšnost dotazu)
  - počet řádek (select)
  - počet trojic (construct)
  - parametry dotazu

## Technické informace
Aplikace je psaná v TypeScriptu a využívá framework [Angular 8](https://angular.io/).
Pro základní styly je použit responzivní framework [Materialize](https://materializecss.com/)
Jako persistentní uložiště je použit [HTML5 Web Storage](https://www.w3schools.com/HTML/html5_webstorage.asp)

### Spuštění vývojového serveru
Pro spuštění vývojového serveru je potřeba mít nainstalovaný [Angular CLI](https://cli.angular.io/).
Poté se server spustí příkazem `ng serve`.
