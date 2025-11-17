// Allowed origins for CORS
const allowedOrigins = [
  'https://pyupvlgdtcxgqjungiof.supabase.co',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://bbb25e4c-159b-4989-9432-0c5a5bc36284.lovableproject.com',
];

export const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  };
};

// Legacy export for backwards compatibility
export const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigins[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};