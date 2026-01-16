fetch('data/spirits.json')
    .then(response => response.json())
    .then(spirits => {
        console.log('Fetched spirits data:', spirits);
        displaySpiritList(spirits);
    });

function displaySpiritList(spirits) {
    const container = document.getElementById('spiritListContainer');

    for (const category in spirits) {
        container.innerHTML += `
            <div class="spirit-category">
                <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <ul>
                    ${spirits[category].map(spirit => `<li>${spirit}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}