function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
    return `${String(hours).padStart(2, "0")}:${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

const audioPlayers = document.querySelectorAll(".player");

audioPlayers.forEach((player) => {
    const src = player.dataset.src || "mp3/NLT.wav"; // fallback falls kein data-src
    const audio = new Audio(src);

    const playBtn = player.querySelector(".toggle-play");
    const timeline = player.querySelector(".timeline");
    const progressBar = player.querySelector(".progress");
    const currentTimeElem = player.querySelector(".time .current");
    const lengthElem = player.querySelector(".time .length");

    audio.volume = 0.75;

    audio.addEventListener("loadeddata", () => {
        lengthElem.textContent = getTimeCodeFromNum(audio.duration);
    });

    // Play/Pause
    playBtn.addEventListener("click", () => {
        // optional: andere Player pausieren
        audioPlayers.forEach(p => {
            if (p !== player) {
                const otherAudio = p.audioRef;
                if (otherAudio && !otherAudio.paused) {
                    otherAudio.pause();
                    p.querySelector(".toggle-play").classList.remove("pause");
                    p.querySelector(".toggle-play").classList.add("play");
                }
            }
        });

        if (audio.paused) {
            playBtn.classList.remove("play");
            playBtn.classList.add("pause");
            audio.play();
        } else {
            playBtn.classList.remove("pause");
            playBtn.classList.add("play");
            audio.pause();
        }
    });

    // Timeline klick
    timeline.addEventListener("click", e => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
        audio.currentTime = timeToSeek;
    });

    // Fortschritt
    setInterval(() => {
        if (!audio.duration) return;
        progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
        currentTimeElem.textContent = getTimeCodeFromNum(audio.currentTime);
    }, 500);

    // Audio-Referenz speichern
    player.audioRef = audio;
});

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".content");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));

    sections.forEach(section => {
        if (section.getBoundingClientRect().top < window.innerHeight) {
            section.classList.add("visible");
        }
    });
});