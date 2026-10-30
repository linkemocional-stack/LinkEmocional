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
  PROMO_TIKTOK: true,                   // muestra los descuentos por subir un video a TikTok

  /* ====== PRECIOS (sección "Precios" de la portada) ======
     Todo se puede cambiar aquí sin tocar el diseño. Los diseños se acomodan solos
     en el nivel que les toca según su precio en templates.json. */
  ENLACE_COMBO_USD: 0.49,               // enlace con tu nombre cuando se compra junto con un diseño (normal: PRECIO_ENLACE_USD)
  PROMO_REFERIDOS: true,                // tarjeta "Invita a un amigo" (pon false para ocultarla)
  REFERIDOS_OFF: 15,                    // % de descuento para ambos
  PACKS_ACTIVOS: true,                  // calculadora de packs (pon false para ocultarla)
  PACKS: [                              // n = páginas, off = % de descuento
    { n: 2, off: 10, nombre: "Dúo" },
    { n: 3, off: 20, nombre: "Trío" },
    { n: 5, off: 30, nombre: "Cupido" }
  ],
  NIVELES: [                            // "max" = precio USD más alto que entra en ese nivel
    { id: "esencial", nombre: "Esencial", max: 1.49, min: 0.99, thumb: "arbol-amor" },
    { id: "clasico",  nombre: "Clásico",  max: 1.99, min: 1.99, thumb: "ventana-lluvia" },
    { id: "premium",  nombre: "Premium",  max: 2.99, min: 2.99, thumb: "rosa" },
    { id: "imperial", nombre: "Imperial", max: 99,   min: 3.49, thumb: "rosa-imperial" }
  ]
};
