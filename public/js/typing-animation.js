document.addEventListener('DOMContentLoaded', function () {
    // --- Configuration ---
    const words = ["Frontend", "Mazen Hesham"];
    const typingSpeed = 150; // Milliseconds per character
    const deletingSpeed = 75;
    const delayBetweenWords = 2000; // Milliseconds to wait after typing/deleting
    const pauseBeforeTyping = 1500;
    const elementId = 'typing-text'; // The ID of the span where text will be typed

    // --- State ---
    const typingElement = document.getElementById(elementId);
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingElement.textContent = currentWord.substring(0, charIndex);

        let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting) {
            typeSpeed += (Math.random() - 0.5) * 100; // Add randomness for natural feel
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = pauseBeforeTyping;
        }

        setTimeout(type, typeSpeed);
    }

    // Start the animation if the element exists
    if (typingElement) {
        type();
    }

    // --- Optional Background Text Effects ---
    const bgTextContainer = document.querySelector('.background-text-container');

    if (bgTextContainer) {
        let currentScrollY = window.scrollY;
        let targetScrollY = window.scrollY;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;
        const parallaxFactor = 0.1; // Slower parallax effect
        const mouseFactor = 0.05;   // Less sensitive mouse movement
        const lerpFactor = 0.08;    // Smoothing factor for animations

        window.addEventListener('scroll', () => {
            targetScrollY = window.scrollY;
        });

        window.addEventListener('mousemove', (e) => {
            // Calculate mouse position relative to the center of the screen
            targetMouseX = (e.clientX - window.innerWidth / 2);
            targetMouseY = (e.clientY - window.innerHeight / 2);
        });

        function update() {
            // Use linear interpolation (lerp) for smooth animation
            currentScrollY += (targetScrollY - currentScrollY) * lerpFactor;
            mouseX += (targetMouseX - mouseX) * lerpFactor;
            mouseY += (targetMouseY - mouseY) * lerpFactor;

            const parallaxY = -currentScrollY * parallaxFactor;
            const mouseMoveX = mouseX * mouseFactor;
            const mouseMoveY = mouseY * mouseFactor;

            // Apply the combined transforms for parallax and mouse movement
            bgTextContainer.style.transform = `translate3d(${mouseMoveX}px, ${parallaxY + mouseMoveY}px, 0)`;
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
});