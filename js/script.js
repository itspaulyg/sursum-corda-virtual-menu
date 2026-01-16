let cocktailsData = {};
let selectedCategories = new Set();
let selectedSpirits = new Set();

function titleCase(str) {
    return str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

// Fetch the cocktails data
fetch('data/cocktails.json')
    .then(response => response.json())
    .then(data => {
        // merge data and tag category for easier filtering
        const classics = data.classics.map(c => ({ ...c, category: 'classics' }));
        const modern = data.modern.map(c => ({ ...c, category: 'modern' }));

        cocktailsData.all = [...classics, ...modern];
        cocktailsData.classics = classics;
        cocktailsData.modern = modern;

        let favorite = [];
        for (cocktail of cocktailsData.all) {
            if (cocktail.favorite) {
                console.log("true");
                favorite.push(cocktail);
            }
        }

        cocktailsData.favorite = favorite;

        console.log(cocktailsData);

        buildSpiritButtons();
        displayCocktails();
    })
    .catch(err => {
        console.error('Failed to load cocktails:', err);
        const container = document.getElementById('cocktailsContainer');
        container.innerHTML = '<div class="error-message">Unable to load cocktails data.</div>';
    });

function buildSpiritButtons() {
    const spiritSet = new Set();
    cocktailsData.all.forEach(c => {
        if (Array.isArray(c.spirit)) c.spirit.forEach(s => spiritSet.add(s));
    });

    const spirits = Array.from(spiritSet).sort();
    const container = document.getElementById('spiritButtons');
    container.innerHTML = '';

    spirits.forEach(spirit => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn spirit-btn';
        btn.dataset.spirit = spirit;
        btn.textContent = titleCase(spirit);
        btn.addEventListener('click', () => {
            toggleSpirit(spirit, btn);
        });
        container.appendChild(btn);
    });
}

function toggleSpirit(spirit, btn) {
    if (selectedSpirits.has(spirit)) {
        selectedSpirits.delete(spirit);
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    } else {
        selectedSpirits.add(spirit);
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
    }
    displayCocktails();
}

function toggleCategory(category, btn) {
    if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    } else {
        selectedCategories.add(category);
        console.log("added category:", category);
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
    }
    displayCocktails();
}

function displayCocktails() {
    // safety: if data isn't loaded yet, just return
    if (!cocktailsData.all) return;
    const container = document.getElementById('cocktailsContainer');
    container.innerHTML = '';

    let items = cocktailsData.all.slice();

    // Category filter (OR across Classics/Modern, but AND with Favorite)
    if (selectedCategories.size > 0) {
        if (selectedCategories.has('favorite')) {
            if (selectedCategories.size === 1) {
                items = items.filter(c => c.favorite === true);
            } else {
                items = items.filter(c => selectedCategories.has(c.category));
                items = items.filter(c => c.favorite === true);
            }
        } else {
            items = items.filter(c => selectedCategories.has(c.category));
        }
    }

    // Spirit filter (AND across selected spirits)
    if (selectedSpirits.size > 0) {
        items = items.filter(c => {
            // ensure all selected spirits are present in cocktail.spirit
            for (let sp of selectedSpirits) {
                if (!Array.isArray(c.spirit) || !c.spirit.includes(sp)) return false;
            }
            return true;
        });
    }

    if (items.length === 0) {
        container.innerHTML = '<div class="error-message">No cocktails match the selected filters.</div>';
        return;
    }

    items.forEach(cocktail => {
        const cocktailLink = document.createElement('a');
        cocktailLink.href = `cocktail.html?drink=${cocktail.id}`;
        cocktailLink.className = 'cocktail-link';
        if (cocktail.favorite) {
            cocktailLink.innerHTML = `
                <div class="cocktail-card">
                    <img src="images/sacred-heart.png" alt="Sacred Heart" class="sacred-heart-icon-card">
                    <div class="cocktail-image">
                        <img src="images/${cocktail.name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${cocktail.name}">
                    </div>
                    <h3>${cocktail.name}</h3>
                </div>
            `;
        } else {
            cocktailLink.innerHTML = `
                <div class="cocktail-card">
                    <div class="cocktail-image">
                        <img src="images/${cocktail.name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${cocktail.name}">
                    </div>
                    <h3>${cocktail.name}</h3>
                </div>
            `;
        }
        container.appendChild(cocktailLink);
    });
}

// setup category button listeners
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('#categoryButtons .filter-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.filter;
            console.log("toggling category:", cat);
            toggleCategory(cat, btn);
        });
    });

    const toggleBtn = document.getElementById('toggleSpiritBtn');
    const spiritContainer = document.getElementById('spiritButtons');
    if (toggleBtn && spiritContainer) {
        // ensure initial hidden state matches markup
        spiritContainer.style.display = spiritContainer.classList.contains('hidden') ? 'none' : '';
        toggleBtn.setAttribute('aria-expanded', spiritContainer.classList.contains('hidden') ? 'false' : 'true');
        if (!spiritContainer.classList.contains('hidden')) toggleBtn.classList.add('active');

        toggleBtn.addEventListener('click', () => {
            const nowHidden = spiritContainer.classList.toggle('hidden');
            spiritContainer.style.display = nowHidden ? 'none' : '';
            toggleBtn.setAttribute('aria-expanded', nowHidden ? 'false' : 'true');
            toggleBtn.classList.toggle('active', !nowHidden);
        });
    }
});