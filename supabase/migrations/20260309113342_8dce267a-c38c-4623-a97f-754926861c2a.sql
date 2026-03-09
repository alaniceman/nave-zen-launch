
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  existing_customer_id UUID;
  new_customer_id UUID;
  user_name TEXT;
  user_phone TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  user_phone := NEW.raw_user_meta_data->>'phone';

  -- Check if customer already exists by email
  SELECT id INTO existing_customer_id
  FROM public.customers
  WHERE email = LOWER(TRIM(NEW.email));

  IF existing_customer_id IS NOT NULL THEN
    new_customer_id := existing_customer_id;

    -- Update customer name if it was just the email before, and set phone if provided
    UPDATE public.customers
    SET name = CASE WHEN name = email THEN user_name ELSE name END,
        phone = COALESCE(user_phone, phone),
        updated_at = now()
    WHERE id = new_customer_id;

    -- Log CRM event
    INSERT INTO public.customer_events (customer_id, event_type, title, description)
    VALUES (
      new_customer_id,
      'user_registered',
      'Usuario creó cuenta',
      'Se registró con email que ya tenía historial en CRM'
    );
  ELSE
    -- Create new customer
    INSERT INTO public.customers (email, name, phone, status)
    VALUES (LOWER(TRIM(NEW.email)), user_name, user_phone, 'new')
    RETURNING id INTO new_customer_id;

    -- Log CRM event
    INSERT INTO public.customer_events (customer_id, event_type, title, description)
    VALUES (
      new_customer_id,
      'user_registered',
      'Nuevo usuario registrado',
      'Primera vez en la plataforma'
    );
  END IF;

  -- Create profile linked to customer
  INSERT INTO public.profiles (id, customer_id, full_name, phone)
  VALUES (NEW.id, new_customer_id, user_name, user_phone);

  RETURN NEW;
END;
$function$;
