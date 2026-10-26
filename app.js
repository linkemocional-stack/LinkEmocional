/* Link Emocional — app.js (utilidades compartidas de las pantallas nuevas) */
(function () {
  var C = window.LE_CONFIG || {};
  var LE = window.LE = { cfg: C };

  /* ---------- fondo de estrellas (igual que el sitio) ---------- */
  LE.stars = function () {
    var cv = document.getElementById('stars'); if (!cv) return;
    var g = cv.getContext('2d'), W, H, S = [];
    function rs() { W = cv.width = innerWidth; H = cv.height = innerHeight; S = []; for (var i = 0; i < 90; i++) S.push([Math.random() * W, Math.random() * H, Math.random() * 1.4 + .3, Math.random() * 6.28]); }
    rs(); addEventListener('resize', rs);
    (function f(t) {
      g.clearRect(0, 0, W, H);
      for (var i = 0; i < S.length; i++) { var s = S[i]; g.globalAlpha = .15 + .5 * Math.abs(Math.sin(t / 1400 + s[3])); g.fillStyle = '#fff'; g.fillRect(s[0], s[1], s[2], s[2]); }
      requestAnimationFrame(f);
    })(0);
  };

  /* ---------- sesión (Supabase Auth) ---------- */
  var ok = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY && C.SUPABASE_URL.indexOf('TU-PROYECTO') < 0 && C.SUPABASE_ANON_KEY.indexOf('TU_ANON') < 0);
  var sb = null;
  try {
    if (ok && window.supabase) sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY,
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  } catch (e) { sb = null; }
  LE.sb = sb; LE.configured = !!sb;
  LE.session = function () {
    if (!sb) return Promise.resolve(null);
    return sb.auth.getSession().then(function (r) { return r.data && r.data.session; }, function () { return null; });
  };
  LE.token = function () { return LE.session().then(function (s) { return s ? s.access_token : null; }); };
  LE.signOut = function () { return sb ? sb.auth.signOut() : Promise.resolve(); };
  // Solo rutas internas (evita redirecciones a otros sitios)
  LE.safeNext = function (n, dflt) {
    n = String(n || '');
    return /^[a-zA-Z0-9\-_./?=&%]+$/.test(n) && n.indexOf('//') < 0 && n.charAt(0) !== '/' ? n : (dflt || 'mis-paginas.html');
  };

  /* ---------- llamadas a la API ---------- */
  LE.api = function (path, o) {
    o = o || {};
    return LE.token().then(function (t) {
      var h = { 'Content-Type': 'application/json' };
      if (t) h.Authorization = 'Bearer ' + t;
      if (o.editKey) h['x-edit-key'] = o.editKey;
      return fetch(path, { method: o.method || 'GET', headers: h, body: o.body ? JSON.stringify(o.body) : undefined });
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (d) {
        if (!r.ok) { var e = new Error((d && d.message) || 'Ocurrió un error.'); e.status = r.status; e.data = d || {}; throw e; }
        return d;
      });
    });
  };

  /* ---------- reloj del servidor ---------- */
  var off = 0;
  LE.setNow = function (serverNow) { if (serverNow) off = serverNow - Date.now(); };
  LE.now = function () { return Date.now() + off; };
  LE.hms = function (ms) {
    var s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    return [h, m, x].map(function (n) { return (n < 10 ? '0' : '') + n; }).join(':');
  };
  LE.hm = function (ms) {
    var s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    return h + 'h ' + (m < 10 ? '0' : '') + m + 'm ' + (x < 10 ? '0' : '') + x + 's';
  };

  /* ---------- guardado local de las paginas creadas en este dispositivo ---------- */
  LE.remember = function (id, key) {
    try {
      localStorage.setItem('le_own_' + id, key);
      var l = JSON.parse(localStorage.getItem('le_ids') || '[]');
      if (l.indexOf(id) < 0) { l.unshift(id); localStorage.setItem('le_ids', JSON.stringify(l.slice(0, 50))); }
      localStorage.setItem('le_last', id);
    } catch (e) { }
  };
  LE.editKey = function (id) { try { return localStorage.getItem('le_own_' + id); } catch (e) { return null; } };
  LE.myIds = function () { try { return JSON.parse(localStorage.getItem('le_ids') || '[]'); } catch (e) { return []; } };
  LE.lastId = function () { try { return localStorage.getItem('le_last'); } catch (e) { return null; } };

  /* ---------- UI ---------- */
  LE.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var tt;
  LE.toast = function (msg, err) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.className = 'toast on' + (err ? ' err' : ''); t.textContent = msg;
    clearTimeout(tt); tt = setTimeout(function () { t.className = 'toast' + (err ? ' err' : ''); }, 2800);
  };
  LE.copy = function (text) {
    function fb() {
      var a = document.createElement('textarea'); a.value = text; a.style.position = 'fixed'; a.style.opacity = '0';
      document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) { } a.remove(); LE.toast('Enlace copiado ✓');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { LE.toast('Enlace copiado ✓'); }, fb); else fb();
  };
  LE.wa = function (text) { return 'https://wa.me/' + C.WHATSAPP + '?text=' + encodeURIComponent(text); };
  LE.price = function (usd) { return { usd: '$' + Number(usd).toFixed(2), bob: 'Bs ' + Math.round(usd * (C.USD_BOB || 10)) }; };

  LE.header = function (active) {
    var h = document.getElementById('top'); if (!h) return;
    h.className = 'top';
    h.innerHTML = '<a class="brand" href="index.html"><img src="logo.jpg" alt="">Link Emocional</a><nav>' +
      '<a href="crear.html"' + (active === 'crear' ? ' class="on"' : '') + '>Crear</a>' +
      '<a href="mis-paginas.html"' + (active === 'mis' ? ' class="on"' : '') + '>Mis páginas</a>' +
      '<a id="nAuth" class="cta" href="login.html">Entrar</a></nav>';
    LE.session().then(function (s) {
      var b = document.getElementById('nAuth'); if (!b || !s) return;
      b.className = ''; b.textContent = 'Salir'; b.href = '#';
      b.onclick = function (e) { e.preventDefault(); LE.signOut().then(function () { location.href = 'index.html'; }); };
    });
  };

  LE.modal = function (html) {
    var m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = '<div class="sheet"><button class="close" aria-label="Cerrar">✕</button>' + html + '</div>';
    function close() { m.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    m.querySelector('.close').onclick = close;
    document.addEventListener('keydown', esc);
    document.body.appendChild(m);
    m.closeModal = close;
    return m;
  };

  /* ---------- ventana "hacer permanente" / "reactivar" ---------- */
  LE.openPermanent = function (o) {
    var P = LE.price(C.PRECIO_PERMANENTE_USD || 1.99);
    var url = o.url || (location.origin + '/p/' + o.id);
    var accion = o.expired ? 'reactivar' : 'hacer permanente';
    var wa = LE.wa('Hola! Quiero ' + accion + ' mi página 💗\nID: ' + o.id + '\n' + url);
    var tk = C.TIKTOK ? '@' + C.TIKTOK : 'nuestro TikTok';
    var html = '<h2>' + (o.expired ? '🔁 Reactivá tu página' : '💫 Hacé tu página permanente') + '</h2>' +
      '<p class="muted" style="margin:0 0 12px">Se queda online para siempre, sin cuenta regresiva y sin la etiqueta de Link Emocional.</p>' +
      '<div class="price">' + P.usd + ' <small>· ' + P.bob + ' · pago único</small></div>' +
      '<ul class="ticks"><li>Nunca expira</li><li>Podés seguir editándola</li><li>Sin marca de Link Emocional</li><li>Activación en minutos por WhatsApp</li></ul>' +
      (C.QR_PAGO ? '<div class="card center" style="padding:14px"><img src="' + LE.esc(C.QR_PAGO) + '" alt="QR de pago" style="max-width:220px;width:100%;border-radius:14px;background:#fff"><p class="hint" style="margin:10px 0 0">Pagá por QR y mandanos el comprobante con el ID <b>' + LE.esc(o.id) + '</b>.</p></div>' : '') +
      '<a class="btn wa" target="_blank" rel="noopener" href="' + LE.esc(wa) + '">Pedirla por WhatsApp</a>' +
      '<p class="muted center" style="margin:10px 0 0">QR bancario, transferencia y otros medios. Desde otro país también te ayudamos.</p>';
    if (C.PROMO_TIKTOK) {
      var w1 = LE.wa('Hola! Subí mi página a TikTok 🎬\nID: ' + o.id + '\nMi video: (pegá el link acá)');
      var w2 = LE.wa('Hola! Grabé cómo creo mi página en Link Emocional 🎬\nID: ' + o.id + '\nMi video: (pegá el link acá)');
      html += '<div class="sep">o conseguila más barata</div>' +
        '<div class="promo"><b>📱 Subí tu página a TikTok <span class="chip">50% OFF</span></b><p>Grabá un video con tu página, subilo a TikTok con “Hecho en Link Emocional” y mencioná ' + LE.esc(tk) + '. Mandanos el link y te hacemos el 50%.</p>' +
        '<a class="btn ghost sm" target="_blank" rel="noopener" href="' + LE.esc(w1) + '">Enviar mi TikTok por WhatsApp</a></div>' +
        '<div class="promo"><b>🎬 Grabá cómo creás tu página <span class="chip ok">GRATIS</span></b><p>Mostrá en video cómo creás tu página en Link Emocional y subilo a TikTok mencionando ' + LE.esc(tk) + '. Mandanos el link y te la dejamos permanente gratis.</p>' +
        '<a class="btn ghost sm" target="_blank" rel="noopener" href="' + LE.esc(w2) + '">Enviar mi TikTok por WhatsApp</a></div>';
    }
    return LE.modal(html);
  };

  document.addEventListener('DOMContentLoaded', function () { LE.stars(); });
})();
