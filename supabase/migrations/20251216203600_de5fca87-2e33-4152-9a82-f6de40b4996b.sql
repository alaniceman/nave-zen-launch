-- Permitir ver códigos de sesión si tienen un giftcard_access_token (el filtro específico se hace en el query)
CREATE POLICY "Anyone can view session codes with valid access token"
ON session_codes FOR SELECT
USING (giftcard_access_token IS NOT NULL);