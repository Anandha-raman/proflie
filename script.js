/* ==========================================================================
   PORTFOLIO SCRIPT — ANANDHARAMAN P
   Interactive Canvas, Smooth Animations, Theme Switcher & Accordion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (DARK / LIGHT MODE)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Check saved theme or default to dark
  let savedTheme = 'dark';
  try { const s = localStorage.getItem('anandharaman_theme'); if (s) savedTheme = s; } catch(e) { console.warn('localStorage blocked on file://, using default theme', e); }
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      try { localStorage.setItem('anandharaman_theme', newTheme); } catch(e) { console.warn('localStorage blocked', e); }
    });
  }

  /* --------------------------------------------------------------------------
     2. CUSTOM GLOWING CURSOR
     -------------------------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let followerX = mouseX, followerY = mouseY;

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.14;
      followerY += (mouseY - followerY) * 0.14;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Hover expand effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .faq-btn');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
        follower.style.borderColor = 'var(--accent-indigo)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.borderColor = 'var(--accent-cyan)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. INTERACTIVE PARTICLE CANVAS
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 75;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        const isDark = htmlRoot.getAttribute('data-theme') !== 'light';
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = isDark ? '#06b6d4' : '#2563eb';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    particles = Array.from({ length: particleCount }, () => new Particle());

    const connectParticles = () => {
      const maxDistance = 110;
      const isDark = htmlRoot.getAttribute('data-theme') !== 'light';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / maxDistance) * (isDark ? 0.15 : 0.08);
            ctx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     4. NAVBAR SCROLL & ACTIVE SECTION HIGHLIGHT
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  const onScroll = () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }

    let currentSection = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((sec) => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile Menu Toggle
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  /* --------------------------------------------------------------------------
     4b. FIX for file:// unique origin error on #hash navigation (e.g. #contact)
     Chrome treats file:/// + hash as frame navigation and blocks it.
     Prevent default hash jump, use smooth scroll + history.replaceState instead.
     -------------------------------------------------------------------------- */
  // Handle initial hash on file:// load (direct link with #contact)
  if (location.protocol === 'file:' && location.hash) {
    const initTarget = document.querySelector(location.hash);
    if (initTarget) {
      setTimeout(() => initTarget.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    // Skip resume modal triggers that already preventDefault
    if (a.id === 'openResumeBtn' || a.id === 'heroResumeModalBtn') return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { history.replaceState(null, '', href); } catch (err) { /* file:// may block history */ }
        // Close mobile menu if open
        if (hamburger) hamburger.classList.remove('open');
        if (navLinksContainer) navLinksContainer.classList.remove('open');
      });
    }
  });

  // Suppress harmless file:// console warning display (optional, page still works)
  if (location.protocol === 'file:') {
    const _origWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('file:')) return;
      _origWarn.apply(console, args);
    };
  }

  /* --------------------------------------------------------------------------
     5. TYPED TEXT ANIMATION
     -------------------------------------------------------------------------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const roles = [
      'Python Developer',
      'Oracle & SQL Developer',
      'Web Developer (HTML, CSS, JS)',
      'Data Processing Specialist',
      'Automation Engineer',
      'Computer Science Graduate'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeLoop = () => {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        typedEl.textContent = currentRole.substring(0, ++charIndex);
        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(typeLoop, 2000);
          return;
        }
      } else {
        typedEl.textContent = currentRole.substring(0, --charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeLoop, 400);
          return;
        }
      }

      setTimeout(typeLoop, isDeleting ? 45 : 85);
    };
    typeLoop();
  }

  /* --------------------------------------------------------------------------
     6. SCROLL REVEAL (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('in-view'));
  }

  /* --------------------------------------------------------------------------
     7. ANIMATED SKILL BARS
     -------------------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  if (skillBars.length && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const fill = bar.querySelector('.skill-bar-fill');
            const targetWidth = bar.getAttribute('data-width');
            if (fill && targetWidth) {
              setTimeout(() => {
                fill.style.width = `${targetWidth}%`;
              }, 200);
            }
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.25 }
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  }

  /* --------------------------------------------------------------------------
     8. FAQ ACCORDION (SMOOTH MAX-HEIGHT EXPAND)
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-btn');
    const panel = item.querySelector('.faq-panel');

    if (btn && panel) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach((other) => {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-btn');
          const otherPanel = other.querySelector('.faq-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        });

        // Toggle clicked
        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     9. 3D AVATAR TILT EFFECT
     -------------------------------------------------------------------------- */
  const avatarWrap = document.getElementById('avatarWrap');
  if (avatarWrap && window.matchMedia('(min-width: 992px)').matches) {
    const avatarContainer = avatarWrap.querySelector('.avatar-container');

    avatarWrap.addEventListener('mousemove', (e) => {
      const rect = avatarWrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;

      if (avatarContainer) {
        avatarContainer.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });

    avatarWrap.addEventListener('mouseleave', () => {
      if (avatarContainer) {
        avatarContainer.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. CONTACT FORM VALIDATION & SUBMISSION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('nameInput');
      const emailInput = document.getElementById('emailInput');
      const messageInput = document.getElementById('messageInput');

      // Helper to toggle error
      const validateField = (input, condition) => {
        const group = input.closest('.form-group');
        if (!condition) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      };

      validateField(nameInput, nameInput.value.trim().length > 1);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      validateField(messageInput, messageInput.value.trim().length > 4);

      if (!isValid) return;

      // Submit feedback state
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Sending Message...';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = originalText;

          if (formSuccess) {
            formSuccess.classList.add('show');
            setTimeout(() => {
              formSuccess.classList.remove('show');
            }, 6000);
          }
        }, 1200);
      }
    });
  }

  /* --------------------------------------------------------------------------
     11. RESUME MODAL HANDLERS
     -------------------------------------------------------------------------- */
  const resumeModalBackdrop = document.getElementById('resumeModalBackdrop');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const heroResumeModalBtn = document.getElementById('heroResumeModalBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');

  const openResumeModal = (e) => {
    if (e) e.preventDefault();
    if (resumeModalBackdrop) {
      resumeModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeResumeModal = () => {
    if (resumeModalBackdrop) {
      resumeModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResumeModal);
  if (heroResumeModalBtn) heroResumeModalBtn.addEventListener('click', openResumeModal);
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);

  if (resumeModalBackdrop) {
    resumeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === resumeModalBackdrop) {
        closeResumeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModalBackdrop && resumeModalBackdrop.classList.contains('open')) {
      closeResumeModal();
    }
  });

  /* --------------------------------------------------------------------------
     12. DOWNLOAD CV BUTTON INTERACTION FEEDBACK
     -------------------------------------------------------------------------- */
  const downloadButtons = document.querySelectorAll('a[download]');
  downloadButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textSpan = btn.querySelector('span');
      if (textSpan) {
        const originalText = textSpan.textContent;
        textSpan.textContent = 'Downloading...';
        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 1800);
      }
    });
  });

});

