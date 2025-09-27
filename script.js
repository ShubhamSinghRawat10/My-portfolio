// Navigation menu functionality
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const navOverlay = document.querySelector('.nav-overlay');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
    
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    burger.classList.toggle('toggle');
});

// Close menu when clicking overlay
navOverlay.addEventListener('click', () => {
    nav.classList.remove('active');
    navOverlay.classList.remove('active');
    burger.classList.remove('toggle');
    document.body.style.overflow = 'auto';
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        navOverlay.classList.remove('active');
        burger.classList.remove('toggle');
        document.body.style.overflow = 'auto';
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Error: ' + result.message);
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Failed to send message. Please check your connection and try again.');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

window.addEventListener('DOMContentLoaded', function() {
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        bgVideo.addEventListener('loadedmetadata', function() {
            if (bgVideo.duration && !isNaN(bgVideo.duration)) {
                bgVideo.currentTime = bgVideo.duration / 2;
            }
        });
    }
    // Animate skill progress bars when section enters viewport
    const skillSection = document.getElementById('skills');
    const fills = document.querySelectorAll('.progress-fill');
    if (skillSection && fills.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fills.forEach(el => {
                        const pct = parseInt(el.getAttribute('data-percent') || '0', 10);
                        el.style.width = pct + '%';
                    });
                    obs.disconnect();
                }
            });
        }, { threshold: 0.25 });
        observer.observe(skillSection);
    }
});


const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

function setTheme(mode) {
    if (mode === 'light') {
        document.body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    localStorage.setItem('theme', mode);
    try {
        window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
    } catch (e) {
        // no-op
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        setTheme(isLight ? 'dark' : 'light');
    });
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme('light');
} else {
    setTheme('dark');
}

// Sparkle background animation
(function () {
    const canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let devicePixelRatioValue = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0, height = 0;
    let particles = [];
    let running = false;
    let lastTime = 0;

    function isLightMode() {
        return document.body.classList.contains('light-mode');
    }

    function getCssVar(name, fallback) {
        const styles = getComputedStyle(document.documentElement);
        const value = styles.getPropertyValue(name).trim();
        return value || fallback;
    }

    function hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!m) return { r: 255, g: 255, b: 255 };
        return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
    }

    function randomBetween(min, max) { return Math.random() * (max - min) + min; }

    function pickAccentColor() {
        const c1 = hexToRgb(getCssVar('--accent', '#4ecdc4'));
        const c2 = hexToRgb(getCssVar('--accent2', '#45b7d1'));
        const t = Math.random();
        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);
        return { r, g, b };
    }

    function pickSparkleColor() {
        // Light mode: blue, Dark mode: whit
        if (isLightMode()) {
            return { r: 87, g: 166, b: 255 }; // #57A6FF
        }
        return { r: 255, g: 255, b: 255 };
    }

    function setCanvasSize() {
        width = window.innerWidth;
        height = window.innerHeight;
        devicePixelRatioValue = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        canvas.width = Math.floor(width * devicePixelRatioValue);
        canvas.height = Math.floor(height * devicePixelRatioValue);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(devicePixelRatioValue, 0, 0, devicePixelRatioValue, 0, 0);
    }

    function computeParticleCount() {
        // Scale with area, capped for performance
        const area = width * height;
        return Math.max(40, Math.min(140, Math.floor(area / 20000)));
    }

    function createParticles() {
        const count = computeParticleCount();
        particles = new Array(count).fill(0).map(() => {
            const color = pickSparkleColor();
            const baseAlpha = isLightMode() ? 0.90 : 0.40;
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: randomBetween(-0.05, 0.05),
                vy: randomBetween(-0.05, 0.05),
                size: randomBetween(0.9, 2.0),
                twinkleSpeed: randomBetween(0.8, 0.9),
                twinklePhase: Math.random() * Math.PI * 2,
                alpha: baseAlpha,
                baseAlpha,
                color
            };
        });
    }

    function clear() {
        ctx.clearRect(0, 0, width, height);
    }

    function drawParticle(p, t) {
        const twinkle = (Math.sin(t * p.twinkleSpeed + p.twinklePhase) + 1) * 0.5; // 0..1
        const a = p.baseAlpha * (0.6 + twinkle * 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + a + ')';
        ctx.shadowColor = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
    }

    function updateParticle(p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
        if (p.y < -4) p.y = height + 4;
        if (p.y > height + 4) p.y = -4;
    }

    function loop(ts) {
        if (!running) return;
        const t = ts ? (ts / 1000) : (lastTime + 0.016);
        lastTime = t;
        clear();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            drawParticle(p, t);
            updateParticle(p);
        }
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(loop);
    }

    function restart() {
        setCanvasSize();
        createParticles();
    }

    function onResize() {
        restart();
    }

    function onThemeChange(e) {
        canvas.style.display = '';
        // Refresh particle visuals to match new theme
        const baseAlpha = isLightMode() ? 0.18 : 0.45;
        if (!particles.length) {
            restart();
        } else {
            for (let i = 0; i < particles.length; i++) {
                particles[i].baseAlpha = baseAlpha;
                particles[i].color = pickSparkleColor();
            }
        }
        if (!running) start();
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('themechange', onThemeChange);

    function start() {
        if (running) return;
        canvas.style.display = '';
        running = true;
        restart();
        requestAnimationFrame(loop);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();