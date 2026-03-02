

## Plan: Fix package validity display across all pages

### Problem
The "Paquetes de Criomedicina" section in `/planes-precios` shows hardcoded validity text that doesn't match the database:
- **3 Sesiones** shows "válido 90 días" but DB has **365 días**
- **5 Sesiones** shows "válido 180 días" but DB has **360 días**

Additionally, `MarzoReset.tsx` hardcodes "Válido por 6 meses" instead of reading from DB.

### Changes

#### 1. `src/pages/Planes.tsx` -- Fix hardcoded validity in Criomedicina section
- Line 336: Change `válido 90 días` to `válido 365 días` (matching DB for 3-session package)
- Line 362: Change `válido 180 días` to `válido 360 días` (matching DB for 5-session package)

#### 2. `src/pages/MarzoReset.tsx` -- Make validity dynamic
- Line 270: Change hardcoded "Válido por 6 meses desde la compra" to show the actual validity from the selected package. Since this page uses hardcoded package data (not fetched from DB), update the hardcoded values from `180` days to `365` days equivalent, or fetch `validity_days` from DB.

#### 3. Update DB: Set Marzo Reset packages to 365 days
- Update `session_packages` where id in (`448c825b-...`, `c89ccd95-...`) to `validity_days = 365`
- This ensures Bonos, GiftCards, CriomedicinMetodoWimHof, and CriomedicinAdsLanding pages (which already read `validity_days` dynamically) show the correct value automatically.

