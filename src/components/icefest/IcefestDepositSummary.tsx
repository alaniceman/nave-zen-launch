import { icefestMoney } from '@/lib/icefest';
import { icefestDepositInstructions, type IcefestDeposit } from '../../../supabase/functions/_shared/icefestDeposit';

export function IcefestDepositSummary({ deposit, quantity }: { deposit: IcefestDeposit; quantity: number }) {
  return <div className="border-l-2 border-primary pl-4 space-y-3 text-sm" aria-live="polite">
    <h3 className="font-semibold text-primary">Reserva con abono · no es el pago completo</h3>
    <dl className="space-y-2">
      <div className="flex justify-between gap-4"><dt>Valor completo · {quantity} persona(s)</dt><dd className="font-semibold">{icefestMoney(deposit.full_price * quantity)}</dd></div>
      <div className="flex justify-between gap-4"><dt>Abono · {icefestMoney(deposit.deposit_per_person)} por persona</dt><dd className="font-semibold">{icefestMoney(deposit.deposit_per_person * quantity)}</dd></div>
      <div className="flex justify-between gap-4 text-primary"><dt>{deposit.balance_paid ? 'Saldo recibido' : 'Saldo restante a cancelar'}</dt><dd className="font-bold">{icefestMoney(deposit.balance_due)}</dd></div>
    </dl>
    <p className="leading-relaxed text-muted-foreground">{icefestDepositInstructions(deposit)}</p>
    {!deposit.balance_paid && <a className="inline-block text-primary underline" href="https://wa.me/56946120426?text=Hola%2C%20quiero%20coordinar%20el%20pago%20del%20saldo%20de%20mi%20reserva%20Icefest" target="_blank" rel="noopener noreferrer">Coordinar pago del saldo por WhatsApp</a>}
  </div>;
}