/* Link Emocional — render-core.js
   Se usa en el navegador (vista previa del editor) y en el servidor (api/p.js),
   asi la vista previa y la pagina publicada salen exactamente iguales. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LE_RENDER = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // Claves que el formato "le" guarda en el nivel principal; el resto va dentro de "extra".
  var TOP_LE = ['titulo', 'tapTexto', 'mensaje', 'frases', 'fotos', 'musica', 'color', 'font', 'shape',
    'burst', 'trail', 'burstCount'];

  // JSON seguro para incrustarlo dentro de un <script>
  function jsonForScript(obj) {
    return JSON.stringify(obj)
      .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }

  function leState(cfg) {
    var st = {}, extra = {};
    Object.keys(cfg).forEach(function (k) {
      if (TOP_LE.indexOf(k) >= 0) st[k] = cfg[k]; else extra[k] = cfg[k];
    });
    st.extra = extra;
    return st;
  }

  function replaceScript(html, id, json) {
    var re = new RegExp('(<script id="' + id + '" type="application/json">)[\\s\\S]*?(</script>)');
    if (!re.test(html)) throw new Error('La plantilla no tiene el bloque #' + id);
    return html.replace(re, function (_, a, b) { return a + json + b; });
  }

  // kind: "st" (cosmos, arbol...) | "le" (rosa eterna, medusa...) | "is" (productos con <script id="initial-state">)
  function protect(out) {
    var tag = '<script src="/protection.js"></script>';
    return /<\/head>/i.test(out) ? out.replace(/<\/head>/i, function () { return tag + '</head>'; }) : tag + out;
  }
  /* Red de seguridad para la música: algunas plantillas tienen el campo "Música de fondo" pero no le pasan
     la canción al <audio>. Este script (se ejecuta al final de la página ya armada) busca la canción en los
     datos de la página y, SOLO si ninguna <audio> tiene canción, la pone y la reproduce al primer toque. */
  var MUSIC_FIX = '<script>(function(){function find(){var s=document.querySelectorAll(\'script[type="application/json"]\');' +
    'for(var i=0;i<s.length;i++){var m=/data:audio\\/[A-Za-z0-9.+-]+;base64,[A-Za-z0-9+\\/=]+/.exec(s[i].textContent);if(m)return m[0]}return \'\'}' +
    'function boot(){var src=find();if(!src)return;var as=document.querySelectorAll(\'audio\');' +
    'for(var i=0;i<as.length;i++){if(as[i].getAttribute(\'src\')||as[i].currentSrc)return}' +
    'var a=as[0];if(!a){a=document.createElement(\'audio\');document.body.appendChild(a)}' +
    'a.loop=true;a.preload=\'auto\';a.src=src;var done=false,ev=[\'pointerdown\',\'touchend\',\'click\',\'keydown\'];' +
    'function off(){ev.forEach(function(e){removeEventListener(e,go,true)})}' +
    'function go(){if(done)return;done=true;off();try{a.volume=.8}catch(e){}var p=a.play();' +
    'if(p&&p.catch)p.catch(function(){done=false;on()})}' +
    'function on(){ev.forEach(function(e){addEventListener(e,go,true)})}on()}' +
    'if(document.readyState===\'complete\')setTimeout(boot,0);else addEventListener(\'load\',function(){setTimeout(boot,0)})})()</script>';
  function withMusicFix(out, html) {
    if (/new Audio\(/.test(html)) return out;               // la plantilla maneja su propio reproductor
    return /<\/body>/i.test(out) ? out.replace(/<\/body>/i, function () { return MUSIC_FIX + '</body>'; }) : out + MUSIC_FIX;
  }
  function render(html, kind, cfg) {
    if (kind === 'is') return withMusicFix(protect(replaceScript(html, 'initial-state', jsonForScript(cfg))), html);
    if (kind === 'le') return withMusicFix(protect(replaceScript(html, 'le-initial-state', jsonForScript(leState(cfg)))), html);
    return withMusicFix(protect(replaceScript(html, 'st', jsonForScript(cfg))), html);
  }

  return { render: render, leState: leState, jsonForScript: jsonForScript };
});
