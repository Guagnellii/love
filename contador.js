console.log("contador.js cargado correctamente")
const inicioRelacion = new Date(2025, 7, 6);

function actualizarContador() {
    const contador = document.getElementById("contador");
    if (!contador) return; // Evita errores en páginas sin el contador
    const hoy = new Date();
    const diferencia = hoy - inicioRelacion;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    contador.textContent = `Llevamos juntos ${dias} días!`;
}

actualizarContador();
setInterval(actualizarContador, 1000);

const modal = document.getElementById("modal");
const modalImg = document.getElementById("imgModal");
const cerrar = document.querySelector(".cerrar"); 

const zoomBtns = document.querySelectorAll(".zoom-btn");

zoomBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        const img = this.parentElement.querySelector("img"); 
        modalImg.src = img.src;
        modal.style.display = "flex";
    });
});

cerrar.addEventListener("click", () => {
    modal.style.display = "none";
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modal.style.display = "none";
    }
});

const header = document.querySelector("header");
let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add("hidden");
    } else {
        header.classList.remove("hidden");
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

const footer = document.querySelector("footer");
let lastScrollFooter = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollFooter && currentScroll > 50) {
        // bajando: mostrar footer
        footer.classList.add("visible-footer");
    } else {
        // subiendo: ocultar footer
        footer.classList.remove("visible-footer");
    }

    lastScrollFooter = currentScroll <= 0 ? 0 : currentScroll;
});

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("uploadBtn").addEventListener("click", async () => {
    const audioFile = document.getElementById("audioFile").files[0];
    const coverFile = document.getElementById("coverFile").files[0];
    const songName = document.getElementById("songName").value;
    const artistName = document.getElementById("artistName").value;

    if (!audioFile || !coverFile || !songName || !artistName) return alert("Completa todos los campos");

    const coverRef = storage.ref('covers/' + coverFile.name);
    await coverRef.put(coverFile);
    const coverURL = await coverRef.getDownloadURL();

    const audioRef = storage.ref('songs/' + audioFile.name);
    await audioRef.put(audioFile);
    const audioURL = await audioRef.getDownloadURL();

    await db.collection("playlist").add({
        nombre: songName,
        artista: artistName,
        cover: coverURL,
        audio: audioURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Canción subida!");
});

const playlistContainer = document.querySelector(".playlist");

db.collection("playlist").orderBy("timestamp").onSnapshot(snapshot => {
    playlistContainer.innerHTML = ""; 
    snapshot.forEach(doc => {
        const data = doc.data();
        const item = document.createElement("div");
        item.classList.add("playlist-item");
        item.innerHTML = `
            <img src="${data.cover}" width="50">
            <span>${data.nombre} - ${data.artista}</span>
        `;
        item.addEventListener("click", () => {
            reproducirCancion(data.audio, data.cover, data.nombre, data.artista);
        });
        playlistContainer.appendChild(item);
    });
});

function reproducirCancion(audioURL, coverURL, nombre, artista) {
    const audio = new Audio(audioURL);
    document.querySelector(".music-player img").src = coverURL;
    document.querySelector(".song-title").textContent = nombre;
    document.querySelector(".song-artist").textContent = artista;
    audio.play();


}

document.addEventListener("DOMContentLoaded", () => {
    const player = document.querySelector('.spotify-player');
    if (player) {
        setTimeout(() => {
            player.classList.add('visible');
        }, 300);
    }
});

const toggleButton = document.getElementById(`togglePlayer`);
const spotifyPlayer = document.querySelector(`.spotify-player`);

toggleButton.addEventListener(`click`, () => {
    spotifyPlayer.classList.toggle(`minimized`);
    toggleButton.textContent = spotifyPlayer.classList.contains(`minimized`) ? `+` : `-`;
});


const envelopeBtn = document.getElementById('openEnvelope');

if (envelopeBtn) {
    envelopeBtn.addEventListener('click', () => {
        window.location.href = "sobre.html"; 
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script cargado correctamente");

    const heartBtn = document.getElementById('heartButton');
    const msg = document.getElementById('loveMessage');
    const paperSound = document.getElementById('paperSound');

    // Solo ejecuta esta parte si estamos en sobre.html
    if (!heartBtn || !msg) {
        console.log("ℹ️ Página sin corazón, se omite el código romántico.");
        return;
    }

    console.log("❤️ Corazón detectado en el DOM");

    const frases = [
        "¡Te amo más de lo que te puedo explicar y demostrar!",
        "Cada momento que paso contigo vale millones 💖",
        "Eres mi lugar deseado y perfecto ✨",
        "Gracias por hacerme feliz 🌹",
        "Gracias por amarme 💕",
        "Gracias por quererme 😍",
        "Te amo corazón de melón 🍉",
        "Tu haces que todo valga la pena 💫",
        "Mi vida es mucho mejor contigo 💞",
        "Eres mi mujer 💋",
        "Vales todooo 💘"
    ];

    let indexFrase = 0;

    heartBtn.addEventListener('click', () => {
        console.log("💌 Clic en el corazón detectado correctamente");

        msg.textContent = frases[indexFrase];
        indexFrase = (indexFrase + 1) % frases.length;

        if (paperSound) {
            paperSound.currentTime = 0;
            paperSound.play().catch(err => console.warn("No se pudo reproducir el sonido:", err));
        }

        const fraseFlotante = document.createElement("div");
        fraseFlotante.textContent = frases[Math.floor(Math.random() * frases.length)];
        fraseFlotante.classList.add("floating-message");
        fraseFlotante.style.left = Math.random() * 90 + "%";
        fraseFlotante.style.top = Math.random() * 80 + "%";
        fraseFlotante.style.color = ["#ff4f87", "#ffb6c1", "#ff69b4", "#ff1493", "#c71585"][Math.floor(Math.random() * 5)];
        document.body.appendChild(fraseFlotante);
        setTimeout(() => fraseFlotante.remove(), 4000);
    });
});