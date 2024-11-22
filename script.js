let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle'; // Der Spieler, der als nächstes setzt

function init() {
    // Anzeige initialisieren
    updateCurrentPlayerDisplay();
    render();
}

/** Zusammenfassung - render()
 * Die Funktion render erstellt dynamisch den HTML-Inhalt für ein Tic-Tac-Toe-Spielbrett.
 * - Es wird überprüft, ob jedes Feld leer, ein Kreis oder ein Kreuz ist.
 * - Für leere Felder wird eine klickbare Zelle mit onclick-Handler erstellt.
 * - Für belegte Felder wird das passende SVG-Symbol (Kreis oder Kreuz) eingefügt.
 * - Die generierte Tabelle wird schließlich in das Element mit der ID content eingefügt, 
 *   um das Spielbrett im Browser anzuzeigen.
 */
function render() {
    // Initialisiert einen HTML-String für die Tabelle.
    let tableHTML = '<table>';

    // Startet eine Schleife, um drei Reihen der Tabelle zu erstellen.
    for (let row = 0; row < 3; row++) {
        // Fügt den HTML-Tag für eine Tabellenreihe hinzu.
        tableHTML += '<tr>';

        // Startet eine Schleife, um drei Zellen für die aktuelle Reihe zu erstellen.
        for (let col = 0; col < 3; col++) {
            // Berechnet den linearen Index (0 bis 8) basierend auf der aktuellen Reihe und Spalte.
            const index = row * 3 + col;

            // Initialisiert den Symbol-String für den Inhalt der Zelle.
            let symbol = '';

            // Prüft, ob das Feld an der aktuellen Position ein Kreis ist.
            if (fields[index] === 'circle') {
                // Generiert das SVG für einen Kreis.
                symbol = generateCircleSVG();
            // Prüft, ob das Feld an der aktuellen Position ein Kreuz ist.
            } else if (fields[index] === 'cross') {
                // Generiert das SVG für ein Kreuz.
                symbol = generateCrossSVG();
            }

            // Wenn das Feld an der aktuellen Position leer ist:
            if (!fields[index]) {
                // Fügt eine klickbare Zelle ein, die die `handleClick`-Funktion aufruft, wenn darauf geklickt wird.
                tableHTML += `<td onclick="handleClick(${index}, this)"></td>`;
            } else {
                // Wenn das Feld belegt ist, fügt das entsprechende Symbol (SVG) in die Zelle ein.
                tableHTML += `<td>${symbol}</td>`;
            }
        }        
        // Schließt die aktuelle Tabellenreihe ab.
        tableHTML += '</tr>';
    }
    // Schließt die Tabelle ab.
    tableHTML += '</table>';

    // Fügt den generierten HTML-Inhalt in das Element mit der ID "content" ein.
    document.getElementById('content').innerHTML = tableHTML;
}

function updateCurrentPlayerDisplay() {
    const display = document.getElementById('currentPlayerDisplay');
    const svg = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
    display.innerHTML = `Spieler am Zug: ${svg}`;
}

/** Erklärung: restartGame()
 * - querySelectorAll('svg'): Wählt alle svg-Elemente aus dem DOM aus (z. B. die Gewinnlinie).
 * - for-Schleife: Iteriert über die NodeList der svg-Elemente und entfernt jedes Element mit
 *   .remove().
 */
function restartGame() {
    fields = Array(9).fill(null);
    
    // Aktuellen Spieler zurücksetzen (falls nötig)
    currentPlayer = 'circle'; // Beispiel: Der Kreis beginnt immer.

    // Gezeichnete Gewinnlinie entfernen
    // Alle SVGs auswählen
    const svgElements = document.querySelectorAll('svg'); 
    for (let i = 0; i < svgElements.length; i++) {
        // Jedes SVG aus dem DOM entfernen
        svgElements[i].remove(); 
    }

    // Anzeige zurücksetzen
    updateCurrentPlayerDisplay();

    // Spielfeld neu rendern
    render();
}

