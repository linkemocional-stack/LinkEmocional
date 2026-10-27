'use strict';
const L = require('./_lib');
const R = require('../render-core.js');


// Íconos con los colores de Link Emocional (en vez de emojis básicos)
const SVG_DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="leg" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22"><stop offset="0" stop-color="#6fd6e8"/><stop offset=".55" stop-color="#8b6ff0"/><stop offset="1" stop-color="#b07cff"/></linearGradient></defs></svg>';
const IC = {
  ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'
};
const ic = (n, stroke) => '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:1.15em;height:1.15em;vertical-align:-.2em;fill:none;stroke:' + (stroke || 'url(#leg)') + ';stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round"><path d="' + IC[n] + '"/></svg>';
const HEART_BADGE = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:12px;height:12px;vertical-align:-2px;margin-right:5px"><defs><linearGradient id="lgh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fd6e8"/><stop offset="1" stop-color="#b07cff"/></linearGradient></defs><path fill="url(#lgh)" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = ms => new Date(ms).toLocaleDateString('es-BO', { timeZone: 'America/La_Paz', day: '2-digit', month: '2-digit', year: 'numeric' });

const BASE_CSS = `*{box-sizing:border-box}html,body{margin:0;min-height:100%}
body{font-family:'Quicksand','Segoe UI',system-ui,sans-serif;color:#f2f0fb;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;
background:radial-gradient(circle at 15% -10%,rgba(139,111,240,.25),transparent 45%),linear-gradient(165deg,#050308,#0d0a1e 55%,#0c0818)}
.card{width:100%;max-width:420px;border-radius:26px;padding:28px 24px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);backdrop-filter:blur(8px)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}
.chip{font-size:12px;font-weight:700;padding:7px 12px;border-radius:99px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.25)}
h1{font-size:34px;line-height:1.1;margin:0 0 10px;font-weight:800;letter-spacing:-.01em}
p{margin:0 0 18px;color:#c9c2e6;line-height:1.55;font-size:15px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font-weight:800;font-size:15px;padding:15px 18px;border-radius:16px;color:#fff;background:linear-gradient(120deg,#25c26e,#1a9d57)}
.small{margin-top:18px;font-size:12px;color:#8f87ad;text-align:center}.small a{color:#b9a6ff}`;

function shell(title, body, extraCss) {
  return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="robots" content="noindex,nofollow"><title>' + esc(title) + '</title><script src="/protection.js"></script>' +
    '<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap" rel="stylesheet">' +
    '<style>' + BASE_CSS + (extraCss || '') + '</style></head><body>' + SVG_DEFS + body + '</body></html>';
}

function expiredPage(row, tpl) {
  const msg = encodeURIComponent('Hola! Mi página con ID ' + row.id + ' expiró y quiero reactivarla 💗');
  const wa = 'https://wa.me/' + L.WHATSAPP + '?text=' + msg;
  const css = `body{background:radial-gradient(circle at 20% 0,rgba(255,60,60,.28),transparent 50%),linear-gradient(165deg,#120305,#2a0507 60%,#0c0204)}
.card{border-color:rgba(255,90,90,.35);background:rgba(120,10,10,.22)}
.ico{width:58px;height:58px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:28px;background:linear-gradient(140deg,#e0322b,#8f1410);margin-bottom:18px}
h1 em{font-style:normal;color:#ff7a70}.note{border:1px solid rgba(255,90,90,.45);border-radius:14px;padding:12px 14px;font-size:13px;margin-bottom:14px;color:#ffd5d1}`;
  return shell('Página expirada · Link Emocional',
    '<main class="card"><div class="chips"><span class="chip">' + ic('ban') + ' PÁGINA EXPIRADA</span>' +
    '<span class="chip">' + esc(tpl ? tpl.emoji + ' ' + tpl.name : 'Link Emocional') + '</span>' +
    '<span class="chip">' + ic('cal') + ' Expiró el ' + fmtDate(new Date(row.expires_at).getTime()) + '</span></div>' +
    '<div class="ico">' + ic('clock', '#fff') + '</div><h1>Esta página ya no está <em>disponible</em></h1>' +
    '<p>Pídele a quien te la envió que la active nuevamente.</p>' +
    '<div class="note">Solo quien la creó puede reactivarla.</div>' +
    '<p style="font-size:13px;margin-bottom:10px">¿Sos el dueño? Escríbenos con el ID <b>' + esc(row.id) + '</b>.</p>' +
    '<a class="btn" href="' + esc(wa) + '" rel="noopener">Contactar por WhatsApp</a>' +
    '<div class="small">Hecho con <a href="/">Link Emocional</a></div></main>', css);
}

