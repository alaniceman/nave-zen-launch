CREATE OR REPLACE FUNCTION public.execute_readonly_query(query_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
  upper_query text;
BEGIN
  upper_query := upper(trim(query_text));
  
  -- Only allow SELECT and WITH statements
  IF NOT (upper_query LIKE 'SELECT%' OR upper_query LIKE 'WITH%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;
  
  -- Block dangerous operations
  IF upper_query ~ '\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXECUTE)\b' THEN
    RAISE EXCEPTION 'Mutation operations are not allowed';
  END IF;
  
  -- Block system schemas
  IF upper_query ~ '(AUTH\.|STORAGE\.|REALTIME\.|SUPABASE_FUNCTIONS\.|VAULT\.|PG_CATALOG\.|INFORMATION_SCHEMA\.)' THEN
    RAISE EXCEPTION 'Access to system schemas is not allowed';
  END IF;
  
  EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || query_text || ') t' INTO result;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;