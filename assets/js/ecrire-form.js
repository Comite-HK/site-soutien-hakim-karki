/* Formulaire « Écrire à Hakim » : envoi AJAX vers l'API Web3Forms, retour accessible.
   Sans JavaScript, le formulaire fonctionne en POST classique vers la même API.
   Bascule : « Adresse complète » n'apparaît — et n'est jamais transmise — que si
   une réponse est souhaitée (le champ masqué est aussi désactivé, donc exclu de
   tout envoi, avec ou sans JavaScript).
   Anti-spam : honeypot `botcheck` — aucun script ou traceur externe chargé. */
(function () {
  var form = document.getElementById('mq-ecrire-form');
  if (!form) return;

  var caseReponse = document.getElementById('souhaite_reponse');
  var blocAdresse = document.getElementById('adresse_fields');
  var adresse = document.getElementById('adresse');
  var majAdresse = function () {
    blocAdresse.hidden = !caseReponse.checked;
    adresse.disabled = !caseReponse.checked;
    caseReponse.setAttribute('aria-expanded', String(caseReponse.checked));
  };
  caseReponse.addEventListener('change', majAdresse);
  majAdresse();

  var statut = document.getElementById('mq-ecrire-statut');
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
    statut.className = 'mq-ecrire__statut';
    statut.textContent = '';

    var corps = Object.fromEntries(new FormData(form).entries());
    corps.botcheck = form.botcheck ? form.botcheck.checked : false;
    /* L'email du visiteur devient l'adresse de réponse (replyto), comme documenté. */
    corps.replyto = corps.email;
    /* Cases à cocher transmises en clair dans le courrier. */
    corps.souhaite_reponse = caseReponse.checked ? 'Oui' : 'Non';
    corps.accepte_transmission = document.getElementById('accepte_transmission').checked ? 'Oui' : 'Non';
    corps.accepte_newsletter = document.getElementById('accepte_newsletter').checked ? 'Oui' : 'Non';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(corps)
    }).then(function (reponse) {
      return reponse.json().then(function (json) {
        if (!reponse.ok || json.success === false) throw new Error(json.message || 'envoi refuse');
        statut.className = 'mq-ecrire__statut mq-ecrire__statut--ok';
        statut.textContent = 'Votre message a bien été transmis au comité. Merci pour votre soutien.';
        form.reset();
        majAdresse();
      });
    }).catch(function () {
      statut.className = 'mq-ecrire__statut mq-ecrire__statut--erreur';
      statut.textContent = 'L’envoi a échoué. Vos champs sont conservés : vérifiez votre connexion et réessayez.';
    }).then(function () {
      bouton.disabled = false;
      bouton.removeAttribute('aria-disabled');
      bouton.textContent = libelle;
    });
  });
})();
