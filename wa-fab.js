/* Link Emocional — boton flotante de WhatsApp (chiquito, abajo a la derecha) */
(function () {
  if (document.querySelector('.wa-fab')) return;
  var n = (window.LE_CONFIG && window.LE_CONFIG.WHATSAPP) || '59178550176';
  var st = document.createElement('style');
  st.textContent = '.wa-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:60;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:#fff;background:#25d366;box-shadow:0 8px 22px rgba(0,0,0,.4),0 0 0 4px rgba(37,211,102,.18);transition:transform .2s,box-shadow .2s}' +
    '.wa-fab:hover{transform:scale(1.08);box-shadow:0 10px 26px rgba(0,0,0,.45),0 0 0 6px rgba(37,211,102,.25)}' +
    '.wa-fab:focus-visible{outline:3px solid #fff;outline-offset:3px}' +
    '@media(max-width:860px){.wa-fab{width:44px;height:44px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px))}.wa-fab svg{width:24px;height:24px}}';
  document.head.appendChild(st);
  var a = document.createElement('a');
  a.className = 'wa-fab'; a.target = '_blank'; a.rel = 'noopener';
  a.href = 'https://wa.me/' + n + '?text=' + encodeURIComponent('Hola, tengo una consulta sobre Link Emocional');
  a.setAttribute('aria-label', 'Escríbenos por WhatsApp'); a.title = 'Escríbenos por WhatsApp';
  a.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" ><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.79 14.1c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.13.11-1.82-.12-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.3-.29.47-.15.17-.31.37-.44.5-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.21.72-.85.92-1.14.19-.29.38-.24.64-.14.26.1 1.66.79 1.94.93.29.14.47.22.55.34.07.12.07.7-.17 1.38z"/></svg>';
  document.body.appendChild(a);
})();
