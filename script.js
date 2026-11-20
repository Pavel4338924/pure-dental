/* =========================================
   Magic Doctor — скрипты
   ========================================= */
(() => {
  'use strict';

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  const progress = document.getElementById('preloaderProgress');

  let loaded = 0;
  const interval = setInterval(() => {
    loaded += 5;
    if (progress) progress.style.width = loaded + '%';
    if (loaded >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('done');
          preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
          }, { once: true });
        }
        initReveals();
      }, 300);
    }
  }, 40);

  // ---------- DOM helpers ----------
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // ---------- Header scroll state ----------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ---------- Mobile menu ----------
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Active link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = { threshold: 0.25 };
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach((sec) => scrollObserver.observe(sec));

  // ---------- Scroll reveal ----------
  function initReveals() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-delay, .reveal-delay2');
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            ro.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => ro.observe(el));
  }

  // ---------- Animated counters ----------
  const statNumbers = document.querySelectorAll('.num, .stat-num');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.getAttribute('data-target');
          let current = 0;
          const duration = 1400;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString('ru-RU');
          }, 16);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );
  statNumbers.forEach((el) => counterObserver.observe(el));

  // ---------- FAQ accordion ----------
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((q) => {
    q.addEventListener('click', () => {
      const active = q.classList.toggle('active');
      const answer = q.nextElementSibling;
      if (answer) {
        answer.classList.toggle('hidden');
      }
      // close others
      faqQuestions.forEach((other) => {
        if (other !== q && other.classList.contains('active')) {
          other.classList.remove('active');
          const ans = other.nextElementSibling;
          if (ans) ans.classList.add('hidden');
        }
      });
    });
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        q.click();
      }
    });
  });

  // ---------- Before & After slider ----------
  let currentSlide = 0;
  const slides = document.querySelectorAll('.ba-slide');
  const dots = document.querySelectorAll('.ba-dot');
  const prevBtn = document.querySelector('.ba-prev');
  const nextBtn = document.querySelector('.ba-next');

  function showSlide(index) {
    if (slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === currentSlide);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  dots.forEach((d) => {
    d.addEventListener('click', () => showSlide(+d.getAttribute('data-index')));
  });

  // ---------- Appointment form ----------
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Отправляется...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Заявка отправлена!';
        btn.style.background = '#16a34a';
        setTimeout(() => {
          form.reset();
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
        }, 2000);
      }, 1200);
    });
  }

  // ---------- Spotlight mouse effect ----------
  document.querySelectorAll('.card, .t-card, .faq-item, .contact-item, .laptop-img, .btn, .card-link, .ba-btn').forEach((el) => {
    el.classList.add('spotlight');
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.removeProperty('--mouse-x');
      el.style.removeProperty('--mouse-y');
    });
  });

  // ---------- Phone mask hint (visual only) ----------
  const telInput = document.querySelector('input[type="tel"]');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('7')) v = v.slice(1);
      if (v.length > 0) v = '(' + v;
      if (v.length > 4) v = v.slice(0, 4) + ') ' + v.slice(4);
      if (v.length > 9) v = v.slice(0, 9) + '-' + v.slice(9);
      if (v.length > 12) v = v.slice(0, 12) + '-' + v.slice(12);
      e.target.value = v;
    });
  }
})();
