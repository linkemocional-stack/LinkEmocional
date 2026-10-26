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

  // kind: "st" (cosmos, arbol...) | "le" (rosa eterna, medusa...)
  function render(html, kind, cfg) {
    if (kind === 'le') return replaceScript(html, 'le-initial-state', jsonForScript(leState(cfg)));
    return replaceScript(html, 'st', jsonForScript(cfg));
  }

  return { render: render, leState: leState, jsonForScript: jsonForScript };
});
