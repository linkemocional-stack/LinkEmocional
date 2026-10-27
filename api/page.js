'use strict';
const L = require('./_lib');

/* /api/page?id=ID
   GET     -> devuelve la configuracion (solo dueño)
   PUT     -> guarda cambios {config}
   DELETE  -> elimina
   POST    -> reclama una pagina creada sin cuenta {edit_key} (requiere sesion)
   El dueño se identifica con la sesion (Bearer) o con la cabecera x-edit-key. */
module.exports = L.wrap(async function (req, res) {
  const id = String((req.query || {}).id || '').toLowerCase();
  if (!/^[a-f0-9]{6,32}$/.test(id)) throw new L.HttpError(404, 'not_found', 'Página no encontrada.');
  const row = await L.getPage('id', id);
  if (!row) throw new L.HttpError(404, 'not_found', 'Página no encontrada.');
  const user = await L.getUser(req);
  const body = L.readBody(req);

  if (req.method === 'POST') {
    if (!user) throw new L.HttpError(401, 'auth', 'Inicia sesión.');
    if (row.owner && row.owner !== user.id) throw new L.HttpError(403, 'forbidden', 'Esta página es de otra cuenta.');
    if (!row.owner) {
      if (!L.safeEq(body.edit_key, row.edit_key)) throw new L.HttpError(403, 'forbidden', 'Clave inválida.');
      await L.db('PATCH', 'paginas?id=eq.' + L.q(id), { owner: user.id, owner_email: user.email });
    }
    return L.send(res, 200, { ok: true });
  }

  const byKey = L.safeEq(req.headers['x-edit-key'], row.edit_key);
  const isOwner = !!(user && row.owner && row.owner === user.id);
  if (!(isOwner || byKey || L.isAdmin(user))) throw new L.HttpError(403, 'forbidden', 'No tienes permiso para esto.');

  if (req.method === 'GET') {
    const tpl = L.templateBySlug(row.plantilla);
    return L.send(res, 200, {
      id: row.id, plantilla: row.plantilla, config: row.config,
      state: L.pageState(row), expires_at: row.expires_at, is_permanent: row.is_permanent,
      kind: tpl ? tpl.kind : 'st'
    });
  }
  if (req.method === 'PUT') {
    const tpl = L.templateBySlug(row.plantilla);
    if (!tpl) throw new L.HttpError(400, 'bad_template', 'Diseño no disponible.');
    const config = L.sanitizeConfig(tpl, body.config);
    await L.db('PATCH', 'paginas?id=eq.' + L.q(id), { config, updated_at: new Date().toISOString() });
    return L.send(res, 200, { ok: true });
  }
  if (req.method === 'DELETE') {
    await L.db('DELETE', 'paginas?id=eq.' + L.q(id));
    return L.send(res, 200, { ok: true });
  }
  throw new L.HttpError(405, 'method', 'Método no permitido.');
});
