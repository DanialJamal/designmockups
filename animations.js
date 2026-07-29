/* ==========================================================================
   animations.js — scroll reveal + animated counters
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Animated counters — element markup:
     <span class="stat-item__number" data-counter data-target="500" data-suffix="+">0</span>
     ------------------------------------------------------------------------ */
  var counters = document.querySelectorAll('[data-counter]');

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) { startTime = timestamp; }
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-target')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
        el.textContent = target.toFixed(decimals) + suffix;
      });
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ------------------------------------------------------------------------
     Button ripple effect
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);

      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

      btn.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 650);
    });
  });
})();
