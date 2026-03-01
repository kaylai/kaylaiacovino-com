/* ============================================================
   Dr. Kayla Iacovino — Site JavaScript
   ============================================================ */

(function () {
  'use strict';

  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.site-nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Sticky Nav Shadow on Scroll ---
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    window.addEventListener('scroll', function () {
      siteNav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // --- Active Nav Link Highlighting ---
  const currentPath = window.location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.site-nav__links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    // Resolve relative href to absolute for comparison
    const linkUrl = new URL(href, window.location.href);
    const linkPath = linkUrl.pathname.replace(/index\.html$/, '');
    if (linkPath === currentPath || (currentPath.endsWith('/') && linkPath === currentPath.slice(0, -1))) {
      link.classList.add('active');
    }
  });
})();