/** Zusammenfassung - handleClick()
 * Die Funktion handleClick wird ausgelöst, wenn ein Spieler auf ein Spielfeld klickt. Sie:
 * - Speichert den Zug des aktuellen Spielers im Spielfeld-Array.
 * - Zeigt das entsprechende Symbol (Kreis oder Kreuz) im HTML-Element an.
 * - Deaktiviert weitere Klicks auf das angeklickte Feld.
 * - Überprüft, ob das Spiel einen Gewinner hat.
 * -- Falls ja, zeichnet sie die Gewinnlinie.
 * --Falls nein, wechselt sie den aktuellen Spieler, sodass der andere Spieler an der Reihe ist.
 * @param {*} index 
 * @param {*} element 
 */
function handleClick(index, element) {
    // Speichert den aktuellen Spieler ('circle' oder 'cross') in das `fields`-Array an der angegebenen Position `index`.
    fields[index] = currentPlayer;

    // Überprüft, ob der aktuelle Spieler ein Kreis ist.
    if (currentPlayer === 'circle') {
        // Fügt ein SVG-Element für einen Kreis in das geklickte Element ein.
        element.innerHTML = generateCircleSVG();
    } else if (currentPlayer === 'cross') {
        // Fügt ein SVG-Element für ein Kreuz in das geklickte Element ein.
        element.innerHTML = generateCrossSVG();
    }

    // Deaktiviert den `onclick`-Handler des Elements, sodass es nicht mehr klickbar ist.
    element.onclick = null;

    // Überprüft, ob ein Spieler gewonnen hat, indem die `checkWin()`-Funktion aufgerufen wird.
    const winner = checkWin();
    if (winner) {
        // Falls ein Gewinner existiert, wird die Gewinnlinie mit der Funktion `drawWinningLine` gezeichnet.
        drawWinningLine(winner.line);
    } else {
        // Falls kein Gewinner existiert, wechselt der Spieler zwischen 'circle' und 'cross' für den nächsten Zug.
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

        // Spieleranzeige aktualisieren
        updateCurrentPlayerDisplay(); 
    }
}


/** Zusammenfassung - checkWin()
 * Die Funktion überprüft, ob es eine Gewinnkombination auf einem 3x3-Spielbrett gibt. Sie durchläuft
 * jede mögliche Kombination und prüft, ob alle drei Felder der Kombination denselben Wert haben
 * (entweder "X" oder "O"). Wenn eine Gewinnkombination gefunden wird, gibt die Funktion den
 * Gewinner und die Gewinnlinie zurück. Andernfalls gibt sie null zurück.
 * @returns winner or null
 */
function checkWin() {
    // Definiert alle möglichen Gewinnkombinationen für ein 3x3-Spielbrett.
    const winningCombinations = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6], // Diagonal top-right to bottom-left
    ];

    // Iteriert über jede Gewinnkombination.
    for (let combination of winningCombinations) {
        // Extrahiert die drei Indizes der aktuellen Kombination.
        const [a, b, c] = combination;

        // Überprüft, ob:
        // 1. Das Feld an Position `a` belegt ist.
        // 2. Das Feld an Position `a` denselben Wert wie das Feld an Position `b` hat.
        // 3. Das Feld an Position `a` denselben Wert wie das Feld an Position `c` hat.
        if (
            fields[a] &&
            fields[a] === fields[b] &&
            fields[a] === fields[c]
        ) {
            // Gibt das Symbol des Gewinners (z. B. "X" oder "O") und die Gewinnkombination zurück.
            return { player: fields[a], line: combination };
        }
    }

    // Gibt `null` zurück, wenn keine Gewinnkombination gefunden wurde.
    return null;
}

/** Zusammenfassung - drawWinningLine()
 * Die Funktion zeichnet eine visuelle Linie zwischen zwei Zellen einer HTML-Tabelle, um beispielsweise
 * einen Gewinn in einem Tic-Tac-Toe-Spiel darzustellen. Sie verwendet SVG, um die Linie direkt auf der
 * Webseite zu rendern.
 * @param {*} line 
 */
