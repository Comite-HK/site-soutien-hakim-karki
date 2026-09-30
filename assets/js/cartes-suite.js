/* Cartes « Dans la même rubrique » — générées depuis le sous-menu de la
   rubrique courante, dans son ordre, en excluant la page courante.
   Une seule source de destinations : le menu partagé. */
(function () {
  'use strict';

  var zone = document.getElementById('mq-suite-liens');
  var section = document.getElementById('mq-suite') || (zone && zone.closest('.mq-suite'));
  if (!zone) return;

  /* Sous-menu contenant la page courante */
  var sous = document.querySelector('.mq-nav__sous:has([aria-current="page"])')
    || document.getElementById('mq-sous-affaire');
  if (!sous) return;

  var liens = Array.prototype.slice.call(sous.querySelectorAll('a[href]'));
  liens.forEach(function (lien) {
    if (lien.hasAttribute('aria-current')) return;
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'mq-suite__carte';
    a.setAttribute('href', lien.getAttribute('href'));
    a.textContent = lien.textContent.replace(/\s+/g, ' ').trim();
    li.appendChild(a);
    zone.appendChild(li);
  });

  if (section && zone.children.length) section.hidden = false;
})();
