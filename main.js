/* ========================================================
   MEENAKSHI JAIN PORTFOLIO — main.js
   Handles: cursor, navbar, scroll reveals, counters,
            hero parallax, exhibitions, form, marquee
   ======================================================== */

'use strict';

// ── Utility ──────────────────────────────────────────────
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Custom Cursor ─────────────────────────────────────────
(function initCursor() {
    const dot = qs('#cursorDot');
    const ring = qs('#cursorRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
})();

// ── Navbar Scroll ─────────────────────────────────────────
(function initNavbar() {
    const nav = qs('#navbar');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ── Hero Background Parallax & Load ───────────────────────
(function initHero() {
    const bg = qs('#heroBg');
    if (!bg) return;

    // Add loaded class for gentle zoom-in on load
    requestAnimationFrame(() => {
        setTimeout(() => bg.classList.add('loaded'), 100);
    });

    // Subtle parallax on scroll
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        bg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }, { passive: true });
})();

// ── Animated Number Counter ───────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || (target > 20 ? '+' : '');
    const duration = 1800;
    const startTs = performance.now();

    function update(ts) {
        const progress = Math.min((ts - startTs) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ── Scroll Reveal + Counter Trigger ───────────────────────
(function initReveal() {
    const revealEls = qsa('.reveal, .reveal-left, .reveal-right');
    const counterEls = qsa('[data-count]');
    const triggeredCounters = new WeakSet();

    function onIntersect(entries, obs) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;

            // Reveal animation
            if (el.classList.contains('reveal') ||
                el.classList.contains('reveal-left') ||
                el.classList.contains('reveal-right')) {
                el.classList.add('visible');
            }

            // Counter animation
            if (el.dataset.count && !triggeredCounters.has(el)) {
                triggeredCounters.add(el);
                animateCounter(el);
            }

            obs.unobserve(el);
        });
    }

    const io = new IntersectionObserver(onIntersect, {
        threshold: 0.15
    });

    revealEls.forEach(el => io.observe(el));
    counterEls.forEach(el => io.observe(el));
})();

// ── Exhibitions Interactive List ──────────────────────────
(function initExhibitions() {
    const cityItems = qsa('.city-item');
    const img = qs('#exhibitionImg');
    const cityTitle = qs('#exhibitionCity');
    const cityDesc = qs('#exhibitionDesc');

    const cityData = {
        'Chandigarh': {
            desc: "Home base of Parindon Ki Udaan Society\u00ae, Chandigarh has hosted multiple landmark exhibitions curated by Meenakshi Jain, including award events by Rotary Club (Panchkula Gaurav Samman) and Sanskar Bharti."
        },
        'Delhi': {
            desc: "The national capital's prestigious galleries have featured Meenakshi Jain's vibrant abstract works, connecting her art to one of India's largest and most discerning art audiences."
        },
        'Jaipur': {
            desc: "In the Pink City, Meenakshi's exhibitions blended the rich Rajasthani cultural tapestry with contemporary abstract expression, creating memorable artistic conversations."
        },
        'Mumbai': {
            desc: "India's commercial art capital provided an international platform for Meenakshi's works, with exhibitions attracting collectors and art professionals from across the country and abroad."
        },
        'Lucknow': {
            desc: "In the City of Nawabs, Meenakshi brought modern abstraction into dialogue with Lucknow's rich classical artistic heritage, drawing remarkable audience engagement."
        },
        'Patiala': {
            desc: "Patiala's cultural pride and royal heritage formed a fitting backdrop for exhibitions showcasing the depth and spiritual resonance of Meenakshi Jain's finger-painted canvases."
        },
        'Gujarat': {
            desc: "Western India embraced Meenakshi's work through exhibitions in Gujarat, expanding the reach of Parindon Ki Udaan Society\u00ae beyond North India into new artistic territories."
        }
    };

    if (!cityItems.length || !img) return;

    cityItems.forEach(item => {
        item.addEventListener('click', () => {
            cityItems.forEach(c => c.classList.remove('active'));
            item.classList.add('active');

            const city = item.dataset.city;
            if (cityTitle) cityTitle.textContent = city;
            if (cityDesc && cityData[city]) cityDesc.textContent = cityData[city].desc;

            // Quick fade transition on image
            if (img) {
                img.style.opacity = '0';
                img.style.transform = 'scale(1.04)';
                setTimeout(() => {
                    img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
})();

// ── Awards Marquee Duplicate (for seamless loop) ──────────
(function initMarquee() {
    const marquee = qs('#awardsMarquee');
    if (!marquee) return;
    // Cards are already duplicated in HTML for a seamless infinite loop.
    // No JS needed beyond the CSS animation.
})();

// ── Smooth Section Links w/ Offset ───────────────────────
(function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = qs(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80; // nav height
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();

// ── Contact Form ──────────────────────────────────────────
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = qs('#submitBtn');
    if (!btn) return;

    btn.textContent = 'Sending…';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate async send (replace with real backend / EmailJS / Formspree)
    setTimeout(() => {
        btn.textContent = '✅ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #2ecc71, #16a085)';

        setTimeout(() => {
            btn.textContent = 'Send Message →';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.background = '';
            e.target.reset();
        }, 3000);
    }, 1500);
}

// ── Stagger Reveal Delays ─────────────────────────────────
(function initStagger() {
    // Education grid cards
    qsa('.education-grid .edu-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });
    // Objectives
    qsa('.objectives-grid .objective-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });
    // Style features
    qsa('.style-feature').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
    });
    // Pillars
    qsa('.empowerment-pillars .pillar').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
    });
    // Vision pills
    qsa('.vision-pill').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.07}s`;
    });
})();

// ── Floating Glow Orbs (Hero Ambient) ─────────────────────
(function initOrbs() {
    const hero = qs('#hero');
    if (!hero) return;

    const orbs = [
        { size: 400, x: '10%', y: '20%', color: 'rgba(181,39,94,0.06)', duration: 8 },
        { size: 300, x: '70%', y: '60%', color: 'rgba(201,168,76,0.05)', duration: 11 },
        { size: 250, x: '50%', y: '10%', color: 'rgba(43,27,92,0.2)', duration: 9 }
    ];

    orbs.forEach(orb => {
        const el = document.createElement('div');
        el.style.cssText = `
      position: absolute;
      width: ${orb.size}px;
      height: ${orb.size}px;
      left: ${orb.x};
      top: ${orb.y};
      border-radius: 50%;
      background: radial-gradient(circle, ${orb.color} 0%, transparent 70%);
      pointer-events: none;
      animation: float ${orb.duration}s ease-in-out infinite;
      z-index: 1;
    `;
        hero.appendChild(el);
    });
})();

// ── Active Nav Link Highlight on Scroll ───────────────────
(function initActiveNav() {
    const sections = qsa('section[id]');
    const navLinks = qsa('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 120;
        let current = '';

        sections.forEach(sec => {
            if (scrollPos >= sec.offsetTop) current = sec.id;
        });

        navLinks.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${current}`
                ? 'var(--gold)'
                : '';
        });
    }, { passive: true });
})();
