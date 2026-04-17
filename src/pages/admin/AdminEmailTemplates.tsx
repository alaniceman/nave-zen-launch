import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Eye } from 'lucide-react';

const MAPS_LINK = "https://maps.app.goo.gl/RZmsnSLuxH8XkW2K6";
const NAVE_WHATSAPP = "https://wa.me/56946120426";

const SAMPLE = {
  name: "María González",
  email: "maria@ejemplo.com",
  phone: "+56912345678",
  classTitle: "Vinyasa Yoga",
  formattedDate: "Miércoles 12 de marzo de 2026",
  time: "19:00",
  professionalName: "Alan",
  serviceName: "Vinyasa Yoga",
  startTime: "19:00",
  endTime: "20:15",
};

const SAMPLE_WH = {
  ...SAMPLE,
  classTitle: "Método Wim Hof + Ice Bath",
  serviceName: "Método Wim Hof + Ice Bath",
  startTime: "10:00",
  endTime: "12:00",
  time: "10:00",
};

// ── Polished shared email styles ──
const EMAIL_STYLES = `
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;-webkit-font-smoothing:antialiased}
.wrap{max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:36px 28px;text-align:center}
.hdr h1{margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.3px}
.body{padding:32px 28px}
.greeting{font-size:17px;color:#1A1A1A;margin:0 0 6px;line-height:1.5}
.intro{font-size:15px;color:#4A4A4A;line-height:1.7;margin:0 0 24px}
.card{background:#F8FAFB;border-radius:12px;padding:22px 24px;margin:0 0 24px;border:1px solid #E8ECF0}
.card p{margin:0 0 10px;color:#2A2A2A;font-size:15px;line-height:1.6}
.card p:last-child{margin-bottom:0}
.card strong{color:#1A1A1A}
.info-box{padding:18px 22px;margin:0 0 20px;border-radius:10px}
.info-box p{margin:0;font-size:14px;line-height:1.7}
.info-box ul{color:#2A2A2A}
.directions{background:#FFFBF0;border-left:4px solid #E8A800}
.directions p{color:#5C4800}
.bring{background:#F0F7F2;border-left:4px solid #2E4D3A}
.bring p{color:#2E4D3A}
.ice-policy{background:#F7F9FB;border-radius:12px;padding:26px 24px;margin:0 0 24px;border:1px solid #E2E8F0}
.ice-title{margin:0 0 14px;color:#2E4D3A;font-size:17px;font-weight:700;line-height:1.4}
.ice-intro{margin:0 0 20px;color:#4A4A4A;font-size:14px;line-height:1.7}
.ice-heading{margin:0 0 8px;color:#2E4D3A;font-size:14px;font-weight:700;line-height:1.5}
.ice-text{margin:0 0 18px;color:#4A4A4A;font-size:14px;line-height:1.7}
.ice-text:last-child{margin-bottom:0}
.ice-note{margin:0 0 18px;color:#6B7280;font-size:13px;line-height:1.6;font-style:italic}
.cta-row{text-align:center;margin:28px 0}
.btn{display:inline-block;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;text-align:center;margin:6px 6px}
.btn-green{background:#2E4D3A;color:#ffffff!important}
.btn-outline{background:#ffffff;color:#2E4D3A!important;border:2px solid #2E4D3A}
.closing{font-size:15px;color:#4A4A4A;margin:28px 0 0;line-height:1.6}
.footer{padding:24px 28px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0;letter-spacing:0.2px}
`;

function isWimHof(serviceName: string): boolean {
  const lower = serviceName.toLowerCase();
  return lower.includes("wim hof") || lower.includes("ice bath") || lower.includes("baño de hielo") || lower.includes("criomedicin");
}

