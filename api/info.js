'use strict';
const L = require('./_lib');

/* GET /api/info?id=ID  (publico, sin la configuracion) */
module.exports = L.wrap(async function (req, res) {
  const id = String((req.query || {}).id || '').toLowerCase();
  if (!/^[a-f0-9]{6,32}$/.test(id)) throw new L.HttpError(404, 'not_found', 'Página no encontrada.');
  const row = await L.getPage('id', id);
  if (!row) throw new L.HttpError(404, 'not_found', 'Página no encontrada.');
  const tpl = L.templateBySlug(row.plantilla);
  const now = Date.now();
  L.send(res, 200, {
    id: row.id,
    plantilla: row.plantilla,
    template_name: tpl ? tpl.name : row.plantilla,
    emoji: tpl ? tpl.emoji : '🎁',
    titulo: row.config && row.config.titulo ? row.config.titulo : '',
    slug: row.slug || null,
    is_permanent: row.is_permanent,
    created_at: row.created_at,
    expires_at: row.expires_at,
    state: L.pageState(row, now),
    free_hours: L.FREE_HOURS,
    now
  });
});
