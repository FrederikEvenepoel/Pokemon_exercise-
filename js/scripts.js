let allPokemon = [];
let filteredPokemon = [];
let activeType = null; 

async function fetchAllPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        allPokemon = data.results.map(pokemon => ({
            name: pokemon.name,
            url: pokemon.url,
        }));
        displayPokemonCards(allPokemon.slice(0, 100)); 
    } catch (error) {
        console.error('Error fetching all Pokémon:', error);
    }
}

async function fetchPokemonByType(type) {
    try {
        activeType = type; 
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await response.json();

        filteredPokemon = data.pokemon.map(entry => ({
            name: entry.pokemon.name,
            url: entry.pokemon.url,
        }));

        console.log(`Filtered Pokémon of type ${type}:`, filteredPokemon); 

        displayPokemonCards(filteredPokemon.slice(0, 100));
    } catch (error) {
        console.error(`Error fetching Pokémon by type ${type}:`, error);
    }
}

function searchAllPokemon() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase().trim();
    console.log('Search input:', searchInput); 

    if (!searchInput) {
        displayPokemonCards([]); 
        return;
    }
    const matchingPokemon = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchInput) 
    );

    console.log('Matching Pokémon:', matchingPokemon);g

    displayPokemonCards(matchingPokemon); 
}

async function displayPokemonCards(pokemonList) {
    const main = document.getElementById('pokemon-cards');
    main.innerHTML = ''; 

    for (const pokemon of pokemonList) {
        try {
            const pokemonData = await fetch(pokemon.url).then(res => res.json());

            const card = document.createElement('div');
            card.classList.add('pokemon-card');

            const pokemonId = pokemonData.id;
            const pokemonName = pokemonData.name;
            const pokemonTypes = pokemonData.types.map(t => t.type.name);

            card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemonName}">
                <p class="pokemon-name">${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</p>
                <p class="pokemon-id">ID: ${pokemonId}</p>
                <div class="pokemon-types">
                    ${pokemonTypes
                        .map(
                            type => `<span class="type-label ${type}-type">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`
                        )
                        .join('')}
                </div>
            `;
            main.appendChild(card);
        } catch (error) {
            console.error('Error displaying Pokémon:', error);
        }
    }

    if (pokemonList.length === 0) {
        main.innerHTML = '<p>No Pokémon found. Try searching for another name or type!</p>';
    }
}


fetchAllPokemon();


