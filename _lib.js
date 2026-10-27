'use strict';
/* Link Emocional — utilidades de la API.
   Habla con Supabase por REST (sin dependencias de npm). */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const TEMPLATES = require('../templates.json').templates;

const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const FREE_HOURS = Number(process.env.FREE_HOURS || 12);        // duracion de la prueba gratis
const ANON_LIMIT = Number(process.env.ANON_LIMIT || 1);               // paginas de prueba SIN cuenta (por dispositivo)
const ANON_WINDOW_DAYS = Number(process.env.ANON_WINDOW_DAYS || 30);   // ... dentro de esta ventana de dias
const ANON_IP_LIMIT = Number(process.env.ANON_IP_LIMIT || 5);          // tope por IP (alto: muchas personas comparten IP en datos moviles)
const USER_LIMIT = Number(process.env.USER_LIMIT || 1);                // paginas gratis CON cuenta ...
const USER_WINDOW_DAYS = Number(process.env.USER_WINDOW_DAYS || 3);    // ... cada tantos dias
const USER_DEVICE_LIMIT = Number(process.env.USER_DEVICE_LIMIT || 3);  // tope por dispositivo (evita crear muchas cuentas)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
const WHATSAPP = process.env.WHATSAPP || '59178550176';
const MAX_BODY_CHARS = 3400000;   // Vercel acepta hasta ~4.5 MB por peticion
const MAX_IMG = 450 * 1024;       // tamano maximo de cada foto (en caracteres base64)
const HIDDEN = new Set(['musica', 'mnom', 'cam', 'q']);
const IMG_RE = /^data:image\/(?:png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;

class HttpError extends Error {
  constructor(status, code, message, extra) {
    super(message || code);
    this.status = status; this.code = code; this.extra = extra || {};
  }
}

/* ---------- respuestas ---------- */
function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}
function sendHtml(res, status, html, headers) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  Object.keys(headers || {}).forEach(k => res.setHeader(k, headers[k]));
  res.end(html);
}
function wrap(handler) {
  return async function (req, res) {
    try {
      if (!SB_URL || !SB_KEY) {
        throw new HttpError(500, 'config', 'Falta configurar SUPABASE_URL y SUPABASE_SERVICE_KEY en Vercel.');
      }
      await handler(req, res);
    } catch (e) {
      if (e instanceof HttpError) return send(res, e.status, Object.assign({ error: e.code, message: e.message }, e.extra));
      console.error(e);
      send(res, 500, { error: 'server', message: 'Ocurrió un error. Probá de nuevo en un momento.' });
    }
  };
}
function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return {};
}

/* ---------- Supabase ---------- */
async function db(method, pathQuery, body, headers) {
  const h = Object.assign({ apikey: SB_KEY, 'Content-Type': 'application/json' }, headers || {});
  if (SB_KEY.startsWith('eyJ')) h.Authorization = 'Bearer ' + SB_KEY;   // llaves nuevas (sb_secret_) no van como JWT
  const r = await fetch(SB_URL + '/rest/v1/' + pathQuery, {
    method, headers: h, body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!r.ok) {
    const err = new Error((data && data.message) || ('db ' + r.status));
    err.dbStatus = r.status; err.dbCode = data && data.code;
    throw err;
  }
  return data;
}
const q = encodeURIComponent;

async function getUser(req) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!m) return null;
  const r = await fetch(SB_URL + '/auth/v1/user', { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + m[1] } });
  if (!r.ok) return null;
  const u = await r.json();
  return u && u.id ? { id: u.id, email: String(u.email || '').toLowerCase() } : null;
}
function isAdmin(user) { return !!(user && user.email && ADMIN_EMAILS.indexOf(user.email) >= 0); }

// Si todavia no corriste la migracion (columnas device_id / guest), se usa la version simple
async function withFallback(primary, fallback) {
  try { return await primary(); }
  catch (e) { if (e.dbCode === '42703' || /device_id|guest/.test(e.message || '')) return fallback(); throw e; }
}
function humanLeft(ms) {
  const h = Math.max(1, Math.ceil(ms / 3600000));
  if (h >= 48) return Math.ceil(h / 24) + ' días';
  return h + (h === 1 ? ' hora' : ' horas');
}

