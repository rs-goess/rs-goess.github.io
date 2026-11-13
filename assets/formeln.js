/* =====================================================================
   formeln.js – schöner Formelsatz mit KaTeX für die Übungsseiten
   ---------------------------------------------------------------------
   1) Formel.tex(kurz)   Kurzschrift  ->  LaTeX
        @f{Z}{N} Bruch · @w{..} Wurzel · @s{AB} Strecke · @l{AB} Streckenlänge
        @t{Text} aufrecht · _n _{..} tief · ^2 ^{..} hoch
   2) Formel.html(kurz, block)  ->  fertiges KaTeX-HTML (oder null ohne KaTeX)
   3) Formel.render(el)  wandelt ein vorhandenes HTML-Formel-Element
        (span.f, div.fz, …) in KaTeX um – auch nachträglich eingefügte
        Elemente werden automatisch umgewandelt (MutationObserver).
   Ohne Internet/KaTeX bleibt einfach die bisherige HTML-Darstellung stehen.
   ===================================================================== */
(function () {
  'use strict';

  var GRIECH = { 'α':'\\alpha','β':'\\beta','γ':'\\gamma','δ':'\\delta','ε':'\\varepsilon','φ':'\\varphi','ϕ':'\\varphi',
                 'μ':'\\mu','π':'\\pi','ω':'\\omega','λ':'\\lambda','ρ':'\\rho','σ':'\\sigma','τ':'\\tau','Δ':'\\Delta' };
  var ZEICHEN = {
    '·':'\\cdot ', '⋅':'\\cdot ', '×':'\\times ', '−':'-', '–':'-', '≈':'\\approx ', '⇒':'\\;\\Rightarrow\\; ',
    '⇔':'\\;\\Leftrightarrow\\; ', '→':'\\to ', '≤':'\\le ', '≥':'\\ge ', '≠':'\\ne ', '±':'\\pm ', '∞':'\\infty ',
    '∈':'\\in ', 'ℝ':'\\mathbb{R}', '∢':'\\sphericalangle ', '∠':'\\angle ', '…':'\\ldots ', '°':'^{\\circ}',
    '²':'^{2}', '³':'^{3}', '|':'\\mid ', '%':'\\%', '#':'\\#', '&':'\\&', '$':'\\$', '~':'\\sim ', '\\':'\\backslash ',
    '{':'\\{', '}':'\\}', '⊥':'\\perp ', '∥':'\\parallel ', '△':'\\triangle ', '✓':'\\checkmark ', '<':'<', '>':'>',
    '[':'[', ']':']', '(':'(', ')':')', '+':'+', '=':'=', ':':':', ';':';\\ ', '!':'!', '?':'?', '/':'/', "'":"'",
    '*':'\\ast '
  };
  var FUNK = { sin:'\\sin', cos:'\\cos', tan:'\\tan' };
  var EINHEIT = { cm:1, mm:1, dm:1, km:1, m:0, ha:1, l:0, ml:1, LE:1, FE:1, VE:1 };
  var TEXTWORT = { TR:1, LE:1, FE:1, VE:1, max:1, min:1, Max:1, Min:1 };

  function istBuchst(c) { return /[A-Za-zÄÖÜäöüß]/.test(c); }

  /* Ein einzelnes Wort (nur Buchstaben) in LaTeX */
  function wort(w, imText) {
    if (FUNK[w]) return FUNK[w] + ' ';
    if (EINHEIT[w] === 1) return '\\,\\mathrm{' + w + '}';
    if (TEXTWORT[w]) return '\\text{' + w + '}';
    /* mindestens zwei Kleinbuchstaben hintereinander oder Umlaut -> normales Wort (aufrecht) */
    if (/[a-zäöüß]{2,}/.test(w) || /[ÄÖÜäöüß]/.test(w)) return '\\text{' + w + '}';
    return w;                      /* Variablen, Punktnamen: kursiv */
  }

  /* Reiner Text (ohne Kurzschrift-Befehle) -> LaTeX */
  function istTextwort(w) { var t = wort(w); return t.indexOf('\\text{') === 0; }
  function text2tex(s) {
    var out = '', i = 0, n = s.length, letztesText = false;
    while (i < n) {
      var c = s[i];
      if (istBuchst(c)) {
        var j = i; while (j < n && istBuchst(s[j])) j++;
        var w = s.slice(i, j);
        /* „m“ direkt nach einer Zahl ist die Einheit Meter */
        if (w === 'm' && /[\d)]\s*$/.test(s.slice(0, i)) && !/^\s*[=(·]/.test(s.slice(j)) ) { out += '\\,\\mathrm{m}'; i = j; letztesText = false; continue; }
        out += wort(w); letztesText = istTextwort(w); i = j; continue;
      }
      if (c === ' ' || c === ' ') {
        var k = i; while (k < n && (s[k] === ' ' || s[k] === ' ')) k++;
        var m = k; while (m < n && istBuchst(s[m])) m++;
        var naechstesText = m > k && istTextwort(s.slice(k, m));
        if (k - i >= 2) out += '\\quad ';
        else if ((letztesText || naechstesText) && out && k < n) out += '\\ ';
        else out += ' ';
        i = k; continue;
      }
      letztesText = false;
      if (GRIECH[c]) { out += GRIECH[c] + ' '; i++; continue; }
      if (c === ',' ) {
        if (/\d/.test(s[i - 1] || '') && /\d/.test(s[i + 1] || '')) out += '{,}';
        else out += ',\\ ';
        i++; continue;
      }
      if (/[0-9.]/.test(c)) { out += c; i++; continue; }
      if (c === '"' || c === '„' || c === '“' || c === '”') { out += '\\text{' + c + '}'; i++; continue; }
      if (ZEICHEN[c] !== undefined) { out += ZEICHEN[c]; i++; continue; }
      if (c === '​') { i++; continue; }
      out += '\\text{' + c + '}'; i++;
    }
    return out;
  }

  /* ---------- 1) Kurzschrift -> LaTeX ---------- */
  function tex(s) {
    var i = 0;
    function arg() {               /* liest {...} ab Position i (i zeigt auf '{') */
      i++; var r = seq('}'); i++; return r;
    }
    function roh() { i++; var j = s.indexOf('}', i); var r = s.slice(i, j); i = j + 1; return r; }
    function seq(ende) {
      var out = '', buf = '';
      function flush() { if (buf) { out += text2tex(buf); buf = ''; } }
      while (i < s.length && s[i] !== ende) {
        var c = s[i];
        if (c === '@' && /[ftwsl]/.test(s[i + 1] || '') && s[i + 2] === '{') {
          flush(); var k = s[i + 1]; i += 2;
          if (k === 't') { out += '\\text{' + roh().replace(/[{}\\]/g, '') + '}'; continue; }
          var a = arg();
          if (k === 'f') { var b = arg(); out += '\\dfrac{' + a + '}{' + b + '}'; }
          else if (k === 'w') out += '\\sqrt{' + a + '}';
          else if (k === 's') out += '\\overline{' + a + '}';
          else if (k === 'l') out += '\\lvert\\overline{' + a + '}\\rvert ';
          continue;
        }
        if (c === '_' || c === '^') {
          flush(); i++; var x;
          if (s[i] === '{') x = arg();
          else { x = text2tex(s[i] || ''); i++; }
          out += c + '{' + x + '}';
          continue;
        }
        buf += c; i++;
      }
      flush();
      return out;
    }
    return seq(null);
  }

  var OPT = { throwOnError: false, strict: 'ignore', trust: false, output: 'htmlAndMathml' };
  function html(kurz, block) {
    if (!window.katex) return null;
    try { return window.katex.renderToString(tex(kurz), Object.assign({ displayMode: !!block }, OPT)); }
    catch (e) { return null; }
  }

  /* ---------- 2) vorhandenes HTML -> LaTeX ---------- */
  function hex(rgb) {
    var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb || ''); if (!m) return null;
    return '#' + [m[1], m[2], m[3]].map(function (v) { return ('0' + (+v).toString(16)).slice(-2); }).join('');
  }
  function dom2tex(el, wurzel) {
    var out = '', kinder = el.childNodes, basisFarbe = hex(getComputedStyle(wurzel).color), betragZu = false;
    for (var k = 0; k < kinder.length; k++) {
      var n = kinder[k];
      if (n.nodeType === 3) {
        var t = n.nodeValue;
        if (betragZu) { t = t.replace(/^\s*\|/, ''); out += '\\rvert '; betragZu = false; }
        var nx = kinder[k + 1];
        if (/√\s*$/.test(t) && nx && nx.nodeType === 1 && nx.classList.contains('w')) {
          out += text2tex(t.replace(/√\s*$/, '')) + '\\sqrt{' + dom2tex(nx, wurzel) + '}';
          k++; continue;
        }
        out += text2tex(t);
        continue;
      }
      if (n.nodeType !== 1) continue;
      var tag = n.tagName.toLowerCase(), cl = n.classList;
      if (tag === 'br') { out += ' '; continue; }
      if (tag === 'svg' || tag === 'img' || tag === 'button') return null;   /* nicht umwandelbar */
      var innen;
      if (tag === 'sub') innen = '_{' + dom2tex(n, wurzel) + '}';
      else if (tag === 'sup') innen = '^{' + dom2tex(n, wurzel) + '}';
      else if (cl.contains('bruch') && n.children.length >= 2) innen = '\\dfrac{' + dom2tex(n.children[0], wurzel) + '}{' + dom2tex(n.children[1], wurzel) + '}';
      else if (cl.contains('wz')) {
        var sp = n.querySelector('span');
        innen = '\\sqrt{' + (sp ? dom2tex(sp, wurzel) : '') + '}';
      }
      else if (cl.contains('w')) {
        innen = '\\overline{' + dom2tex(n, wurzel) + '}';
        var nach = kinder[k + 1];
        if (/\\mid $/.test(out) && nach && nach.nodeType === 3 && /^\s*\|/.test(nach.nodeValue)) {
          out = out.replace(/\\mid $/, '\\lvert '); betragZu = true;
        }
      }
      else if (cl.contains('g')) {
        var e = n.textContent.replace(/\s+/g, '').replace('²', '^{2}').replace('³', '^{3}');
        innen = '\\,\\mathrm{' + e.replace(/\^\{\d\}/, '') + '}' + (e.match(/\^\{\d\}/) || [''])[0];
      }
      else innen = dom2tex(n, wurzel);
      if (innen === null) return null;
      if (tag === 'b' || tag === 'strong') innen = '\\boldsymbol{' + innen + '}';
      var f = hex(getComputedStyle(n).color);
      if (f && basisFarbe && f !== basisFarbe && tag !== 'sub' && tag !== 'sup') innen = '{\\color{' + f + '}' + innen + '}';
      out += innen;
    }
    return out;
  }

  function render(el) {
    if (!window.katex || !el || el.getAttribute('data-katex')) return;
    if (el.querySelector('.katex')) { el.setAttribute('data-katex', '1'); return; }
    var block = el.classList.contains('fz') || el.tagName === 'DIV' || el.tagName === 'P';
    var t = dom2tex(el, el);
    if (t === null || !t.trim()) return;
    try {
      var h = window.katex.renderToString(t, Object.assign({ displayMode: false }, OPT));
      el.setAttribute('data-katex', '1');
      el.setAttribute('data-tex', t);
      el.innerHTML = h;
      if (block) el.classList.add('f-block');
    } catch (e) { /* alte Darstellung behalten */ }
  }

  var SEL = '.f, .fz';
  function alle(root) {
    if (!window.katex) return;
    if (root.matches && root.matches(SEL)) render(root);
    var l = root.querySelectorAll ? root.querySelectorAll(SEL) : [];
    for (var i = 0; i < l.length; i++) {
      /* nur äußerste Formel-Elemente umwandeln */
      if (l[i].parentElement && l[i].parentElement.closest(SEL)) continue;
      render(l[i]);
    }
  }
  function auto() {
    if (!window.katex) return;
    alle(document.body);
    var plan = null, wart = [];
    new MutationObserver(function (ml) {
      ml.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) wart.push(n); }); });
      if (!plan) plan = requestAnimationFrame(function () {
        plan = null; var w = wart; wart = [];
        w.forEach(function (n) { if (n.isConnected && !(n.closest && n.closest('.katex'))) alle(n); });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  window.Formel = { tex: tex, html: html, render: render, alle: alle, auto: auto, text2tex: text2tex };
})();
