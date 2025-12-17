import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token || typeof token !== 'string' || token.length < 10) {
      console.log('Invalid token provided:', token ? 'too short' : 'missing');
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching gift card data for token:', token.substring(0, 8) + '...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch session codes with matching token - using service role bypasses RLS
    const { data: codes, error: codesError } = await supabase
      .from('session_codes')
      .select('code, is_used, expires_at, package_id, applicable_service_ids, buyer_name')
      .eq('giftcard_access_token', token);

    if (codesError) {
      console.error('Error fetching codes:', codesError);
      throw codesError;
    }

    if (!codes || codes.length === 0) {
      console.log('No gift card found for token');
      return new Response(
        JSON.stringify({ error: 'Gift Card no encontrada o el link ha expirado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${codes.length} codes for gift card`);

    // Get package info
    const packageId = codes[0].package_id;
    let packageData = null;
    
    if (packageId) {
      const { data: pkg, error: packageError } = await supabase
        .from('session_packages')
        .select('name, sessions_quantity, validity_days')
        .eq('id', packageId)
        .single();

      if (packageError) {
        console.error('Package fetch error:', packageError);
      } else {
        packageData = pkg;
      }
    }

    // Get service names
    const serviceIds = codes[0].applicable_service_ids || [];
    let serviceNames: string[] = [];
    
    if (serviceIds.length > 0) {
      const { data: services } = await supabase
        .from('services')
        .select('name')
        .in('id', serviceIds);
      
      serviceNames = services?.map(s => s.name) || [];
    }

    const response = {
      codes: codes.map(c => ({
        code: c.code,
        is_used: c.is_used,
        expires_at: c.expires_at,
      })),
      packageName: packageData?.name || 'Paquete de Sesiones',
      buyerName: codes[0].buyer_name,
      sessionsQuantity: packageData?.sessions_quantity || codes.length,
      validityDays: packageData?.validity_days || 90,
      expiresAt: codes[0].expires_at,
      applicableServices: serviceNames,
    };

    console.log('Successfully returning gift card data');

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-giftcard-data:', error);
    return new Response(
      JSON.stringify({ error: 'Error al cargar la Gift Card' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
