'use strict';
const L = require('./_lib');

/* GET /api/quota  -> cuantas paginas gratis le quedan a quien consulta (con o sin sesion) */
module.exports = L.wrap(async function (req, res) {
  const user = await L.getUser(req);
  const qt = await L.quota(req, user);
  L.send(res, 200, Object.assign({ now: Date.now(), email: user ? user.email : null }, qt));
});
