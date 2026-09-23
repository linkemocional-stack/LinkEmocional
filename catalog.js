/* ===================== DATOS DE PRODUCTOS ===================== */
var WHATSAPP_NUMBER = "59178550176";
var WHATSAPP_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="flex-shrink:0"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.79 14.1c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.13.11-1.82-.12-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.3-.29.47-.15.17-.31.37-.44.5-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.21.72-.85.92-1.14.19-.29.38-.24.64-.14.26.1 1.66.79 1.94.93.29.14.47.22.55.34.07.12.07.7-.17 1.38z"/></svg>';
/* ===================== CONVERSION A BOLIVIANOS =====================
Tipo de cambio fijo usado en todo el sitio para mostrar el precio en
Bs junto al precio en dolares: 1 USD = 10 Bs. Si el tipo de cambio
cambia, solo hay que actualizar este numero. */
var USD_TO_BOB = 10;
function formatPrice(usd){
return '$ ' + usd.toFixed(2) + ' / Bs ' + Math.round(usd * USD_TO_BOB);
}
/* ===================== BOTONES DE PAGO (Takenos / Meru / QR) =====================
Se muestran en cada producto, en la tarjeta del catalogo y en la vista de detalle.
- Takenos y Meru: si el producto todavia no tiene su link cargado (pagoTakenos /
pagoMeru en null, arriba en PRODUCTS), el boton muestra un aviso "muy pronto".
En cuanto se pega el link real en el producto, el boton abre ese link directo.
- QR: pensado para clientes de Bolivia. Por ahora es solo el boton (sin imagen
todavia); mas adelante se le puede sumar un link o una imagen de QR igual que
Takenos/Meru. */
function paymentRowHtml(p, isFree){
if (isFree) return '';
var waMsg = encodeURIComponent('Hola! Quiero pedir el diseño "' + p.name + '" pero tengo otro medio de pago, ¿qué opciones tienen? 💗');
var waHref = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waMsg;
return '<div class="pago-row">' +
'<button type="button" class="btn-pago" data-pago="takenos" data-product-id="' + p.id + '">💳 Takenos</button>' +
'<button type="button" class="btn-pago" data-pago="meru" data-product-id="' + p.id + '">🪙 Meru</button>' +
'<button type="button" class="btn-pago" data-pago="qr" data-product-id="' + p.id + '" title="QR — pagos dentro de Bolivia">📱 QR Bolivia</button>' +
'</div>' +
'<a class="pago-more" href="' + waHref + '" target="_blank">¿Tenés otro medio de pago? Consultanos por WhatsApp 💬</a>';
}
function initPagoButtons(){
document.querySelectorAll('.btn-pago').forEach(function(btn){
btn.addEventListener('click', function(e){
e.stopPropagation();
var id = btn.getAttribute('data-product-id');
var metodo = btn.getAttribute('data-pago');
var product = PRODUCTS.filter(function(p){ return p.id === id; })[0];
if (!product) return;
if (metodo === 'takenos') {
if (product.pagoTakenos) { window.open(product.pagoTakenos, '_blank'); }
else { showToast('Muy pronto vas a poder pagar con Takenos aquí 💳 — mientras tanto, coordinalo por WhatsApp.', '💳'); }
} else if (metodo === 'meru') {
if (product.pagoMeru) { window.open(product.pagoMeru, '_blank'); }
else { showToast('Muy pronto vas a poder pagar con Meru aquí 🪙 — mientras tanto, coordinalo por WhatsApp.', '🪙'); }
} else if (metodo === 'qr') {
if (product.pagoQR) { window.open(product.pagoQR, '_blank'); }
else { showToast('Muy pronto vas a poder pagar por QR (Bolivia) aquí 📱 — mientras tanto, coordinalo por WhatsApp.', '📱'); }
}
});
});
}
var PRODUCTS = [
{
id: "rosa-cristal-pro",
pagoTakenos: null, // pega aca tu link de pago Takenos para "rosa-cristal-pro" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "rosa-cristal-pro" cuando lo tengas
name: "Rosa de Cristal PRO",
tag: "Amor",
dim: "3D",
desc: "Una rosa de partículas que abre sus pétalos dentro de una cúpula de cristal, en un jardín nocturno con luciérnagas, luna y estrellas fugaces.",
precioPersonalizado: 3.99,
precioNoPersonalizado: 2.99,
ordenPersonalizado: 0,
ordenNoPersonalizado: 0,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687281721162681621",
isPro: true,
features: ["Color principal editable","6 tipografías","Frases que orbitan ilimitadas","Fotos flotando (hasta 10)","Música de fondo opcional","Ráfaga y rastro al tocar (4 formas)","Figura que se transforma: capullo → rosa abierta","Cúpula de cristal","Luciérnagas ajustables","Pétalos flotando y estrellas fugaces"],
preview: "three-rosa-cristal-pro"
},
{
id: "mariposa-infinita-pro",
pagoTakenos: null, // pega aca tu link de pago Takenos para "mariposa-infinita-pro" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "mariposa-infinita-pro" cuando lo tengas
name: "Mariposa Infinita PRO",
tag: "Amor",
dim: "3D",
desc: "Una mariposa de partículas que aletea y se transforma en el símbolo del infinito, entre pétalos que suben, estrellas fugaces y una aurora de color.",
precioPersonalizado: 3.99,
precioNoPersonalizado: 2.99,
ordenPersonalizado: 0.1,
ordenNoPersonalizado: 0.1,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7688203058559356181?is_from_webapp=1&sender_device=pc&web_id=7680607510172780049",
isPro: true,
features: ["Color principal editable","6 tipografías","Frases que orbitan ilimitadas","Fotos flotando (hasta 10)","Música de fondo opcional","Ráfaga y rastro al tocar (4 formas)","Figura que se transforma: mariposa → infinito","Velocidad y fuerza del aleteo ajustables","Pétalos flotando y estrellas fugaces"],
preview: "three-mariposa-infinita-pro"
},
{
id: "flores-amarillas-pro",
pagoTakenos: null, // pega aca tu link de pago Takenos para "flores-amarillas-pro" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "flores-amarillas-pro" cuando lo tengas
name: "Flores Amarillas PRO",
tag: "Amor",
dim: "3D",
desc: "Una galaxia dorada donde un corazón de partículas se transforma en una flor y vuelve a corazón, con fotos y frases para el Día de las Flores Amarillas.",
precioPersonalizado: 3.99,
precioNoPersonalizado: 2.99,
ordenPersonalizado: 0.2,
ordenNoPersonalizado: 0.2,
videoUrl: null,
isPro: true,
features: ["Color principal editable","6 tipografías","Frases que orbitan ilimitadas","Fotos flotando (hasta 10)","Música de fondo opcional","Ráfaga y rastro al tocar (4 formas)","Galaxia dorada de fondo","Corazón de partículas que se transforma en flor"],
preview: "three-flores-amarillas-pro"
},
{
id: "corazon-galactico-pro",
pagoTakenos: null, // pega aca tu link de pago Takenos para "corazon-galactico-pro" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "corazon-galactico-pro" cuando lo tengas
name: "Corazón Galáctico PRO",
tag: "Amor",
dim: "3D",
desc: "Un corazón de partículas brillante flotando sobre una galaxia espiral de cuatro brazos, con fotos y frases orbitando alrededor.",
precioPersonalizado: 3.99,
precioNoPersonalizado: 2.99,
ordenPersonalizado: 0.3,
ordenNoPersonalizado: 0.3,
videoUrl: null,
isPro: true,
features: ["Color principal editable","6 tipografías","Frases que orbitan ilimitadas","Fotos flotando (hasta 10)","Música de fondo opcional","Ráfaga y rastro al tocar (4 formas)","Galaxia espiral de fondo","Corazón de partículas brillante"],
preview: "three-corazon-galactico-pro"
},
{
id: "girasol-eterno-pro",
pagoTakenos: null, // pega aca tu link de pago Takenos para "girasol-eterno-pro" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "girasol-eterno-pro" cuando lo tengas
name: "Girasol Eterno PRO",
tag: "Amistad",
dim: "3D",
desc: "Un girasol de partículas que se abre al atardecer y se transforma en corazón, entre polen dorado, luciérnagas y estrellas fugaces, con una corona de flores y tus frases y fotos orbitando.",
precioPersonalizado: 3.99,
precioNoPersonalizado: 2.99,
ordenPersonalizado: 0.05,
ordenNoPersonalizado: 0.05,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687275360957779221",
isPro: true,
features: ["Color principal editable","6 tipografías","Frases que orbitan ilimitadas","Fotos flotando (hasta 10)","Música de fondo opcional","Ráfaga y rastro al tocar (4 formas)","Figura que se transforma: girasol → corazón (9 figuras a elegir)","Corona de flores","Luciérnagas ajustables","Polen dorado y estrellas fugaces","Carta con mensaje personalizado"],
preview: "three-girasol-eterno-pro"
},
{
    id: "corazon-cristal-pro",
    name: "Corazón de Cristal PRO",
    tag: "Amor",
    dim: "3D",
    desc: "Una gema de corazón tallada envuelta en una cinta de luz en espiral, con gemas orbitando, confeti de cristal cayendo y una figura de partículas que pasa de flor a estrella, entre tus frases.",
    precioPersonalizado: 3.99,
    precioNoPersonalizado: 2.99,
    ordenPersonalizado: 0.45,
    ordenNoPersonalizado: 0.45,
    videoUrl: "https://www.tiktok.com/@linkemocional1/video/7688207773812657428?is_from_webapp=1&sender_device=pc&web_id=7680607510172780049",
    isPro: true,
    features: ["Color principal editable","6 tipografías","Frases que orbitan ilimitadas","Fotos flotando (hasta 10)","Música de fondo opcional","Ráfaga y rastro al tocar (4 formas)","Figura que se transforma: flor → estrella (9 figuras a elegir)","Gema de corazón tallada con cinta de luz","Gemas orbitando ajustables","Confeti de cristal y estrellas fugaces","Carta con mensaje personalizado"],
    preview: "three-corazon-cristal-pro"
},
{
id: "saturno",
pagoTakenos: null, // pega aca tu link de pago Takenos para "saturno" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "saturno" cuando lo tengas
name: "Saturno de Recuerdos",
tag: "Amor",
dim: "3D",
desc: "Un planeta 3D interactivo con mensajes, fotos y palabras orbitando alrededor.",
precioPersonalizado: 2.99,
precioNoPersonalizado: 1.99,
ordenPersonalizado: 4,
ordenNoPersonalizado: 12,
videoUrl: null,
features: ["Color y paleta","6 tipografías","Ráfagas: corazón o estrella","Frases centrales ilimitadas","Palabras orbitando","Hasta 6 fotos flotantes","Música de fondo opcional","Velocidad de frases ajustable"],
preview: "three-saturno"
},
{
id: "rosa",
pagoTakenos: null, // pega aca tu link de pago Takenos para "rosa" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "rosa" cuando lo tengas
name: "Rosa Eterna",
tag: "Amor",
dim: "3D",
desc: "Una rosa 3D que florece por completo, con frases y fotos flotando alrededor.",
precioPersonalizado: 2.99,
precioNoPersonalizado: 1.99,
ordenPersonalizado: 3,
ordenNoPersonalizado: 13,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687799323014319381?is_from_webapp=1&sender_device=pc&web_id=7680607510172780049",
features: ["Color y paleta","6 tipografías","Ráfagas: corazón o estrella","Frases centrales ilimitadas","Palabras orbitando","Hasta 6 fotos flotantes","Música de fondo opcional","Velocidad de frases ajustable"],
preview: "three-rosa"
},
{
id: "fenix",
pagoTakenos: null, // pega aca tu link de pago Takenos para "fenix" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "fenix" cuando lo tengas
name: "Fénix Renaciente",
tag: "Renacer",
dim: "3D",
desc: "Un Fénix de fuego que renace desde las cenizas, con tu mensaje en el pecho.",
precioPersonalizado: 2.99,
precioNoPersonalizado: 1.99,
ordenPersonalizado: 7,
ordenNoPersonalizado: 15,
videoUrl: null,
features: ["Color y paleta","6 tipografías","Ráfagas: corazón o estrella","Frases centrales ilimitadas","Palabras orbitando","Hasta 6 fotos flotantes","Música de fondo opcional","Velocidad de frases ajustable"],
preview: "three-fenix"
},
{
id: "caja",
pagoTakenos: null, // pega aca tu link de pago Takenos para "caja" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "caja" cuando lo tengas
name: "Caja Sorpresa",
tag: "Sorpresa",
dim: "3D",
desc: "Una caja de regalo que se abre y libera una nube de luz con tu mensaje adentro.",
precioPersonalizado: 2.99,
precioNoPersonalizado: 1.99,
ordenPersonalizado: 9,
ordenNoPersonalizado: 14,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687799323014319381?is_from_webapp=1&sender_device=pc&web_id=7680607510172780049",
features: ["Color y paleta","6 tipografías","Ráfagas: corazón o estrella","Frases centrales ilimitadas","Palabras orbitando","Hasta 6 fotos flotantes","Música de fondo opcional","Velocidad de frases ajustable"],
preview: "three-caja"
},
{
id: "flores",
pagoTakenos: null, // pega aca tu link de pago Takenos para "flores" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "flores" cuando lo tengas
name: "Flores Amarillas",
tag: "Amor",
dim: "2D",
desc: "Un jardín de girasoles que florece en forma de corazón, con tus frases y música de fondo.",
precioPersonalizado: 1.99,
precioNoPersonalizado: 1.00,
ordenPersonalizado: 15,
ordenNoPersonalizado: 10,
videoUrl: null,
features: ["Frases personalizadas ilimitadas","Música de fondo opcional"],
preview: "flores2d"
},
{
id: "corazon-particulas",
pagoTakenos: null, // pega aca tu link de pago Takenos para "corazon-particulas" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "corazon-particulas" cuando lo tengas
name: "Corazón de Partículas",
tag: "Amor",
dim: "3D",
desc: "Un corazón de partículas ci que se arma en el aire y brilla.",
precioPersonalizado: null,
precioNoPersonalizado: 0,
ordenPersonalizado: 99,
ordenNoPersonalizado: 2,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687122506234236168",
features: [],
highlights: ["Miles de partículas armando un corazón brillante en el aire, en 3D","Ideal para probar cómo se siente un regalo Link Emocional, sin gastar nada","Se ve igual de bien en cualquier celular, sin instalar nada"],
preview: "three-corazon"
},
{
id: "cumpleanos",
pagoTakenos: null, // pega aca tu link de pago Takenos para "cumpleanos" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "cumpleanos" cuando lo tengas
name: "Feliz Cumpleaños",
tag: "Cumpleaños",
dim: "2D",
desc: "Una torta con vela que se sopla al tocarla, entre confeti y un mensaje de cumpleaños.",
precioPersonalizado: null,
precioNoPersonalizado: 1.00,
ordenPersonalizado: 99,
ordenNoPersonalizado: 7,
videoUrl: null,
features: [],
highlights: ["Vela que se apaga de verdad al tocar la pantalla, con su humito","Lluvia de confeti de cumpleaños justo en ese momento","Mensaje de feliz cumpleaños ya integrado, para abrir y sorprender"],
preview: "cumple2d"
},
{
id: "dia-de-la-novia",
pagoTakenos: null, // pega aca tu link de pago Takenos para "dia-de-la-novia" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "dia-de-la-novia" cuando lo tengas
name: "Día de la Novia",
tag: "Amor",
dim: "2D",
desc: "Una galaxia de partículas rosa que revela un 'Te Amo' y termina en una tarjeta especial para tu novia.",
precioPersonalizado: null,
precioNoPersonalizado: 1.00,
ordenPersonalizado: 99,
ordenNoPersonalizado: 6,
videoUrl: null,
features: [],
highlights: ["Galaxia de partículas rosa que se abre revelando un 'Te Amo' gigante","Termina en una tarjeta especial pensada para el Día de la Novia","Pantalla romántica, lista para enviar ese mismo día"],
preview: "novia2d"
},
{
id: "buzon-cartas",
pagoTakenos: null, // pega aca tu link de pago Takenos para "buzon-cartas" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "buzon-cartas" cuando lo tengas
name: "Buzón de Cartas",
tag: "Amor",
dim: "2D",
desc: "Un buzón que se abre con la puerta girando en 3D y libera varios sobres para elegir y leer, con confeti al abrir cada uno.",
precioPersonalizado: 1.00,
precioNoPersonalizado: null,
ordenPersonalizado: 12,
ordenNoPersonalizado: 99,
videoUrl: null,
features: ["Título e instrucción editables","Entre 1 y 8 cartas","Etiqueta y mensaje por carta","Foto opcional por carta","Confeti al abrir cada carta"],
preview: "buzon2d"
},
{
id: "capsula-tiempo",
pagoTakenos: null, // pega aca tu link de pago Takenos para "capsula-tiempo" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "capsula-tiempo" cuando lo tengas
name: "Cápsula del Tiempo",
tag: "Amor",
dim: "2D",
desc: "Cartas selladas para abrir cuando quieras, o con candado hasta la fecha que elijas para cada una.",
precioPersonalizado: 1.00,
precioNoPersonalizado: null,
ordenPersonalizado: 14,
ordenNoPersonalizado: 99,
videoUrl: null,
features: ["Título e instrucción editables","Entre 1 y 8 cartas","Fecha de apertura opcional por carta","Foto opcional por carta","Confeti al abrir"],
preview: "capsula2d"
},
{
id: "regalo-caja-carrusel",
pagoTakenos: null, // pega aca tu link de pago Takenos para "regalo-caja-carrusel" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "regalo-caja-carrusel" cuando lo tengas
name: "Un Regalo Para Ti",
tag: "Sorpresa",
dim: "3D",
desc: "Una caja de regalo 3D que se abre con un estallido de corazones y pasa a un carrusel de fotos: cada una se voltea y revela un mensaje.",
precioPersonalizado: 1.00,
precioNoPersonalizado: null,
ordenPersonalizado: 8,
ordenNoPersonalizado: 99,
videoUrl: null,
features: ["Título y pistas editables","Entre 1 y 10 fotos","Mensaje al voltear cada foto","Animación de apertura con corazones"],
preview: "regalo2d"
},
{
id: "nuestra-historia",
pagoTakenos: null, // pega aca tu link de pago Takenos para "nuestra-historia" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "nuestra-historia" cuando lo tengas
name: "Nuestra Historia",
tag: "Amor",
dim: "2D",
desc: "Un libro interactivo: dedicatoria, línea del tiempo, galería de recuerdos, medidor de amor, ruleta de planes y un quiz de '¿cuánto me conoces?'.",
precioPersonalizado: 2.99,
precioNoPersonalizado: null,
ordenPersonalizado: 6,
ordenNoPersonalizado: 99,
videoUrl: null,
features: ["Portada y dedicatoria editables","Línea del tiempo (hasta 6 momentos)","Galería con mensajes ocultos","Ruleta de planes personalizable","Quiz de '¿cuánto me conoces?' con puntaje"],
preview: "libro2d"
},
{
id: "maquina-amor",
pagoTakenos: null, // pega aca tu link de pago Takenos para "maquina-amor" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "maquina-amor" cuando lo tengas
name: "Máquina de Amor",
tag: "Amor",
dim: "2D",
desc: "Una máquina expendedora con 9 casilleros: cada uno puede ser una frase, una foto o un 'rasca y descubre' sorpresa.",
precioPersonalizado: 1.00,
precioNoPersonalizado: null,
ordenPersonalizado: 10,
ordenNoPersonalizado: 99,
videoUrl: null,
features: ["Título e instrucción editables","9 casilleros personalizables","Cada casillero: frase, foto o rasca y descubre","Confeti al dispensar"],
preview: "maquina2d"
},
{
id: "anniversary-times",
pagoTakenos: null, // pega aca tu link de pago Takenos para "anniversary-times" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "anniversary-times" cuando lo tengas
name: "The Anniversary Times",
tag: "Aniversario",
dim: "2D",
desc: "Un periódico de una sola edición con titular, foto y cita destacada, sopa de letras, rasca y gana, encuesta y memorama del amor.",
precioPersonalizado: 2.99,
precioNoPersonalizado: null,
ordenPersonalizado: 2,
ordenNoPersonalizado: 99,
videoUrl: null,
features: ["Titular, foto y cita editables","Índice de amor con barras","Sopa de letras con tu palabra","Rasca y descubre","Galería de hasta 6 fotos","Encuesta y memorama personalizables"],
preview: "periodico2d"
},
{
id: "rama-floreciente",
pagoTakenos: null, // pega aca tu link de pago Takenos para "rama-floreciente" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "rama-floreciente" cuando lo tengas
name: "Rama Floreciente para Ti",
tag: "Amor",
dim: "3D",
desc: "Una ramita que crece de a poco y se llena de flores doradas, entre luciérnagas y estrellas fugaces de fondo.",
precioPersonalizado: null,
precioNoPersonalizado: 0,
ordenPersonalizado: 99,
ordenNoPersonalizado: 5,
videoUrl: null,
features: [],
highlights: ["La ramita crece y florece en tiempo real, frente a tus ojos, en 3D","Luciérnagas y estrellas fugaces de fondo, animación suave y tranquila","También es gratis — perfecta para un primer regalo sin gastar nada"],
preview: "three-rama"
},
{
id: "flores-amarillas-3d",
pagoTakenos: null, // pega aca tu link de pago Takenos para "flores-amarillas-3d" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "flores-amarillas-3d" cuando lo tengas
name: "Flores Amarillas 3D",
tag: "Amor",
dim: "3D",
desc: "Un sol de girasoles con anillo dorado tipo planeta, ramitos y palabras orbitando, con frases que van cambiando en el centro.",
precioPersonalizado: null,
precioNoPersonalizado: 1.50,
ordenPersonalizado: 99,
ordenNoPersonalizado: 3,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687153278211083541",
features: [],
highlights: ["Sol de girasoles con un anillo dorado tipo planeta girando alrededor","Ramitos y palabras orbitando, con frases que van cambiando solas en el centro","Pensada especial para el Día de las Flores Amarillas"],
preview: "three-flores-dorado"
},
{
id: "constelacion",
pagoTakenos: null, // pega aca tu link de pago Takenos para "constelacion" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "constelacion" cuando lo tengas
name: "Tu Constelación",
tag: "Amor",
dim: "3D",
desc: "Un cielo 3D donde cada estrella guarda un mensaje distinto: se van encendiendo una a una hasta formar tu constelación completa.",
precioPersonalizado: 1.99,
precioNoPersonalizado: 1.00,
ordenPersonalizado: 5,
ordenNoPersonalizado: 9,
videoUrl: null,
features: ["Título e instrucción editables","Color de las estrellas (paleta o personalizado)","3 formas de constelación: corazón, estrella o círculo","Mensajes editables (uno por estrella, hasta agregar los que quieras)","Mensaje final al completar la constelación"],
preview: "three-constelacion"
},
{
id: "galaxia-rosa-roja",
pagoTakenos: null, // pega aca tu link de pago Takenos para "galaxia-rosa-roja" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "galaxia-rosa-roja" cuando lo tengas
name: "Galaxia Espiral del Corazón",
tag: "Amor",
dim: "3D",
desc: "Una galaxia espiral que converge en un corazón de partículas, con rosas y ramos orbitando y ráfagas al tocar la pantalla.",
precioPersonalizado: 2.99,
precioNoPersonalizado: 1.99,
ordenPersonalizado: 1,
ordenNoPersonalizado: 11,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687861562094259476?is_from_webapp=1&sender_device=pc&web_id=7680607510172780049",
features: ["Color principal editable","Forma de las ráfagas: corazón o estrella","6 tipografías para el texto y las palabras","Texto de amor central editable","Palabras orbitando personalizables","Hasta 6 fotos flotando","Música de fondo opcional (mp3)"],
preview: "three-galaxia-rosa"
},
{
id: "cielo-farolillos",
pagoTakenos: null, // pega aca tu link de pago Takenos para "cielo-farolillos" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "cielo-farolillos" cuando lo tengas
name: "Un Cielo de Farolillos",
tag: "Amor",
dim: "2D",
desc: "Un atardecer con farolillos apagados esperando: cada uno guarda un deseo y se enciende y vuela al tocarlo.",
precioPersonalizado: 1.99,
precioNoPersonalizado: 1.00,
ordenPersonalizado: 11,
ordenNoPersonalizado: 4,
videoUrl: null,
features: ["Título e instrucción editables","Color de los farolillos","Deseos editables (uno por farolillo)","Mensaje final al soltarlos todos"],
preview: "farolillos2d"
},
{
id: "frasco-razones",
pagoTakenos: null, // pega aca tu link de pago Takenos para "frasco-razones" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "frasco-razones" cuando lo tengas
name: "Un Frasco de Razones",
tag: "Amor",
dim: "2D",
desc: "Un frasco de vidrio lleno de estrellitas: cada una guarda una razón distinta por la que la quieres, y brilla más al abrirlas todas.",
precioPersonalizado: 1.00,
precioNoPersonalizado: 1.00,
ordenPersonalizado: 13,
ordenNoPersonalizado: 8,
videoUrl: null,
features: ["Título e instrucción editables","Razones editables (una por estrella, hasta agregar las que quieras)","Mensaje final al abrir todas"],
preview: "frasco2d"
},
{
id: "quieres-salir-conmigo",
pagoTakenos: null, // pega aca tu link de pago Takenos para "quieres-salir-conmigo" cuando lo tengas
pagoMeru: null, // pega aca tu link de pago Meru para "quieres-salir-conmigo" cuando lo tengas
name: "¿Quieres Salir Conmigo?",
tag: "Sorpresa",
dim: "2D",
desc: "Un sobre que se abre y revela la gran pregunta: el botón 'NO' se escapa cada vez que lo tocas, hasta que solo queda el 'SÍ'.",
precioPersonalizado: null,
precioNoPersonalizado: 1.00,
ordenPersonalizado: 99,
ordenNoPersonalizado: 1,
videoUrl: "https://www.tiktok.com/@linkemocional1/video/7687292732821261589",
features: [],
highlights: ["El botón 'NO' se escapa cada vez que lo tocan — no hay forma de decir que no 😏","Sobre animado que se abre revelando la gran pregunta","Perfecta para pedir salir de una forma tierna y divertida"],
preview: "citas2d"
}
];
var catalogMode = "personalizado";
var subTab = "todos";
var gridObserver = null;
/* ===================== TOAST DE AVISO ===================== */
var toastTimer = null;
function showToast(message, icon){
var toast = document.getElementById('appToast');
var text = document.getElementById('appToastText');
var iconEl = toast.querySelector('.toast-icon');
text.textContent = message;
iconEl.textContent = icon || '🎬';
toast.classList.add('open');
if (toastTimer) clearTimeout(toastTimer);
toastTimer = setTimeout(function(){ toast.classList.remove('open'); }, 3600);
}
/* ===================== NAVEGACION ENTRE VISTAS ===================== */
function showView(name, mode){
document.getElementById('viewHome').style.display = (name === 'home') ? 'block' : 'none';
document.getElementById('viewCatalogo').style.display = (name === 'catalogo') ? 'block' : 'none';
window.scrollTo(0, 0);
if (name === 'catalogo') {
setCatalogMode(mode || 'personalizado');
}
}
function setCatalogMode(mode){
catalogMode = mode;
var tabs = document.getElementById('catTabs');
var note = document.getElementById('catNote');
if (mode === 'personalizado') {
tabs.style.display = 'none';
document.getElementById('catalogoTitulo').textContent = 'Con Editor';
document.getElementById('catalogoSubtitulo').textContent = 'Elegí un diseño, hazlo tuyo y pedilo por WhatsApp';
note.style.display = 'block';
note.textContent = 'Todos vienen con editor: puedes cambiar frases, fotos, colores y más.';
renderGrid();
} else {
tabs.style.display = 'flex';
document.getElementById('catalogoTitulo').textContent = 'Sin Editor';
document.getElementById('catalogoSubtitulo').textContent = 'Diseños ya armados y bonitos, algunos gratis';
setSubTab('todos');
}
}
function setSubTab(tab){
subTab = tab;
document.getElementById('tabTodos').classList.toggle('active', tab === 'todos');
document.getElementById('tabSinEditor').classList.toggle('active', tab === 'sinEditor');
document.getElementById('tabGratis').classList.toggle('active', tab === 'gratis');
var note = document.getElementById('catNote');
note.style.display = 'block';
if (tab === 'todos') {
note.textContent = 'Todos los diseños sin editor: gratis y con costo, listos tal como están.';
} else if (tab === 'sinEditor') {
note.textContent = 'Sin editor y a menor precio. Si un diseño te gusta pero quieres personalizarlo, mirá el botón celeste de su tarjeta.';
} else {
note.textContent = 'Gratis — escríbenos por WhatsApp para obtenerlo 💌';
}
renderGrid();
}
/* ===================== RENDER DEL GRID ===================== */
function thumbIdFor(p){
return 'thumb-' + p.id + '-' + catalogMode + (catalogMode === 'nopersonalizado' ? ('-' + subTab) : '');
}
function previewKindFor(p){
return (catalogMode !== 'personalizado' && p.previewAlt) ? p.previewAlt : p.preview;
}
function buildCardHtml(p, priceShown, isFree, rightBadge, thumbId){
var isThree = previewKindFor(p).indexOf('three-') === 0;
var thumbInner = isThree
? '<canvas id="' + thumbId + '"></canvas>'
: '<div class="thumb2d" id="' + thumbId + '"></div>';
var priceHtml = isFree ? 'Gratis 🎁' : formatPrice(priceShown);
var pedirLabel = isFree ? 'Escríbenos' : 'Pedir';
var waMsg = encodeURIComponent('Hola! Me interesa el diseño "' + p.name + '" 💗');
var waHref = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waMsg;
var noEditorHtml = '';
if (catalogMode === 'personalizado' && p.precioNoPersonalizado != null) {
noEditorHtml = '<div class="also-noeditor">🔓 Sin editor: ' + formatPrice(p.precioNoPersonalizado) + '</div>';
}
var introOverlayHtml = '';
if (p.id === 'flores-amarillas-3d') {
introOverlayHtml =
'<div class="mini-intro-overlay" id="introOverlay-' + thumbId + '">' +
'<div class="mini-intro-badge">&#10022; LOVE YOU &#10022;</div>' +
'<div class="mini-intro-title">🌼 FLORES AMARILLAS 🌼</div>' +
'<div class="mini-intro-sub">para ti</div>' +
'<svg class="mini-bouquet" viewBox="0 0 100 90" width="64" height="58">' +
'<use href="#flowerShape2d" x="34" y="4" width="22" height="22"></use>' +
'<use href="#flowerShape2d" x="14" y="24" width="18" height="18"></use>' +
'<use href="#flowerShape2d" x="58" y="24" width="18" height="18"></use>' +
'<use href="#flowerShape2d" x="24" y="42" width="16" height="16"></use>' +
'<use href="#flowerShape2d" x="52" y="42" width="16" height="16"></use>' +
'<use href="#flowerShape2d" x="38" y="34" width="15" height="15"></use>' +
'</svg>' +
'<button type="button" class="mini-intro-btn">Ver mi regalo &rarr;</button>' +
'</div>';
}
var proRibbonHtml = p.isPro ? '<span class="pro-ribbon">✨ PRO</span>' : '';
return {
thumbId: thumbId,
html:
'<div class="card-thumb" data-3d="' + isThree + '">' +
'<div class="thumb-badges-left">' +
'<span class="tag">' + p.tag + '</span>' +
'<span class="badge-3d" title="Animación ' + p.dim + ' interactiva">' + (p.dim === '2D' ? '🌼' : '🧊') + ' ' + p.dim + '</span>' +
'</div>' +
rightBadge +
thumbInner +
proRibbonHtml +
introOverlayHtml +
'</div>' +
'<div class="card-body">' +
'<h3>' + p.name + '</h3>' +
'<p>' + p.desc + '</p>' +
'<div class="price' + (isFree ? ' gratis' : '') + '">' + priceHtml + '</div>' +
noEditorHtml +
'<button type="button" class="btn btn-details" data-product-id="' + p.id + '">🎁 Ver qué incluye</button>' +
'<div class="card-actions">' +
'<button type="button" class="btn btn-video" data-product-id="' + p.id + '">Ver Video</button>' +
'<a class="btn whatsapp" href="' + waHref + '" target="_blank">' + WHATSAPP_SVG + pedirLabel + '</a>' +
'</div>' +
paymentRowHtml(p, isFree) +
'</div>'
};
}
function rightBadgeFor(p){
var proCls = p.isPro ? ' pro-badge' : '';
if (catalogMode === 'personalizado') {
return '<button type="button" class="editor-badge' + proCls + '" data-features="' + p.features.join(';') + '">✎ Con editor</button>';
} else if (p.precioPersonalizado) {
return '<button type="button" class="editor-badge also-badge' + proCls + '" data-features="' + p.features.join(';') + '" data-also-price="' + formatPrice(p.precioPersonalizado) + '">🎨 Hay editor</button>';
}
return '';
}
function appendGridSection(container, list){
if (!list.length) return;
var grid = document.createElement('div');
grid.className = 'grid';
list.forEach(function(p, i){
var isFree = catalogMode !== 'personalizado' && p.precioNoPersonalizado === 0;
var priceShown = (catalogMode === 'personalizado') ? p.precioPersonalizado : p.precioNoPersonalizado;
var card = document.createElement('div');
card.className = 'card';
var built = buildCardHtml(p, priceShown, isFree, rightBadgeFor(p), thumbIdFor(p));
card.innerHTML = built.html;
grid.appendChild(card);
});
container.appendChild(grid);
}
function shuffleArray(arr){
for (var i = arr.length - 1; i > 0; i--){
var j = Math.floor(Math.random() * (i + 1));
var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
}
return arr;
}
function renderGrid(){
var container = document.getElementById('grid');
container.innerHTML = '';
var list;
if (catalogMode === 'personalizado') {
list = PRODUCTS.filter(function(p){ return p.precioPersonalizado != null; });
list.sort(function(a,b){
var av = (a.ordenPersonalizado === undefined || a.ordenPersonalizado === null) ? 99 : a.ordenPersonalizado;
var bv = (b.ordenPersonalizado === undefined || b.ordenPersonalizado === null) ? 99 : b.ordenPersonalizado;
return av - bv;
});
} else {
var base = PRODUCTS.filter(function(p){ return p.precioNoPersonalizado != null; });
/* en "sin editor" no fijamos el orden: se mezcla cada vez que se abre
la vista, asi ningun producto (ni siquiera los PRO) se queda pegado
siempre arriba quitandole protagonismo al resto. */
shuffleArray(base);
if (subTab === 'sinEditor') {
list = base.filter(function(p){ return p.precioNoPersonalizado > 0; });
} else if (subTab === 'gratis') {
list = base.filter(function(p){ return p.precioNoPersonalizado === 0; });
} else {
list = base;
}
}
appendGridSection(container, list);
requestAnimationFrame(function(){
initTooltips();
initVideoButtons();
initDetailsButtons();
initPagoButtons();
if (gridObserver) { gridObserver.disconnect(); gridObserver = null; }
var supportsObserver = typeof IntersectionObserver === "function";
if (supportsObserver) {
gridObserver = new IntersectionObserver(function(entries){
entries.forEach(function(entry){
var el = entry.target;
var kind = el.getAttribute('data-preview-kind');
var isThree = kind && kind.indexOf('three-') === 0;
if (entry.isIntersecting) {
if (el.getAttribute('data-preview-active') !== '1') {
startPreview(kind, el.id);
el.setAttribute('data-preview-active', '1');
}
if (!isThree) {
/* las 2D son livianas (SVG, sin WebGL): arrancan una vez y listo */
gridObserver.unobserve(el);
}
} else if (isThree && el.getAttribute('data-preview-active') === '1') {
/* se fue de pantalla: apaga el contexto WebGL reemplazando el canvas por
uno nuevo y vacio, para liberar memoria en celulares. Al volver a
entrar en pantalla se vuelve a armar desde cero, mas abajo. */
var freshCanvas = document.createElement('canvas');
freshCanvas.id = el.id;
freshCanvas.setAttribute('data-preview-kind', kind);
if (el.parentNode) el.parentNode.replaceChild(freshCanvas, el);
gridObserver.unobserve(el);
gridObserver.observe(freshCanvas);
}
});
}, { root: null, rootMargin: '250px 0px', threshold: 0.01 });
}
list.forEach(function(p){
var tId = thumbIdFor(p);
var thumbEl = document.getElementById(tId);
if (thumbEl) {
if (supportsObserver) {
thumbEl.setAttribute('data-preview-kind', previewKindFor(p));
gridObserver.observe(thumbEl);
} else {
/* navegador muy viejo sin soporte: arranca todo de una, como antes */
startPreview(previewKindFor(p), tId);
}
}
if (p.id === 'flores-amarillas-3d') {
var overlayEl = document.getElementById('introOverlay-' + tId);
if (overlayEl) {
overlayEl.addEventListener('click', function(){
overlayEl.classList.add('hide');
});
setTimeout(function(){ overlayEl.classList.add('hide'); }, 3200);
}
}
});
});
}
/* ===================== MODAL "QUE INCLUYE" ===================== */
/* Arma el contenido del modal segun si, en la vista actual, el producto
tiene editor disponible o no. Reutiliza p.features (lo que se puede
personalizar) cuando hay editor; si no hay editor, usa una descripcion
generica basada en p.desc y p.dim, sin inventar personalizacion que no
existe. */
function detailsContentFor(p, isFree){
/* antes: "editorAqui" se activaba tambien cuando el producto tenia
version con editor en OTRO lado del catalogo, aunque se lo estuviera
viendo desde la seccion "sin editor" — por eso mostraba el contenido
de editor donde no correspondia. Ahora depende solo de la seccion en
la que el usuario esta parado ahora mismo. */
var editorAqui = (catalogMode === 'personalizado');
if (editorAqui && p.features && p.features.length) {
var nota = (p.precioNoPersonalizado != null)
? '🔓 ¿Preferís algo ya armado y más barato? También existe sin editor, tal como está, por ' + formatPrice(p.precioNoPersonalizado) + '.'
: null;
return {
intro: 'No es un video armado por otro: es TU regalo, con tu foto y tu frase, abriéndose frente a esa personita especial 💫',
heading: '✏️ Con el Editor Link Emocional lo hacés 100% tuyo',
items: p.features,
closing: 'Lo editás las veces que quieras hasta que quede perfecto. Recién cuando estés conforme, se genera tu HTML final — listo para enviar.',
note: nota
};
}
var itemsBase = (p.highlights && p.highlights.length) ? p.highlights.slice() : [
'Animación ' + p.dim + ' profesional, exactamente igual a la vista previa y al video — sin sorpresas',
'Mensaje y estilo ya armados por nosotros, pensados para emocionar'
];
itemsBase.push('Se guarda para siempre — lo puede reabrir todas las veces que quiera, como un recuerdo');
var notaSinEditor;
if (isFree) {
/* los productos gratis no se pagan: en vez de mostrar medios de pago
o la nota de upgrade, se explica como reclamarlo */
notaSinEditor = '🎁 Para tenerlo gratis: seguí todas nuestras redes sociales (TikTok, Instagram y Facebook) y mandanos la captura por WhatsApp al pedirlo.';
} else {
notaSinEditor = (p.precioPersonalizado != null)
? '🎨 ¿Querés personalizarlo? Existe la versión CON Editor Link Emocional por ' + formatPrice(p.precioPersonalizado) + ' — elegís colores, fotos y frases antes de enviarlo.'
: '💌 ¿Querés sumarle un nombre o una fecha especial? Escríbenos por WhatsApp al pedirlo y lo coordinamos.';
}
return {
intro: 'Esta versión ya viene hecha y lista tal cual la ves en la vista previa y el video — no tiene el Editor Link Emocional, no se personaliza.',
heading: '🎁 Así llega, listo para sorprender',
items: itemsBase,
closing: null,
note: notaSinEditor
};
}
/* ===================== VISTA DE DETALLE (pantalla completa, no popup) ===================== */
var detalleThumbId = 'detalleThumb';
var detalleActivePreviewKind = null;
/* libera el contexto WebGL de la preview 3D de la vista de detalle
al salir, igual que hace el observer del grid al perder de vista una tarjeta */
function teardownDetallePreview(){
if (detalleActivePreviewKind && detalleActivePreviewKind.indexOf('three-') === 0) {
var el = document.getElementById(detalleThumbId);
if (el && el.parentNode) {
var fresh = document.createElement('canvas');
fresh.id = detalleThumbId;
el.parentNode.replaceChild(fresh, el);
}
}
detalleActivePreviewKind = null;
}
function openDetailsView(p){
teardownDetallePreview();
var isFree = catalogMode !== 'personalizado' && p.precioNoPersonalizado === 0;
var c = detailsContentFor(p, isFree);
var priceShown = (catalogMode === 'personalizado') ? p.precioPersonalizado : p.precioNoPersonalizado;
document.getElementById('detalleTag').textContent = p.tag;
document.getElementById('detalleDim').textContent = (p.dim === '2D' ? '🌼 ' : '🧊 ') + p.dim;
document.getElementById('detalleTitulo').textContent = p.name;
document.getElementById('detallePrice').innerHTML = isFree ? 'Gratis 🎁' : formatPrice(priceShown);
document.getElementById('detallePrice').className = 'detalle-price' + (isFree ? ' gratis' : '');
document.getElementById('detalleDesc').textContent = p.desc;
document.getElementById('detalleIntro').textContent = c.intro;
document.getElementById('detalleHeading').textContent = c.heading;
var list = document.getElementById('detalleList');
list.innerHTML = '';
c.items.forEach(function(f){
var li = document.createElement('li');
li.textContent = f;
list.appendChild(li);
});
var closingEl = document.getElementById('detalleClosing');
if (c.closing) { closingEl.style.display = 'block'; closingEl.textContent = c.closing; }
else { closingEl.style.display = 'none'; }
var noteEl = document.getElementById('detalleNote');
if (c.note) { noteEl.style.display = 'block'; noteEl.textContent = c.note; }
else { noteEl.style.display = 'none'; }
var waMsg = encodeURIComponent('Hola! Me interesa el diseño "' + p.name + '" 💗');
var waHref = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waMsg;
var pedirLabel = isFree ? 'Escríbenos' : 'Pedir';
document.getElementById('detalleActions').innerHTML =
'<div class="detalle-actions-main">' +
'<button type="button" class="btn btn-video" data-product-id="' + p.id + '">Ver Video</button>' +
'<a class="btn whatsapp" href="' + waHref + '" target="_blank">' + WHATSAPP_SVG + pedirLabel + '</a>' +
'</div>' +
paymentRowHtml(p, isFree);
initVideoButtons();
initPagoButtons();
/* la vista tiene que estar visible ANTES de armar el preview 3D: si el
canvas se crea mientras el contenedor esta en display:none, Three.js lo
mide con ancho/alto 0 y queda todo negro */
document.getElementById('viewCatalogo').style.display = 'none';
document.getElementById('viewDetalle').style.display = 'block';
window.scrollTo(0, 0);
/* preview en vivo, la misma animacion que ya se usa en la tarjeta */
var kind = previewKindFor(p);
var isThree = kind.indexOf('three-') === 0;
var existing = document.getElementById(detalleThumbId);
if (existing) existing.remove();
var el = isThree ? document.createElement('canvas') : document.createElement('div');
el.id = detalleThumbId;
if (!isThree) el.className = 'thumb2d';
document.getElementById('detalleThumbWrap').appendChild(el);
startPreview(kind, detalleThumbId);
detalleActivePreviewKind = kind;
}
function closeDetailView(){
teardownDetallePreview();
document.getElementById('viewDetalle').style.display = 'none';
document.getElementById('viewCatalogo').style.display = 'block';
window.scrollTo(0, 0);
}
function initDetailsButtons(){
document.querySelectorAll('.btn-details').forEach(function(btn){
btn.addEventListener('click', function(e){
e.stopPropagation();
var id = btn.getAttribute('data-product-id');
var product = PRODUCTS.filter(function(p){ return p.id === id; })[0];
if (product) openDetailsView(product);
});
});
}
function initVideoButtons(){
document.querySelectorAll('.btn-video').forEach(function(btn){
btn.addEventListener('click', function(e){
e.stopPropagation();
var id = btn.getAttribute('data-product-id');
var product = PRODUCTS.filter(function(p){ return p.id === id; })[0];
if (product && product.videoUrl) {
window.open(product.videoUrl, '_blank');
} else {
showToast('Pronto se publicará el video en nuestras redes sociales 🎥', '🎬');
}
});
});
}
(function(){
var canvas = document.getElementById("stars");
var ctx = canvas.getContext("2d");
var stars = [];
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
function build(){
stars = [];
var count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
for (var i = 0; i < count; i++) {
var angle = Math.random()*Math.PI*2;
var speed = Math.random()*0.06 + 0.015;
stars.push({
x: Math.random()*canvas.width,
y: Math.random()*canvas.height,
r: Math.random()*1.4+0.3,
a: Math.random()*0.6+0.2,
s: Math.random()*0.015+0.005,
vx: Math.cos(angle)*speed,
vy: Math.sin(angle)*speed
});
}
}
function draw(){
ctx.clearRect(0, 0, canvas.width, canvas.height);
stars.forEach(function(st){
st.a += st.s;
st.x += st.vx;
st.y += st.vy;
if (st.x < -5) st.x = canvas.width + 5;
if (st.x > canvas.width + 5) st.x = -5;
if (st.y < -5) st.y = canvas.height + 5;
if (st.y > canvas.height + 5) st.y = -5;
var op = 0.35 + 0.35 * Math.sin(st.a);
ctx.beginPath();
ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
ctx.fillStyle = "rgba(180,255,240," + op + ")";
ctx.fill();
});
requestAnimationFrame(draw);
}
window.addEventListener("resize", function(){ resize(); build(); });
resize(); build(); draw();
})();
function initTooltips(){
var tooltip = document.getElementById("sharedTooltip");
if (!tooltip) {
tooltip = document.createElement("div");
tooltip.id = "sharedTooltip";
tooltip.innerHTML = '<span class="tooltip-title">Qué se puede personalizar</span><span class="tooltip-price" id="tooltipPrice" style="display:none;"></span><ul></ul>';
document.body.appendChild(tooltip);
}
var tooltipList = tooltip.querySelector("ul");
var tooltipPrice = tooltip.querySelector("#tooltipPrice");
var currentBadge = null;
function closeTooltip(){
tooltip.classList.remove("open");
currentBadge = null;
}
/* recalcula la posicion del tooltip respecto a su badge */
function positionTooltip(){
if (!currentBadge) return;
var rect = currentBadge.getBoundingClientRect();
var tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
var left = rect.right - tw;
left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
var top = rect.bottom + 8;
if (top + th > window.innerHeight - 8) top = Math.max(8, rect.top - th - 8);
tooltip.style.left = left + "px";
tooltip.style.top = top + "px";
}
function openTooltipFor(badge){
var featuresAttr = badge.getAttribute("data-features") || "";
var features = featuresAttr.split(";").map(function(s){ return s.trim(); }).filter(Boolean);
tooltipList.innerHTML = "";
features.forEach(function(f){
var li = document.createElement("li");
li.textContent = f;
tooltipList.appendChild(li);
});
var alsoPrice = badge.getAttribute("data-also-price");
if (alsoPrice) {
tooltipPrice.style.display = "block";
tooltipPrice.textContent = "Versión con editor: " + alsoPrice;
} else {
tooltipPrice.style.display = "none";
}
tooltip.scrollTop = 0;
currentBadge = badge;
positionTooltip();
tooltip.classList.add("open");
}
document.querySelectorAll(".editor-badge").forEach(function(badge){
badge.addEventListener("click", function(e){
e.stopPropagation();
if (currentBadge === badge && tooltip.classList.contains("open")) {
closeTooltip();
return;
}
openTooltipFor(badge);
});
});
tooltip.addEventListener("click", function(e){ e.stopPropagation(); });
/* initTooltips() corre de nuevo en cada render del grid, pero el tooltip es siempre
el mismo elemento. Guardamos las funciones actuales en el propio elemento y
registramos los listeners globales una sola vez, para que no se dupliquen ni
queden apuntando a una version vieja. */
tooltip._close = closeTooltip;
tooltip._reposition = positionTooltip;
tooltip._hasBadge = function(){ return !!currentBadge; };
tooltip._badgeRect = function(){ return currentBadge ? currentBadge.getBoundingClientRect() : null; };
if (!tooltip._globalsBound) {
tooltip._globalsBound = true;
document.addEventListener("click", function(){ tooltip._close(); });
window.addEventListener("scroll", function(e){
/* si el scroll ocurre dentro del propio tooltip no lo cerramos:
el usuario esta leyendo la lista */
if (e.target === tooltip || (e.target.nodeType === 1 && tooltip.contains(e.target))) return;
if (!tooltip._hasBadge()) return;
/* si el badge se fue de pantalla cerramos; si no, el tooltip lo sigue */
var r = tooltip._badgeRect();
if (!r || r.bottom < 0 || r.top > window.innerHeight) { tooltip._close(); return; }
tooltip._reposition();
}, true);
window.addEventListener("resize", function(){ tooltip._close(); });
}
}