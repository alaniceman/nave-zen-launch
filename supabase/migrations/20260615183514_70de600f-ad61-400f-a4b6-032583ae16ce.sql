
REVOKE ALL ON FUNCTION public.execute_readonly_query(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.execute_readonly_query(text) TO service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user_signup() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ensure_uppercase_code() FROM PUBLIC, anon, authenticated;
