/* My Diary - privacy policy
 *
 * Progressive enhancement only. With JavaScript disabled the page is still a complete,
 * readable document: the contents list stays expanded and every link is a plain anchor.
 */
(function () {
  'use strict';

  var SMALL_SCREEN = '(max-width: 820px)';

  /* ------------------------------------------------ collapsible contents */

  var toggle = document.querySelector('.toc-toggle');
  var list = document.getElementById('toc-list');

  if (toggle && list) {
    // Collapsed to start with on phones only - on a wide screen the list is the sidebar.
    var startCollapsed = window.matchMedia(SMALL_SCREEN).matches;
    list.classList.toggle('collapsed', startCollapsed);
    toggle.setAttribute('aria-expanded', String(!startCollapsed));

    toggle.addEventListener('click', function () {
      var nowOpen = list.classList.contains('collapsed');
      list.classList.toggle('collapsed', !nowOpen);
      toggle.setAttribute('aria-expanded', String(nowOpen));
    });

    // Tapping a link on a phone should close the list rather than leave it covering
    // the section you just jumped to.
    list.addEventListener('click', function (event) {
      if (event.target.tagName !== 'A') return;
      if (!window.matchMedia(SMALL_SCREEN).matches) return;
      list.classList.add('collapsed');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ------------------------------------------- highlight the section in view */

  var links = Array.prototype.slice.call(
    document.querySelectorAll('#toc-list a')
  );

  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        // Several sections can be on screen at once; the topmost visible one wins.
        var visible = entries
          .filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------------------------------------------------------- back to top */

  var toTop = document.getElementById('to-top');

  if (toTop) {
    var sync = function () {
      toTop.hidden = window.pageYOffset < 600;
    };

    // passive: this fires constantly while scrolling and never calls preventDefault.
    window.addEventListener('scroll', sync, { passive: true });
    sync();

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}());
