document.addEventListener('DOMContentLoaded', () => {
    // Send Discord notification when site is opened
    const webhookUrl = 'https://discord.com/api/webhooks/1485980385530613883/03et9mX9m5zWoVYN45HsGSlgydyc4oP0PIgZHP4sk3Y86Zz5wy1Uze7hNaFDpscpL9a9';
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: '🌟 Ashna\'s Birthday Website has just been opened! 🌟'
        }),
        mode: 'no-cors'
    }).catch(error => console.error('Error sending Discord notification:', error));

    // 1. Audio Control
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;

    // Set volume lower so it's "soft music"
    bgMusic.volume = 0.4;

    // Robust music play helper with retry
    function startMusic() {
        if (isPlaying) return;
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.innerHTML = '<span class="icon">🎵</span> Pause Music';
        }).catch(e => {
            console.log("Audio play failed, will retry on next interaction:", e);
            // Set a one-time click/touch listener on the whole document as fallback
            document.addEventListener('click', retryMusic, { once: true });
            document.addEventListener('touchstart', retryMusic, { once: true });
        });
    }

    function retryMusic() {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.innerHTML = '<span class="icon">🎵</span> Pause Music';
            }).catch(e => console.log("Retry audio also failed:", e));
        }
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<span class="icon">🔇</span> Play Music';
            isPlaying = false;
        } else {
            startMusic();
        }
    });

    // Welcome Overlay Logic (Swipe to Cut Cake)
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const cakeContainer = document.getElementById('interactive-cake');
    const canvas = document.getElementById('swipe-canvas');

    if (welcomeOverlay && cakeContainer && canvas) {
        const ctx = canvas.getContext('2d');
        let swipePoints = [];
        let particles = [];
        let isSwiping = false;
        let isCut = false;
        let startX = 0;
        let startY = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Confetti explosion logic
        function createConfetti() {
            const cakeRect = cakeContainer.getBoundingClientRect();
            const centerX = cakeRect.left + cakeRect.width / 2;
            const centerY = cakeRect.top + cakeRect.height / 2;
            
            const colors = ['#ff7eb3', '#9d4edd', '#ffd166', '#06d6a0', '#118ab2', '#ff85a2'];
            for (let i = 0; i < 70; i++) {
                particles.push({
                    x: centerX,
                    y: centerY,
                    vx: (Math.random() - 0.5) * 14,
                    vy: (Math.random() - 0.75) * 12 - 3,
                    size: Math.random() * 8 + 5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 12,
                    alpha: 1,
                    decay: Math.random() * 0.015 + 0.01
                });
            }
        }

        // Animation loop for swipe trail and confetti
        function drawOverlayFX() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Fading trail logic
            const now = Date.now();
            swipePoints = swipePoints.filter(p => now - p.time < 300);
            
            if (swipePoints.length > 1) {
                ctx.beginPath();
                ctx.moveTo(swipePoints[0].x, swipePoints[0].y);
                for (let i = 1; i < swipePoints.length; i++) {
                    const xc = (swipePoints[i].x + swipePoints[i-1].x) / 2;
                    const yc = (swipePoints[i].y + swipePoints[i-1].y) / 2;
                    ctx.quadraticCurveTo(swipePoints[i-1].x, swipePoints[i-1].y, xc, yc);
                }
                
                // Trail stroke outer pink glow
                ctx.save();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff7eb3';
                ctx.strokeStyle = 'rgba(255, 126, 179, 0.85)';
                ctx.lineWidth = 10;
                ctx.stroke();
                
                // Trail stroke inner white core
                ctx.shadowBlur = 0;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.restore();
            }
            
            // Draw confetti particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.22; // gravity
                p.rotation += p.rotationSpeed;
                p.alpha -= p.decay;
                
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
            
            requestAnimationFrame(drawOverlayFX);
        }
        requestAnimationFrame(drawOverlayFX);

        // Cutting action
        function cutCake() {
            if (isCut) return;
            isCut = true;
            isSwiping = false;

            // Trigger splitting CSS
            cakeContainer.classList.add('cut');

            // Spawn confetti
            createConfetti();

            // Play background music (uses robust retry logic)
            startMusic();

            // Transition to Hero Section
            setTimeout(() => {
                welcomeOverlay.classList.add('hidden');
                setTimeout(typeQuote, 1500); // Trigger typing effect as overlay fades out
            }, 1600);
        }

        // Event listeners for Swipe Gesture
        function getCoords(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX, y: clientY };
        }

        function handleStart(e) {
            if (isCut) return;
            isSwiping = true;
            const coords = getCoords(e);
            startX = coords.x;
            startY = coords.y;
            swipePoints = [{ x: startX, y: startY, time: Date.now() }];
        }

        function handleMove(e) {
            if (!isSwiping || isCut) return;
            const coords = getCoords(e);
            swipePoints.push({ x: coords.x, y: coords.y, time: Date.now() });

            // Detect swipe threshold (80 pixels)
            const dist = Math.hypot(coords.x - startX, coords.y - startY);
            if (dist > 80) {
                cutCake();
            }
        }

        function handleEnd() {
            isSwiping = false;
            swipePoints = [];
        }

        welcomeOverlay.addEventListener('mousedown', handleStart);
        welcomeOverlay.addEventListener('mousemove', handleMove);
        welcomeOverlay.addEventListener('mouseup', handleEnd);
        welcomeOverlay.addEventListener('mouseleave', handleEnd);

        welcomeOverlay.addEventListener('touchstart', handleStart, { passive: true });
        welcomeOverlay.addEventListener('touchmove', handleMove, { passive: true });
        welcomeOverlay.addEventListener('touchend', handleEnd, { passive: true });
    }


    // 2. Typing Effect for Hero Quote
    const quoteText = "“Some people stay for years.\nSome stay for days and still become unforgettable.”";
    const quoteElement = document.getElementById('hero-quote');
    const nameElement = document.getElementById('hero-name');
    let charIndex = 0;

    function typeQuote() {
        if (charIndex < quoteText.length) {
            quoteElement.textContent += quoteText.charAt(charIndex);
            charIndex++;
            setTimeout(typeQuote, 50); // Slower typing speed
        } else {
            // Typing finished, remove cursor and reveal name
            quoteElement.style.borderRight = "none";
            setTimeout(() => {
                nameElement.classList.remove('hidden');
            }, 300);
        }
    }

    // Typing now starts when the welcome overlay is clicked.


    // 3. Heart Cursor Trail
    const cursorContainer = document.getElementById('cursor-trail-container');
    let lastHeartTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Limit heart creation rate
        if (now - lastHeartTime > 50) {
            createHeart(e.clientX, e.clientY);
            lastHeartTime = now;
        }
    });

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.classList.add('cursor-heart');
        heart.innerHTML = '💖'; // Heart emoji
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // Randomize size slightly
        const size = Math.random() * 10 + 10;
        heart.style.fontSize = `${size}px`;

        cursorContainer.appendChild(heart);

        // Remove after animation finishes
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }


    // 4. Background Effects (Stars & Petals)
    const starsContainer = document.getElementById('stars-container');
    const petalsContainer = document.getElementById('petals-container');

    function createStars() {
        const starCount = 50;
        for (let i = 0; i < starCount; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            // Random properties
            let size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            starsContainer.appendChild(star);
        }
    }

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Random properties
        let size = Math.random() * 15 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5s to 10s fall time
        
        petalsContainer.appendChild(petal);

        // Remove petal when it falls out of view
        setTimeout(() => {
            petal.remove();
        }, 10000);
    }

    createStars();
    // Continuously create petals
    setInterval(createPetal, 400);


    // 5. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated in
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeSections = document.querySelectorAll('.fade-in-section');
    fadeSections.forEach(section => {
        observer.observe(section);
    });
});