function drawWinningLine(line) {
    // Bereitet den Zeichenbereich vor, indem die HTML-Tabelle referenziert wird.
    const table = document.querySelector('table');

    // Ermittelt die erste Zelle der Gewinnerlinie basierend auf dem ersten Index in "line".
    const firstCell = table.rows[Math.floor(line[0] / 3)].cells[line[0] % 3];

    // Ermittelt die letzte Zelle der Gewinnerlinie basierend auf dem dritten Index in "line".
    const lastCell = table.rows[Math.floor(line[2] / 3)].cells[line[2] % 3];

    // Holt die Bildschirmkoordinaten (Position und Größe) der ersten Zelle.
    const firstRect = firstCell.getBoundingClientRect();

    // Holt die Bildschirmkoordinaten (Position und Größe) der letzten Zelle.
    const lastRect = lastCell.getBoundingClientRect();

/** SVG als HTML-String generieren
 * position: absolute;      - Setzt das SVG-Element absolut auf der Seite.
 * top: 0;                  - Positioniert es relativ zum oberen Rand des Dokuments.
 * left: 0;                 - Positioniert es relativ zum linken Rand des Dokuments.
 * width: 100%;             - Deckt die gesamte Breite des Fensters ab.
 * height: 100%;            - Deckt die gesamte Höhe des Fensters ab.
 * pointer-events: none;    - Verhindert, dass die SVG die Interaktionen mit anderen Elementen blockiert.
 * 
 * x1="${firstRect.x + firstRect.width / 2}"    - X-Koordinate des Mittelpunkts der ersten Zelle.
 * y1="${firstRect.y + firstRect.height / 2}"   - Y-Koordinate des Mittelpunkts der ersten Zelle.
 * x2="${lastRect.x + lastRect.width / 2}"      - X-Koordinate des Mittelpunkts der letzten Zelle.
 * y2="${lastRect.y + lastRect.height / 2}"     - Y-Koordinate des Mittelpunkts der letzten Zelle.
 * stroke="white"                               - Farbe der Linie (weiß).
 * stroke-width="5"                             - Breite der Linie in Pixeln.
 */
    const svgHTML = `
        <svg 
            style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            " 
            xmlns="http://www.w3.org/2000/svg"
        >
            <line 
                x1="${firstRect.x + firstRect.width / 2}" 
                y1="${firstRect.y + firstRect.height / 2}" 
                x2="${lastRect.x + lastRect.width / 2}" 
                y2="${lastRect.y + lastRect.height / 2}" 
                stroke="white" 
                stroke-width="5"
            />
        </svg>
    `;

    // Fügt das SVG-Element (als HTML-String) in den Body der Webseite ein.
    document.body.innerHTML += svgHTML;
}

/** Zusammenfassung - generateCircleSVG()
 * cx="50" cy="50" r="45"       - Setzt den Kreis-Mittelpunkt auf (50, 50) und den Radius auf 45.
 * stroke="#00B0EF"             - Definiert die Farbe des Kreisrandes (ein Blau-Ton).
 * stroke-width="8"             - Legt die Dicke des Kreisrandes auf 8 Pixel fest.
 * fill="none"                  - Der Kreis hat keine Füllfarbe.
 * stroke-dasharray="282.6"     - Definiert die Gesamtlänge des gestrichelten Kreisrandes.
 * stroke-dashoffset="282.6"    - Setzt den Anfangsversatz des Kreisrandes auf seine Gesamtlänge (unsichtbar).-
 */
function generateCircleSVG() {
    // Gibt einen SVG-String zurück, der eine animierte Kreisform darstellt.
    return `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Definiert einen Kreis -->
            <circle
                cx="50" cy="50" r="45"
                stroke="#00B0EF"
                stroke-width="8"
                fill="none"
                stroke-dasharray="282.6"
                stroke-dashoffset="282.6"
            >
                <animate
                    attributeName="stroke-dashoffset"
                    from="282.6"
                    to="0"
                    dur="500ms"
                    fill="freeze"
                />
            </circle>
        </svg>
    `;
}

