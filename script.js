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
    render();
}

function render() {
    let tableHTML = '<table>';
    for (let row = 0; row < 3; row++) {
        tableHTML += '<tr>';
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            let symbol = '';

            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }

            if (!fields[index]) {
                tableHTML += `<td onclick="handleClick(${index}, this)"></td>`;
            } else {
                tableHTML += `<td>${symbol}</td>`;
            }
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    document.getElementById('content').innerHTML = tableHTML;
}

function handleClick(index, element) {
    fields[index] = currentPlayer;

    if (currentPlayer === 'circle') {
        element.innerHTML = generateCircleSVG();
    } else if (currentPlayer === 'cross') {
        element.innerHTML = generateCrossSVG();
    }

    element.onclick = null;

    // Überprüfen, ob das Spiel vorbei ist
    const winner = checkWin();
    if (winner) {
        drawWinningLine(winner.line);
    } else {
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function checkWin() {
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

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            fields[a] &&
            fields[a] === fields[b] &&
            fields[a] === fields[c]
        ) {
            return { player: fields[a], line: combination };
        }
    }
    return null;
}

function drawWinningLine(line) {
    // Zeichenbereich vorbereiten
    const table = document.querySelector('table');
    const firstCell = table.rows[Math.floor(line[0] / 3)].cells[line[0] % 3];
    const lastCell = table.rows[Math.floor(line[2] / 3)].cells[line[2] % 3];

    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();

    // SVG als HTML-String generieren
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

    // SVG-HTML in den Body einfügen
    document.body.innerHTML += svgHTML;
}

function generateCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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

function generateCrossSVG() {
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
