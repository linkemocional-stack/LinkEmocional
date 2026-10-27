'use strict';
const L = require('./_lib');

/* GET /api/mine  (requiere sesion) -> lista de paginas de la cuenta */
module.exports = L.wrap(async function (req, res) {
  if (req.method !== 'GET') throw new L.HttpError(405, 'method', 'Método no permitido.');
  const user = await L.getUser(req);
  if (!user) throw new L.HttpError(401, 'auth', 'Iniciá sesión para ver tus páginas.');
  const rows = await L.db('GET', 'paginas?select=id,plantilla,slug,is_permanent,created_at,expires_at,titulo:config->>titulo' +
    '&owner=eq.' + user.id + '&order=created_at.desc&limit=100');
  const now = Date.now();
  L.send(res, 200, {
    now, free_hours: L.FREE_HOURS,
    pages: rows.map(r => {
      const tpl = L.templateBySlug(r.plantilla);
      return Object.assign({}, r, {
        template_name: tpl ? tpl.name : r.plantilla,
        emoji: tpl ? tpl.emoji : '🎁',
        price: tpl ? tpl.price : null,
        state: L.pageState(r, now)
      });
    })
  });
});
