let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const progress = document.getElementById('progress');
const dotsContainer = document.getElementById('nav-dots-container');

// Slide 5 Continuous Wave Animation State
let waveOffset = 0;
let waveSpeed = 0.6;

// Sound State Management using Web Audio API (Synthesizer Engine)
let audioCtx = null;
let soundMuted = false;

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// Synth Function: Generate Spark Zapping Crackle
function playSparkSound() {
    if (soundMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, audioCtx.currentTime);
        // Voltage frequency spike
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.4);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.8);
        
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.85);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.85);
    } catch(e) {
        console.log("Spark audio error", e);
    }
}

// Synth Function: Generate Emotion Chord Sweeps
function playEmotionSound(freq1, freq2) {
    if (soundMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
        const now = audioCtx.currentTime;
        [freq1, freq2].forEach((freq) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 1.2);
            
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            
            osc.start();
            osc.stop(now + 1.2);
        });
    } catch(e) {}
}

function toggleMute() {
    soundMuted = !soundMuted;
    const icon = document.getElementById('sound-icon');
    if (icon) {
        icon.innerText = soundMuted ? '🔇' : '🔊';
    }
    initAudio();
}

// Generate Slide Timeline Navigation Dots
function createDots() {
    if (!dotsContainer) return;
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        if (index === 0) dot.classList.add('active');
        
        const title = slide.querySelector('h2')?.innerText || "START";
        const tooltip = document.createElement('span');
        tooltip.classList.add('nav-dot-tooltip');
        tooltip.innerText = title;
        
        dot.appendChild(tooltip);
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlide();
            initAudio();
        });
        dotsContainer.appendChild(dot);
    });
}

function updateSlide() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update Progress and Dots
    progress.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlide();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
        e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        prevSlide();
        e.preventDefault();
    }
});

// Mouse Wheel Navigation with smart thresholding
let lastWheelTime = 0;
document.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (now - lastWheelTime < 1200) return; // Throttle
    
    if (e.deltaY > 20) {
        nextSlide();
        lastWheelTime = now;
    } else if (e.deltaY < -20) {
        prevSlide();
        lastWheelTime = now;
    }
});

// Slide 3: Action Potential Interactive Trigger Logic
let backgroundBoost = false;

function triggerSpark() {
    const pulse = document.getElementById('axon-pulse');
    const path = document.getElementById('graph-path');
    const vLabel = document.getElementById('voltage-val');
    
    if (!pulse || !path || !vLabel) return;
    
    pulse.classList.remove('active');
    path.classList.remove('active');
    void pulse.offsetWidth; // Trigger reflow
    void path.offsetWidth;
    
    pulse.classList.add('active');
    path.classList.add('active');
    
    backgroundBoost = true;
    playSparkSound();
    
    // Voltage Phase Changes
    setTimeout(() => {
        vLabel.innerText = '+40 mV';
        vLabel.style.color = '#00f2ff';
    }, 450);
    
    setTimeout(() => {
        vLabel.innerText = '-90 mV';
        vLabel.style.color = '#8e2de2';
    }, 800);
    
    setTimeout(() => {
        vLabel.innerText = '-70 mV';
        vLabel.style.color = 'var(--text-main)';
        backgroundBoost = false;
    }, 1200);
}

// Slide 5: Interactive Emotion Profiler Logic
let activeMood = 'nostalgia';
const moodData = {
    love: {
        color: '#ff007f',
        rgb: { r: 255, g: 0, b: 127 },
        band: 'Theta & Alpha sync',
        frequency: '6.5 - 9.0 Hz',
        transmitter: 'Oxytocin / Dopamine',
        sync: '92.4%',
        freqs: [220, 275]
    },
    fear: {
        color: '#ff5555',
        rgb: { r: 255, g: 85, b: 85 },
        band: 'High Beta / Gamma',
        frequency: '28.0 - 38.5 Hz',
        transmitter: 'Adrenaline / Cortisol',
        sync: '48.1%',
        freqs: [180, 540]
    },
    anxiety: {
        color: '#8e2de2',
        rgb: { r: 142, g: 45, b: 226 },
        band: 'Erratic Beta peaks',
        frequency: '18.0 - 24.5 Hz',
        transmitter: 'Glutamate overload',
        sync: '35.6%',
        freqs: [200, 310]
    },
    nostalgia: {
        color: '#00f2ff',
        rgb: { r: 0, g: 242, b: 255 },
        band: 'Rhythmic Alpha glow',
        frequency: '9.0 - 11.5 Hz',
        transmitter: 'Serotonin / Dopamine',
        sync: '81.2%',
        freqs: [220, 330]
    }
};

