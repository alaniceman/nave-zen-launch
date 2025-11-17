import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { getCorsHeaders } from '../_shared/cors.ts'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

// Validation schema for subscriber data
const subscribeSchema = z.object({
  email: z.string().trim().email('Invalid email format').max(255, 'Email too long'),
  whatsapp: z.string().trim().regex(/^\+?[0-9]{8,15}$/, 'Invalid phone number format').max(20, 'Phone number too long'),
  tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').optional().default([]),
  groups: z.array(z.string().max(100, 'Group name too long')).max(5, 'Too many groups').optional().default([]),
  source: z.string().max(100, 'Source identifier too long').optional().default('unknown')
})

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()

    // Validate input data
    let validatedData
    try {
      validatedData = subscribeSchema.parse(requestData)
    } catch (validationError) {
      console.error('Validation error:', { errorType: 'validation_failed' })
      return new Response(
        JSON.stringify({ error: 'Invalid input data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { email, whatsapp, tags, groups, source } = validatedData

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Save to local database first
    const { data: dbData, error: dbError } = await supabaseClient
      .from('email_subscribers')
      .insert({
        email,
        whatsapp,
        source,
        tags,
        groups,
        mailerlite_synced: false
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', { errorType: dbError.code })
      // Continue with MailerLite even if DB insert fails
    } else {
      console.log('Saved to database:', dbData.id)
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

    // Update DB record with MailerLite sync status
    if (mailerliteResponse.ok && dbData) {
      await supabaseClient
        .from('email_subscribers')
        .update({
          mailerlite_synced: true,
          mailerlite_response: mailerliteData.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', dbData.id)
    }

    if (!mailerliteResponse.ok) {
      console.error('Mailerlite error:', { 
        status: mailerliteResponse.status,
        hasMessage: !!mailerliteData.message 
      })
      
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

    console.log('Successfully subscribed:', dbData?.id, 'tag count:', tags.length)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed',
        subscriber: mailerliteData.data,
        db_id: dbData?.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Subscription error:', { errorType: error.name })
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})