function notFoundPage() {
  return shell('No encontrada · Link Emocional',
    '<main class="card" style="text-align:center"><h1>Esta página no existe</h1>' +
    '<p>Revisa que el enlace esté completo o pide que te lo envíen de nuevo.</p>' +
    '<a class="btn" style="background:linear-gradient(120deg,#6fd6e8,#8b6ff0)" href="/">Ir a Link Emocional</a></main>');
}

// Etiqueta "Hecho con..." + cuenta regresiva (solo la ve quien creó la página en este dispositivo)
function badgeScript(row, serverNow) {
  const exp = new Date(row.expires_at).getTime();
  return '<script>(function(){var ID=' + JSON.stringify(row.id) + ',EXP=' + exp + ',SN=' + serverNow + ';' +
    'var off=SN-Date.now();function now(){return Date.now()+off}' +
    'var f="font:700 11px/1 Quicksand,system-ui,sans-serif;z-index:2147483000;position:fixed;text-decoration:none;color:#fff;";' +
    'var t=document.createElement("a");t.href="/";t.target="_blank";t.rel="noopener";t.innerHTML=' + JSON.stringify(HEART_BADGE + 'Hecho con Link Emocional') + ';' +
    't.style.cssText=f+"left:50%;transform:translateX(-50%);bottom:calc(4px + env(safe-area-inset-bottom,0px));opacity:.5;padding:4px 8px;white-space:nowrap;text-shadow:0 0 6px #000";' +
    'document.body.appendChild(t);' +
    'var own=false;try{own=!!localStorage.getItem("le_own_"+ID)}catch(e){}' +
    'if(own){var p=document.createElement("a");p.href="/listo.html?id="+ID;' +
    'p.style.cssText=f+"left:8px;top:calc(6px + env(safe-area-inset-top,0px));padding:7px 10px;border-radius:99px;background:rgba(20,10,40,.72);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(6px)";' +
    'document.body.appendChild(p);' +
    'function tick(){var s=Math.max(0,Math.floor((EXP-now())/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;' +
    'p.innerHTML=' + JSON.stringify(ic('clock', '#fff') + ' ') + '+[h,m,x].map(function(n){return(n<10?"0":"")+n}).join(":")}tick();setInterval(tick,1000)}' +
    'var left=EXP-now();if(left>0&&left<2147483000)setTimeout(function(){location.reload()},left+600);' +
    '})();</script>';
}

module.exports = L.wrap(async function (req, res) {
  const query = req.query || {};
  const id = query.id ? String(query.id).toLowerCase() : '';
  const slug = query.slug ? String(query.slug).toLowerCase() : '';
  let row = null;
  if (/^[a-f0-9]{6,32}$/.test(id)) row = await L.getPage('id', id);
  else if (/^[a-z0-9_-]{3,32}$/.test(slug)) row = await L.getPage('slug', slug);
  if (!row) return L.sendHtml(res, 404, notFoundPage());

  const tpl = L.templateBySlug(row.plantilla);
  const now = Date.now();
  if (L.pageState(row, now) === 'expired') return L.sendHtml(res, 200, expiredPage(row, tpl));

  const html = tpl ? L.loadTemplateHtml(tpl.slug) : null;
  if (!html) return L.sendHtml(res, 500, shell('Error', '<main class="card"><h1>Diseño no disponible</h1><p>Escríbenos por WhatsApp y lo resolvemos.</p></main>'));

  let out = R.render(html, tpl.kind, row.config);
  const base = L.baseUrl(req);
  const head = '<meta name="robots" content="noindex,nofollow"><meta property="og:type" content="website">' +
    '<meta property="og:title" content="Alguien te preparó una sorpresa 💗">' +
    '<meta property="og:description" content="Abre este regalo digital hecho con Link Emocional.">' +
    '<meta property="og:image" content="' + esc(base) + '/og-image.jpg">';
  out = out.replace('</head>', function () { return head + '</head>'; });
  if (!row.is_permanent) out = out.replace('</body>', function () { return badgeScript(row, now) + '</body>'; });
  L.sendHtml(res, 200, out);
});
