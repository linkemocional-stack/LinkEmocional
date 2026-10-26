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

  if (!user) {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const rows = await L.db('GET', 'paginas?select=id&ip_hash=eq.' + ip + '&owner=is.null&created_at=gte.' +
      L.q(since) + '&limit=50');
    if (rows.length >= L.ANON_LIMIT) {
      throw new L.HttpError(429, 'limit', 'Has alcanzado el límite. Iniciá sesión para seguir creando más páginas.',
        { needLogin: true });
    }
  } else {
    const rows = await L.db('GET', 'paginas?select=id&owner=eq.' + user.id + '&is_permanent=eq.false&expires_at=gt.' +
      L.q(new Date().toISOString()) + '&limit=100');
    if (rows.length >= L.USER_LIMIT) {
      throw new L.HttpError(429, 'limit', 'Ya tenés ' + L.USER_LIMIT + ' páginas gratis activas. ' +
        'Hacé permanente alguna o esperá a que venza una.', { needLogin: false });
    }
  }

  const row = {
    id: L.randomId(),
    plantilla: tpl.slug,
    config,
    owner: user ? user.id : null,
    owner_email: user ? user.email : null,
    ip_hash: ip,
    edit_key: L.randomKey(),
    is_permanent: false,
    expires_at: new Date(Date.now() + L.FREE_HOURS * 3600 * 1000).toISOString()
  };
  const out = await L.db('POST', 'paginas', row, { Prefer: 'return=representation' });
  const saved = out && out[0] ? out[0] : row;
  L.send(res, 200, {
    id: saved.id,
    edit_key: saved.edit_key,
    url: L.baseUrl(req) + '/p/' + saved.id,
    expires_at: saved.expires_at,
    now: Date.now()
  });
});
