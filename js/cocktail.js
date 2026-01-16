const params = new URLSearchParams(window.location.search);
const drinkId = params.get('drink');

if (!drinkId) {
    displayError('No cocktail selected');
}

fetch('data/cocktails.json')
    .then(response => response.json())
    .then(cocktails => {
        console.log('Fetched cocktails data:', cocktails);
        for (const type in cocktails) {
            const cocktail = cocktails[type].find(c => c.id === drinkId);
            if (cocktail) {
                displayCocktailDetails(cocktail);
                return;
            }
        }
        displayError(`Cocktail "${drinkId}" not found`);
        return;
    });

function displayCocktailDetails(cocktail) {
    const heading = document.getElementById('heading');
    if (cocktail.favorite) {
        heading.innerHTML = `
            <h1>${cocktail.name}</h1>
            <img src="images/sacred-heart.png" alt"Sacred Heart" class="sacred-heart-icon">
        `;
    } else {
        heading.innerHTML = `<h1>${cocktail.name}</h1>`;
    }
    const container = document.getElementById('cocktailDetailsContainer');
    container.innerHTML = `
        <div class="cocktail-details">
            <div class="cocktail-header">
                <img src="images/${cocktail.name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${cocktail.name}" class="cocktail-detail-image">
                <div class="cocktail-info">
                    <p><strong>Glass:</strong>&nbsp;&nbsp;${cocktail.glass}</p>
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        ${cocktail.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                    <p><strong>Garnish:</strong>&nbsp;&nbsp;${cocktail.garnish || 'None'}</p>
                    <p><strong>Instructions:</strong>&nbsp;&nbsp;${cocktail.instructions}</p>
                    <!-- <p><strong>Description:</strong>&nbsp;&nbsp;${cocktail.description}</p> -->
                    <p><strong>Quote:</strong>&nbsp;&nbsp;${cocktail.quote}</p>
                </div>
            </div>
        </div>
        <a href="index.html" class="back-link">Back to Cocktails</a>
    `;
}

function displayError(message) {
  document.getElementById('cocktailDetailsContainer').innerHTML = `
    <p>${message}</p>
    <a href="index.html">Back to menu</a>
  `;
}