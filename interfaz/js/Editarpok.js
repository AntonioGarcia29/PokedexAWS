window.onload = init;

var headers = {
    'Content-Type': 'application/json'
};
var url = 'http://localhost:3000';

function init() {
    const form = document.getElementById('pokemonForm');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pok_id = urlParams.get('pok_id');

    if (pok_id) {
        loadPokemonData(pok_id);
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const pok_id = document.getElementById('pok_id').value;
        const pok_name = document.getElementById('pok_name').value;
        const pok_height = document.getElementById('pok_height').value;
        const pok_weight = document.getElementById('pok_weight').value;
        const pok_base_experience = document.getElementById('pok_base_experience').value;
        const b_hp = document.getElementById('b_hp').value;
        const b_atk = document.getElementById('b_atk').value;
        const b_def = document.getElementById('b_def').value;
        const b_sp_atk = document.getElementById('b_sp_atk').value;
        const b_sp_def = document.getElementById('b_sp_def').value;
        const b_speed = document.getElementById('b_speed').value;
        const pok_types = document.getElementById('pok_types').value.split(',').map(type => type.trim());

        const pokemonData = {
            pok_id,
            pok_name,
            pok_height,
            pok_weight,
            pok_base_experience,
            b_hp,
            b_atk,
            b_def,
            b_sp_atk,
            b_sp_def,
            b_speed,
            pok_types
        };

        try {
            const response = await axios.patch(`${url}/pokedex/${pok_id}`, pokemonData, { headers });
            console.log(response.data);
            alert('Pokémon actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar el Pokémon:', error);
            alert('Error al actualizar el Pokémon');
        }
    });
}

async function loadPokemonData(pok_id) {
    try {
        const response = await axios.get(`${url}/Pokedex/${pok_id}`);
        const pokemon = response.data.message[0];  // Asegúrate de acceder a los datos correctos

        document.getElementById('pok_id').value = pokemon.pok_id;
        document.getElementById('pok_name').value = pokemon.pok_name;
        document.getElementById('pok_height').value = pokemon.pok_height;
        document.getElementById('pok_weight').value = pokemon.pok_weight;
        document.getElementById('pok_base_experience').value = pokemon.pok_base_experience;
        document.getElementById('b_hp').value = pokemon.b_hp;
        document.getElementById('b_atk').value = pokemon.b_atk;
        document.getElementById('b_def').value = pokemon.b_def;
        document.getElementById('b_sp_atk').value = pokemon.b_sp_atk;
        document.getElementById('b_sp_def').value = pokemon.b_sp_def;
        document.getElementById('b_speed').value = pokemon.b_speed;
        document.getElementById('pok_types').value = pokemon.pok_types.join(', ');

    } catch (error) {
        console.error('Error al cargar los datos del Pokémon:', error);
        alert('Error al cargar los datos del Pokémon');
    }
}

function redirectToPokedex() {
    window.location.href = "Pokedex.html";
}