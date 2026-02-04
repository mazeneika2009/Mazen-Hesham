document.addEventListener('DOMContentLoaded', () => {
    
    // Inject Animated Background Text
    const bgContainer = document.createElement('div');
    bgContainer.className = 'bg-floating-text-container';
    bgContainer.innerHTML = `
        <a href="#contact" class="bg-floating-text delay-3">Transform Your Ideas into Reality</a>
    `;
    document.body.prepend(bgContainer);

    // 1. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(el);
    });

    // 2. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            
            // UI Loading State
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            formStatus.innerText = '';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                // ⚠️ IMPORTANT: GitHub Pages cannot run the Node.js backend.
                // 1. Go to https://formspree.io/ to create a form and get your unique ID.
                // 2. Replace 'YOUR_FORM_ID' below with your actual ID (e.g., 'f/xyzyqwer').
                const response = await fetch('https://formspree.io/f/xdalnorl', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                    },
                    body: JSON.stringify(formData)
                });

                // Check if response is JSON (prevents "Unexpected token <" crash on 404 HTML pages)
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Backend API not found. (GitHub Pages does not support server-side code like /api/contact)");
                }

                const result = await response.json();

                if (response.ok) {
                    formStatus.style.color = '#4ade80'; // Green
                    formStatus.innerText = 'Message sent successfully!';
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Something went wrong');
                }
            } catch (error) {
                formStatus.style.color = '#f87171'; // Red
                formStatus.innerText = error.message;
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});