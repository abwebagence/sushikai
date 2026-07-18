/**
 * Galerie dynamique Sushikai
 * Charge les photos ajoutées via admin-pdf.php (fichier galerie/galerie.json)
 * et les insère dans la grille Isotope existante, dans la bonne catégorie.
 * Fonctionne pour la version PC (/galerie/) et mobile (/mobile/galerie/)
 * grâce aux chemins relatifs.
 */
(function () {
  'use strict';

  var DOSSIER = 'galerie/';
  var CONTAINER_SELECTOR = '.mad-portfolio.mad-grid--isotope';
  var CATEGORIES = ['restaurant', 'food', 'drinks', 'events'];

  function creerItem(photo) {
    var cat = CATEGORIES.indexOf(photo.cat) !== -1 ? photo.cat : 'events';
    var titre = photo.title || 'Photo Sushikai';

    var item = document.createElement('div');
    item.className = 'mad-grid-item mad-category-' + cat;

    var galleryItem = document.createElement('div');
    galleryItem.className = 'mad-gallery-item';

    var media = document.createElement('a');
    media.href = DOSSIER + photo.file;
    media.target = '_blank';
    media.rel = 'noopener';
    media.className = 'mad-gallery-media';

    var img = document.createElement('img');
    img.src = DOSSIER + photo.thumb;
    img.alt = titre;
    img.width = 448;
    img.height = 344;
    img.loading = 'lazy';
    img.decoding = 'async';
    media.appendChild(img);

    var desc = document.createElement('div');
    desc.className = 'mad-gallery-desc';

    var h6 = document.createElement('h6');
    h6.className = 'mad-gallery-name';
    var titreLien = document.createElement('a');
    titreLien.href = '#';
    titreLien.className = 'mad-link';
    titreLien.textContent = titre;
    titreLien.addEventListener('click', function (e) { e.preventDefault(); });
    h6.appendChild(titreLien);

    var agrandir = document.createElement('a');
    agrandir.href = DOSSIER + photo.file;
    agrandir.target = '_blank';
    agrandir.rel = 'noopener';
    agrandir.className = 'mad-gallery-cat mad-link';
    agrandir.textContent = 'Agrandir la photo';

    desc.appendChild(h6);
    desc.appendChild(agrandir);
    galleryItem.appendChild(media);
    galleryItem.appendChild(desc);
    item.appendChild(galleryItem);
    return item;
  }

  function rafraichirIsotope(container, imgs) {
    if (!window.jQuery) return;
    var $c = window.jQuery(container);

    var relayout = function () {
      // Isotope pas encore initialisé (init au window.load) : il prendra
      // les nouveaux éléments tout seul, rien à faire.
      if (!$c.data('IsotopeWrapper')) return;
      var actif = document.querySelector('#portfolio-filter .mad-active');
      var filtre = (actif && actif.getAttribute('data-filter')) || '*';
      $c.isotope('reloadItems');
      $c.isotope({ filter: filtre });
    };

    relayout();
    // Recale la grille au fur et à mesure du chargement des images
    imgs.forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', relayout);
      img.addEventListener('error', relayout);
    });
    window.addEventListener('load', relayout);
  }

  function init() {
    var container = document.querySelector(CONTAINER_SELECTOR);
    if (!container) return;

    // no-store : une photo ajoutée dans l'admin apparaît immédiatement
    fetch(DOSSIER + 'galerie.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (photos) {
        if (!Array.isArray(photos) || !photos.length) return;
        var fragment = document.createDocumentFragment();
        var imgs = [];
        photos.forEach(function (photo) {
          if (!photo || !photo.file || !photo.thumb) return;
          var item = creerItem(photo);
          imgs.push(item.querySelector('img'));
          fragment.appendChild(item);
        });
        container.appendChild(fragment);
        rafraichirIsotope(container, imgs);
      })
      .catch(function () { /* pas de galerie dynamique : silence */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