/** Zusammenfassung - generateCrossSVG()
 * Erste Linie des Kreuzes
 * x1="20" y1="20" x2="80" y2="80"  - Linie von oben links (20, 20) nach unten rechts (80, 80).
 * stroke="#FFC000"                 - Definiert die Farbe der Linie (ein Gelb-Ton).
 * stroke-width="8"                 - Legt die Dicke der Linie auf 8 Pixel fest.
 * stroke-linecap="round"           - Die Enden der Linie sind abgerundet.
 * stroke-dasharray="84.85"         - Die Länge der gestrichelten Linie wird auf 84.85 festgelegt (entspricht der tatsächlichen Länge).
 * stroke-dashoffset="84.85"        - Setzt den Anfangsversatz der Linie auf ihre Gesamtlänge (unsichtbar).
 * 
 * attributeName="stroke-dashoffset"    - Animiert den `stroke-dashoffset`.
 * from="84.85"                         - Startwert: Linie vollständig unsichtbar.
 * to="0"                               - Endwert: Linie vollständig sichtbar.
 * dur="200ms"                          - Animationsdauer: 200 Millisekunden.
 * fill="freeze"                        - Hält die Animation nach dem Ende im letzten Zustand an.
 * 
 * Zweite Linie des Kreuzes
 * x1="80" y1="20" x2="20" y2="80"  - Linie von oben rechts (80, 20) nach unten links (20, 80).
 * stroke="#FFC000"                 - Definiert die Farbe der Linie (gleiches Gelb wie die erste Linie).
 * stroke-width="8"                 - Legt die Dicke der Linie auf 8 Pixel fest.
 * stroke-linecap="round"           - Die Enden der Linie sind abgerundet.
 * stroke-dasharray="84.85"         - Die Länge der gestrichelten Linie wird auf 84.85 festgelegt.
 * stroke-dashoffset="84.85"        - Setzt den Anfangsversatz der Linie auf ihre Gesamtlänge (unsichtbar).
 * 
 * attributeName="stroke-dashoffset"    - Animiert den `stroke-dashoffset`.
 * from="84.85"                         - Startwert: Linie vollständig unsichtbar.
 * to="0"                               - Endwert: Linie vollständig sichtbar.
 * dur="200ms"                          - Animationsdauer: 200 Millisekunden.
 * begin="200ms"                        - Startet die Animation erst nach 200 Millisekunden (nach der ersten Linie).
 * fill="freeze"                        - Hält die Animation nach dem Ende im letzten Zustand an.-
 */
function generateCrossSVG() {
    // Gibt einen SVG-String zurück, der ein animiertes Kreuz darstellt.
    return `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Erste Linie des Kreuzes -->
            <line 
                x1="20" y1="20" x2="80" y2="80"
                stroke="#FFC000" 
                stroke-width="8" 
                stroke-linecap="round"
                stroke-dasharray="84.85"
                stroke-dashoffset="84.85"
            >
                <!-- Animiert die Linie, sodass sie von unsichtbar (Offset 84.85) zu sichtbar (Offset 0) wird. -->
                <animate 
                    attributeName="stroke-dashoffset" 
                    from="84.85" 
                    to="0" 
                    dur="200ms"
                    fill="freeze" 
                />
            </line>
            <!-- Zweite Linie des Kreuzes -->
            <line 
                x1="80" y1="20" x2="20" y2="80"
                stroke="#FFC000" 
                stroke-width="8" 
                stroke-linecap="round"
                stroke-dasharray="84.85"
                stroke-dashoffset="84.85"
            >
                <!-- Animiert die Linie, sodass sie von unsichtbar (Offset 84.85) zu sichtbar (Offset 0) wird. -->
                <animate 
                    attributeName="stroke-dashoffset" 
                    from="84.85" 
                    to="0" 
                    dur="200ms"
                    begin="200ms"
                    fill="freeze" 
                />
            </line>
        </svg>
    `;
}
