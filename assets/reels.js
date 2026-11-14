/* Physik-Reels – gemeinsamer Code für alle Klassen.
   Braucht vorher:  assets/reels-katalog.js  (REELS_KATALOG: Texte zu jedem Video)
                    pX/reels/daten.js         (REELS_KLASSE, REELS_THEMEN)
   Auf index.html   → Themenkacheln in #reels-themen
   Auf ansehen.html → Wisch-Ansicht in #feed   (Thema über ?thema=…, „alle“ = alle Videos)
   Hier muss normalerweise nichts geändert werden. */
(function () {
  'use strict';

  var ICONS = {
    alle: '<rect x="7" y="3" width="18" height="26" rx="4"/><path d="M14 12v8l6-4z" fill="currentColor"/>',
    messen: '<path d="M4 23L23 4l5 5L9 28z"/><path d="M10 17l2.5 2.5M13.5 13.5l3.5 3.5M17 10l2.5 2.5M20.5 6.5l3.5 3.5"/>',
    tacho: '<path d="M5 22a11 11 0 1 1 22 0"/><path d="M16 22l6-7"/><circle cx="16" cy="22" r="2" fill="currentColor"/>',
    traegheit: '<circle cx="21" cy="16" r="6"/><path d="M3 11h9M1.5 16h9M3 21h9"/>',
    kraft: '<path d="M3 16h7l2-4 3 8 3-8 2 4h3"/><path d="M23 10l6 6-6 6"/>',
    dichte: '<path d="M9 4h14v21a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3z"/><path d="M9 12h14M9 19h14"/>',
    licht: '<circle cx="16" cy="16" r="6"/><path d="M16 2v4M16 26v4M2 16h4M26 16h4M6 6l3 3M23 23l3 3M26 6l-3 3M6 26l3-3"/>',
    spiegel: '<path d="M3 26h26"/><path d="M5 6l11 20L27 6"/><path d="M8.5 9.5L5 6l1 5" />',
    linse: '<path d="M16 3c4.5 4 4.5 22 0 26c-4.5-4-4.5-22 0-26z"/><path d="M2 12l14 4 14-4M2 20l14-4 14 4"/>',
    magnet: '<path d="M7 5h6v11a3 3 0 0 0 6 0V5h6v11a9 9 0 0 1-18 0z"/><path d="M7 10h6M19 10h6"/>',
    ladung: '<circle cx="10" cy="16" r="6.5"/><circle cx="22.5" cy="16" r="6.5"/><path d="M7 16h6M10 13v6M19.5 16h6"/>',
    strom: '<path d="M18 3L8 18h7l-1 11 10-15h-7z"/>',
    druck: '<path d="M16 3c5 7 9 12 9 17a9 9 0 0 1-18 0c0-5 4-10 9-17z"/><path d="M12 21a4 4 0 0 0 4 4"/>',
    luft: '<circle cx="16" cy="17" r="11"/><path d="M16 17l5-6"/><path d="M9 25h14"/>',
    gas: '<circle cx="9" cy="10" r="3"/><circle cx="22" cy="8" r="3"/><circle cx="14" cy="21" r="3"/><circle cx="25" cy="22" r="3"/><path d="M12 9.5l7-1M11.5 13l2 5M17 21h5"/>',
    auftrieb: '<path d="M4 21h24l-4 7H8z"/><path d="M16 3v14M10 9l6-6 6 6"/>',
    thermo: '<path d="M13 6a3 3 0 0 1 6 0v13a6 6 0 1 1-6 0z"/><path d="M16 12v10"/>',
    flamme: '<path d="M16 3c1 5 8 8 8 15a8 8 0 0 1-16 0c0-4 2-6 3-8 1 2 2 3 3 4 1-4 1-7 2-11z"/>',
    aggregat: '<path d="M16 3v26M5 9.5l22 13M27 9.5l-22 13"/><path d="M12 4l4 3 4-3M12 28l4-3 4 3"/>',
    motor: '<circle cx="16" cy="16" r="5"/><path d="M16 3v5M16 24v5M3 16h5M24 16h5M6.8 6.8l3.5 3.5M21.7 21.7l3.5 3.5M25.2 6.8l-3.5 3.5M10.3 21.7l-3.5 3.5"/>',
    spule: '<path d="M2 16h4c0-7 4-7 4 0s4 7 4 0 4-7 4 0 4 7 4 0 4-7 4 0h4"/>',
    trafo: '<rect x="6" y="5" width="20" height="22" rx="2"/><path d="M11 9v14M21 9v14M7 11h4M7 15h4M7 19h4M21 13h4M21 18h4"/>',
    atom: '<circle cx="16" cy="16" r="2.5" fill="currentColor"/><ellipse cx="16" cy="16" rx="13" ry="5"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(-60 16 16)"/>',
    strahlung: '<path d="M16 3l13.5 24h-27z"/><path d="M16 12v7"/><circle cx="16" cy="23" r="1.2" fill="currentColor"/>',
    energie: '<path d="M6 10h18v13H6z"/><path d="M24 14h3v5h-3"/><path d="M16 12l-3 5h5l-3 5"/>',
    fall: '<circle cx="16" cy="7" r="4.5"/><path d="M16 15v13M10 22l6 6 6-6"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.alle) + '</svg>';
  }
  var PFEIL_RECHTS = '<svg class="pf" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 4l6 6-6 6"/></svg>';

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var KAT = window.REELS_KATALOG || {};
  var THEMEN = (window.REELS_THEMEN || []).map(function (t) {
    return Object.assign({}, t, { reels: (t.reels || []).filter(function (id) { return KAT[id]; }) });
  }).filter(function (t) { return t.reels.length; });
  var KLASSE = window.REELS_KLASSE || { name: 'Physik' };

  function alleReels() {
    var ids = [], themaVon = {};
    THEMEN.forEach(function (t) { t.reels.forEach(function (id) { if (!themaVon[id]) { themaVon[id] = t.titel; ids.push(id); } }); });
    return { ids: ids, themaVon: themaVon };
  }

  /* ================= Themenübersicht ================= */
  var liste = document.getElementById('reels-themen');
  if (liste) {
    var alle = alleReels();
    var html = '<a class="kachel f-gelb" href="ansehen.html?thema=alle"><span class="bild">' + icon('alle') + '</span>' +
      '<span><b>Alle Videos</b><small>Alle ' + alle.ids.length + ' Reels quer durch die Themen</small></span>' + PFEIL_RECHTS + '</a>';
    THEMEN.forEach(function (t) {
      html += '<a class="kachel ' + esc(t.farbe || 'f-petrol') + '" href="ansehen.html?thema=' + encodeURIComponent(t.id) + '">' +
        '<span class="bild">' + icon(t.icon) + '</span>' +
        '<span><b>' + esc(t.titel) + '</b><small>' + (t.text ? esc(t.text) + ' · ' : '') + t.reels.length + (t.reels.length === 1 ? ' Video' : ' Videos') + '</small></span>' +
        PFEIL_RECHTS + '</a>';
    });
    liste.innerHTML = html;
    return;
  }

  /* ================= Wisch-Ansicht ================= */
  var feed = document.getElementById('feed');
  if (!feed) return;
  var punkte = document.getElementById('punkte');
  var hinweis = document.getElementById('hinweis');
  var tonKnopf = document.getElementById('ton');
  var titelEl = document.getElementById('titel');

  var param = (location.search.match(/[?&]thema=([^&]+)/) || [])[1];
  param = param ? decodeURIComponent(param) : 'alle';
  var themaIndex = -1, ids, themaVon = {}, themaTitel;
  if (param === 'alle') {
    var a = alleReels(); ids = a.ids; themaVon = a.themaVon; themaTitel = 'Alle Videos';
  } else {
    themaIndex = THEMEN.findIndex(function (t) { return t.id === param; });
    if (themaIndex < 0) { feed.innerHTML = '<div class="fehler">Dieses Thema gibt es nicht.<br><br><a class="knopf" href="index.html">Zur Übersicht</a></div>'; return; }
    ids = THEMEN[themaIndex].reels; themaTitel = THEMEN[themaIndex].titel;
  }
  document.title = themaTitel + ' – Reels ' + KLASSE.name;
  titelEl.innerHTML = esc(themaTitel) + '<small>' + esc(KLASSE.name) + ' · ' + ids.length + ' Videos</small>';

  var REELS = ids.map(function (id) { var r = Object.assign({ id: id, typ: 'instagram' }, KAT[id]); if (r.datei) r.typ = 'mp4'; return r; });
  var hatIG = REELS.some(function (r) { return r.typ === 'instagram'; });
  var hatMP4 = REELS.some(function (r) { return r.typ === 'mp4'; });
  var erlaubt = false;
  try { erlaubt = sessionStorage.getItem('reels-ig-ok') === '1'; } catch (e) {}
  var tonAn = false, aktiv = -1, karten = [];

  var SVG = {
    pfeil: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8l5 5 5-5"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    stumm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>',
    laut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="3"/><path d="M10 9v6l5-3z" fill="currentColor"/></svg>',
    haken: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  function merkeErlaubnis() { erlaubt = true; try { sessionStorage.setItem('reels-ig-ok', '1'); } catch (e) {} }

  /* --- Startkarte (Hinweis zu Instagram) --- */
  if (hatIG && !erlaubt) {
    var start = el('section', 'reel start');
    start.innerHTML =
      '<div class="karte-mitte"><div class="symbol" style="color:#fff">' + SVG.film + '</div>' +
      '<h2>' + esc(themaTitel) + '</h2>' +
      '<p>Schau dir jedes Video an und überleg dir eine Antwort auf die Frage. Tippe dann auf <b>Erklärung</b>.</p>' +
      '<p class="klein">Die Videos werden von Instagram geladen. Dabei werden Daten (z. B. deine IP-Adresse) an Instagram/Meta übertragen. Ein Instagram-Konto brauchst du nicht.</p>' +
      '<div class="knoepfe"><button class="knopf" type="button" id="okIG">Videos anzeigen</button></div></div>';
    feed.appendChild(start);
    karten.push({ el: start });
    start.querySelector('#okIG').addEventListener('click', function () {
      merkeErlaubnis();
      karten.forEach(function (k) { if (k.ig) zeigePlatzhalter(k); });
      if (karten[1]) karten[1].el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* --- Reels --- */
  REELS.forEach(function (r, i) {
    var s = el('section', 'reel');
    var buehne = el('div', 'buehne');
    var info = el('div', 'info');
    var metaTeile = [];
    if (param === 'alle' && themaVon[r.id]) metaTeile.push(themaVon[r.id]);
    if (r.meta) metaTeile.push(r.meta);
    metaTeile.push(r.typ === 'instagram' ? 'Quelle: Instagram' + (r.kanal ? ' (@' + r.kanal + ')' : '') : (r.quelle ? 'Quelle: ' + r.quelle : ''));
    info.innerHTML =
      '<div class="kopfzeile"><span class="nr">' + (i + 1) + ' / ' + REELS.length + '</span><h2>' + esc(r.titel) + '</h2></div>' +
      '<p class="frage">' + (r.frage || '') + '</p>' +
      (r.erklaerung ? '<button class="aufloesen" type="button">Erklärung ' + SVG.pfeil + '</button><div class="erklaerung">' + r.erklaerung + '</div>' : '') +
      '<div class="meta">' + esc(metaTeile.filter(Boolean).join(' · ')) + '</div>';
    var auf = info.querySelector('.aufloesen');
    s.appendChild(buehne); s.appendChild(info); feed.appendChild(s);
    var k = { el: s, r: r, buehne: buehne };
    karten.push(k);
    if (auf) auf.addEventListener('click', function () { s.classList.toggle('offen'); passeAn(); });

    if (r.typ === 'mp4') {
      var v = document.createElement('video');
      v.src = (window.REELS_WURZEL || '../../') + r.datei;
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
      v.preload = 'metadata';
      buehne.appendChild(v);
      buehne.appendChild(el('div', 'pause-icon', SVG.play));
      buehne.addEventListener('click', function () {
        if (v.paused) { v.play().catch(function () {}); s.classList.remove('angehalten'); }
        else { v.pause(); s.classList.add('angehalten'); }
      });
      k.video = v;
    } else {
      k.ig = el('div', 'ig');
      buehne.appendChild(k.ig);
      zeigePlatzhalter(k);
    }
  });

  /* --- Endkarte --- */
  var naechstes = themaIndex >= 0 ? THEMEN[themaIndex + 1] : null;
  var ende = el('section', 'reel ende');
  ende.innerHTML =
    '<div class="karte-mitte"><div class="symbol">' + SVG.haken + '</div>' +
    '<h2>Geschafft!</h2>' +
    '<p>Kannst du zu jedem Video in einem Satz erklären, was passiert? Dann hast du ' + (themaIndex >= 0 ? 'das Thema <b>' + esc(themaTitel) + '</b>' : 'die Physik deiner Klasse') + ' gut im Griff.</p>' +
    '<div class="knoepfe">' +
      (naechstes ? '<a class="knopf" href="ansehen.html?thema=' + encodeURIComponent(naechstes.id) + '">Weiter: ' + esc(naechstes.titel) + '</a>' : '') +
      '<button class="knopf leise" type="button" id="vonVorn">Von vorn</button>' +
      '<a class="knopf leise" href="index.html">Alle Themen</a>' +
    '</div></div>';
  feed.appendChild(ende);
  karten.push({ el: ende });
  ende.querySelector('#vonVorn').addEventListener('click', function () { feed.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* --- Fortschrittspunkte --- */
  REELS.forEach(function () { punkte.appendChild(document.createElement('i')); });
  if (REELS.length > 14) punkte.classList.add('viele');

  /* --- Ton-Knopf (nur für eigene Videos) --- */
  if (hatMP4) {
    tonKnopf.hidden = false;
    tonKnopf.innerHTML = SVG.stumm;
    tonKnopf.addEventListener('click', function () {
      tonAn = !tonAn;
      tonKnopf.innerHTML = tonAn ? SVG.laut : SVG.stumm;
      tonKnopf.setAttribute('aria-label', tonAn ? 'Ton aus' : 'Ton an');
      karten.forEach(function (k) { if (k.video) k.video.muted = !tonAn; });
    });
  }

  /* --- Instagram laden / entladen --- */
  function zeigePlatzhalter(k) {
    k.ig.innerHTML = '';
    var p = el('div', 'platz');
    if (!erlaubt) {
      p.innerHTML = '<b>Video von Instagram</b><span>Beim Laden werden Daten an Instagram/Meta übertragen.</span><button class="knopf" type="button">Videos laden</button>';
      p.querySelector('button').addEventListener('click', function () {
        merkeErlaubnis();
        karten.forEach(function (x) { if (x.ig && x !== k) zeigePlatzhalter(x); });
        lade(k);
      });
    } else {
      p.innerHTML = SVG.film + '<span>Video wird geladen …</span>';
    }
    k.ig.appendChild(p);
    k.geladen = false;
  }
  function lade(k) {
    if (!erlaubt || k.geladen) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.instagram.com/reel/' + encodeURIComponent(k.r.code) + '/embed/';
    f.title = k.r.titel;
    f.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');
    f.setAttribute('allowfullscreen', '');
    k.ig.innerHTML = '';
    k.ig.appendChild(f);
    k.geladen = true;
  }

  /* --- Sichtbare Karte steuern --- */
  function aktiviere(index) {
    if (index === aktiv || index < 0) return;
    var alt = karten[aktiv];
    aktiv = index;
    if (alt) {
      if (alt.video) { alt.video.pause(); alt.el.classList.remove('angehalten'); }
      if (alt.ig && alt.geladen) zeigePlatzhalter(alt);   // Instagram lässt sich nicht pausieren → entladen
      alt.el.classList.remove('offen');
    }
    var k = karten[index];
    if (k.video) { k.video.muted = !tonAn; k.video.currentTime = 0; k.video.play().catch(function () {}); }
    if (k.ig) lade(k);
    var nr = k.r ? REELS.indexOf(k.r) : -1;
    Array.prototype.forEach.call(punkte.children, function (p, i) { p.classList.toggle('an', i === nr); });
    punkte.style.opacity = nr < 0 ? '0' : '1';
    var n = karten[index + 1];
    if (n && n.video) n.video.preload = 'auto';
    passeAn();
  }
  var beob = new IntersectionObserver(function (eintraege) {
    eintraege.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.6) aktiviere(karten.findIndex(function (k) { return k.el === e.target; }));
    });
  }, { root: feed, threshold: [0.6] });
  karten.forEach(function (k) { beob.observe(k.el); });

  feed.addEventListener('scroll', function () { if (feed.scrollTop > 40) hinweis.classList.add('weg'); }, { passive: true });
  setTimeout(function () { hinweis.classList.add('weg'); }, 6000);

  document.addEventListener('keydown', function (e) {
    var ziel = null;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !(e.target.closest && e.target.closest('button,a')))) ziel = karten[aktiv + 1];
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') ziel = karten[aktiv - 1];
    else return;
    e.preventDefault();
    if (ziel) ziel.el.scrollIntoView({ behavior: 'smooth' });
  });

  /* Instagram zeigt oben eine Kopfzeile (Kanalname) und darunter das Video im Format 4:5. */
  var IG_KOPF = 36, IG_FORMAT = 1.25;   // 36 statt 54: so endet der Kasten genau unter dem Video
  function passeAn() {
    karten.forEach(function (k) {
      if (!k.ig) return;
      var h = k.buehne.clientHeight, bw = k.buehne.clientWidth;
      if (!h || !bw) return;
      var w = Math.max(220, Math.min(bw - 16, 520, (h - IG_KOPF) / IG_FORMAT));
      k.ig.style.width = w + 'px';
      k.ig.style.height = Math.min(h, IG_KOPF + w * IG_FORMAT) + 'px';
    });
  }
  window.addEventListener('resize', passeAn);
  passeAn();
})();