function buildIcePolicyBlock(): string {
  return `
    <div class="ice-policy">
      <p class="ice-title">🧊 Información importante sobre el uso del agua fría</p>
      <p class="ice-intro">En Nave Studio combinamos yoga con inmersión en agua fría. Para que la experiencia sea segura y fluida para todos, te pedimos tener en cuenta lo siguiente:</p>
      <p class="ice-heading">1. Clases de prueba de yoga</p>
      <p class="ice-text">Las clases de prueba <strong>no incluyen inmersión en hielo</strong> al final, independiente de si ya has hecho baños de hielo antes o no.</p>
      <p class="ice-note">Esto es parte del proceso para que primero conozcas el espacio, la práctica y cómo trabajamos.</p>
      <p class="ice-heading">2. Clases de yoga pagadas o con membresía</p>
      <p class="ice-text">Para poder terminar una clase de yoga en el agua fría debes haber realizado previamente una <strong>sesión guiada del Método Wim Hof con nosotros</strong>. Esto aplica aunque ya hayas hecho baños de hielo en otro lugar, ya que necesitamos asegurarnos de que conozcas nuestra forma de trabajar y que sea una experiencia segura para ti.</p>
      <p class="ice-heading">3. Tiempo máximo en el agua</p>
      <p class="ice-text">Después de yoga, el tiempo máximo de inmersión es de <strong>2 minutos</strong>. Esto es estricto. En sesiones completas del Método Wim Hof es posible permanecer más tiempo, siempre siguiendo las instrucciones del instructor.</p>
      <p class="ice-heading">4. Respeto por el tiempo de la clase</p>
      <p class="ice-text">Las clases de yoga duran 1 hora completa. Por eso, cuando termina la práctica y entras al agua fría, la dinámica es entrar y salir, para respetar el tiempo de la instructora y el flujo de la clase.</p>
    </div>`;
}

function buildWhatToBringSection(serviceName: string): string {
  if (isWimHof(serviceName)) {
    return `
      <div class="info-box bring">
        <p><strong>🎒 Qué llevar:</strong></p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.8">
          <li>Traje de baño (ojalá ya puesto)</li>
          <li>Toalla</li>
          <li>Bolsa para ropa mojada</li>
          <li>¡Actitud!</li>
        </ul>
      </div>
      <div class="info-box" style="background:#F8FAFB;border-left:4px solid #2E4D3A">
        <p style="color:#2E4D3A"><strong>🎬 Videos sugeridos para prepararte:</strong></p>
        <p style="margin:8px 0 4px;color:#4A4A4A">1. <a href="https://youtu.be/6QfD1UY1weM" style="color:#2E4D3A;font-weight:600">Cómo hacer la respiración Wim Hof en detalle</a></p>
        <p style="margin:0;color:#4A4A4A">2. <a href="https://youtu.be/OUCe2VjHyzg" style="color:#2E4D3A;font-weight:600">Respiración Wim Hof guiada</a></p>
      </div>
      <div class="info-box directions">
        <p><strong>Importante:</strong> Llega puntual y en ayunas ligeras para aprovechar al máximo tu experiencia.</p>
      </div>`;
  }

  return `
    <div class="info-box bring">
      <p><strong>🎒 Qué llevar:</strong></p>
      <p style="margin-top:6px"><strong>Yoga:</strong> ropa cómoda. Los implementos están acá (mats y todo).</p>
    </div>
    ${buildIcePolicyBlock()}`;
}

function buildWhatToBringSectionTrial(): string {
  return `
    <div class="info-box bring">
      <p><strong>🎒 Qué llevar:</strong></p>
      <p style="margin-top:6px"><strong>Yoga:</strong> ropa cómoda. Los implementos están acá (mats y todo).</p>
    </div>
    ${buildIcePolicyBlock()}`;
}

// ── Templates ──

function trialConfirmation(s: typeof SAMPLE): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${EMAIL_STYLES}</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">Tu clase de prueba en Nave Studio quedó agendada ✓</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${s.name}</strong>!</p>
    <p class="intro">Listo, tu clase de prueba quedó agendada:</p>
    <div class="card">
      <p><strong>Clase:</strong> ${s.classTitle}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${s.formattedDate}</span></p>
      <p><strong>Hora:</strong> ${s.time} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="info-box directions">
      <p><strong>🗺️ Cómo llegar (importante):</strong></p>
      <p style="margin-top:8px">Es el portón negro a mano derecha de donde sale la numeración. Van a ver un pequeño platillo volador. El portón se corre manual y luego subes al segundo piso.</p>
    </div>
    ${buildWhatToBringSectionTrial()}
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">Si necesitas ayuda o vienes con cualquier duda, escríbenos por WhatsApp:</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">Nos vemos pronto!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

