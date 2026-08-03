# Recordatorio semanal para compradores de paquetes

Un email automático cada domingo a las 18:00 (hora Chile) para quienes tienen sesiones sin usar, con una frase de poder distinta cada semana, los horarios de la semana y link directo a la agenda.

## A quién le llega

- Personas con al menos un código de paquete comprado, sin usar y no expirado.
- Un solo email por persona (agrupando todos sus códigos), mostrando cuántas sesiones le quedan y cuándo expiran.
- Dejan de recibirlo automáticamente cuando usan todas sus sesiones o cuando expiran.
- No se envía dos veces la misma semana, aunque el job se ejecute de nuevo.

## Contenido del email

- Asunto rotativo (ej. "Tu semana empieza en el agua fría", "Te quedan 3 sesiones esperándote").
- Frase de poder distinta cada semana, tomada de un banco de ~15 frases que rota según el número de semana del año, así nadie recibe la misma dos domingos seguidos.
- Recordatorio de sesiones restantes + fecha de expiración.
- Horarios de la semana: Criomedicina/Wim Hof y Yoga, agrupados por día, tomados directamente de /admin/horarios (siempre actualizados).
- Botón principal a https://studiolanave.com/agenda-nave-studio.
- Recordatorio de que los códigos se pueden compartir con quien quieran.
- Al pie: link para dejar de recibir estos recordatorios semanales.

Diseño consistente con los demás emails del sitio: Helvetica Neue, verde #2E4D3A.

## Opt-out

Link en el pie que marca la preferencia de la persona; a partir de ese momento queda excluida de este envío semanal (no afecta confirmaciones de reserva ni códigos de compra). Página de confirmación simple dentro del sitio.

## Panel admin

En la sección de emails del admin: vista previa del email de la semana (frase + horarios reales) y el listado de envíos de la última semana con estado, para poder revisar antes/después de cada domingo.

## Detalles técnicos

- Nueva Edge Function `send-weekly-package-reminder`: consulta `session_codes` paginado con `.range()`, agrupa por `buyer_email`, excluye opt-outs, arma horarios desde `schedule_entries` + `services` + `professionals` (`day_of_week` 0=domingo), y envía con Resend respetando el límite de 2 req/seg.
- Nuevas tablas: `weekly_reminder_logs` (email, semana ISO, estado, timestamp) para idempotencia, y `email_optouts` (email, tipo, token) para el opt-out; ambas con RLS + GRANTs, escritura solo vía service role.
- Edge Function pública `weekly-reminder-optout` para validar el token y registrar la baja.
- `pg_cron` + `pg_net`: job semanal los domingos a las 18:00 Chile (ajustado en UTC según DST) que invoca la función.
- Frases y asuntos en un módulo aparte para editarlos fácil después.
