import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Handle GET - List bookings with filters
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const status = url.searchParams.get('status');
      const professionalId = url.searchParams.get('professionalId');
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      const search = url.searchParams.get('search');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('bookings')
        .select(`
          *,
          professionals!inner(name, email),
          services!inner(name, price_clp),
          discount_coupons(code, discount_type, discount_value)
        `, { count: 'exact' })
        .order('date_time_start', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (professionalId) {
        query = query.eq('professional_id', professionalId);
      }

      if (startDate) {
        query = query.gte('date_time_start', startDate);
      }

      if (endDate) {
        query = query.lte('date_time_start', endDate);
      }

      if (search) {
        query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: bookings, error: bookingsError, count } = await query;

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return new Response(
          JSON.stringify({ error: bookingsError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ 
          bookings, 
          count,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle PATCH - Update booking status
    if (req.method === 'PATCH' || req.method === 'POST') {
      const { id, status: newStatus } = await req.json();

      if (!id || !newStatus) {
        return new Response(
          JSON.stringify({ error: 'Missing id or status' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      // Si el status cambió a CONFIRMED, enviar email de confirmación automáticamente
      if (newStatus === 'CONFIRMED') {
        console.log('Triggering confirmation email for booking:', id);
        try {
          const emailResponse = await supabase.functions.invoke('send-booking-confirmation', {
            body: { bookingId: id },
          });
          
          if (emailResponse.error) {
            console.error('Error sending confirmation email:', emailResponse.error);
          } else {
            console.log('Confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Failed to invoke send-booking-confirmation:', emailError);
        }
      }

      return new Response(
        JSON.stringify({ booking: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  } catch (error) {
    console.error('Error in admin-bookings:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