function trialReminder3d(s: typeof SAMPLE): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${EMAIL_STYLES}</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">Te escribo para recordarte que en 3 días es tu clase de prueba.</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${s.name}</strong>!</p>
    <p class="intro">Te escribo para recordarte que en 3 días es tu clase de prueba en Nave Studio:</p>
    <div class="card">
      <p><strong>Clase:</strong> ${s.classTitle}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${s.formattedDate}</span></p>
      <p><strong>Hora:</strong> ${s.time} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="info-box directions">
      <p><strong>🗺️ Cómo llegar:</strong><br>Portón negro a la derecha de la numeración. Verás un pequeño platillo volador. Se corre manual y subes al segundo piso.</p>
    </div>
    ${buildWhatToBringSectionTrial()}
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">Si necesitas mover tu hora o tienes alguna pregunta, escríbenos por WhatsApp:</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">Nos vemos pronto!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

function trialReminder1d(s: typeof SAMPLE): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${EMAIL_STYLES}</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">Mañana es tu clase de prueba en Nave Studio.</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${s.name}</strong>!</p>
    <p class="intro">Mañana es tu clase de prueba:</p>
    <div class="card">
      <p><strong>Clase:</strong> ${s.classTitle}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${s.formattedDate}</span></p>
      <p><strong>Hora:</strong> ${s.time} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="info-box directions">
      <p><strong>🗺️ Cómo llegar:</strong><br>Portón negro a la derecha de la numeración (hay un pequeño platillo volador). Se corre manual y subes al segundo piso.</p>
    </div>
    ${buildWhatToBringSectionTrial()}
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">Cualquier cosa, WhatsApp directo:</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">Nos vemos mañana!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

function trialReminder3h(s: typeof SAMPLE): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${EMAIL_STYLES}</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">Recordatorio rápido: hoy tienes tu clase de prueba.</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${s.name}</strong>!</p>
    <p class="intro">Recordatorio rápido: hoy a las <strong>${s.time}</strong> tienes tu clase de prueba <strong>${s.classTitle}</strong>.</p>
    <div class="card">
      <p><strong>Clase:</strong> ${s.classTitle}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${s.formattedDate}</span></p>
      <p><strong>Hora:</strong> ${s.time} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="info-box" style="background:#F0F7F2;border-left:4px solid #2E4D3A">
      <p style="color:#2E4D3A"><strong>Tip para llegar en 10 segundos:</strong><br>Portón negro a la derecha de la numeración (verás un pequeño platillo volador). Se corre manual y subes al segundo piso.</p>
    </div>
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">Si vas atrasado/a o necesitas ayuda, WhatsApp directo:</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">Nos vemos pronto!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

