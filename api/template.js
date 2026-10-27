'use strict';
const L = require('./_lib');

/* GET /api/template?slug=...  -> HTML de la plantilla (para la vista previa del editor) */
module.exports = L.wrap(async function (req, res) {
  const slug = String((req.query || {}).slug || '');
  const tpl = L.templateBySlug(slug);
  const html = tpl ? L.loadTemplateHtml(slug) : null;
  if (!html) throw new L.HttpError(404, 'not_found', 'Diseño no encontrado.');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600');
  res.end(html);
});
