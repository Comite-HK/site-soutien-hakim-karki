// Navigation principale — panneau mobile + groupes dépliants.
// Clavier : Entrée/Espace ouvre, Tab/Maj+Tab parcourt, Échap ferme et rend le focus.
// Sans JavaScript : les liens restent visibles dans le flux (voir navigation.css).
document.documentElement.classList.add('js');
(function () {
  var bascule = document.getElementById('mq-bascule');
  var nav = document.getElementById('mq-nav');
  if (!bascule || !nav) return;
  var groupes = Array.prototype.slice.call(nav.querySelectorAll('.mq-nav__groupe'));
  var mobile = window.matchMedia('(max-width: 1199px)');
  var courant = nav.querySelector('[aria-current="page"]');
  var groupeCourant = courant ? courant.closest('.mq-nav__groupe') : null;

  function ouvrirGroupe(groupe, ouvert) {
    groupe.classList.toggle('mq-ouvert', ouvert);
    groupe.querySelector('.mq-nav__parent').setAttribute('aria-expanded', String(ouvert));
    groupe.querySelector('.mq-nav__sous').hidden = !ouvert;
  }
  function fermerGroupes(sauf) {
    groupes.forEach(function (groupe) {
      if (groupe !== sauf) ouvrirGroupe(groupe, false);
    });
  }
  function panneau(ouvert, retour) {
    if (retour) bascule.focus();
    nav.classList.toggle('mq-ouvert', ouvert);
    bascule.setAttribute('aria-expanded', String(ouvert));
    bascule.textContent = ouvert ? 'Fermer' : 'Menu';
    fermerGroupes();
    // Sur mobile, la rubrique de la page courante s'ouvre par défaut.
    if (ouvert && groupeCourant) ouvrirGroupe(groupeCourant, true);
  }
  bascule.addEventListener('click', function () {
    panneau(bascule.getAttribute('aria-expanded') !== 'true', false);
  });
  nav.querySelector('.mq-nav__fermer').addEventListener('click', function () {
    panneau(false, true);
  });
  groupes.forEach(function (groupe) {
    var bouton = groupe.querySelector('.mq-nav__parent');
    bouton.addEventListener('click', function () {
      var ouvert = bouton.getAttribute('aria-expanded') !== 'true';
      fermerGroupes(groupe);
      ouvrirGroupe(groupe, ouvert);
    });
    groupe.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bouton.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        e.stopPropagation();
        bouton.focus();
        ouvrirGroupe(groupe, false);
      }
    });
    groupe.addEventListener('focusout', function (e) {
      if (!mobile.matches && !groupe.contains(e.relatedTarget)) ouvrirGroupe(groupe, false);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobile.matches && nav.classList.contains('mq-ouvert')) {
      e.preventDefault();
      panneau(false, true);
    }
  });
  document.addEventListener('click', function (e) {
    if (nav.contains(e.target) || bascule.contains(e.target)) return;
    if (mobile.matches && nav.classList.contains('mq-ouvert')) {
      panneau(false, nav.contains(document.activeElement));
    } else if (!mobile.matches) {
      var actif = document.activeElement.closest('.mq-nav__sous');
      if (actif) actif.parentElement.querySelector('.mq-nav__parent').focus();
      fermerGroupes();
    }
  });
  mobile.addEventListener('change', function () {
    var actif = document.activeElement;
    var groupe = actif.closest ? actif.closest('.mq-nav__groupe') : null;
    panneau(false, false);
    if (mobile.matches && nav.contains(actif)) bascule.focus();
    else if (!mobile.matches && (actif === bascule || actif.matches('.mq-nav__action-mobile,.mq-nav__fermer'))) nav.querySelector('a').focus();
    else if (groupe) groupe.querySelector('.mq-nav__parent').focus();
  });
  fermerGroupes();
})();
