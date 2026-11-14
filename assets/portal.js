/* Countdown zum nächsten Leistungsnachweis auf den Klassen-Startseiten.
   Hier nur Schulaufgaben und Leistungstests eintragen (keine Stegreifaufgaben/Exen).
   klasse = Ordnername (m5, m6, m10, p7, p8, p9, p10), datum = JJJJ-MM-TT.
   link/linktext sind freiwillig. Vergangene Termine verschwinden von selbst. */
var TERMINE = [
  { klasse: 'm10', datum: '2026-11-17', titel: '1. Schulaufgabe', link: 'material.html', linktext: 'Zum Übungsmaterial' },
  { klasse: 'm5',  datum: '2026-12-17', titel: '2. Leistungstest' }
];

(function () {
  try {
    var teile = location.pathname.split('/').filter(Boolean);
    if (teile.length && /\.html?$/.test(teile[teile.length - 1])) {
      if (teile[teile.length - 1] !== 'index.html') return;
      teile.pop();
    }
    var klasse = teile[teile.length - 1];
    var kopf = document.querySelector('header.kopf');
    if (!klasse || !kopf) return;

    var jetzt = new Date();
    var heute = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
    var naechster = null;
    TERMINE.forEach(function (t) {
      if (t.klasse !== klasse) return;
      var p = String(t.datum).split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      if (isNaN(d) || d < heute) return;
      var tage = Math.round((d - heute) / 86400000);
      if (tage > 60) return;
      if (!naechster || tage < naechster.tage) naechster = { t: t, d: d, tage: tage };
    });
    if (!naechster) return;

    var wann = naechster.d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    var box = document.createElement('div');
    box.className = 'termin';
    var zahl = document.createElement('span');
    zahl.className = 'zahl';
    var b = document.createElement('b'), i = document.createElement('i');
    if (naechster.tage === 0) { b.textContent = '!'; i.textContent = 'Heute'; }
    else { b.textContent = naechster.tage; i.textContent = naechster.tage === 1 ? 'Tag' : 'Tage'; }
    zahl.appendChild(b); zahl.appendChild(i);
    var tx = document.createElement('span');
    tx.className = 'tx';
    tx.appendChild(document.createTextNode(
      naechster.tage === 0 ? 'Heute: ' + naechster.t.titel + ' – viel Erfolg!'
      : naechster.tage === 1 ? 'Morgen: ' + naechster.t.titel
      : 'Noch ' + naechster.tage + ' Tage bis: ' + naechster.t.titel));
    var klein = document.createElement('small');
    klein.appendChild(document.createTextNode(wann));
    if (naechster.t.link && naechster.tage > 0) {
      klein.appendChild(document.createTextNode(' · '));
      var a = document.createElement('a');
      a.href = naechster.t.link;
      a.textContent = naechster.t.linktext || 'Zum Üben';
      klein.appendChild(a);
    }
    tx.appendChild(klein);
    box.appendChild(zahl); box.appendChild(tx);
    kopf.parentNode.insertBefore(box, kopf.nextSibling);
  } catch (e) { /* ohne Countdown weiter */ }
})();
