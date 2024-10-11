const typeColor = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
};

const url = "https://pokeapi.co/api/v2/pokemon/";
const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/";
const card = document.getElementById("card");
const btn = document.getElementById("btn");
const loading = document.getElementById("loading");
const welcome = document.querySelector("h1"); // Ambil elemen welcome

let getPokeData = () => {
    let id = Math.floor(Math.random() * 150) + 1;
    const finalUrl = url + id;
    const finalSpeciesUrl = speciesUrl + id;

    // Tampilkan loading, sembunyikan kartu, welcome, dan tombol
    loading.style.display = "block";
    card.style.display = "none";
    welcome.style.display = "none"; // Sembunyikan welcome
    btn.style.display = "none"; // Sembunyikan tombol

    // Timer 2 detik untuk loading
    const loadingTimer = setTimeout(() => {
        // Fetch data Pokémon
        fetch(finalUrl)
            .then((response) => {
                if (!response.ok) throw new Error('Pokémon not found');
                return response.json();
            })
            .then((data) => {
                return fetch(finalSpeciesUrl)
                    .then((response) => {
                        if (!response.ok) throw new Error('Species not found');
                        return response.json();
                    })
                    .then((speciesData) => {
                        generateCard(data, speciesData);
                    });
            })
            .catch((error) => {
                card.innerHTML = `<p class="error">${error.message}</p>`; // Tampilkan pesan kesalahan
            })
            .finally(() => {
                loading.style.display = "none"; // Sembunyikan loading setelah selesai
                card.style.display = "block"; // Tampilkan kartu setelah loading
                welcome.style.display = "block"; // Tampilkan welcome kembali
                btn.style.display = "block"; // Tampilkan tombol kembali
                clearTimeout(loadingTimer); // Hentikan timer jika selesai lebih cepat dari 2 detik
            });
    }, 1000);
};

// Generate card
let generateCard = (data, speciesData) => {
    console.log(data);
    const hp = data.stats[0].base_stat;
    const imgSrc = data.sprites.other.dream_world.front_default;
    const pokeName = data.name[0].toUpperCase() + data.name.slice(1);

    const statAttack = data.stats[1].base_stat;
    const statDefend = data.stats[2].base_stat;
    const statSpeed = data.stats[5].base_stat;

    // Ambil deskripsi dari data spesies
    const flavorTextEntries = speciesData.flavor_text_entries.filter(entry => entry.language.name === "en");
    const description = flavorTextEntries.length > 0 ? flavorTextEntries[flavorTextEntries.length - 1].flavor_text : "No description available.";

    // Set theme Pokémon
    const themeColor = typeColor[data.types[0].type.name];
    card.innerHTML = `
        <p class="hp">
            <span>HP</span>
            ${hp}
        </p>
        <img src=${imgSrc} alt="pokemon" />
        <h2 class="poke-name">${pokeName}</h2>
        <p class="description">${description}</p>
        <div class="types"></div>
        <div class="stats">
            <div>
                <h3>${statAttack}</h3>
                <p>attack</p>
            </div>
            <div>
                <h3>${statDefend}</h3>
                <p>defense</p>
            </div>
            <div>
                <h3>${statSpeed}</h3>
                <p>speed</p>
            </div>
        </div>
    `;
    appendTypes(data.types);
    styleCard(themeColor);
};

let appendTypes = (types) => {
    types.forEach((item) => {
        let span = document.createElement("SPAN");
        span.textContent = item.type.name;
        document.querySelector(".types").appendChild(span);
    });
};

let styleCard = (color) => {
    card.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
    card.querySelectorAll(".types span").forEach(typeColor => {
        typeColor.style.backgroundColor = color;
    });
};

btn.addEventListener("click", getPokeData);
window.addEventListener("load", getPokeData);
