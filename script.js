
(function () {
    'use strict';

    // ==========================================================
    // 1. Ano dinâmico no rodapé
    // ==========================================================
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ==========================================================
    // 2. Menu mobile (toggle)
    // ==========================================================
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            const isOpen = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        siteNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                siteNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================================
    // 3. Header com sombra/elevação ao rolar
    // ==========================================================
    const header = document.querySelector('.site-header');

    function handleScroll() {
        if (!header) return;
        const y = window.scrollY;
        if (y > 8) {
            header.style.boxShadow = '0 4px 18px rgba(26, 41, 84, 0.08)';
            header.style.background = 'rgba(235, 230, 216, 0.98)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(235, 230, 216, 0.92)';
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================================================
    // 4. Smooth scroll com compensação do header sticky
    // ==========================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });
    });

    // ==========================================================
    // 5. FAQ accordion — fecha os outros ao abrir um
    // ==========================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (item.open) {
                faqItems.forEach(function (other) {
                    if (other !== item && other.open) other.open = false;
                });
            }
        });
    });

    // ==========================================================
    // 6. Reveal-on-scroll com IntersectionObserver
    // ==========================================================
    const revealSelectors = [
        '.case-card',
        '.plan-card',
        '.product-card',
        '.faq-item',
        '.course-info',
        '.course-card',
        '.about-content',
        '.about-visual',
        '.cta-banner',
        '.section-head',
        '.provocation-card',
        '.problem-side',
        '.solution-side',
        '.final-card',
        '.stat-pill'
    ];

    const revealEls = document.querySelectorAll(revealSelectors.join(','));
    revealEls.forEach(function (el, i) {
        el.classList.add('reveal');
        // pequeno stagger para cards em grade
        if (el.matches('.case-card, .plan-card, .product-card, .stat-pill')) {
            const siblings = Array.from(el.parentElement.children).filter(function (c) {
                return c.classList.contains(el.classList[0]);
            });
            const idx = siblings.indexOf(el);
            el.style.transitionDelay = (idx * 0.08) + 's';
        }
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // ==========================================================
    // 7. Tracking simples de cliques (console)
    // ==========================================================
    document.querySelectorAll('a[href*="wa.me"], a[href*="hotmart"]').forEach(function (link) {
        link.addEventListener('click', function () {
            const label = (this.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
            const target = this.href.includes('wa.me') ? 'WhatsApp' : 'Hotmart';
            console.log('[CTA]', target, '→', label);
        });
    });

    // ==========================================================
    // 8. Active link no menu conforme a seção visível
    // ==========================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav a');

    function setActiveLink() {
        if (!sections.length || !navLinks.length) return;
        const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 40;
        let current = '';

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    // ==========================================================
    // 9. Parallax leve nos cards flutuantes do hero
    // ==========================================================
    const floatingCards = document.querySelectorAll('.hero-floating-card');
    if (floatingCards.length && window.matchMedia('(min-width: 980px)').matches) {
        document.addEventListener('mousemove', function (e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 14;
            const y = (e.clientY / window.innerHeight - 0.5) * 14;
            floatingCards.forEach(function (card, i) {
                const factor = i % 2 === 0 ? 1 : -1;
                card.style.transform = 'translate(' + (x * factor) + 'px,' + (y * factor) + 'px)';
            });
        });
    }

})();
