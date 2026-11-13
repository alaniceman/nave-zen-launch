# Tabla de ventas y eliminación Icefest

# Rediseño aprobado del carrito Icefest
- [x] Compactar foto, fecha y lugar; mostrar abono, pago completo y precio normal con cupos reales. La subida se anuncia al agotar preventa; no hay fecha de inicio configurada para entrada general.
- [x] Reubicar cantidad debajo del descuento y simplificar contacto/resumen sin cambiar pagos.
- [x] Selección y cantidades comprobadas: dos abonos $50.000 hoy / $104.000 saldo; pago completo $154.000, datos conservados, precio normal bloqueado y móvil sin desbordamiento. Cinco pruebas existentes pasan; sin compras ni publicar.

# Cuotas en checkout Icefest
- [x] Destacar debajo del total 3 cuotas sin intereses, recalculadas por cantidad y descuento, aclarando tarjetas habilitadas y que las cuotas del abono no incluyen el saldo.
- [x] Cálculo verificado con 2 pruebas y checkout móvil: $77.000 → $25.667 aprox.; dos entradas → $51.333 aprox., sin desbordamiento ni compras; build OK, sin publicar.

# Piloto de reservas con abono Icefest
- [x] Agregar 20 reservas a $25.000, con precio completo congelado en $77.000 y saldo de $52.000 por persona.
- [x] Mostrar condiciones en entradas, checkout, confirmación, entrada privada, correos y administración; saldo manual por WhatsApp en la semana del evento o antes de ingresar en puerta.
- [x] Mantener checkout y emisión existentes, aislar descuentos y etapas, y exigir confirmación del saldo en acreditación.
- [x] Verificar cotización real, rechazo de cupones, permisos, cálculo y móvil/escritorio sin compras ni correos de prueba; funciones desplegadas, sitio sin publicar. Pago real, entrega de correo y registro de saldo de una reserva pagada pendientes de validación de Alan.

- [x] Reemplazar tarjetas por tabla con nombre, email, códigos, estado, evento, cantidad, total, fecha y acciones.
- [x] Agregar eliminación confirmada exclusiva de administradores, anulando entradas y liberando cupos sin reembolsar pagos.
- [x] Desplegar y verificar tabla autenticada, confirmación/cancelación y permisos sin eliminar ventas reales; cuatro pruebas de acceso pasan. La prueba previa de precio general falla por configuración de etapas, fuera de este cambio.

# Correo de entradas Icefest Santiago

- [x] Adaptar la información del correo adjunto: acreditación manual, preparación por actividad, datos de Santiago, almuerzo, mapa y WhatsApp.
- [x] Dejar solo la advertencia de salud indicada por Alan, en HTML y texto plano.
- [x] Desplegar los envíos actualizados sin reenviar entradas ni realizar compras de prueba.

# Vista previa de Icefest al compartir

- [x] Preparar foto grupal real en JPG liviano y sincronizar título/descripción de Icefest (1200 × 630, 229 KB; imagen pública confirmada).
- [x] Entregar encabezado estático propio de Icefest para lectores sin JavaScript, conservando la portada de Nave; respuesta local confirmada sin navegador ni compras.
- [x] Dejar listo sin publicar.
- [ ] Confirmar la respuesta del alojamiento y vista previa de WhatsApp después de que Alan publique.

# Cierre de promoción de talleres

- [x] Retirar promoción del banner del Home.
- [x] Mostrar ambas fechas y pack como agotados sin alterar ventas.
- [x] Actualizar listado de Talleres y Retiros.
- [x] Verificar vista previa sin publicar.

# Corrección checkout Cyber y aviso del carrito

- [x] Corregir creación de órdenes Cyber sin modificar productos históricos.
- [x] Mostrar X permanente y acortar el aviso del carrito a 1,8 segundos, lejos de los controles inferiores.
- [x] Desplegar corrección de creación de órdenes; sin compras de prueba ni publicación del sitio.

# Banner Cyber en el carrusel del Home

- [x] Slide "Cyber Nave Studio" con contador y enlace a /cyber-nave-studio.
- [x] Que se retire solo al vencer la oferta el 7 de octubre.
- [x] Verificar vista previa sin publicar.

# Franja roja del Cyber sobre el header

- [x] Banner rojo delgado arriba del header con enlace a /cyber-nave-studio.
- [x] Se retira solo al vencer la oferta el 7 de octubre; no aparece en admin ni en las páginas Cyber.
- [x] Header y menú móvil desplazados para que nada quede tapado; sin publicar.
- [x] Cupos reales Cyber (paquetes 20, 7 meses 5, 14 meses 5) + admin /admin/cyber-cupos

# Coincidencia de Horarios y Agenda

- [x] Comparar los horarios publicados con la disponibilidad para reservas.
- [x] Corregir diferencias y horarios futuros sin alterar reservas existentes.
- [x] Verificar los datos resultantes sin publicar el sitio.

# Direcciones principales para Google

