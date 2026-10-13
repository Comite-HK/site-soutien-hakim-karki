/* Façade vidéo de l'accueil : le lecteur YouTube n'est injecté qu'au clic.
   Sans JavaScript, le lien « Regarder la vidéo sur YouTube » reste fonctionnel. */
document.querySelectorAll('.mq-video__facade[data-video]').forEach(function (facade) {
  facade.addEventListener('click', function (event) {
    event.preventDefault();
    var iframe = document.createElement('iframe');
    iframe.className = 'mq-video__lecteur';
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + facade.dataset.video + '?autoplay=1&rel=0';
    iframe.title = facade.dataset.titre || 'Vidéo YouTube';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
    iframe.focus();
  });
});
