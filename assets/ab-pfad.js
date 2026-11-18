/* =====================================================================
   ab-pfad.js – Selbstlernpfad auf dem Bild des Arbeitsblatts
   Daten: window.PFAD = { fach, titel, ueberschrift, zurueck, karten:[…] }
   Karte: { chip, start:true, titel, html }  oder
          { chip, name, bild:{ src, y0, y1 }, anhang:{ h, karo:[[x,y,w,h]] },
            check, striche:[[x,y0,y1]], zeilen:[Z], spiele:[{ titel, html, init(el, fmt) }] }
   Z = { x, y, z, s (Schrittname), tipp, erkl:{ schritte:[{ k, t, f }] }, lab, labx, mitte, w,
         typ:'oval' (rote Markierung: x, y = Mitte, w, h) }
   Alle Maße in cm auf dem Blatt (wie in PowerPoint). Formeln zwischen $…$ (KaTeX).
   ===================================================================== */
(function () {
  'use strict';
  var P = window.PFAD, PX = 52, BREITE = 19.05 * PX, LUPE = false, karten = [];
  var BIRNE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2h5c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"/></svg>';
  var KREUZ = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>';

  function tex(x) {
    x = x.replace(/\\cdot(?!\\nobreak)/g, '\\cdot\\nobreak ');
    try { return window.katex.renderToString(x, { throwOnError: false, strict: false }); } catch (e) { return x; }
  }
  function fmt(s) { return (s || '').replace(/\$([^$]+)\$/g, function (_, x) { return tex(x); }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function px(cm) { return Math.round(cm * PX * 10) / 10 + 'px'; }

  /* ---------- Kopf ---------- */
  document.title = P.titel + ' – Lernpfad';
  document.body.appendChild(el('header', 'oben',
    '<a class="zurStart" href="' + (P.zurueck || 'material.html') + '">‹ Material</a><small>' + P.fach + ' · ' + P.titel + '</small>' +
    '<h1>' + (P.ueberschrift || 'Lernpfad – Lösung Schritt für Schritt') + '</h1><div class="chips" id="chips"></div>'));
  var main = el('main'); document.body.appendChild(main);
  document.body.appendChild(el('nav', 'unten', '<button id="zurueck" type="button">◀ Zurück</button><button id="weiter" type="button">Weiter ▶</button>'));

  /* ---------- Erklärungsfenster ---------- */
  var dlg = el('dialog', 'dlg',
    '<div class="inner"><div class="dkopf"><div class="wo" id="dwo"></div><button class="zu" type="button" aria-label="Schließen">' + KREUZ + '</button></div>' +
    '<div class="body"><div class="zeile" id="dzeile"></div><ol class="schritte" id="dschritte"></ol></div>' +
    '<div class="fuss"><button class="weiter" type="button" id="dweiter">Nächster Schritt</button><button class="allesz" type="button" id="dalle">Alle Schritte</button></div></div>');
  document.body.appendChild(dlg);
  var dAkt = null, dN = 0;
  function dZeige(alle) {
    var ol = document.getElementById('dschritte');
    do {
      var s = dAkt.schritte[dN]; if (!s) break;
      var li = el('li', 'schritt', '<span class="n">' + (dN + 1) + '</span><div>' + (s.k ? '<div class="k">' + fmt(s.k) + '</div>' : '') +
        (s.t ? '<div>' + fmt(s.t) + '</div>' : '') + (s.f ? '<div class="f">' + fmt(s.f) + '</div>' : '') + '</div>');
      ol.appendChild(li); dN++;
      if (!alle) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } while (alle);
    var fertig = dN >= dAkt.schritte.length;
    document.getElementById('dweiter').textContent = fertig ? 'Verstanden ✓' : 'Nächster Schritt';
    document.getElementById('dalle').hidden = fertig;
  }
  function oeffneErkl(z, wo) {
    dAkt = z.erkl; dN = 0;
    document.getElementById('dwo').textContent = wo + ' · Erklärung';
    var zl = document.getElementById('dzeile'); zl.innerHTML = z.z ? fmt(z.z) : ''; zl.hidden = !z.z;
    document.getElementById('dschritte').innerHTML = '';
    dZeige(false);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  dlg.querySelector('.zu').onclick = function () { dlg.close(); };
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  document.getElementById('dweiter').onclick = function () { if (dN >= dAkt.schritte.length) dlg.close(); else dZeige(false); };
  document.getElementById('dalle').onclick = function () { dZeige(true); };

  /* ---------- Ergebnis prüfen ---------- */
  function zahl(s) {
    s = (s || '').trim().replace(/\s/g, '').replace('−', '-').replace(',', '.');
    var m = s.match(/^(-?\d*\.?\d+)(?:[·*x]10\^?(-?\d+))?$/i);
    return m ? parseFloat(m[1]) * (m[2] ? Math.pow(10, +m[2]) : 1) : NaN;
  }
  function nah(a, b, rel) { return Math.abs(a - b) <= Math.abs(b) * (rel || 0.004) + 1e-9; }
  function check(c, karte) {
    var box = el('div', 'check', '<label>' + (c.frage || 'Ergebnis prüfen: Gib dein Ergebnis ein.') + '</label><div class="reihe">' +
      '<input type="text" inputmode="decimal" autocomplete="off" placeholder="z. B. ' + (c.bsp || '2,5') + '"><span class="einh">' + c.einh + '</span>' +
      '<button type="button">Prüfen</button></div><div class="ort"></div>');
    var inp = box.querySelector('input'), ort = box.querySelector('.ort');
    function rm(art, t) { ort.innerHTML = '<div class="rm ' + art + '">' + fmt(t) + '</div>'; }
    function pruef() {
      var x = zahl(inp.value);
      if (isNaN(x)) return rm('nein', 'Gib nur eine Zahl ein, z. B. ' + (c.bsp || '2,5') + '. Die Einheit steht schon dahinter.');
      if (c.ok.some(function (o) { return nah(x, o, 0.0001); })) { karte.checkOk = true; karte.pruefe(); return rm('gut', '<b>Richtig!</b> Vergleiche trotzdem deinen Rechenweg Zeile für Zeile.'); }
      if (c.exakt != null && nah(x, c.exakt, 0.012)) return rm('fast', '<b>Richtig gerechnet</b> – aber noch nicht sinnvoll gerundet. ' + (c.runden || ''));
      for (var i = 0; i < (c.fehler || []).length; i++) if (nah(x, c.fehler[i].w, c.fehler[i].rel || 0.012)) return rm('nein', c.fehler[i].t);
      rm('nein', '<b>Das stimmt noch nicht.</b> Hol dir unten Zeile für Zeile die Lösung – oder einen Tipp.');
    }
    box.querySelector('button').onclick = pruef;
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') pruef(); });
    return box;
  }

  /* ---------- Eine Aufgabenkarte mit Blatt ---------- */
  function blattKarte(k, sec) {
    var r = el('div', 'rahmen'); sec.appendChild(r);
    var quer = el('div', 'quer', '📱 <span>Dreh dein Handy <b>quer</b> – dann wird das Blatt größer. Oder nimm die Lupe.</span><button type="button" class="lupe-k">🔍 Lupe</button>');
    quer.querySelector('button').onclick = function () { LUPE = !LUPE; document.querySelectorAll('.lupe-k').forEach(function (b) { b.textContent = LUPE ? '↔ Ganzes Blatt' : '🔍 Lupe'; }); karten.forEach(function (x) { if (x.skaliere) x.skaliere(); }); };
    r.appendChild(quer);
    if (k.check) r.appendChild(check(k.check, sec));

    var y0 = k.bild.y0, hoehe = (k.bild.y1 - y0) + (k.anhang ? k.anhang.h : 0);
    var wrap = el('div', 'bl-wrap'), blatt = el('div', 'bl-blatt');
    blatt.style.width = BREITE + 'px'; blatt.style.height = px(hoehe);
    blatt.style.backgroundImage = 'url(' + k.bild.src + ')'; blatt.style.backgroundSize = BREITE + 'px auto';
    blatt.setAttribute('role', 'img'); blatt.setAttribute('aria-label', 'Arbeitsblatt ' + k.name);
    var sizer = el('div', 'bl-sizer'); sizer.appendChild(blatt); wrap.appendChild(sizer); r.appendChild(wrap);
    function T(y) { return px(y - y0); }
    ((k.anhang && k.anhang.karo) || []).forEach(function (q) {
      var d = el('div', 'bl-karo'); d.style.left = px(q[0]); d.style.top = T(q[1]); d.style.width = px(q[2]); d.style.height = px(q[3]); blatt.appendChild(d);
    });
    (k.striche || []).forEach(function (s) {
      var d = el('div', 'bl-strich'); d.style.left = px(s[0]); d.style.top = T(s[1]); d.style.height = px(s[2] - s[1]); blatt.appendChild(d);
    });

    /* Zeilen anlegen */
    var zeilen = k.zeilen.map(function (z) {
      var e;
      if (z.typ === 'oval') {
        e = el('div', 'bl-oval'); e.style.left = px(z.x - z.w / 2); e.style.top = T(z.y - z.h / 2); e.style.width = px(z.w); e.style.height = px(z.h);
      } else {
        e = el('div', 'bl-z' + (z.mitte ? ' mitte' : ''), fmt(z.z)); e.style.left = px(z.x); e.style.top = T(z.y);
        if (z.cls) e.className += ' ' + z.cls;
        if (z.cls && z.cls.indexOf('zwei') >= 0 && z.w) e.style.width = px(z.w);
      }
      blatt.appendChild(e);
      var lab = null;
      if (z.lab) { lab = el('div', 'bl-lab', z.lab); lab.style.left = px(z.labx != null ? z.labx : 0.65); lab.style.top = T(z.y); blatt.appendChild(lab); }
      var b = null;
      if (z.erkl) {
        b = el('button', 'bl-birne' + (z.birne ? ' eck' : ''), BIRNE); b.type = 'button'; b.setAttribute('aria-label', 'Erklärung');
        b.onclick = function () { oeffneErkl(z, k.name); }; blatt.appendChild(b);
      }
      return { z: z, e: e, lab: lab, b: b };
    });
    var hin = el('div', 'bl-naechst'); blatt.appendChild(hin);

    /* Skalieren: das Blatt hat feste Maße und wird nur verkleinert */
    var faktor = 1;
    function skaliere() {
      var w = wrap.clientWidth; if (!w) return;
      faktor = w / BREITE;
      var lupe = LUPE && faktor < 0.62; if (lupe) faktor = 0.62;
      wrap.classList.toggle('lupe', lupe);
      blatt.style.transform = 'scale(' + faktor + ')';
      sizer.style.width = (BREITE * faktor) + 'px'; sizer.style.height = (hoehe * PX * faktor) + 'px'; wrap.style.height = 'auto';
      zeilen.forEach(setzeBirne);
    }
    function setzeBirne(o) {
      if (!o.b || !o.e.classList.contains('auf')) return;
      if (o.z.birne) { o.b.style.left = (o.z.birne[0] * PX - 14) + 'px'; o.b.style.top = ((o.z.birne[1] - y0) * PX - 14 + 5) + 'px'; return; }
      var w = o.e.offsetWidth, l = o.e.offsetLeft - (o.z.mitte ? w / 2 : 0);
      o.b.style.left = (l + w + 8) + 'px';
      o.b.style.top = (o.e.offsetTop - (o.z.mitte ? 13 : 0)) + 'px';
    }
    sec.skaliere = skaliere;
    window.addEventListener('resize', skaliere);

    /* Leiste */
    var tippOrt = el('div'), leiste = el('div', 'leiste',
      '<button class="k-zur" type="button" title="Eine Zeile zurück" aria-label="Eine Zeile zurück">↶</button>' +
      '<button class="k-tipp" type="button">Tipp</button><button class="k-weiter" type="button">Nächster Schritt</button>' +
      '<button class="k-erkl" type="button">' + BIRNE + 'Erklärung</button><button class="k-alles" type="button">Ganze Lösung</button>');
    var fertig = el('div', 'fertig', '✓ Fertig – vergleiche mit deinem Blatt und verbessere mit einer anderen Farbe.');
    r.appendChild(tippOrt); r.appendChild(leiste); r.appendChild(fertig);
    var bz = leiste.children[0], bt = leiste.children[1], bw = leiste.children[2], be = leiste.children[3], ba = leiste.children[4];
    var n = 0, warn = false, letzte = null;
    function zeige(o, neu) {
      o.e.classList.add('auf'); if (o.lab) o.lab.classList.add('auf');
      if (o.b) { o.b.classList.add('auf'); setzeBirne(o); }
      if (neu && o.z.typ !== 'oval') { o.e.classList.remove('neu'); void o.e.offsetWidth; o.e.classList.add('neu'); }
    }
    function verstecke(o) { o.e.classList.remove('auf', 'neu'); if (o.lab) o.lab.classList.remove('auf'); if (o.b) o.b.classList.remove('auf'); }
    function status() {
      var o = zeilen[n];
      if (o) {
        var z = o.z; hin.hidden = false; hin.textContent = (z.s || 'nächste Zeile') + '?';
        hin.className = 'bl-naechst' + (z.mitte || z.typ === 'oval' ? ' mitte' : '');
        var w = z.w || (z.typ === 'oval' ? z.w : (z.x < 9 ? 9.1 - z.x : 18.4 - z.x));
        if (z.mitte && !z.w) w = 2.6;
        hin.style.left = px(z.x); hin.style.top = T(z.y); hin.style.width = px(w);
        if (!z.mitte && z.typ !== 'oval' && z.lab) { hin.style.left = px(z.labx != null ? z.labx : 0.65); hin.style.width = px(w + z.x - (z.labx != null ? z.labx : 0.65)); }
      } else hin.hidden = true;
      bw.disabled = !o; ba.disabled = !o; bz.disabled = n === 0;
      bt.disabled = !o || !o.z.tipp || tippOrt.innerHTML !== '';
      bw.textContent = o ? 'Nächster Schritt' + (o.z.s ? ': ' + o.z.s : '') : 'Alles aufgedeckt';
      be.hidden = !(letzte && letzte.z.erkl);
      fertig.hidden = !!o;
      if (!o) { ba.classList.remove('warnung'); ba.textContent = 'Ganze Lösung'; }
      sec.fertig = !o; sec.pruefe();
    }
    bw.onclick = function () {
      var o = zeilen[n]; if (!o) return; zeige(o, true); letzte = o; n++; tippOrt.innerHTML = '';
      warn = false; ba.classList.remove('warnung'); ba.textContent = 'Ganze Lösung'; status();
    };
    bz.onclick = function () { if (!n) return; n--; verstecke(zeilen[n]); letzte = zeilen[n - 1] || null; tippOrt.innerHTML = ''; status(); };
    bt.onclick = function () { var o = zeilen[n]; if (o && o.z.tipp) tippOrt.innerHTML = '<div class="tippbox">' + fmt(o.z.tipp) + '</div>'; status(); };
    be.onclick = function () { if (letzte && letzte.z.erkl) oeffneErkl(letzte.z, k.name); };
    ba.onclick = function () {
      if (!warn) { warn = true; ba.classList.add('warnung'); ba.textContent = 'Wirklich? Erst selbst probieren! (nochmal tippen)'; return; }
      while (n < zeilen.length) { zeige(zeilen[n], false); letzte = zeilen[n]; n++; }
      warn = false; tippOrt.innerHTML = ''; status();
    };
    status();
    (k.spiele || []).forEach(function (b) {
      var s = el('div', 'spiel', '<h4>' + (b.titel || 'Ausprobieren') + '</h4>' + fmt(b.html || ''));
      r.appendChild(s); if (b.init) b.init(s, fmt);
    });
  }

  /* ---------- Karten ---------- */
  var chipVon = {}, i = 0;
  P.karten.forEach(function (k) {
    var sec = el('section', 'karte'); sec.dataset.chip = k.chip || '';
    sec.pruefe = function () { var c = chipVon[karten.indexOf(sec)]; if (c) c.classList.toggle('ok', !!(sec.fertig || sec.checkOk)); };
    if (k.start) sec.appendChild(el('div', 'rahmen', '<div class="text"><h2>' + fmt(k.titel) + '</h2>' + fmt(k.html) + '</div>'));
    else blattKarte(k, sec);
    main.appendChild(sec); karten.push(sec);
  });
  var chips = document.getElementById('chips');
  karten.forEach(function (k, j) {
    if (!k.dataset.chip) return;
    var b = el('button', '', k.dataset.chip); b.type = 'button'; b.onclick = function () { zeige(j); };
    chips.appendChild(b); chipVon[j] = b;
  });
  function zeige(n) {
    i = Math.max(0, Math.min(karten.length - 1, n));
    karten.forEach(function (k, j) { k.classList.toggle('aktiv', j === i); });
    if (karten[i].skaliere) karten[i].skaliere();
    Object.keys(chipVon).forEach(function (j) { chipVon[j].classList.toggle('an', +j === i); });
    if (chipVon[i]) chipVon[i].scrollIntoView({ inline: 'center', block: 'nearest' });
    document.getElementById('zurueck').disabled = (i === 0);
    document.getElementById('weiter').textContent = (i === karten.length - 1) ? 'Zum Start ↺' : 'Weiter ▶';
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {}
    window.scrollTo(0, 0);
  }
  document.getElementById('weiter').onclick = function () { zeige(i === karten.length - 1 ? 0 : i + 1); };
  document.getElementById('zurueck').onclick = function () { zeige(i - 1); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { karten.forEach(function (k) { if (k.skaliere && k.classList.contains('aktiv')) k.skaliere(); }); });
  var start = parseInt((location.hash || '').slice(1), 10);
  zeige(isNaN(start) ? 0 : start - 1);
})();