/* Cupo de paginas gratis.
   Sin cuenta: ANON_LIMIT por dispositivo (y tope por IP). Con cuenta: USER_LIMIT cada USER_WINDOW_DAYS dias.
   Lo creado sin cuenta NO gasta el cupo de la cuenta. Las que se hacen permanentes dejan de contar. */
async function quota(req, user) {
  const days = user ? USER_WINDOW_DAYS : ANON_WINDOW_DAYS, win = days * 86400000;
  const limit = user ? USER_LIMIT : ANON_LIMIT;
  const out = o => Object.assign({ loggedIn: !!user, limit, windowDays: days }, o);
  if (isAdmin(user)) return out({ admin: true, limit: null, used: 0, remaining: null, resetAt: null, needLogin: false });

  const base = 'paginas?select=created_at&created_at=gte.' + q(new Date(Date.now() - win).toISOString()) +
    '&order=created_at.asc&limit=100&';
  const dev = deviceHash(req), ip = ipHash(req);
  let list, ref, over;
  if (user) {
    list = await withFallback(
      () => L_db(base + 'owner=eq.' + user.id + '&is_permanent=eq.false&guest=eq.false'),
      () => L_db(base + 'owner=eq.' + user.id + '&is_permanent=eq.false'));
    ref = list; over = list.length >= limit;
    if (dev) {
      const d = await withFallback(() => L_db(base + 'device_id=eq.' + dev), () => []);
      if (d.length >= USER_DEVICE_LIMIT) { over = true; ref = d; }
    }
  } else {
    list = dev
      ? await withFallback(() => L_db(base + 'device_id=eq.' + dev), () => L_db(base + 'ip_hash=eq.' + ip + '&owner=is.null'))
      : await L_db(base + 'ip_hash=eq.' + ip + '&owner=is.null');
    ref = list; over = list.length >= limit;
    if (dev) {
      const r = await L_db(base + 'ip_hash=eq.' + ip + '&owner=is.null');
      if (r.length >= ANON_IP_LIMIT) { over = true; ref = r; }
    }
  }
  const remaining = over ? 0 : Math.max(0, limit - list.length);
  const resetAt = over && ref[0] ? new Date(new Date(ref[0].created_at).getTime() + win).toISOString() : null;
  return out({ used: list.length, remaining, resetAt, needLogin: !user && remaining === 0 });
}
function L_db(pathQuery) { return db('GET', pathQuery); }

async function getPage(by, value) {
  const rows = await db('GET', 'paginas?select=*&' + by + '=eq.' + q(value) + '&limit=1');
  return rows && rows[0] ? rows[0] : null;
}

