'use strict';
const L = require('./_lib');

/* /api/admin  (solo correos de ADMIN_EMAILS)
   GET  ?filter=all|active|expired|permanent&search=texto  -> lista
   POST {action:'permanent', id, value}   activar/desactivar permanente
        {action:'extend', id, hours}      reactivar / sumar horas
        {action:'slug', id, slug}         enlace personalizado (/s/nombre)
        {action:'delete', id} */
module.exports = L.wrap(async function (req, res) {
  const user = await L.getUser(req);
  if (!user) throw new L.HttpError(401, 'auth', 'Inicia sesión.');
  if (!L.isAdmin(user)) throw new L.HttpError(403, 'forbidden', 'Esta cuenta no es administradora.');

  if (req.method === 'GET') {
    const qs = req.query || {};
    const nowIso = L.q(new Date().toISOString());
    let f = 'paginas?select=id,plantilla,slug,owner_email,is_permanent,created_at,expires_at,titulo:config->>titulo' +
      '&order=created_at.desc&limit=100';
    if (qs.filter === 'permanent') f += '&is_permanent=eq.true';
    else if (qs.filter === 'active') f += '&is_permanent=eq.false&expires_at=gt.' + nowIso;
    else if (qs.filter === 'expired') f += '&is_permanent=eq.false&expires_at=lte.' + nowIso;
    const s = String(qs.search || '').trim().replace(/[^a-zA-Z0-9@._ -]/g, '');
    if (s) f += '&or=(id.ilike.*' + L.q(s) + '*,slug.ilike.*' + L.q(s) + '*,owner_email.ilike.*' + L.q(s) + '*)';
    const rows = await L.db('GET', f);
    const now = Date.now();
    return L.send(res, 200, {
      now, pages: rows.map(r => Object.assign({}, r, { state: L.pageState(r, now) }))
    });
  }
  if (req.method !== 'POST') throw new L.HttpError(405, 'method', 'Método no permitido.');

  const b = L.readBody(req);
  const id = String(b.id || '').toLowerCase();
  if (!/^[a-f0-9]{6,32}$/.test(id)) throw new L.HttpError(400, 'bad_id', 'ID inválido.');
  const row = await L.getPage('id', id);
  if (!row) throw new L.HttpError(404, 'not_found', 'No existe una página con ese ID.');
  const where = 'paginas?id=eq.' + L.q(id);

  if (b.action === 'permanent') {
    await L.db('PATCH', where, { is_permanent: !!b.value });
  } else if (b.action === 'extend') {
    const h = Math.max(1, Math.min(24 * 365, Number(b.hours) || 16));
    const from = Math.max(Date.now(), new Date(row.expires_at).getTime());
    await L.db('PATCH', where, { expires_at: new Date(from + h * 3600 * 1000).toISOString() });
  } else if (b.action === 'slug') {
    const slug = String(b.slug || '').toLowerCase().trim();
    if (slug && !/^[a-z0-9_-]{3,32}$/.test(slug)) throw new L.HttpError(400, 'bad_slug', 'Usa 3 a 32 letras minúsculas, números, guion o guion bajo.');
    try {
      await L.db('PATCH', where, { slug: slug || null });
    } catch (e) {
      if (e.dbCode === '23505') throw new L.HttpError(409, 'slug_taken', 'Ese nombre ya está en uso.');
      throw e;
    }
  } else if (b.action === 'delete') {
    await L.db('DELETE', where);
  } else {
    throw new L.HttpError(400, 'bad_action', 'Acción desconocida.');
  }
  L.send(res, 200, { ok: true });
});
