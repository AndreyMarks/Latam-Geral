document.addEventListener('DOMContentLoaded', () => {
    // Funções de inicialização para o slider (apenas na página principal)
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const heroSection = document.querySelector('.hero');

    if (slides.length > 0 && heroSection) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoSlideInterval = null;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % totalSlides;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(prev);
        }

        function startAutoSlide() {
            if (autoSlideInterval !== null) return;
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval !== null) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        // Event listeners for slider
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });

        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopAutoSlide();
                startAutoSlide();
            }
        }

        showSlide(0);
        startAutoSlide();
    }

    // Funções de inicialização para o menu mobile (em todas as páginas)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');

    if (mobileMenuBtn && nav && header) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            nav.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('active');
            });
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('active');
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.focus();
                }
            }
        });

        mobileMenuBtn.addEventListener('click', function() {
            setTimeout(() => {
                if (nav.classList.contains('active')) {
                    const firstNavLink = nav.querySelector('.nav-link');
                    if (firstNavLink) {
                        firstNavLink.focus();
                    }
                }
            }, 100);
        });
    }

    // Header scroll effect (em todas as páginas)
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScrollTop = scrollTop;
        });
    }

    // Smooth scrolling para links âncora (em todas as páginas)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer para animações (em todas as páginas)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .stat-item, .section-header, .employee-card').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats (apenas na página principal)
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                const increment = target / 100;
                let current = 0;
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        if (counter.textContent.includes('+')) {
                            counter.textContent = Math.ceil(current) + '+';
                        } else if (counter.textContent.includes('%')) {
                            counter.textContent = Math.ceil(current) + '%';
                        } else if (counter.textContent.includes('/')) {
                            counter.textContent = '24/7';
                        } else {
                            counter.textContent = Math.ceil(current);
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = counter.textContent;
                    }
                };
                updateCounter();
            });
        }

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // Lazy loading para imagens (em todas as páginas)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Tratamento de erro para imagens ausentes (em todas as páginas)
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });

    // Melhorias de acessibilidade (em todas as páginas)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.focus();
                e.preventDefault();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Loading animation (em todas as páginas)
    window.addEventListener('load', () => {
        document.body.classList.add('loading');
    });

    // Animação de entrada para elementos (em todas as páginas)
    setTimeout(() => {
        document.querySelectorAll('.service-card, .stat-item, .employee-card').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Funcionalidade de FAQ (apenas na página de contato)
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            faqItem.classList.toggle('active');
        });
    });
});



// ================= DROPDOWN FUNCTIONALITY =================
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Desktop hover functionality
        dropdown.addEventListener('mouseenter', () => {
            dropdown.classList.add('dropdown');
        });
        
        dropdown.addEventListener('mouseleave', () => {
            dropdown.classList.remove('dropdown');
        });
        
        // Mobile click functionality
        if (window.innerWidth <= 768) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

