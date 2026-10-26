/* Link Emocional — configuración pública (se puede ver en el navegador, es normal).
   La llave "anon" de Supabase es pública por diseño. NUNCA pongas aquí la llave service_role. */
window.LE_CONFIG = {
  SUPABASE_URL: "https://klcauyiyqoeqjolxgwon.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_n32d3IG2dbmS2CsRAcX3Pw_ZOOJ2vPE",

  WHATSAPP: "59178550176",              // sin + ni espacios
  TIKTOK: "linkemocional1",

  // Precios (puedes cambiarlos cuando quieras)
  PRECIO_PERMANENTE_USD: 1.99,          // hacer permanente una página
  PRECIO_ENLACE_USD: 0.99,              // enlace personalizado /s/tu-nombre
  USD_BOB: 10,                          // tipo de cambio para mostrar Bs

  QR_PAGO: "",                          // ej: "img/qr-pago.jpg" (tu QR bancario). Vacío = no se muestra
  PROMO_TIKTOK: true                    // muestra los descuentos por subir un video a TikTok
};
