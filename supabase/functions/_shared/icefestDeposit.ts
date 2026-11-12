// Immutable terms for the limited pilot; new offers must use a different tier ID.
export const ICEFEST_DEPOSIT_TIER_ID = '9cefe570-2026-4000-8000-000000000025';
export const ICEFEST_DEPOSIT_AMOUNT = 25000;
export const ICEFEST_DEPOSIT_FULL_PRICE = 77000;
export type IcefestDeposit = { full_price: number; deposit_per_person: number; balance_due: number; balance_paid: boolean };
export function icefestDepositForQuantity(quantity: number): IcefestDeposit {
  return { full_price: ICEFEST_DEPOSIT_FULL_PRICE, deposit_per_person: ICEFEST_DEPOSIT_AMOUNT, balance_due: (ICEFEST_DEPOSIT_FULL_PRICE - ICEFEST_DEPOSIT_AMOUNT) * quantity, balance_paid: false };
}
export function icefestDepositInstructions(deposit: IcefestDeposit): string {
  const money = (amount: number) => `$${amount.toLocaleString('es-CL')}`;
  return deposit.balance_paid
    ? 'Saldo recibido y registrado por el equipo. Puedes acreditar tus entradas.'
    : `Saldo pendiente del pedido: ${money(deposit.balance_due)}. Págalo durante la semana del evento, del 7 al 13 de diciembre de 2026, o en la puerta antes de ingresar. Para pagar antes, escribe al WhatsApp +56 9 4612 0426 con tu email y código de entrada: el equipo te indicará cómo pagar y registrará tu comprobante. En la puerta, muestra tu código y cancela el saldo con el equipo antes de acreditar. El abono reserva tu cupo, pero no es el pago completo. No hay cobro automático del saldo. El precio queda fijado en ${money(deposit.full_price)} por persona y no sube si cambia la preventa.`;
}