/* ---------- utilidades ---------- */
function baseUrl(req) {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0];
  return proto + '://' + host;
}
function ipKey(ip) {   // IPv6: se usa el prefijo /64 (la parte final cambia en cada conexion movil)
  const m = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(ip);
  if (m) return m[1];
  return ip.indexOf(':') >= 0 ? ip.split(':').slice(0, 4).join(':') : ip;
}
function ipHash(req) {
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    (req.socket && req.socket.remoteAddress) || '';
  return crypto.createHash('sha256').update(ipKey(ip) + (process.env.IP_SALT || 'le')).digest('hex').slice(0, 32);
}
// Identificador anonimo del navegador (lo genera la web y lo guarda en el dispositivo)
function deviceHash(req) {
  const d = String(req.headers['x-device'] || '');
  return /^[a-f0-9]{16,40}$/.test(d)
    ? crypto.createHash('sha256').update('dev' + d + (process.env.IP_SALT || 'le')).digest('hex').slice(0, 32) : null;
}
const randomId = () => crypto.randomBytes(7).toString('hex');
const randomKey = () => crypto.randomBytes(16).toString('hex');
function safeEq(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function pageState(row, now) {
  now = now || Date.now();
  if (row.is_permanent) return 'permanent';
  return new Date(row.expires_at).getTime() > now ? 'active' : 'expired';
}
function templateBySlug(slug) { return TEMPLATES.find(t => t.slug === slug) || null; }

const HTML_CACHE = new Map();
function loadTemplateHtml(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (HTML_CACHE.has(slug)) return HTML_CACHE.get(slug);
  const candidates = [
    path.join(process.cwd(), 'templates', slug + '.html'),
    path.join(__dirname, '..', 'templates', slug + '.html')
  ];
  for (const p of candidates) {
    try { const h = fs.readFileSync(p, 'utf8'); HTML_CACHE.set(slug, h); return h; } catch (e) { /* siguiente */ }
  }
  return null;
}

/* ---------- sanitizado de la configuracion ----------
   Se parte de los valores por defecto de la plantilla: solo se aceptan las claves
   que ya existen, con el mismo tipo. Se quitan < y > para que nadie pueda inyectar HTML. */
function collectSpecs(tpl) {
  const map = {};
  (tpl.groups || []).forEach(g => g.fields.forEach(f => {
    map[f.key] = f;
    (f.of || []).forEach(s => { if (!map[s.key]) map[s.key] = s; });
  }));
  return map;
}
function cleanStr(s, max) {
  s = typeof s === 'string' ? s : String(s == null ? '' : s);
  if (/^data:image\//i.test(s)) return (s.length <= MAX_IMG && IMG_RE.test(s)) ? s : '';
  return s.replace(/<3/g, '♥').replace(/[<>]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u2028\u2029]/g, '').slice(0, max);
}
function san(def, v, key, specs, depth) {
  const spec = specs[key];
  if (depth > 5) return def;
  if (typeof def === 'boolean') return typeof v === 'boolean' ? v : def;
  if (typeof def === 'number') {
    const n = Number(v);
    if (!Number.isFinite(n)) return def;
    const lo = spec && spec.min != null ? spec.min : -1000;
    const hi = spec && spec.max != null && spec.type === 'range' ? spec.max : 1000;
    return Math.min(hi, Math.max(lo, n));
  }
  if (typeof def === 'string') {
    if (v == null) return def;
    const max = spec && spec.max ? spec.max : 120;
    const s = cleanStr(v, max);
    if (spec && spec.type === 'color') return /^#[0-9a-fA-F]{6}$/.test(s) ? s : def;
    if (spec && spec.type === 'date') return (s === '' || /^\d{4}-\d{2}-\d{2}$/.test(s)) ? s : def;
    if (spec && spec.type === 'select') return spec.options.some(o => o.v === s) ? s : def;
    return s;
  }
  if (Array.isArray(def)) {
    if (!Array.isArray(v)) return def;
    const proto = def.length ? def[0] : '';
    const max = spec && spec.max ? spec.max : 20;
    if (typeof proto === 'string') {
      const itemMax = spec && spec.itemMax ? spec.itemMax : 120;
      return v.slice(0, max).map(x => cleanStr(x, itemMax)).filter(s => s !== '');
    }
    const out = v.slice(0, max).map(x => san(proto, x, key, specs, depth + 1));
    return out.length || !(spec && spec.min) ? out : def;
  }
  if (def && typeof def === 'object') {
    const o = {};
    const src = v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    Object.keys(def).forEach(k => { o[k] = san(def[k], src[k], k, specs, depth + 1); });
    return o;
  }
  return def;
}
function sanitizeConfig(tpl, cfg) {
  if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) throw new HttpError(400, 'bad_config', 'Configuración inválida.');
  if (JSON.stringify(cfg).length > MAX_BODY_CHARS) throw new HttpError(413, 'too_big', 'La página pesa demasiado. Probá con menos fotos.');
  const specs = collectSpecs(tpl);
  const out = san(tpl.defaults, cfg, '', specs, 0);
  HIDDEN.forEach(k => { if (k in tpl.defaults) out[k] = tpl.defaults[k]; });
  return out;
}

module.exports = {
  HttpError, send, sendHtml, wrap, readBody, db, q, getUser, isAdmin, getPage,
  baseUrl, ipHash, deviceHash, humanLeft, randomId, randomKey, safeEq, pageState, templateBySlug, loadTemplateHtml,
  sanitizeConfig, TEMPLATES,
  quota, FREE_HOURS, ANON_LIMIT, USER_LIMIT, USER_WINDOW_DAYS, WHATSAPP
};