function bookingConfirmation(s: typeof SAMPLE): string {
  const whatToBring = buildWhatToBringSection(s.serviceName);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${EMAIL_STYLES}</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">Tu reserva en Nave Studio quedó confirmada ✓</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${s.name}</strong>!</p>
    <p class="intro">Tu sesión quedó confirmada:</p>
    <div class="card">
      <p><strong>Sesión:</strong> ${s.serviceName}</p>
      <p><strong>Instructor:</strong> ${s.professionalName}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${s.formattedDate}</span></p>
      <p><strong>Horario:</strong> ${s.startTime} - ${s.endTime} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="info-box directions">
      <p><strong>🗺️ Cómo llegar:</strong></p>
      <p style="margin-top:8px">Portón negro a la derecha de la numeración. Verás un pequeño platillo volador. Se corre manual y subes al segundo piso.</p>
    </div>
    ${whatToBring}
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">Si necesitas mover tu hora o tienes alguna pregunta, escríbenos por WhatsApp:</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">Nos vemos!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

function bookingReminder(s: typeof SAMPLE): string {
  const whatToBring = buildWhatToBringSection(s.serviceName);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${EMAIL_STYLES}</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">Mañana tienes tu sesión en Nave Studio — recordatorio rápido</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${s.name}</strong>!</p>
    <p class="intro">Te recordamos que mañana tienes tu sesión agendada:</p>
    <div class="card">
      <p><strong>Sesión:</strong> ${s.serviceName}</p>
      <p><strong>Instructor:</strong> ${s.professionalName}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${s.formattedDate}</span></p>
      <p><strong>Horario:</strong> ${s.startTime} - ${s.endTime} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="info-box directions">
      <p><strong>🗺️ Cómo llegar:</strong></p>
      <p style="margin-top:8px">Portón negro a la derecha de la numeración. Verás un pequeño platillo volador. Se corre manual y subes al segundo piso.</p>
    </div>
    ${whatToBring}
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">Si necesitas mover tu hora o tienes alguna pregunta, escríbenos por WhatsApp:</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">Nos vemos mañana!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

// ── Template definitions ──
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'trial' | 'booking';
  description: string;
  buildHtml: (variant: 'yoga' | 'wimhof') => string;
}

const templates: EmailTemplate[] = [
  {
    id: 'trial-confirmation',
    name: 'Confirmación de Clase de Prueba',
    subject: 'Confirmación — tu clase de prueba en Nave Studio',
    category: 'trial',
    description: 'Se envía inmediatamente al agendar una clase de prueba.',
    buildHtml: () => trialConfirmation(SAMPLE),
  },
  {
    id: 'trial-reminder-3d',
    name: 'Recordatorio 3 Días Antes (Prueba)',
    subject: 'En 3 días es tu clase de prueba — deja todo listo',
    category: 'trial',
    description: 'Se envía automáticamente 3 días antes de la clase de prueba.',
    buildHtml: () => trialReminder3d(SAMPLE),
  },
  {
    id: 'trial-reminder-1d',
    name: 'Recordatorio 1 Día Antes (Prueba)',
    subject: 'Mañana es tu clase de prueba — recordatorio rápido',
    category: 'trial',
    description: 'Se envía automáticamente 1 día antes de la clase de prueba.',
    buildHtml: () => trialReminder1d(SAMPLE),
  },
  {
    id: 'trial-reminder-3h',
    name: 'Recordatorio 3 Horas Antes (Prueba)',
    subject: `Hoy ${SAMPLE.time} — tu clase de prueba (dirección rápida)`,
    category: 'trial',
    description: 'Se envía automáticamente 3 horas antes de la clase de prueba.',
    buildHtml: () => trialReminder3h(SAMPLE),
  },
  {
    id: 'booking-confirmation-yoga',
    name: 'Confirmación de Reserva',
    subject: 'Confirmación — tu reserva en Nave Studio',
    category: 'booking',
    description: 'Se envía al confirmar el pago de una sesión.',
    buildHtml: (v) => bookingConfirmation(v === 'wimhof' ? SAMPLE_WH : SAMPLE),
  },
  {
    id: 'booking-reminder',
    name: 'Recordatorio 24h Antes',
    subject: 'Mañana es tu sesión — recordatorio',
    category: 'booking',
    description: 'Se envía automáticamente 24 horas antes de la sesión pagada.',
    buildHtml: (v) => bookingReminder(v === 'wimhof' ? SAMPLE_WH : SAMPLE),
  },
];

function EmailPreview({ html }: { html: string }) {
  return (
    <iframe
      srcDoc={html}
      className="w-full border rounded-lg bg-white"
      style={{ height: 820 }}
      sandbox="allow-same-origin"
      title="Email preview"
    />
  );
}

export default function AdminEmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [variant, setVariant] = useState<'yoga' | 'wimhof'>('yoga');

  const trialTemplates = templates.filter(t => t.category === 'trial');
  const bookingTemplates = templates.filter(t => t.category === 'booking');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plantillas de Email</h1>
          <p className="text-sm text-muted-foreground">Vista previa de todos los correos automáticos del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="trial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trial">Clases de Prueba ({trialTemplates.length})</TabsTrigger>
          <TabsTrigger value="booking">Sesiones Pagadas ({bookingTemplates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="trial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              {trialTemplates.map(t => (
                <Card
                  key={t.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate.id === t.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTemplate(t)}
                >
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="md:col-span-3">
              {selectedTemplate.category === 'trial' && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          {selectedTemplate.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Asunto:</strong> {selectedTemplate.subject}
                        </p>
                      </div>
                      <Badge variant="secondary">Clase de Prueba</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EmailPreview html={selectedTemplate.buildHtml('yoga')} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              {bookingTemplates.map(t => (
                <Card
                  key={t.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate.id === t.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTemplate(t)}
                >
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                  </CardContent>
                </Card>
              ))}
              <div className="pt-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Variante</label>
                <Select value={variant} onValueChange={(v: 'yoga' | 'wimhof') => setVariant(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yoga">🧘 Yoga</SelectItem>
                    <SelectItem value="wimhof">🧊 Wim Hof / Ice Bath</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="md:col-span-3">
              {selectedTemplate.category === 'booking' && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          {selectedTemplate.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Asunto:</strong> {selectedTemplate.subject}
                        </p>
                      </div>
                      <Badge variant="outline">{variant === 'wimhof' ? '🧊 Wim Hof' : '🧘 Yoga'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EmailPreview html={selectedTemplate.buildHtml(variant)} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
