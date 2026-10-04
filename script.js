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
  //
  // On mobile the numbered stages' detail popup is `position: fixed` to
  // the viewport's right edge (see styles.css) because the stages are
  // centered with margin on both sides, so there often isn't room to open
  // a popup off the box's own right edge. A fixed-position element still
  // needs a `top`, which depends on which box was tapped, so we set it
  // here rather than in CSS. The skip connector's popup opens below
  // itself instead and isn't affected by this.
  var mobileQuery = window.matchMedia('(max-width: 640px)');
  document.querySelectorAll('.pipeline-toggle').forEach(function (toggle) {
    var stage = toggle.closest('.pipeline-stage');
    var isSkip = stage && stage.classList.contains('pipeline-stage-skip');
    var detailWrap = stage && stage.querySelector('.pipeline-detail-wrap');

    function toggleOpen() {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      var opening = !open;
      if (opening && !isSkip && mobileQuery.matches && detailWrap) {
        detailWrap.style.top = toggle.getBoundingClientRect().top + 'px';
      }
      toggle.setAttribute('aria-expanded', String(opening));
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
