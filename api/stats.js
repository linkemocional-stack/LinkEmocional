'use strict';
const L = require('./_lib');

/* GET /api/stats  (publico) -> cuantas paginas se han creado en total.
   Cuenta las filas de la tabla "paginas" sin traer su contenido. Se cachea 5 minutos. */
module.exports = L.wrap(async function (req, res) {
  const key = process.env.SUPABASE_SERVICE_KEY || '';
  const h = { apikey: key, Prefer: 'count=exact', Range: '0-0' };
  if (key.startsWith('eyJ')) h.Authorization = 'Bearer ' + key;
  const r = await fetch((process.env.SUPABASE_URL || '').replace(/\/+$/, '') + '/rest/v1/paginas?select=id', { method: 'HEAD', headers: h });
  if (!r.ok && r.status !== 206) throw new Error('count ' + r.status);
  const total = Number(String(r.headers.get('content-range') || '').split('/')[1]);
  if (!Number.isFinite(total)) throw new Error('count parse');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ pages: total }));
});
