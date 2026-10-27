/* Link Emocional — íconos de marca + estilos de la esquina (logo).
   Cambia automáticamente los emojis básicos de la interfaz por íconos con los colores de la marca
   (celeste → violeta). No toca el texto que escribe la persona dentro de sus regalos. */
(function () {
  var S = {
    gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z',
    spark: 'M12 2l2.2 6.3L20.5 10l-6.3 1.7L12 18l-2.2-6.3L3.5 10l6.3-1.7zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z',
    eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    pen: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    camera: 'M3 7h4l2-3h6l2 3h4v12H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    play: 'M7 4l13 8-13 8z',
    link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
    folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01',
    repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
    check: 'M4 12.5l5 5L20 6.5',
    x: 'M6 6l12 12M18 6L6 18',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    save: 'M5 3h11l4 4v14H5zM8 3v6h7V3M8 21v-7h8v7',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    down: 'M12 3v12M7 10l5 5 5-5M4 21h16',
    touch: 'M9 11V5a1.5 1.5 0 0 1 3 0v6M12 10a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-3-5a1.5 1.5 0 0 1 2.5-1.5L9 14',
    expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
    card: 'M3 6h18v12H3zM3 10h18',
    coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4',
    mail: 'M3 5h18v14H3zM3 7l9 7 9-7',
    unlock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.5-2',
    cube: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
    palette: 'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a4 4 0 0 0 4-4 9 9 0 0 0-9-10zM7.5 11h.01M10.5 7.5h.01M15 7.5h.01',
    chat: 'M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z',
    flower: 'M12 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 20.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6.5 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17.5 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    lantern: 'M9 3h6M8 5h8l1 3v8l-1 3H8l-1-3V8zM12 5v14M9 21h6',
    wave: 'M2 9c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5 0M2 15c2.5-3 5-3 7.5 0s5 3 7.5 0 3.5-2 5 0',
    crown: 'M3 18h18M4 18l-1-10 5 4 4-7 4 7 5-4-1 10',
    cloud: 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9zM8 21v-1M12 21v-1M16 21v-1',
    cake: 'M4 21h16M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 16c2.3 1.5 4.3 1.5 7 0s4.7-1.5 7 0M12 12V8M12 5v.01',
    rings: 'M9 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM15 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10 3.5h4l1 2-3 2.5-3-2.5z',
    moon: 'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z',
    left: 'M19 12H5M11 6l-6 6 6 6',
    right: 'M5 12h14M13 6l6 6-6 6',
    caret: 'M6 9l6 6 6-6'
  };
  var FILLED = { heart: 1, spark: 1, play: 1, star: 1 };
  // emoji -> ícono
  var MAP = {
    '🎁': 'gift', '💗': 'heart', '💖': 'heart', '💕': 'heart', '💜': 'heart', '❤️': 'heart', '❤': 'heart', '♥': 'heart', '🩷': 'heart', '💓': 'heart', '💘': 'heart',
    '✨': 'spark', '💫': 'spark', '⚡': 'spark', '🌟': 'star', '⭐': 'star', '🌠': 'star', '🌌': 'star', '🪐': 'star',
    '👁': 'eye', '👁️': 'eye', '✏️': 'pen', '✏': 'pen', '✎': 'pen', '✍️': 'pen',
    '📷': 'camera', '📸': 'camera', '🎬': 'play', '🎥': 'play', '▶': 'play', '▶️': 'play',
    '🔗': 'link', '📂': 'folder', '📁': 'folder', '📱': 'phone', '🔁': 'repeat', '🔄': 'repeat',
    '✅': 'check', '✓': 'check', '✔': 'check', '✔️': 'check', '✕': 'x', '✖': 'x', '❌': 'x',
    '🗑': 'trash', '🗑️': 'trash', '🚪': 'logout', '💾': 'save', '👤': 'user', '⛔': 'ban',
    '⏳': 'clock', '⌛': 'clock', '📅': 'cal', '⬇': 'down', '⬇️': 'down', '👆': 'touch', '🖐': 'touch',
    '⛶': 'expand', '💳': 'card', '🪙': 'coin', '💌': 'mail', '🔓': 'unlock', '🧊': 'cube',
    '🎨': 'palette', '💬': 'chat', '🌼': 'flower', '🌸': 'flower', '🌹': 'flower', '🌻': 'flower',
    '🏮': 'lantern', '🪼': 'wave', '🌊': 'wave', '👑': 'crown', '🌧️': 'cloud', '🌧': 'cloud',
    '🎂': 'cake', '💞': 'rings', '💍': 'rings', '🌙': 'moon',
    '←': 'left', '→': 'right', '▾': 'caret'
  };
  var keys = Object.keys(MAP).sort(function (a, b) { return b.length - a.length; });
  var RE = new RegExp('(' + keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')\\uFE0F?', 'g');
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, SELECT: 1, NOSCRIPT: 1, IFRAME: 1, SVG: 1, TITLE: 1, CODE: 1, PRE: 1 };

  function icon(name, solid) {
    return '<svg class="lei' + (FILLED[name] ? ' f' : '') + (solid ? ' on' : '') + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#lei-' + name + '"/></svg>';
  }
  window.LEIcon = icon;

  function css() {
    var st = document.createElement('style');
    st.id = 'le-brand-css';
    st.textContent =
      '.lei{width:1.15em;height:1.15em;vertical-align:-.2em;display:inline-block;fill:none;stroke:url(#leg);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:none}' +
      '.lei.f{fill:url(#leg);stroke:none}' +
      '.lei.on{stroke:currentColor}.lei.f.on{fill:currentColor;stroke:none}' +
      '.lei-g{display:inline-flex;align-items:center;gap:.35em;white-space:nowrap}' +
      /* ===== esquina del logo ===== */
      '.brand,.lp-brand{position:relative;display:inline-flex!important;align-items:center;gap:10px;padding:5px 16px 5px 5px;border-radius:999px;' +
      'background:linear-gradient(135deg,rgba(111,214,232,.10),rgba(139,111,240,.18));border:1px solid rgba(139,111,240,.38);' +
      'box-shadow:0 0 24px rgba(139,111,240,.20),inset 0 1px 0 rgba(255,255,255,.07);text-decoration:none;' +
      'transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;-webkit-text-fill-color:initial}' +
      '.brand:hover,.lp-brand:hover{transform:translateY(-1px);border-color:rgba(111,214,232,.7);box-shadow:0 0 32px rgba(139,111,240,.38),inset 0 1px 0 rgba(255,255,255,.1)}' +
      '.brand img,.lp-brand img{width:34px!important;height:34px!important;border-radius:50%!important;padding:2px;border:0!important;object-fit:cover;' +
      'background:conic-gradient(from 0deg,#6fd6e8,#8b6ff0,#f06292,#6fd6e8);box-shadow:0 0 14px rgba(139,111,240,.65);animation:leRing 9s linear infinite}' +
      '@keyframes leRing{to{filter:hue-rotate(360deg)}}' +
      '.brand span,.lp-brand span{font-weight:800;font-size:15px;letter-spacing:.025em;line-height:1;' +
      'background:linear-gradient(100deg,#ffffff 0%,#d8cbff 35%,#6fd6e8 70%,#ffffff 100%);background-size:220% 100%;' +
      '-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;animation:leShine 7s ease-in-out infinite}' +
      '@keyframes leShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}' +
      '.topbar .brand{background-image:none;animation:none;-webkit-background-clip:border-box;background-clip:border-box;color:inherit;font-size:14px}' +
      '.topbar .brand{background:linear-gradient(135deg,rgba(111,214,232,.10),rgba(139,111,240,.18))}' +
      '@media(max-width:520px){.brand,.lp-brand{padding:4px}.brand span,.lp-brand span{display:none}.topbar .brand span{display:inline}.topbar .brand{padding:4px 14px 4px 4px}}' +
      '@media(prefers-reduced-motion:reduce){.brand img,.lp-brand img,.brand span,.lp-brand span{animation:none}}';
    document.head.appendChild(st);
  }

  function sprite() {
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    var s = '<svg width="0" height="0" aria-hidden="true"><defs><linearGradient id="leg" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22"><stop offset="0" stop-color="#6fd6e8"/><stop offset=".55" stop-color="#8b6ff0"/><stop offset="1" stop-color="#b07cff"/></linearGradient>';
    Object.keys(S).forEach(function (k) { s += '<symbol id="lei-' + k + '" viewBox="0 0 24 24"><path d="' + S[k] + '"/></symbol>'; });
    d.innerHTML = s + '</defs></svg>';
    document.body.insertBefore(d, document.body.firstChild);
  }

  function solidBg(el) {
    // ¿el ícono va sobre un botón con fondo de color sólido/degradado opaco? -> usa el color del texto
    for (var n = el, i = 0; n && n !== document.body && i < 5; n = n.parentElement, i++) {
      if (!/^(BUTTON|A|LABEL)$/.test(n.tagName) && !/\b(btn|cta|chip|pill)\b/.test(n.className || '')) continue;
      var bg = getComputedStyle(n).backgroundImage;
      if (bg && bg.indexOf('gradient') > -1 && bg.indexOf('rgba') === -1) return true;
    }
    return false;
  }

  function convert(node) {
    if (node.nodeType === 3) {
      var p = node.parentNode;
      if (!p || SKIP[(p.nodeName || '').toUpperCase()] || (p.closest && p.closest('[data-noicons],.noicons'))) return;
      RE.lastIndex = 0;
      if (!RE.test(node.nodeValue)) return;
      RE.lastIndex = 0;
      var solid = solidBg(p), html = '', last = 0, v = node.nodeValue, m;
      var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
      while ((m = RE.exec(v))) { html += esc(v.slice(last, m.index)) + icon(MAP[m[1]], solid); last = m.index + m[0].length; }
      html += esc(v.slice(last));
      var w = document.createElement('span'); w.className = 'lei-g'; w.innerHTML = html;
      // si el nodo es solo el ícono dejamos el span; si hay texto, mantenemos el flujo normal
      var frag = document.createDocumentFragment();
      while (w.firstChild) frag.appendChild(w.firstChild);
      p.replaceChild(frag, node);
    } else if (node.nodeType === 1 && !SKIP[node.nodeName.toUpperCase()] && !(node.closest && node.closest('[data-noicons],.noicons'))) {
      var ch = Array.prototype.slice.call(node.childNodes);
      for (var i = 0; i < ch.length; i++) convert(ch[i]);
    }
  }

  function start() {
    if (document.getElementById('le-brand-css')) return;
    css(); sprite(); convert(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') convert(m.target);
        else m.addedNodes.forEach(function (n) { convert(n); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
