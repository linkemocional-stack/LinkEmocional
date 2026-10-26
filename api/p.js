'use strict';
const L = require('./_lib');
const R = require('../render-core.js');

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
    '<meta name="robots" content="noindex,nofollow"><title>' + esc(title) + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap" rel="stylesheet">' +
    '<style>' + BASE_CSS + (extraCss || '') + '</style></head><body>' + body + '</body></html>';
}

function expiredPage(row, tpl) {
  const msg = encodeURIComponent('Hola! Mi página con ID ' + row.id + ' expiró y quiero reactivarla 💗');
  const wa = 'https://wa.me/' + L.WHATSAPP + '?text=' + msg;
  const css = `body{background:radial-gradient(circle at 20% 0,rgba(255,60,60,.28),transparent 50%),linear-gradient(165deg,#120305,#2a0507 60%,#0c0204)}
.card{border-color:rgba(255,90,90,.35);background:rgba(120,10,10,.22)}
.ico{width:58px;height:58px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:28px;background:linear-gradient(140deg,#e0322b,#8f1410);margin-bottom:18px}
h1 em{font-style:normal;color:#ff7a70}.note{border:1px solid rgba(255,90,90,.45);border-radius:14px;padding:12px 14px;font-size:13px;margin-bottom:14px;color:#ffd5d1}`;
  return shell('Página expirada · Link Emocional',
    '<main class="card"><div class="chips"><span class="chip">⛔ PÁGINA EXPIRADA</span>' +
    '<span class="chip">' + esc(tpl ? tpl.emoji + ' ' + tpl.name : 'Link Emocional') + '</span>' +
    '<span class="chip">📅 Expiró el ' + fmtDate(new Date(row.expires_at).getTime()) + '</span></div>' +
    '<div class="ico">⏳</div><h1>Esta página ya no está <em>disponible</em></h1>' +
    '<p>Pedile a quien te la envió que la active nuevamente.</p>' +
    '<div class="note">Solo quien la creó puede reactivarla.</div>' +
    '<p style="font-size:13px;margin-bottom:10px">¿Sos el dueño? Escribinos con el ID <b>' + esc(row.id) + '</b>.</p>' +
    '<a class="btn" href="' + esc(wa) + '" rel="noopener">Contactar por WhatsApp</a>' +
    '<div class="small">Hecho con <a href="/">Link Emocional</a></div></main>', css);
}

function notFoundPage() {
  return shell('No encontrada · Link Emocional',
    '<main class="card" style="text-align:center"><h1>Esta página no existe</h1>' +
    '<p>Revisá que el enlace esté completo o pedí que te lo envíen de nuevo.</p>' +
    '<a class="btn" style="background:linear-gradient(120deg,#6fd6e8,#8b6ff0)" href="/">Ir a Link Emocional</a></main>');
}

// Etiqueta "Hecho con..." + cuenta regresiva (solo la ve quien creó la página en este dispositivo)
function badgeScript(row, serverNow) {
  const exp = new Date(row.expires_at).getTime();
  return '<script>(function(){var ID=' + JSON.stringify(row.id) + ',EXP=' + exp + ',SN=' + serverNow + ';' +
    'var off=SN-Date.now();function now(){return Date.now()+off}' +
    'var f="font:700 11px/1 Quicksand,system-ui,sans-serif;z-index:2147483000;position:fixed;text-decoration:none;color:#fff;";' +
    'var t=document.createElement("a");t.href="/";t.target="_blank";t.rel="noopener";t.textContent="\\u{1F497} Hecho con Link Emocional";' +
    't.style.cssText=f+"left:50%;transform:translateX(-50%);bottom:calc(4px + env(safe-area-inset-bottom,0px));opacity:.5;padding:4px 8px;white-space:nowrap;text-shadow:0 0 6px #000";' +
    'document.body.appendChild(t);' +
    'var own=false;try{own=!!localStorage.getItem("le_own_"+ID)}catch(e){}' +
    'if(own){var p=document.createElement("a");p.href="/listo.html?id="+ID;' +
    'p.style.cssText=f+"left:8px;top:calc(6px + env(safe-area-inset-top,0px));padding:7px 10px;border-radius:99px;background:rgba(20,10,40,.72);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(6px)";' +
    'document.body.appendChild(p);' +
    'function tick(){var s=Math.max(0,Math.floor((EXP-now())/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;' +
    'p.textContent="\\u23F3 "+[h,m,x].map(function(n){return(n<10?"0":"")+n}).join(":")}tick();setInterval(tick,1000)}' +
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
  if (!html) return L.sendHtml(res, 500, shell('Error', '<main class="card"><h1>Diseño no disponible</h1><p>Escribinos por WhatsApp y lo resolvemos.</p></main>'));

  let out = R.render(html, tpl.kind, row.config);
  const base = L.baseUrl(req);
  const head = '<meta name="robots" content="noindex,nofollow"><meta property="og:type" content="website">' +
    '<meta property="og:title" content="Alguien te preparó una sorpresa 💗">' +
    '<meta property="og:description" content="Abrí este regalo digital hecho con Link Emocional.">' +
    '<meta property="og:image" content="' + esc(base) + '/og-image.jpg">';
  out = out.replace('</head>', function () { return head + '</head>'; });
  if (!row.is_permanent) out = out.replace('</body>', function () { return badgeScript(row, now) + '</body>'; });
  L.sendHtml(res, 200, out);
});
