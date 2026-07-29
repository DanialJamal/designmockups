/* ==========================================================================
   main.js — header, navigation, scroll behaviors, forms, FAQ
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Page loader
     ------------------------------------------------------------------------ */
  var loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      loader.classList.add('is-hidden');
    });
  }

  /* ------------------------------------------------------------------------
     Sticky header shadow + scroll progress bar
     ------------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');
  var progressBar = document.querySelector('.scroll-progress');
  var backToTop = document.querySelector('.back-to-top');

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 8);
    }

    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }

    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollY > 500);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var navClose = document.getElementById('navClose');
  var mainNav = document.getElementById('mainNav');
  var navScrim = document.getElementById('navScrim');

  function openNav() {
    mainNav.classList.add('is-open');
    navScrim.classList.add('is-open');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    mainNav.classList.remove('is-open');
    navScrim.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mainNav && navScrim) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.contains('is-open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (navClose) {
      navClose.addEventListener('click', closeNav);
    }

    navScrim.addEventListener('click', closeNav);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeNav();
      }
    });

    mainNav.querySelectorAll('.main-nav__link, .main-nav__cta').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* ------------------------------------------------------------------------
     Smooth scroll for in-page anchors (accounts for sticky header height)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var hash = link.getAttribute('href');
    if (!hash || hash === '#') { return; }
    var target = document.querySelector(hash);
    if (!target) { return; }

    link.addEventListener('click', function (e) {
      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------------
     FAQ accordion
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-item__question');
    if (!question) { return; }

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      item.parentElement.querySelectorAll('.faq-item').forEach(function (sibling) {
        sibling.classList.remove('is-open');
        var q = sibling.querySelector('.faq-item__question');
        if (q) { q.setAttribute('aria-expanded', 'false'); }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------------
     Contact form validation
     ------------------------------------------------------------------------ */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(field, message) {
      field.classList.add('has-error');
      var error = field.closest('.form-group').querySelector('.form-error');
      if (error) {
        error.textContent = message;
        error.classList.add('is-visible');
      }
    }

    function clearError(field) {
      field.classList.remove('has-error');
      var error = field.closest('.form-group').querySelector('.form-error');
      if (error) {
        error.classList.remove('is-visible');
      }
    }

    contactForm.querySelectorAll('.form-control').forEach(function (field) {
      field.addEventListener('input', function () { clearError(field); });
      field.addEventListener('change', function () { clearError(field); });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      var name = contactForm.querySelector('#fullName');
      var email = contactForm.querySelector('#email');
      var interest = contactForm.querySelector('#interest');
      var message = contactForm.querySelector('#message');

      [name, email, interest, message].forEach(function (field) {
        if (field) { clearError(field); }
      });

      if (name && !name.value.trim()) {
        showError(name, 'Please enter your full name.');
        isValid = false;
      }

      if (email && !emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      if (interest && !interest.value) {
        showError(interest, 'Please select an option.');
        isValid = false;
      }

      if (message && message.value.trim().length < 10) {
        showError(message, 'Please tell us a bit more (10+ characters).');
        isValid = false;
      }

      var successEl = document.getElementById('formSuccess');

      if (isValid) {
        if (successEl) {
          successEl.classList.add('is-visible');
          successEl.setAttribute('role', 'status');
        }
        contactForm.reset();
        contactForm.querySelectorAll('.form-control').forEach(clearError);
      } else if (successEl) {
        successEl.classList.remove('is-visible');
      }
    });
  }
})();
