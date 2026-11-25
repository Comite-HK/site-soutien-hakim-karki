/* Ouvre automatiquement le passage visé par une ancre directe. */
(function () {
  'use strict';

  function ouvrirPassage() {
    if (!window.location.hash) return;
    var cible = document.getElementById(window.location.hash.slice(1));
    if (!cible) return;
    var detail = cible.matches('details') ? cible : cible.closest('details');
    if (detail) detail.open = true;
  }

  ouvrirPassage();
  window.addEventListener('hashchange', ouvrirPassage);
})();
