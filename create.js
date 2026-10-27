'use strict';
const L = require('./_lib');

/* POST /api/create   { slug, config }   (opcional: Authorization: Bearer <token de sesion>)
   Crea la pagina con vencimiento a las FREE_HOURS horas. */
module.exports = L.wrap(async function (req, res) {
  if (req.method !== 'POST') throw new L.HttpError(405, 'method', 'Método no permitido.');
  const b = L.readBody(req);
  const tpl = L.templateBySlug(String(b.slug || ''));
  if (!tpl) throw new L.HttpError(400, 'bad_template', 'Ese diseño no existe.');
  const config = L.sanitizeConfig(tpl, b.config);

  const user = await L.getUser(req);
  const ip = L.ipHash(req);

  const qt = await L.quota(req, user);
  if (qt.remaining !== null && qt.remaining <= 0) {
    if (!user) {
      throw new L.HttpError(429, 'limit', 'Ya usaste tu página de prueba. Iniciá sesión para seguir creando más páginas.',
        { needLogin: true });
    }
    const left = qt.resetAt ? L.humanLeft(new Date(qt.resetAt).getTime() - Date.now()) : null;
    throw new L.HttpError(429, 'limit', 'Ya usaste tu página gratis.' + (left ? ' Podés crear otra en ' + left + '.' : '') +
      ' Mientras tanto podés hacer permanente alguna de las tuyas.', { needLogin: false, resetAt: qt.resetAt });
  }

  const row = {
    id: L.randomId(),
    plantilla: tpl.slug,
    config,
    owner: user ? user.id : null,
    owner_email: user ? user.email : null,
    ip_hash: ip,
    device_id: L.deviceHash(req),
    guest: !user,
    edit_key: L.randomKey(),
    is_permanent: false,
    expires_at: new Date(Date.now() + L.FREE_HOURS * 3600 * 1000).toISOString()
  };
  let out;
  try {
    out = await L.db('POST', 'paginas', row, { Prefer: 'return=representation' });
  } catch (e) {   // columnas nuevas todavia no creadas (migracion pendiente)
    if (e.dbCode === 'PGRST204' || e.dbCode === '42703' || /device_id|guest/.test(e.message || '')) {
      delete row.device_id; delete row.guest;
      out = await L.db('POST', 'paginas', row, { Prefer: 'return=representation' });
    } else throw e;
  }
  const saved = out && out[0] ? out[0] : row;
  L.send(res, 200, {
    id: saved.id,
    edit_key: saved.edit_key,
    url: L.baseUrl(req) + '/p/' + saved.id,
    expires_at: saved.expires_at,
    now: Date.now()
  });
});
