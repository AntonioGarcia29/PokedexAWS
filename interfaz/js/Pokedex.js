window.onload = init;
var headers = {};
var url = 'http://localhost:3000';
var PokeData = 0;
var pokemonesFiltrados = [];
var currentPage = 1;
var itemsPerPage = 20;

function init() {
    if (localStorage.getItem('pokemonesFiltrados')) {
        pokemonesFiltrados = JSON.parse(localStorage.getItem('pokemonesFiltrados'));
        displayPokemons(pokemonesFiltrados, currentPage);
        createPaginationControls(pokemonesFiltrados.length, itemsPerPage);
    } else {
        loadpoke();
    }
}

function loadpoke() {
    axios.get(url + "/pokedex", headers)
        .then(function (res) {
            console.log(res);
            pokemonesFiltrados = res.data.message;
            displayPokemons(pokemonesFiltrados, currentPage);
            createPaginationControls(pokemonesFiltrados.length, itemsPerPage);
        }).catch(function (err) {
            console.log(err);
        });
}

function displayPokemons(pok, page) {
    console.log("Displaying...");
    var table = document.getElementById('tabla-1');
    table.innerHTML = ''; // Limpia la tabla antes de llenarla

    // Agrega clases de Bootstrap a la tabla
    table.classList.add('table', 'table-bordered', 'table-hover');

    // Agrega el encabezado de la tabla
    table.innerHTML += `<thead class="thead-dark">
                            <tr>
                                <th></th>
                                <th>Id pokemon</th>
                                <th>Nombre</th>
                                <th>Tipos</th>
                                <th>Altura</th>
                                <th>Peso</th>
                                <th>Experiencia Base</th>
                                <th>HP</th>
                                <th>Ataque</th>
                                <th>Defensa</th>
                                <th>Ataque Especial</th>
                                <th>Defensa Especial</th>
                                <th>Velocidad</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody></tbody>`;

    var tbody = table.querySelector('tbody');

    var startIndex = (page - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var paginatedPokemons = pok.slice(startIndex, endIndex);

    for (var i = 0; i < paginatedPokemons.length; i++) {
        // Construye la URL de la imagen según el ID del juego, formateando el ID a 3 dígitos
        const formattedId = pad(paginatedPokemons[i].pok_id, 3);
        const imageUrl = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${formattedId}.png`;

        // Divide la cadena de tipos en un array
        const typesArray = paginatedPokemons[i].pok_types.split(',');

        // Construye una cadena de tipos separados por comas
        const typesString = typesArray.join(', ');

        tbody.innerHTML += `<tr>
            <td><img src="${imageUrl}" alt="Imagen del juego" class="img-fluid" width="150"></td>
            <td>${paginatedPokemons[i].pok_id}</td>
            <td>${paginatedPokemons[i].pok_name}</td>
            <td>${typesString}</td>
            <td>${paginatedPokemons[i].pok_height}</td>
            <td>${paginatedPokemons[i].pok_weight}</td>
            <td>${paginatedPokemons[i].pok_base_experience}</td>
            <td>${paginatedPokemons[i].b_hp}</td>
            <td>${paginatedPokemons[i].b_atk}</td>
            <td>${paginatedPokemons[i].b_def}</td>
            <td>${paginatedPokemons[i].b_sp_atk}</td>
            <td>${paginatedPokemons[i].b_sp_def}</td>
            <td>${paginatedPokemons[i].b_speed}</td>
            <td>
                <button class="btn btn-primary" onclick="updatePoke(${paginatedPokemons[i].pok_id})">Actualizar</button>
            </td>
            <td>
                <button class="btn btn-danger" onclick="delPoke(${paginatedPokemons[i].pok_id})">Borrar</button>
            </td>
        </tr>`;
    }
}




function pad(number, length) {
    return number.toString().padStart(length, '0');
}

function createPaginationControls(totalItems, itemsPerPage) {
    var totalPages = Math.ceil(totalItems / itemsPerPage);
    var paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = ''; // Limpia los controles antes de llenarlos

    // Botón para ir a la primera página
    let firstButton = document.createElement('button');
    firstButton.className = 'btn btn-secondary mx-1';
    firstButton.innerText = 'First';
    firstButton.addEventListener('click', function() {
        currentPage = 1;
        displayPokemons(pokemonesFiltrados, currentPage);
        createPaginationControls(totalItems, itemsPerPage);
    });
    paginationControls.appendChild(firstButton);

    // Botones de paginación (máximo 5)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        let button = document.createElement('button');
        button.className = 'btn btn-secondary mx-1';
        button.innerText = i;
        button.addEventListener('click', function() {
            currentPage = i;
            displayPokemons(pokemonesFiltrados, currentPage);
            createPaginationControls(totalItems, itemsPerPage);
        });
        if (i === currentPage) {
            button.classList.add('active');
        }
        paginationControls.appendChild(button);
    }

    // Botón para ir a la última página
    let lastButton = document.createElement('button');
    lastButton.className = 'btn btn-secondary mx-1';
    lastButton.innerText = 'Last';
    lastButton.addEventListener('click', function() {
        currentPage = totalPages;
        displayPokemons(pokemonesFiltrados, currentPage);
        createPaginationControls(totalItems, itemsPerPage);
    });
    paginationControls.appendChild(lastButton);
}

function searchPoke() {
    console.log("Searching...");
    var nombreDado = document.getElementById("input-search").value;
    nombreDado = String(nombreDado);
    console.log(nombreDado);

    axios.get(url + '/pokedex/' + nombreDado)
        .then(function (res) {
            pokemonesFiltrados = res.data.message;
            console.log(pokemonesFiltrados);
            var table = document.getElementById('tabla-1');
            table.innerHTML = "";
            displayPokemons(pokemonesFiltrados, currentPage);
            createPaginationControls(pokemonesFiltrados.length, itemsPerPage);
            localStorage.setItem('pokemonesFiltrados', JSON.stringify(pokemonesFiltrados));
        }).catch(function (err) {
            console.log(err);
        });
}

function updatePoke(pok_id) {
    // Redirige a la página de edición con el ID del Pokémon en la URL
    console.log(pok_id);
    window.location.href = `Editar.html?pok_id=${pok_id}`;
}


function delPoke(id) {
    axios.delete(url + '/pokedex/' + id)
        .then(function (res) {
            // Elimina el Pokémon de la lista local
            pokemonesFiltrados = pokemonesFiltrados.filter(pokemon => pokemon.pok_id !== id);
            // Vuelve a renderizar la tabla
            displayPokemons(pokemonesFiltrados, currentPage);
            createPaginationControls(pokemonesFiltrados.length, itemsPerPage);
        }).catch(function (err) {
            // Manejar el error aquí si es necesario
        });
}
