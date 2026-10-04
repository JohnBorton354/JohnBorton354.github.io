(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll('header, section, .pipeline-stage');
  var fadeTargets = document.querySelectorAll('.roles li');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });
  fadeTargets.forEach(function (el) { el.classList.add('reveal-fade'); });
  var allTargets = Array.prototype.slice.call(revealTargets).concat(Array.prototype.slice.call(fadeTargets));

  if (!prefersReduced && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    allTargets.forEach(function (el) { observer.observe(el); });
  } else {
    allTargets.forEach(function (el) { el.classList.add('visible'); });
  }

  // Pipeline stages: click/tap toggles the detail text (desktop also still
  // reveals it on hover via CSS; this makes it reachable without a mouse).
  document.querySelectorAll('.pipeline-toggle').forEach(function (toggle) {
    function toggleOpen() {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
    }
    toggle.addEventListener('click', toggleOpen);
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleOpen();
      }
    });
  });
})();
