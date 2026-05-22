document.addEventListener('DOMContentLoaded', () => {
    // Send Discord notification when site is opened
    const webhookUrl = 'https://discordapp.com/api/webhooks/1485980385530613883/03et9mX9m5zWoVYN45HsGSlgydyc4oP0PIgZHP4sk3Y86Zz5wy1Uze7hNaFDpscpL9a9';
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: '🌟 Ashna\'s Birthday Website has just been opened! 🌟'
        }),
        
    }).catch(error => console.error('Error sending Discord notification:', error));

    // 1. Audio Control
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;

    // Set volume lower so it's "soft music"
    bgMusic.volume = 0.4;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<span class="icon">🔇</span> Play Music';
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
            musicToggle.innerHTML = '<span class="icon">🎵</span> Pause Music';
        }
        
        isPlaying = !isPlaying;
    });

    // Welcome Overlay Logic
    const welcomeOverlay = document.getElementById('welcome-overlay');

    if (welcomeOverlay) {
        welcomeOverlay.addEventListener('click', () => {
            // Hide the overlay
            welcomeOverlay.classList.add('hidden');
            
            // Start the music!
            if (!isPlaying) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    musicToggle.innerHTML = '<span class="icon">🎵</span> Pause Music';
                }).catch(e => console.log("Audio play failed:", e));
            }

            // Start typing after a slow delay, waiting for overlay to fade
            setTimeout(typeQuote, 2500);
        });
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
            setTimeout(typeQuote, 120); // Slower typing speed
        } else {
            // Typing finished, remove cursor and reveal name
            quoteElement.style.borderRight = "none";
            setTimeout(() => {
                nameElement.classList.remove('hidden');
            }, 500);
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
