import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type TrialBooking = {
  id: string;
  class_title: string;
  class_day: string;
  class_time: string;
  scheduled_date: string;
  status: string;
};

type CustomerEvent = {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string;
};

export default function UserDashboard() {
  const { user, profile, customer, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trialBookings, setTrialBookings] = useState<TrialBooking[]>([]);
  const [events, setEvents] = useState<CustomerEvent[]>([]);

  useEffect(() => {
    document.title = 'Mi cuenta | Nave Studio';
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      setLoading(true);
      await refreshProfile();

      const [trialResponse, eventsResponse] = await Promise.all([
        supabase
          .from('trial_bookings')
          .select('id, class_title, class_day, class_time, scheduled_date, status')
          .order('scheduled_date', { ascending: false }),
        supabase
          .from('customer_events')
          .select('id, title, description, event_type, event_date')
          .order('event_date', { ascending: false })
          .limit(20),
      ]);

      if (!trialResponse.error) {
        setTrialBookings((trialResponse.data ?? []) as TrialBooking[]);
      }

      if (!eventsResponse.error) {
        setEvents((eventsResponse.data ?? []) as CustomerEvent[]);
      }

      setLoading(false);
    };

    void loadDashboard();
  }, [user, refreshProfile]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Mi cuenta</h1>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Tus datos personales asociados a la cuenta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-foreground">
            <p><span className="font-medium">Nombre:</span> {profile?.full_name ?? 'No definido'}</p>
            <p><span className="font-medium">Email:</span> {user?.email ?? 'No definido'}</p>
            <p><span className="font-medium">Teléfono:</span> {profile?.phone ?? customer?.phone ?? 'No definido'}</p>
            <p><span className="font-medium">Estado CRM:</span> {customer?.status ?? 'Sin estado'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clases de prueba</CardTitle>
            <CardDescription>Historial vinculado automáticamente por correo.</CardDescription>
          </CardHeader>
          <CardContent>
            {trialBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no tienes clases de prueba registradas.</p>
            ) : (
              <ul className="space-y-3">
                {trialBookings.map((booking) => (
                  <li key={booking.id} className="rounded-md border border-border p-3">
                    <p className="font-medium text-foreground">{booking.class_title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.scheduled_date), "EEEE d 'de' MMMM, yyyy", { locale: es })} · {booking.class_time}
                    </p>
                    <p className="text-xs text-muted-foreground">Estado: {booking.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Timeline de actividad</CardTitle>
            <CardDescription>Eventos de tu historial como cliente.</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay eventos disponibles.</p>
            ) : (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={event.id} className="rounded-md border border-border p-3">
                    <p className="font-medium text-foreground">{event.title}</p>
                    {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.event_date), "dd/MM/yyyy HH:mm", { locale: es })} · {event.event_type}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
