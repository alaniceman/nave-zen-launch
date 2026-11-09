# Icefest Santiago en Nave Studio

## Resultado

Integrar **Icefest + Breath Act** en `/icefest-santiago`, con compra de entradas, correos, administración y acreditación dentro de Nave Studio. Reutilizar las fotos auténticas y el contenido de Icefest Ticketera, manteniendo la identidad y la cuenta de Mercado Pago de Nave Studio. No publicar todavía.

## Página y compra

- Mostrar la edición del **domingo 13 de diciembre de 2026**, de **10:15 a 17:30**, en **Parque Mahuida, La Reina**.
- Trasladar las secciones de Breath Act, recorrido del día, respiración, hielo, cacao, Ecstatic Dance, facilitadores, ubicación y preguntas frecuentes.
- Adaptar la presentación a Nave Studio, con fotos reales, botones grandes y precios/cupos legibles en móvil.
- Mostrar etapas de venta sucesivas: el código del origen anuncia **preventa de $67.000 para los primeros 12 cupos** y **valor normal de $95.000**. Confirmar la configuración efectiva y los cupos restantes mediante la exportación, sin asumir que siguen completos.
- Compra con tipo de entrada vigente, cantidad, nombre, apellido, email, teléfono y aceptación de condiciones. Precio y disponibilidad verificados antes de iniciar Mercado Pago.
- Páginas propias de pago pendiente, rechazado y confirmado. Mostrar entradas solo cuando el pago esté confirmado, no por los parámetros del enlace de retorno.
- Actualizar `/talleres-y-retiros` con este evento y retirar sus eventos ya pasados. Incluir metadatos y dirección principal bajo `studiolanave.com`.

## Administración

Agregar **Icefest Santiago** al admin existente con:

- **Evento:** fecha, horario, lugar, mapa, grupo de WhatsApp, instrucciones, cacao/almuerzo y apertura/cierre de venta.
- **Entradas:** crear y editar tipos, precio, orden de preventas, cupos reales, límite por compra, vigencia y activación.
- **Descuentos:** cupones y reglas por cantidad, con condiciones, fechas y límites comprobados al cobrar, aislados de las promociones existentes de Nave.
- **Ventas:** búsqueda por comprador, email, código y estado; resumen de entradas e ingresos; exportación CSV.
- **Gestión:** inscripción manual con monto cobrado, emisión de entradas, reenvío de correos y registro de incidencias de pago/envío.
- **Acreditación:** buscar y validar entradas una sola vez desde una sesión autorizada del admin, registrando fecha y responsable. No replicar accesos inseguros basados solamente en un PIN público.

## Entradas y correos

- Emitir un código único y enlace privado por entrada, multiplicados por cantidad, únicamente tras pago confirmado o inscripción manual autorizada.
- Enviar primero comprobante de compra y después entradas y preparación: fecha, horario, ubicación, qué llevar, mapa y WhatsApp del evento cuando esté configurado.
- Usar el remitente y Resend ya operativos en Nave Studio, versión HTML y texto, respetando el límite de envíos y evitando duplicados por reintentos.
- Recuperación por email: enviar los enlaces solamente al correo de compra guardado, con límites de solicitudes y sin revelar datos a terceros.
- Conservar las reglas de seguridad y evitar promesas de curación en el contenido.

## Importación de ventas anteriores

**Decisión confirmada: importar las ventas existentes.** Esta conversación puede leer el código del otro proyecto, pero no sus registros ni su configuración guardada.

En el chat de **Icefest Ticketera**, solicitar una exportación CSV de Santiago que incluya:

- Configuración del evento y tipos de entrada: identificadores, precios, cupos totales/vendidos, vigencias, estado, orden y límites.
- Pedidos: identificador original, comprador, email/teléfono, cantidades, importe, descuentos, estado y referencia de pago.
- Entradas: pedido original, código, número, token de acceso y estado/fecha de acreditación.
- Cupones y descuentos de Santiago que deban seguir vigentes.

Subir los archivos aquí para importarlos sin duplicar pedidos ni reenviar automáticamente compras antiguas. Preservar códigos y acreditaciones; generar enlaces de Nave Studio para las entradas importadas. Los enlaces del dominio anterior seguirán dependiendo de Icefest Ticketera hasta que se actualicen allí.

**Antes de abrir ventas:** conciliar cupos con la importación y cerrar la venta de Santiago en el proyecto anterior para evitar dos inventarios independientes. Mientras falte la exportación, dejar la página y administración preparadas, pero nuevas compras cerradas; no anunciar cupos inventados.

## Detalles técnicos

- Tablas y funciones específicas con prefijo `icefest_`, separadas de reservas, talleres, códigos de sesión y Cyber. Permisos explícitos y reglas de acceso usando los roles actuales de Nave; datos de compradores y tokens no públicos.
- Integrar Icefest como rama del webhook existente de Mercado Pago, verificando pago, moneda, importe y pedido mediante la API del proveedor. Mantener `external_reference` como UUID del pedido.
- Reservar/controlar inventario de forma atómica, con vencimiento de reservas pendientes, confirmación idempotente y tratamiento explícito de pagos tardíos o conflictos. No emitir entradas válidas si falta cupo.
- Reutilizar credenciales, seguimiento de conversiones y remitentes actuales; no copiar secretos ni configuración del proyecto origen.
- Registrar decisiones estructurales en `AGENTS.md` y pendientes en `roadmap.md`.

## Verificación y entrega

Comprobar permisos, precios, cantidades, inventario y emisión única con pruebas puntuales; revisar móvil y escritorio y el flujo administrativo autenticado. No realizar compras reales ni mandar correos a compradores para verificar sin autorización. Informar expresamente si la confirmación real de Mercado Pago queda sin comprobar.

Entregar las rutas y administración listas en vista previa, sin publicar. La importación y apertura efectiva de ventas quedarán pendientes únicamente si todavía no se han recibido los CSV y conciliado los cupos.