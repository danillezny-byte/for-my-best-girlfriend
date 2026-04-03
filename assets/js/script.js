const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const titleEl = document.getElementById('title');
const noCounter = document.getElementById('noCounter');
const mainScreen = document.getElementById('mainScreen');
const yesScreen = document.getElementById('yesScreen');
const certificateScreen = document.getElementById('certificateScreen');
const celebrationScreen = document.getElementById('celebrationScreen');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

// ========== SCREEN TRANSITIONS ==========
function showScreen(screen) {
    document.querySelectorAll('.screen.active').forEach(s => s.classList.remove('active'));
    // Small delay so the fade-out starts before fade-in
    setTimeout(() => screen.classList.add('active'), 50);
}

// ========== DAYS COUNTER ==========
const startDate = new Date(2023, 7, 14);
function updateDaysCounter() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    document.querySelectorAll('.days-counter').forEach(el => {
        el.textContent = `Together for ${diff} days`;
    });
}
updateDaysCounter();
setInterval(updateDaysCounter, 60000);

// ========== CERTIFICATE DATE ==========
const dateEl = document.getElementById('certificateDate');
const today = new Date();
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
dateEl.textContent = `Signed on ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

// ========== TYPEWRITER EFFECT ==========
const fullTitle = 'Will you meow me?';
let charIndex = 0;
const cursorSpan = document.createElement('span');
cursorSpan.className = 'cursor';
titleEl.appendChild(cursorSpan);

function typeNextChar() {
    if (charIndex < fullTitle.length) {
        const textNode = document.createTextNode(fullTitle[charIndex]);
        titleEl.insertBefore(textNode, cursorSpan);
        charIndex++;
        setTimeout(typeNextChar, 100 + Math.random() * 80);
    } else {
        setTimeout(() => {
            cursorSpan.remove();
            titleEl.style.animation = 'pulse 2s ease-in-out infinite';
        }, 1000);
    }
}
setTimeout(typeNextChar, 500);

// ========== SOUND EFFECTS ==========
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function playMeow() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.15);
    osc.frequency.linearRampToValueAtTime(600, now + 0.4);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(500, now + 0.5);
    osc2.frequency.linearRampToValueAtTime(900, now + 0.65);
    osc2.frequency.linearRampToValueAtTime(700, now + 0.9);
    gain2.gain.setValueAtTime(0.3, now + 0.5);
    gain2.gain.linearRampToValueAtTime(0, now + 1.0);
    osc2.start(now + 0.5);
    osc2.stop(now + 1.0);
}

function playBoop() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
}

function playCelebration() {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        const t = audioCtx.currentTime + i * 0.15;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
    });
}

// ========== NO BUTTON ==========
let noBtnEscaped = false;
let noAttempts = 0;

const noMessages = [
    "Hmm, try again...",
    "Are you sure? :(",
    "Think twice...",
    "The button says no, but your heart says yes!",
    "You can't escape love!",
    "Stop chasing No and press YES!",
    "That button is faster than you think...",
    "Just give up and say YES already!",
    "No is not an option here!",
    "The universe wants you to press YES!",
];

const noBtnTexts = [
    "No.......",
    "Maybe?...",
    "Still no?",
    "Hmm...",
    "Fine...",
    "Ok ok...",
    "Nope!",
    "Never!",
    "...",
    "YES! jk no",
];

// Smooth animation helper
let noBtnAnimating = false;
function animateNoBtn(targetX, targetY) {
    const startX = parseFloat(noBtn.style.left) || 0;
    const startY = parseFloat(noBtn.style.top) || 0;
    const startTime = performance.now();
    const duration = 400;
    noBtnAnimating = true;

    function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        // ease-out
        const ease = 1 - Math.pow(1 - t, 3);
        noBtn.style.left = (startX + (targetX - startX) * ease) + 'px';
        noBtn.style.top = (startY + (targetY - startY) * ease) + 'px';
        if (t < 1) requestAnimationFrame(step);
        else noBtnAnimating = false;
    }
    requestAnimationFrame(step);
}

function clampPosition(x, y) {
    // Button max-width is 160px, max height ~55px. Use generous fixed values.
    const pad = 10;
    return {
        x: Math.max(pad, Math.min(x, window.innerWidth - 175)),
        y: Math.max(pad, Math.min(y, window.innerHeight - 65)),
    };
}

noBtn.addEventListener('mouseover', () => {
    if (noBtnAnimating) return;

    if (!noBtnEscaped) {
        const initRect = noBtn.getBoundingClientRect();
        // Move button to body so fixed positioning works correctly
        document.body.appendChild(noBtn);
        noBtn.style.position = 'fixed';
        noBtn.style.left = initRect.left + 'px';
        noBtn.style.top = initRect.top + 'px';
        noBtn.style.zIndex = '100';
        noBtnEscaped = true;
    }

    noAttempts++;
    playBoop();

    // Change No button text
    noBtn.textContent = noBtnTexts[Math.min(noAttempts - 1, noBtnTexts.length - 1)];

    // Show counter message
    const msg = noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];
    noCounter.textContent = `Attempt #${noAttempts}: ${msg}`;

    // Shrink No button by reducing font size
    const noFontSize = Math.max(0.9, 1.3 - noAttempts * 0.04);
    noBtn.style.fontSize = noFontSize + 'rem';

    // Grow YES button
    const yesBtnScale = Math.min(1.4, 1 + noAttempts * 0.05);
    yesBtn.style.transform = `scale(${yesBtnScale})`;

    // Pick random target position and clamp to viewport
    const curX = parseFloat(noBtn.style.left) || 0;
    const curY = parseFloat(noBtn.style.top) || 0;

    let targetX, targetY, tries = 0;
    do {
        targetX = 20 + Math.random() * (window.innerWidth - 200);
        targetY = 20 + Math.random() * (window.innerHeight - 100);
        tries++;
    } while (Math.abs(targetX - curX) + Math.abs(targetY - curY) < 120 && tries < 15);

    // Clamp using actual rendered button size
    const clamped = clampPosition(targetX, targetY);
    animateNoBtn(clamped.x, clamped.y);
});

