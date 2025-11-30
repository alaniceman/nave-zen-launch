-- Add applicable_package_ids column to discount_coupons
ALTER TABLE discount_coupons 
ADD COLUMN applicable_package_ids UUID[] DEFAULT NULL;

COMMENT ON COLUMN discount_coupons.applicable_package_ids IS 'Array of session package IDs this coupon applies to. NULL means coupon only applies to regular bookings (not packages)';

-- Create single session packages for use with discounts
INSERT INTO session_packages (name, description, sessions_quantity, price_clp, validity_days, applicable_service_ids, is_active)
VALUES 
  (
    '1 Sesión Método Wim Hof', 
    '1 sesión del Método Wim Hof Ice Bath en grupo', 
    1, 
    30000, 
    90, 
    ARRAY['ced4be53-8e5c-4d34-8370-0784f8d7a4b1']::uuid[], 
    true
  ),
  (
    '1 Sesión Yoga Integral', 
    '1 sesión de Yoga Integral', 
    1, 
    15000, 
    90, 
    ARRAY['55a20a48-0b74-4520-9b03-b2780f7622d2']::uuid[], 
    true
  );