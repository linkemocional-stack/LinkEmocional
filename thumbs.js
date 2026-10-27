/* Link Emocional — miniaturas animadas (usa los mismos previews/*.html que las demos).
   Carga el iframe SOLO cuando la tarjeta se ve en pantalla y lo descarga al salir,
   así 15 diseños 3D no te frenan el celular. Uso: <div class="lt" data-thumb="slug"></div> */
(function () {
  var MAX = 4, live = [], queue = [];
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(onSee, { rootMargin: '150px' }) : null;

  function onSee(es) {
    es.forEach(function (e) {
      var el = e.target;
      if (e.isIntersecting) { if (!el._on) { el._on = 1; queue.push(el); pump(); } }
      else { el._on = 0; queue = queue.filter(function (q) { return q !== el; }); unload(el); }
    });
  }
  function pump() {
    while (queue.length && live.length < MAX) { load(queue.shift()); }
  }
  function load(el) {
    if (el._f || !el._on) return;
    var f = document.createElement('iframe');
    f.src = 'previews/' + el.dataset.thumb + '.html';
    f.title = ''; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); f.setAttribute('scrolling', 'no');
    f.onload = function () {
      el.classList.add('ok');
      // arranca la animación como si la persona tocara la pantalla
      setTimeout(function () {
        try {
          var d = f.contentDocument, g = d && d.getElementById('go');
          if (d) { var st = d.createElement('style'); st.textContent = '#hint,#chips,#card,#bar,#hud,.chips,#tools,#panel,#ui,#sh{display:none!important}'; d.head.appendChild(st); }
          if (g) g.click();
        } catch (e) {}
      }, 700);
    };
    fit(el);
    el.appendChild(f); el._f = f; live.push(el);
  }
  function fit(el) {
    var w = el.clientWidth, h = el.clientHeight;
    if (w && h) el.style.setProperty('--s', Math.max(w / 360, h / 640).toFixed(3));
  }
  window.addEventListener('resize', function () { live.forEach(fit); });
  function unload(el) {
    if (!el._f) return;
    el.removeChild(el._f); el._f = null; el.classList.remove('ok');
    live = live.filter(function (l) { return l !== el; });
    pump();
  }
  window.LEThumbs = {
    scan: function (root) {
      [].forEach.call((root || document).querySelectorAll('.lt[data-thumb]'), function (el) {
        if (el._seen) return; el._seen = 1;
        if (io) io.observe(el); else { el._on = 1; queue.push(el); pump(); }
      });
    }
  };
})();