// ========== CONFETTI ==========
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

let confettiPieces = [];
let confettiRunning = false;

function createConfettiPiece() {
    const colors = ['#039be5', '#0277bd', '#4fc3f7', '#ff6f61', '#ffd54f', '#81c784', '#ba68c8', '#ff8a65', '#ffffff'];
    return {
        x: Math.random() * confettiCanvas.width,
        y: -20,
        w: 8 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
    };
}

function animateConfetti() {
    if (!confettiRunning) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.003;

        if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) {
            confettiPieces.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    }

    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiRunning = false;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

function launchConfetti(waves = 5, perWave = 80) {
    const wasRunning = confettiRunning;
    confettiRunning = true;
    for (let wave = 0; wave < waves; wave++) {
        setTimeout(() => {
            for (let i = 0; i < perWave; i++) {
                confettiPieces.push(createConfettiPiece());
            }
        }, wave * 400);
    }
    if (!wasRunning) animateConfetti();
}

// ========== YES BUTTON CLICK ==========
let catSpawnInterval;

yesBtn.addEventListener('click', () => {
    playMeow();
    launchConfetti();

    // Hide No button
    noBtn.style.display = 'none';

    // Screen 2: MEOW!!!
    showScreen(yesScreen);

    const hearts = ['💙', '🐱', '💙', '🐾', '💙'];
    const yesHeartsEl = document.getElementById('yesHearts');
    yesHeartsEl.textContent = '';
    hearts.forEach((h, i) => {
        setTimeout(() => {
            yesHeartsEl.textContent += h + ' ';
        }, i * 300);
    });

    // After 3.5s -> certificate
    setTimeout(() => showScreen(certificateScreen), 3500);
});

