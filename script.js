let fields = [
    null,
    'circle',
    'circle',
    null,
    'cross',
    null,
    'cross',
    null,
    null,
];

function init() {
    // Die Tabelle beim Laden der Seite rendern
    render();
}

function render() {
    // Die Tabelle dynamisch generieren
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

            tableHTML += `<td>${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    // HTML in den Container rendern
    document.getElementById('content').innerHTML = tableHTML;
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
