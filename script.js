document.addEventListener('DOMContentLoaded', function() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const hiddenMessage = document.getElementById('hiddenMessage');
    const noMessage = document.getElementById('noMessage');
    const rethinkBtn = document.getElementById('rethinkBtn');
    const mainContent = document.querySelector('.main-content');

    // Ensure required elements exist before wiring event handlers
    if (!yesBtn || !noBtn || !hiddenMessage || !noMessage || !rethinkBtn) {
        console.warn('Some UI elements are missing. Button handlers were not attached.');
        return;
    }

    let noClickCount = 0;
    const noMessages = [
        "Really? 🥺",
        "Think again! 😤",
        "Pizza? 🍕",
        "Please? 🙏",
        "Last chance! 💔"
    ];

    // Track whether mini tenor layer is present
    let miniTenorsSpawned = false;

    function spawnMiniTenors(count) {
        if (miniTenorsSpawned) return;
        miniTenorsSpawned = true;

        const layer = document.createElement('div');
        layer.className = 'mini-tenor-layer';
        layer.id = 'miniTenorLayer';

        // create many small tenor embed divs inside positioned wrappers
        for (let i = 0; i < count; i++) {
            const wrap = document.createElement('div');
            wrap.className = 'mini-tenor-wrapper';

            // random position within viewport with small margins
            const left = 5 + Math.random() * 90; // percent
            const top = 5 + Math.random() * 90;
            wrap.style.left = left + '%';
            wrap.style.top = top + '%';

            // Tenor embed placeholder div (embed.js will replace this)
            const embed = document.createElement('div');
            embed.className = 'tenor-gif-embed';
            embed.setAttribute('data-postid', '12805916815008299407');
            embed.setAttribute('data-share-method', 'host');
            embed.setAttribute('data-aspect-ratio', '1');
            embed.setAttribute('data-width', '80');

            wrap.appendChild(embed);
            layer.appendChild(wrap);
        }

        document.body.appendChild(layer);

        // (re)load Tenor embed script so new divs are processed.
        // Remove existing script if present to force re-initialization.
        const existing = document.querySelector('script[src="https://tenor.com/embed.js"]');
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.src = 'https://tenor.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
    }

    function removeMiniTenors() {
        const layer = document.getElementById('miniTenorLayer');
        if (layer) layer.remove();
        miniTenorsSpawned = false;
    }

    // YES button click
    yesBtn.addEventListener('click', function() {
        hiddenMessage.classList.add('show');
        document.body.classList.add("yes-bg");
        

        // Play configured YouTube video when user clicks yes
        const videoId = '_6XGXAMgBNw';
        const existingFrame = document.getElementById('youtubePlayer');
        const videoContainer = hiddenMessage.querySelector('#videoContainer');
        const successContent = hiddenMessage.querySelector('.success-content');

        if (!existingFrame) {
            const iframe = document.createElement('iframe');
            iframe.id = 'youtubePlayer';
            iframe.className = 'embedded-video';
            iframe.style.border = 'none';
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;

            if (videoContainer) {
                videoContainer.appendChild(iframe);
            } else if (successContent) {
                successContent.appendChild(iframe);
            }
        } else {
            // reload / ensure autoplay intent
            existingFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}`;
        }

        createConfetti();
        animateHeartRain();

        // Vibration feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        // spawn mini Tenor GIFs across the background (only once)
        spawnMiniTenors(14);

        // expand the container and main content for a larger view
        const containerEl = document.querySelector('.container');
        if (containerEl) containerEl.classList.add('expanded');
    });

    // NO button click
    noBtn.addEventListener('click', function() {
        noClickCount++;

        if (noClickCount === 1) {
            // show the "Really?" overlay
            noMessage.style.display = '';
            noMessage.classList.add('show');
            animatePersuasion();

            // --- PLAY "NO" VIDEO ON REPEAT ---
            const noVideoId = 'IKBEJJOrMt8';
            const rethinkContent = noMessage.querySelector('.rethink-content');

            if (rethinkContent) {
                // Create container once (so repeated clicks don't add duplicates)
                let noVideoContainer = noMessage.querySelector('#noVideoContainer');
                if (!noVideoContainer) {
                    noVideoContainer = document.createElement('div');
                    noVideoContainer.id = 'noVideoContainer';
                    noVideoContainer.className = 'video-container';

                    // Put the video above the "Reconsider" button
                    rethinkContent.insertBefore(noVideoContainer, rethinkBtn);
                }

                // YouTube loop requires playlist=<videoId>
                noVideoContainer.innerHTML = `
                    <iframe
                        class="embedded-video"
                        src="https://www.youtube.com/embed/${noVideoId}?autoplay=1&loop=1&playlist=${noVideoId}&controls=1&rel=0&modestbranding=1&playsinline=1"
                        title="No video"
                        frameborder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                `;
            }

        } else if (noClickCount <= noMessages.length) {
            noBtn.textContent = noMessages[noClickCount - 1];
            noBtn.style.transform = `scale(${1 - (noClickCount * 0.1)})`;
            yesBtn.style.transform = `scale(${1 + (noClickCount * 0.15)})`;

            // Make yes button more appealing
            if (noClickCount > 2) {
                yesBtn.textContent = "YES PLEASE! 🥺";
                yesBtn.style.background = 'linear-gradient(45deg, #e91e63, #f06292, #e91e63)';
                yesBtn.style.backgroundSize = '200% 200%';
                yesBtn.style.animation = 'gradient 1.5s ease infinite';
            }

            // Shake no button
            noBtn.style.animation = 'shake 0.5s';
            setTimeout(() => {
                noBtn.style.animation = '';
            }, 500);
        }

        // Add vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    });

    // RECONSIDER button click
    rethinkBtn.addEventListener('click', function() {
        // Stop/remove "No" video if present
        const noVideoContainer = noMessage.querySelector('#noVideoContainer');
        if (noVideoContainer) noVideoContainer.remove();

        noMessage.classList.remove('show');
        noMessage.style.display = 'none';
        noClickCount = 0;

        // Reset buttons
        noBtn.textContent = "No 🤔";
        noBtn.style.transform = '';
        noBtn.style.animation = '';
        yesBtn.textContent = "Yes! 💕";
        yesBtn.style.transform = '';
        yesBtn.style.animation = '';

        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        // remove mini tenor gifs if present
        removeMiniTenors();
    });

    // Create confetti effect
    function createConfetti() {
        const colors = ['#e91e63', '#f06292', '#ff69b4', '#ff1493', '#c71585'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }
    }

    // Animate heart rain
    function animateHeartRain() {
        const hearts = ['💕', '💖', '💗', '💝', '❤️'];

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = '-50px';
                heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
                heart.style.zIndex = '1000';
                heart.style.animation = `fall ${Math.random() * 2 + 3}s linear forwards`;
                document.body.appendChild(heart);

                setTimeout(() => heart.remove(), 5000);
            }, i * 200);
        }
    }

    // Animate persuasion items
    function animatePersuasion() {
        const persuasionItems = document.querySelectorAll('.persuasion p');
        persuasionItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Add hover effects
    yesBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });

    yesBtn.addEventListener('mouseleave', function() {
        if (noClickCount === 0) {
            this.style.transform = '';
        }
    });

    noBtn.addEventListener('mouseenter', function() {
        if (noClickCount < 3) {
            this.style.transform = 'translateY(-3px) rotate(-2deg)';
        }
    });

    noBtn.addEventListener('mouseleave', function() {
        if (noClickCount < 3) {
            this.style.transform = '';
        }
    });

    // Add floating background hearts interaction
    const bgHearts = document.querySelectorAll('.bg-heart');
    bgHearts.forEach(heart => {
        heart.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5) rotate(180deg)';
            this.style.transition = 'transform 0.3s ease';
        });

        heart.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Add CSS animation for falling hearts + gradient pulse
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        const isEnter = e.key === 'Enter';
        const isSpace = e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space';

        if (isEnter || isSpace) {
            if (document.activeElement === yesBtn) {
                yesBtn.click();
            } else if (document.activeElement === noBtn) {
                noBtn.click();
            } else if (document.activeElement === rethinkBtn) {
                rethinkBtn.click();
            }
        }
    });

    // Make buttons focusable for accessibility
    yesBtn.setAttribute('tabindex', '0');
    noBtn.setAttribute('tabindex', '0');
    rethinkBtn.setAttribute('tabindex', '0');
});