// ========== CERTIFICATE SIGNING ==========
const signatureBox = document.getElementById('signatureBox');
const signatureText = document.getElementById('signatureText');
const catPaw = document.getElementById('catPaw');
const signaturePlaceholder = signatureBox.querySelector('.signature-placeholder');

signatureBox.addEventListener('click', () => {
    if (signatureBox.classList.contains('signed')) return;

    signaturePlaceholder.classList.add('hidden');
    catPaw.classList.add('animate');

    // After paw reaches center, show signature
    setTimeout(() => {
        signatureText.classList.remove('hidden');
        signatureBox.classList.add('signed');
        playMeow();
        launchConfetti(2, 40);
    }, 700);

    // Show signed certificate for 3s, THEN go to celebration
    setTimeout(() => {
        showScreen(celebrationScreen);
        playCelebration();
        launchConfetti(8, 100);

        // Typewriter for celebration title
        const celebTitle = document.getElementById('celebrationTitle');
        celebTitle.textContent = '';
        const celebText = 'Now you are officially Mr. Meow & Mrs. Meow!';
        let ci = 0;
        function typeCeleb() {
            if (ci < celebText.length) {
                celebTitle.textContent += celebText[ci];
                ci++;
                setTimeout(typeCeleb, 60);
            }
        }
        typeCeleb();

        // Cats go brr
        clearInterval(catSpawnInterval);
        catSpawnInterval = setInterval(() => createCatPhoto(true), 400);
    }, 3500);
});

// ========== RESTART ==========
document.getElementById('restartBtn').addEventListener('click', () => {
    // Reset everything
    noBtn.style.display = '';
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.zIndex = '';
    noBtn.style.transition = '';
    noBtn.style.transform = '';
    noBtn.textContent = 'No.......';
    yesBtn.style.transform = '';
    noCounter.textContent = '';
    noBtnEscaped = false;
    noAttempts = 0;

    // Reset signature
    signatureBox.classList.remove('signed');
    signatureText.classList.add('hidden');
    signaturePlaceholder.classList.remove('hidden');
    catPaw.classList.remove('animate');

    // Reset title
    titleEl.textContent = '';
    charIndex = 0;
    titleEl.appendChild(cursorSpan);
    titleEl.style.animation = '';
    setTimeout(typeNextChar, 300);

    // Reset hearts
    document.getElementById('yesHearts').textContent = '';
    document.getElementById('celebrationTitle').textContent = '';

    // Reset cat spawn
    clearInterval(catSpawnInterval);
    catSpawnInterval = setInterval(() => createCatPhoto(), 1500);

    // Show main
    showScreen(mainScreen);
});

// ========== FLOATING CAT PHOTOS ==========
const catUrls = [];
for (let i = 1; i <= 10; i++) {
    catUrls.push(`assets/images/cats/cat${i}.jpg`);
}

function createCatPhoto(burst = false) {
    const img = document.createElement('img');
    img.classList.add('cat-photo');
    img.src = catUrls[Math.floor(Math.random() * catUrls.length)];
    img.alt = '';
    img.style.left = Math.random() * 100 + 'vw';

    const sizes = burst
        ? [50 + Math.random() * 60]
        : [[35, 50], [55, 75], [80, 110]][Math.floor(Math.random() * 3)];
    const size = Array.isArray(sizes)
        ? sizes[0] + Math.random() * (sizes[1] - sizes[0])
        : sizes[0];
    img.style.width = size + 'px';
    img.style.height = size + 'px';

    if (burst) img.style.opacity = '0.7';

    const duration = Math.random() * 6 + 5;
    img.style.animationDuration = duration + 's';
    img.style.animationDelay = (burst ? 0 : Math.random() * 3) + 's';

    document.body.appendChild(img);
    setTimeout(() => img.remove(), (duration + 5) * 1000);
}

catSpawnInterval = setInterval(() => createCatPhoto(), 1500);
