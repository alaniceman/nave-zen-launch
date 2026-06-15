
DROP POLICY IF EXISTS "Service role can insert chat conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Service role can update chat conversations" ON public.chat_conversations;

DROP POLICY IF EXISTS "Service role can insert mailerlite config" ON public.integrations_mailerlite;
DROP POLICY IF EXISTS "Service role can update mailerlite config" ON public.integrations_mailerlite;

DROP POLICY IF EXISTS "Service role can insert orders" ON public.package_orders;
DROP POLICY IF EXISTS "Service role can update orders" ON public.package_orders;

DROP POLICY IF EXISTS "Service role can insert sync logs" ON public.orders_sync_log;
DROP POLICY IF EXISTS "Service role can update sync logs" ON public.orders_sync_log;
