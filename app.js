const streamUrl = "https://stream.zeno.fm/laig88avevmuv";

const audio = document.getElementById("audioPlayer");
audio.src = streamUrl;
audio.preload = "auto";
audio.volume = 0.8;

const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");
const volumeSlider = document.getElementById("volumeSlider");
const networkStatus = document.getElementById("networkStatus");
const progressBar = document.getElementById("progressBar");
const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;
let isPlaying = false;
let pulseTicker = 0;

const setPlayingState = (playing) => {
  isPlaying = playing;
  const playPath = playing
    ? '<path d="M7 5h4v14H7zm6 0h4v14h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';

  playIcon.innerHTML = playPath;
  playPauseBtn.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
  playPauseBtn.title = playing ? "Pausar" : "Reproducir";

  if (playing) {
    networkStatus.textContent = "Transmitiendo";
    networkStatus.style.color = "#b8f7d7";
  } else {
    networkStatus.textContent = "En espera";
    networkStatus.style.color = "#94a3b8";
  }
};

const setMuteState = (muted) => {
  audio.muted = muted;
  const icon = muted
    ? '<path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v2.21l2.45 2.45c.05-.2.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A9.93 9.93 0 0 0 21 12c0-4.28-2.99-7.86-7-8.8v2.07c2.89.86 5 3.54 5 6.73zm-5-9L9 10H5v4h4l5 5V3zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25 1.27-1.27L4.27 3z"/>'
    : '<path d="M3 10v4h4l5 5V5L7 10zm11 .2 4.5-4.5 1.4 1.4-4.5 4.5 4.5 4.5-1.4 1.4L14 14.8z"/>';

  muteIcon.innerHTML = icon;
  muteBtn.title = muted ? "Activar sonido" : "Silenciar";
  muteBtn.setAttribute("aria-label", muted ? "Activar sonido" : "Silenciar");
};

const updateVolumeDisplay = () => {
  const currentVolume = Math.round(audio.volume * 100);
  volumeSlider.value = currentVolume;
};

const animateVisualizer = () => {
  const bars = document.querySelectorAll(".visualizer span");
  const active = pulseTicker % bars.length;

  bars.forEach((bar, index) => {
    const intensity = index === active ? 1 : 0.45;
    bar.style.opacity = String(intensity);
    bar.style.transform = index === active ? "scaleY(1.1)" : "scaleY(1)";
  });

  pulseTicker += 1;
};

const startLivePulse = () => {
  setInterval(() => {
    if (isPlaying) {
      animateVisualizer();
      const wave = 35 + ((pulseTicker * 14) % 50);
      progressBar.style.width = `${wave}%`;
    }
  }, 420);
};

const playAudio = async () => {
  try {
    await audio.play();
    setPlayingState(true);
  } catch (error) {
    console.error("No se pudo iniciar la reproducción:", error);
    networkStatus.textContent = "Reintentar";
    networkStatus.style.color = "#fbbf24";
  }
};

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    playAudio();
  } else {
    audio.pause();
    setPlayingState(false);
    progressBar.style.width = "18%";
  }
});

muteBtn.addEventListener("click", () => {
  const muted = !audio.muted;
  setMuteState(muted);
});

volumeSlider.addEventListener("input", (event) => {
  const value = Number(event.target.value) / 100;
  audio.volume = value;
  audio.muted = value === 0;
  setMuteState(audio.muted);
  updateVolumeDisplay();
});

audio.addEventListener("play", () => setPlayingState(true));
audio.addEventListener("pause", () => setPlayingState(false));
audio.addEventListener("waiting", () => {
  networkStatus.textContent = "Buffering";
  networkStatus.style.color = "#fbbf24";
});
audio.addEventListener("canplay", () => {
  if (!audio.paused) {
    networkStatus.textContent = "Transmitiendo";
    networkStatus.style.color = "#b8f7d7";
  }
});
audio.addEventListener("error", () => {
  networkStatus.textContent = "Sin señal";
  networkStatus.style.color = "#fca5a5";
  setPlayingState(false);
});

audio.addEventListener("ended", () => {
  setPlayingState(false);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === "accepted") {
    installBtn.classList.add("hidden");
  }

  deferredPrompt = null;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

setPlayingState(false);
setMuteState(false);
updateVolumeDisplay();
startLivePulse();
progressBar.style.width = "18%";
