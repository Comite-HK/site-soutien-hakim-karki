/* Formulaire Contact : envoi AJAX vers l'API Web3Forms, confirmation accessible.
   Sans JavaScript, le formulaire fonctionne en POST classique vers la même API
   (le champ `redirect` n'est pas posé : Web3Forms affiche sa page de succès).
   Anti-spam : honeypot `botcheck` — aucun script ou traceur externe chargé. */
(function () {
  var form = document.getElementById('mq-contact');
  if (!form) return;
  var statut = document.getElementById('mq-contact-statut');
  var bouton = form.querySelector('button[type="submit"]');
  var libelle = bouton.textContent;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (bouton.disabled) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    bouton.disabled = true;
    bouton.setAttribute('aria-disabled', 'true');
    bouton.textContent = 'Envoi en cours…';
    statut.className = 'mq-contact__statut';
    statut.textContent = '';

    var donnees = new FormData(form);
    var corps = Object.fromEntries(donnees.entries());
    corps.botcheck = form.botcheck ? form.botcheck.checked : false;
    /* L'email du visiteur devient l'adresse de réponse (replyto), comme documenté. */
    corps.replyto = corps.email;

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(corps)
    }).then(function (reponse) {
      return reponse.json().then(function (json) {
        if (!reponse.ok || json.success === false) throw new Error(json.message || 'envoi refuse');
        statut.className = 'mq-contact__statut mq-contact__statut--ok';
        statut.textContent = 'Votre message a bien été envoyé au comité. Merci de votre retour.';
        form.reset();
      });
    }).catch(function () {
      statut.className = 'mq-contact__statut mq-contact__statut--erreur';
      statut.textContent = 'L’envoi a échoué. Vos champs sont conservés : vérifiez votre connexion et réessayez, ou écrivez à contact@soutien-juge-hakim-karki.fr.';
    }).then(function () {
      bouton.disabled = false;
      bouton.removeAttribute('aria-disabled');
      bouton.textContent = libelle;
    });
  });
})();
