window.onload = init;

var headers = {
    'Content-Type': 'application/json'
};
var url = 'http://54.227.11.110:3000'
function init() {
    const form = document.getElementById('pokemonForm');

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
            const response = await axios.post(`${url}/Pokedex/`, pokemonData, { headers });
            console.log(response.data);
            alert('Pokémon agregado exitosamente');
        } catch (error) {
            console.error('Error al agregar el Pokémon:', error);
            alert('Error al agregar el Pokémon');
        }
    });
}

function redirectToPokedex() {
    window.location.href = "Pokedex.html";
}
