/* Link Emocional — protección ligera del código.
   Bloquea clic derecho y los atajos típicos para ver/guardar el código (Ctrl+U, F12, Ctrl+Shift+I/J/C, Ctrl+S...).
   OJO: es un freno, no una caja fuerte. Quien sepa puede abrir el código desde el menú del navegador.
   Para trabajar tú sin bloqueo: en tu PC (localhost) ya viene desactivado, o en la consola del navegador
   escribe  localStorage.setItem('le_dev','1')  y recarga (para volver a activarlo: localStorage.removeItem('le_dev')). */
(function () {
  try {
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || localStorage.getItem('le_dev') === '1') return;
  } catch (e) {}

  var isField = function (t) {
    return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
  };
  var stop = function (e) {
    e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    return false;
  };

  // clic derecho / pulsación larga (menos en campos de texto, para poder pegar)
  document.addEventListener('contextmenu', function (e) { if (!isField(e.target)) return stop(e); }, true);

  function blocked(e) {
    var c = e.code || '', k = (e.key || '').toLowerCase();
    var ctrl = e.ctrlKey, meta = e.metaKey, shift = e.shiftKey, alt = e.altKey;
    if (e.key === 'F12' || c === 'F12') return true;
    // Ctrl+U (ver código), Ctrl+S (guardar página)
    if ((ctrl || meta) && !shift && !alt && (c === 'KeyU' || c === 'KeyS' || k === 'u' || k === 's')) return true;
    // Ctrl+Shift+I / J / C / K / E / M  (herramientas de desarrollador)
    if ((ctrl || meta) && shift && /^Key[IJCKEM]$/.test(c)) return true;
    if ((ctrl || meta) && shift && /^[ijckem]$/.test(k)) return true;
    // Mac: Cmd+Option+I / J / C / U
    if (meta && alt && /^Key[IJCU]$/.test(c)) return true;
    // Ctrl+Alt+I / J / C / U (algunos navegadores y teclados)
    if (ctrl && alt && /^Key[IJCU]$/.test(c)) return true;
    return false;
  }
  ['keydown', 'keyup', 'keypress'].forEach(function (t) {
    window.addEventListener(t, function (e) { if (blocked(e)) return stop(e); }, true);
  });

  // no arrastrar imágenes ni elementos, no seleccionar/copiar fuera de campos de texto
  document.addEventListener('dragstart', function (e) { e.preventDefault(); }, true);
  document.addEventListener('selectstart', function (e) { if (!isField(e.target)) e.preventDefault(); }, true);
  document.addEventListener('copy', function (e) { if (!isField(e.target)) e.preventDefault(); }, true);

  var st = document.createElement('style');
  st.textContent = 'html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    'img{-webkit-user-drag:none;user-drag:none}' +
    'input,textarea,select,[contenteditable="true"]{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}';
  (document.head || document.documentElement).appendChild(st);
})();
