import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface SubscribeRequest {
  email: string;
  whatsapp: string;
  tags?: string[];
  groups?: string[];
  source?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, whatsapp, tags = [], groups = [], source = 'unknown' }: SubscribeRequest = await req.json()

    // Validate required fields
    if (!email || !whatsapp) {
      return new Response(
        JSON.stringify({ error: 'Email and WhatsApp are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Mailerlite API key from Supabase secrets
    const MAILERLITE_API_KEY = Deno.env.get('MAILERLITE_API_KEY')
    if (!MAILERLITE_API_KEY) {
      throw new Error('Mailerlite API key not configured')
    }

    // Subscribe to Mailerlite
    const mailerliteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        groups: groups,
        fields: {
          phone: whatsapp,
          source: source,
          subscribed_at: new Date().toISOString()
        },
        tags: tags,
        status: 'active'
      })
    })

    const mailerliteData = await mailerliteResponse.json()

    if (!mailerliteResponse.ok) {
      console.error('Mailerlite error:', mailerliteData)
      
      // Handle duplicate subscriber
      if (mailerliteData.message?.includes('already exists')) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Ya estás suscrito, revisa tu email',
            subscriber: mailerliteData 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      throw new Error(mailerliteData.message || 'Error subscribing to Mailerlite')
    }

    console.log('Successfully subscribed:', email, 'with tags:', tags)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed',
        subscriber: mailerliteData.data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Subscription error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})