function selectMood(mood) {
    activeMood = mood;
    
    // Update buttons
    const buttons = document.querySelectorAll('.mood-btn');
    buttons.forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-mood') === mood);
    });
    
    const data = moodData[mood];
    if (!data) return;
    
    // Update Stats UI
    document.getElementById('stat-band').innerText = data.band;
    document.getElementById('stat-freq').innerText = data.frequency;
    document.getElementById('stat-trans').innerText = data.transmitter;
    document.getElementById('stat-sync').innerText = data.sync;
    
    // Update Screen Wave Path Colors
    const wave = document.getElementById('profiler-wave-path');
    if (wave) {
        wave.setAttribute('stroke', data.color);
        
        // Adjust continuous animation speed smoothly without resetting the animation offset
        if (mood === 'fear') {
            waveSpeed = 2.2;
        } else if (mood === 'anxiety') {
            waveSpeed = 1.3;
        } else if (mood === 'love') {
            waveSpeed = 0.35;
        } else {
            waveSpeed = 0.6; // nostalgia
        }
    }
    
    // Play mood signature synthesizer tone
    playEmotionSound(data.freqs[0], data.freqs[1]);
}

// Canvas Neural Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 75;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        
        // Core persistent base color RGB components
        const isCyan = Math.random() > 0.5;
        this.r = isCyan ? 0 : 142;
        this.g = isCyan ? 242 : 45;
        this.b = isCyan ? 255 : 226;
        
        this.targetR = this.r;
        this.targetG = this.g;
        this.targetB = this.b;
    }

    update() {
        let multiplier = backgroundBoost ? 8 : 1;
        
        // Adjust speed depending on Slide 5 Mood Profiler
        if (activeMood === 'fear') multiplier *= 3;
        else if (activeMood === 'anxiety') multiplier *= 2;
        else if (activeMood === 'love') multiplier *= 0.6;
        
        this.x += this.vx * multiplier;
        this.y += this.vy * multiplier;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Smooth continuous RGB interpolation (color melting)
        if (activeMood && moodData[activeMood]) {
            const target = moodData[activeMood].rgb;
            this.targetR = target.r;
            this.targetG = target.g;
            this.targetB = target.b;
        }
        
        this.r += (this.targetR - this.r) * 0.04;
        this.g += (this.targetG - this.g) * 0.04;
        this.b += (this.targetB - this.b) * 0.04;
    }

    draw() {
        const colorStr = `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = colorStr;
        ctx.shadowBlur = backgroundBoost ? 18 : 8;
        ctx.shadowColor = colorStr;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            
            let maxDist = backgroundBoost ? 180 : 130;
            if (activeMood === 'fear') maxDist = 200;
            
            if (dist < maxDist) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                
                // Color mapping matching active mood - smooth continuous transitions
                const avgR = Math.round((p.r + p2.r) / 2);
                const avgG = Math.round((p.g + p2.g) / 2);
                const avgB = Math.round((p.b + p2.b) / 2);
                
                const alpha = (1 - dist / maxDist) * (backgroundBoost ? 0.6 : 0.25);
                ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${alpha})`;
                ctx.lineWidth = backgroundBoost ? 1.2 : 0.65;
                ctx.stroke();
            }
        }
    });

    // Update Slide 5 Continuous Wave Translation
    waveOffset -= waveSpeed;
    if (waveOffset <= -20) {
        waveOffset += 20; // seamless mathematical wavelength loop
    }
    const waveEl = document.getElementById('profiler-wave-path');
    if (waveEl) {
        waveEl.setAttribute('transform', `translate(${waveOffset}, 0)`);
    }

    requestAnimationFrame(animate);
}

// User Interaction to enable sound
document.addEventListener('click', initAudio, { once: true });

createDots();
animate();
updateSlide();
// Initialize mood profiler values
selectMood('nostalgia');
