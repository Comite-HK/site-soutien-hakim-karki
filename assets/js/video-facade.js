/* Façade vidéo de l'accueil : le lecteur YouTube n'est injecté qu'après activation explicite
   (« Autoriser YouTube et lire »). « Désactiver YouTube » retire le lecteur et restaure la façade.
   Aucune autorisation n'est mémorisée ; sans JavaScript, le lien « Regarder la vidéo sur YouTube »
   reste fonctionnel. */
document.querySelectorAll('.mq-video__facade[data-video]').forEach(function (facade) {
  var bloc = facade.closest('.mq-video');
  var desactiver = bloc && bloc.querySelector('.mq-video__desactiver');
  var lecteur = null;

  facade.addEventListener('click', function (event) {
    event.preventDefault();
    if (lecteur) return;
    lecteur = document.createElement('iframe');
    lecteur.className = 'mq-video__lecteur';
    lecteur.src = 'https://www.youtube-nocookie.com/embed/' + facade.dataset.video + '?autoplay=1&rel=0';
    lecteur.title = facade.dataset.titre || 'Vidéo YouTube';
    lecteur.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
    lecteur.allowFullscreen = true;
    facade.hidden = true;
    facade.insertAdjacentElement('afterend', lecteur);
    if (desactiver) desactiver.hidden = false;
    lecteur.focus();
  });

  if (desactiver) {
    desactiver.addEventListener('click', function () {
      if (lecteur) { lecteur.remove(); lecteur = null; }
      desactiver.hidden = true;
      facade.hidden = false;
      facade.focus();
    });
  }
});
