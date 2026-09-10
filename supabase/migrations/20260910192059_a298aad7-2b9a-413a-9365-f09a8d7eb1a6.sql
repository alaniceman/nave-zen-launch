ALTER TABLE public.session_packages ADD COLUMN IF NOT EXISTS code_composition jsonb;

INSERT INTO public.session_packages (
  name, description, sessions_quantity, price_clp, validity_days,
  applicable_service_ids, is_active, available_as_giftcard,
  show_in_upsell_modal, show_in_criomedicina, sort_order, is_private, code_composition
) VALUES (
  'Pack 18 · Bautizo de Hielo + Yoga',
  '2 sesiones de Método Wim Hof (Bautizo de Hielo) + 4 clases de Yoga que pueden terminar en agua fría. Válido 3 meses.',
  6, 60000, 90,
  ARRAY[
    '7ad79af6-7ff4-46db-a2e3-3cf8d2f970d6',
    '4597bac7-b438-48b7-ba9c-e6c5dcac8df5',
    'ced4be53-8e5c-4d34-8370-0784f8d7a4b1',
    '0e5ff874-2be1-4bcc-b25d-325626bf92da',
    'e256625f-7602-48f2-b051-172516f6e4cf',
    'ed78d76f-2dae-4524-87df-c5418be5c7f1',
    '907de51f-5f1f-444a-b7a7-3734d5a79f65',
    'b5efbd24-3b40-4ba4-b7d1-d45a54097633',
    '4de633c4-1c82-4d18-80a8-b05d39e5e1d2',
    '1359133a-9ebc-420e-a2fd-748b01769420',
    '55a20a48-0b74-4520-9b03-b2780f7622d2'
  ]::uuid[],
  true, false, false, false, 99, true,
  '[
    {"label":"Método Wim Hof (Bautizo de Hielo)","count":2,"service_ids":["7ad79af6-7ff4-46db-a2e3-3cf8d2f970d6","4597bac7-b438-48b7-ba9c-e6c5dcac8df5","ced4be53-8e5c-4d34-8370-0784f8d7a4b1"]},
    {"label":"Yoga (con agua fría opcional)","count":4,"service_ids":["0e5ff874-2be1-4bcc-b25d-325626bf92da","e256625f-7602-48f2-b051-172516f6e4cf","ed78d76f-2dae-4524-87df-c5418be5c7f1","907de51f-5f1f-444a-b7a7-3734d5a79f65","b5efbd24-3b40-4ba4-b7d1-d45a54097633","4de633c4-1c82-4d18-80a8-b05d39e5e1d2","1359133a-9ebc-420e-a2fd-748b01769420","55a20a48-0b74-4520-9b03-b2780f7622d2"]}
  ]'::jsonb
);