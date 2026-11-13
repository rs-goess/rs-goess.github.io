/* =====================================================================
   durchklick.js – baut eine Tipps-und-Lösungen-Seite aus Daten auf
   Daten: window.SEITE = { karten:[ { chip, titel, untertitel, html, teile:[
            { titel, frage, schritte:[ { tipp, zeile, ende } ] } ] } ] }
   In allen Texten steht Mathematik zwischen $…$ (Kurzschrift aus formeln.js).
   ===================================================================== */
(function () {
  'use strict';
  function plain(x) {
    return x.replace(/@f\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/@w\{([^{}]*)\}/g, '√($1)')
            .replace(/@l\{([^{}]*)\}/g, '|$1|').replace(/@[st]\{([^{}]*)\}/g, '$1')
            .replace(/\^\{?2\}?/g, '²').replace(/\^\{?3\}?/g, '³').replace(/_\{([^}]*)\}/g, '$1').replace(/_(\w)/g, '$1');
  }
  function F(x) {
    var h = window.Formel && window.Formel.html(x, false);
    return '<span class="f"' + (plain(x).length <= 22 ? ' style="white-space:nowrap"' : '') + '>' + (h || plain(x)) + '</span>';
  }
  function fmt(s) { return (s || '').replace(/\$([^$]+)\$/g, function (_, x) { return F(x); }); }
  window.fmt = fmt;

  var S = window.SEITE, main = document.getElementById('main');

  /* ---------- Karten aufbauen ---------- */
  S.karten.forEach(function (k) {
    var sec = document.createElement('section');
    sec.className = 'karte';
    if (k.chip) sec.dataset.chip = k.chip;
    sec.innerHTML = '<h2>' + (k.untertitel ? '<span class="teilname">' + k.untertitel + '</span>' : '') + fmt(k.titel) + '</h2>' + fmt(k.html || '');
    (k.teile || []).forEach(function (d) { sec.appendChild(teil(d)); });
    if (k.nachher) { var n = document.createElement('div'); n.innerHTML = fmt(k.nachher); sec.appendChild(n); }
    main.appendChild(sec);
  });

  function teil(d) {
    var div = document.createElement('div');
    div.className = 'teil';
    div.innerHTML = '<h3>' + fmt(d.titel) + '</h3>' + (d.frage ? '<p class="frage">' + fmt(d.frage) + '</p>' : '') +
      '<ul class="zeilen"></ul><div class="tipp-ort"></div>' +
      '<div class="knoepfe"><button class="k-tipp" type="button">Tipp</button><button class="k-zeile" type="button">' + (d.knopf || 'Nächste Zeile') + '</button>' +
      '<button class="k-alles" type="button">Ganze Lösung</button></div><div class="fertig">✓ Fertig – vergleiche mit deinem Blatt.</div>';
    var ul = div.querySelector('.zeilen'), ort = div.querySelector('.tipp-ort');
    var bt = div.querySelector('.k-tipp'), bz = div.querySelector('.k-zeile'), ba = div.querySelector('.k-alles'), fe = div.querySelector('.fertig');
    var n = 0, warn = false;
    function status() {
      var s = d.schritte[n];
      bt.disabled = !s || !s.tipp || ort.innerHTML !== '';
      bz.disabled = !s; ba.disabled = !s;
      fe.style.display = s ? 'none' : 'block';
      if (!s) { ba.classList.remove('warnung'); ba.textContent = 'Ganze Lösung'; }
    }
    function zeige() {
      var s = d.schritte[n]; if (!s) return;
      var li = document.createElement('li'); li.innerHTML = fmt(s.zeile); if (s.ende) li.className = 'ende';
      ul.appendChild(li); n++; ort.innerHTML = '';
    }
    bt.onclick = function () { var s = d.schritte[n]; if (s && s.tipp) ort.innerHTML = '<div class="tipp">' + fmt(s.tipp) + '</div>'; status(); };
    bz.onclick = function () { zeige(); warn = false; ba.classList.remove('warnung'); ba.textContent = 'Ganze Lösung'; status(); };
    ba.onclick = function () {
      if (!warn) { warn = true; ba.classList.add('warnung'); ba.textContent = 'Wirklich? Erst selbst probieren! (nochmal tippen)'; return; }
      while (n < d.schritte.length) zeige(); warn = false; status();
    };
    status();
    return div;
  }

  /* ---------- Navigation + Sprungleiste ---------- */
  var karten = [].slice.call(document.querySelectorAll('.karte')), i = 0;
  var chips = document.getElementById('chips'), chipKarte = [];
  karten.forEach(function (k, j) {
    if (k.dataset.chip) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = k.dataset.chip;
      b.onclick = function () { zeige(j); }; chips.appendChild(b); chipKarte.push([b, j]);
    }
  });
  function zeige(n) {
    i = Math.max(0, Math.min(karten.length - 1, n));
    karten.forEach(function (k, j) { k.classList.toggle('aktiv', j === i); });
    var aktiv = null; chipKarte.forEach(function (c) { if (c[1] <= i) aktiv = c[0]; });
    chipKarte.forEach(function (c) { c[0].classList.toggle('an', c[0] === aktiv); });
    if (aktiv) aktiv.scrollIntoView({ inline: 'center', block: 'nearest' });
    document.getElementById('zurueck').disabled = (i === 0);
    document.getElementById('weiter').textContent = (i === karten.length - 1) ? 'Zum Start ↺' : 'Weiter ▶';
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {}
    window.scrollTo(0, 0);
  }
  document.getElementById('weiter').onclick = function () { zeige(i === karten.length - 1 ? 0 : i + 1); };
  document.getElementById('zurueck').onclick = function () { zeige(i - 1); };
  var start = parseInt((location.hash || '').slice(1), 10);
  zeige(isNaN(start) ? 0 : start - 1);
})();
