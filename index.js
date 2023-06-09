const PAGE_SIZE = 10
let currentPage = 1;
let pokemons = []
let numPageBtn = 5;
let showPokemon = 0;
let totalPokemon = 0;

function displayTotal(){
  var showing = document.getElementById("showing");
  showing.innerText = "Showing " + showPokemon + " of " + totalPokemon + " Pokemon";
}

const updatePaginationDiv = (currentPage, numPages) => {
  $('#pagination').empty()

  const startPage = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
  const endPage = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));
  for (let i = startPage; i <= endPage; i++) {
    let active = "";
    if (i === currentPage) {
      active = "active";
    }
    $('#pagination').append(`
    <button class="btn btn-danger page ml-1 numberedButtons ${active}" value="${i}">${i}</button>
    `)
  }

  if (currentPage > 1) {
    $('#pagination').prepend(`
    <button class="btn btn-danger page ml-1 numberedButtons" value="${currentPage - 1}">Prev</button>
    `)
  }
  if (currentPage < numPages) {
    $('#pagination').append(`
    <button class="btn btn-danger page ml-1 numberedButtons" value="${currentPage + 1}">Next</button>
    `)
  }

}





const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  $('#pokeCards').empty()
  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    $('#pokeCards').append(`
    <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#pokeModal">
          More
        </button>
        </div>  
        `)
  })
  showPokemon = selected_pokemons.length;
  displayTotal();


}


const setup = async () => {
    // test out poke api using axios here
    $('#pokeCards').empty()
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    const pokemons = response.data.results;
    totalPokemon = pokemons.length;
    displayTotal();

    paginate(currentPage, PAGE_SIZE, pokemons)
    const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
    updatePaginationDiv(currentPage, numPages)



  // pop up modal when clicking on a pokemon card
  // add event listener to each pokemon card
  $('body').on('click', '.pokeCard', async function (e) {
    const pokemonName = $(this).attr('pokeName')
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    // console.log("types: ", types);
    $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>
        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
        </div>
        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `)
    $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
  })
  // add event listener to pagination buttons
  $('body').on('click', ".numberedButtons", async function (e) {
    currentPage = Number(e.target.value)
    paginate(currentPage, PAGE_SIZE, pokemons)

    //update pagination buttons
    updatePaginationDiv(currentPage, numPages)
  })



}


function showingNumberOfPokemon() {
  $('#qtyPokemonDisplay').empty()
  $('#qtyPokemonDisplay').append(`
  <h5>Showing ${qtyPokemonDisplay} of ${ pokemons.length } Pokemon</h5>
  `)
}


$(document).ready(setup)