- [x] Corregir declaraciones duplicadas, ausentes y con dominio incorrecto.
- [x] Unificar variantes de enlaces antiguos y de la agenda sin cambiar reservas.
- [x] Confirmar cambios guardados (build OK); Google confirma el dominio incorrecto en Criomedicina y la agenda indexada.
- [ ] Publicar tras revisión de Alan y validar el aviso en Search Console; falta la lista exacta de URLs del informe.

# Icefest Santiago dentro de Nave Studio

## Identidad independiente y compra cuidada
- [x] Recuperar identidad visual del Icefest original con fotos auténticas, navegación independiente y carrito por pasos.
- [x] Mejorar cargas, errores y recuperación del carrito sin alterar precios ni inventario.
- [x] Conservar Pixel de Nave y enlaces de preparación.
- [ ] Vender entrada + sesiones en un pago; faltan cantidad, precio y condiciones del paquete combinado.
- [x] Verificar móvil/escritorio y cotización sin crear compras; 9 pruebas pasan, resumen de 2 entradas confirma $190.000 y conserva datos al reabrir, sin errores. Listo en preview.

- [x] Replicar /icefest-santiago con fotos y contenido del proyecto Icefest Ticketera.
- [x] Integrar compra, confirmación de pago y emisión única de entradas en Nave Studio; funciones desplegadas, sin compra real ni envío de prueba.
- [x] Agregar administración de entradas, precios, cupos, ventas, correos y acreditación en /admin/icefest.
- [x] Importar ventas del CSV tickets-2026-11-10.csv: 10 compras pagadas, 14 entradas, $914.550; códigos originales y fechas conservados, sin correos ni doble descuento de los 14 cupos ya contabilizados. Verificado en admin autenticado y búsqueda por código. El CSV no incluye IDs originales de pedido/pago, teléfono ni tipo de entrada; Preventa 1 asignada según precios, limitaciones registradas en cada pedido.
- [x] Mantener la venta en Icefest Ticketera durante la migración, sin exigir su cierre ni bloquear Nave por duplicados entre proyectos.
- [x] Actualizar Talleres y Retiros y verificar móvil/escritorio, cálculo de precios y guardado del admin autenticado; 9 pruebas sin compras pasan.
- [ ] Activar preventa limitada y trasladar WhatsApp/almuerzo/configuración anterior; pendiente exportación del origen o valores confirmados por Alan. Entrada general activa a $95.000, preventa $67.000 preparada y desactivada.
- [ ] Publicar tras revisión de Alan; pago real, correo entregado y acreditación de entrada real no verificados sin autorización para crear una compra o recibir entradas importadas.

# Copy original de Icefest

- [x] Igualar textos editoriales, experiencias, facilitadores y preguntas a la página original sin modificar precios, cupos ni compras.
- [x] Mantener enlaces de compra y preparación en Nave, sin publicar.

# Carrito Icefest en un solo paso

- [x] Reunir entradas, contacto, descuento, total y pago en un formulario único.
- [x] Quitar la barra fija del carrito y usar campos de etiqueta flotante estilo Shopify.
- [x] Verificar campos, total, consentimiento y datos conservados al reabrir en móvil/escritorio; sin errores, sin crear compras ni publicar. Teclado físico de iPhone no verificado.
- [x] En escritorio el carrito es una tarjeta flotante de 460px centrada en alto, no ocupa la pantalla; móvil sigue a pantalla completa. Medido en 1280x1800 y 393x852; build OK.

# Títulos posteriores a la migración y comprobación de CAPI
- [x] Corregir títulos y descripciones de páginas públicas y secundarias de Icefest sin cambiar portada ni imágenes. Respuesta SSR verificada en 13 páginas; build OK.
- [x] Revisar recepción reciente de CAPI y sus límites de verificación, sin compras ni conversiones simuladas. Meta aceptó eventos recientes; compra Icefest y deduplicación en Events Manager no verificadas.

# Origen de ventas
- [x] Capturar primera y última visita durante 90 días, conservando Pixel; navegación y cookies verificadas.
- [x] Guardar atribución en Icefest, bonos y planes de prueba y preferencias de pago; servicios desplegados.
- [x] Mostrar origen en correo/admin/CSV Icefest; admin autenticado y CSV verificados sin alterar ventas.
- [x] Preparar envío a Notion con omisión segura y logs si falta Origen o se rechaza; lectura real confirma que el campo no existe.
- [ ] Activar atribución visible en Notion: Alan debe crear «Origen» de tipo texto en Clientes; no se modifica el esquema de Notion automáticamente.
- [x] Verificar almacenamiento y handlers con 8 pruebas locales y navegación sin pagos, órdenes ni correos reales; sitio no publicado.
- [ ] Alan valida compra real y entrega de correo tras publicar: https://studiolanave.com/icefest-santiago?utm_source=facebook&utm_medium=paid_social&utm_campaign=validacion_icefest&utm_content=video
