import { LockKeyhole } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type IcefestTier, icefestMoney } from "@/lib/icefest";
import { ICEFEST_DEPOSIT_TIER_ID, icefestDepositForQuantity } from "../../../supabase/functions/_shared/icefestDeposit";

type Props = {
  tiers: IcefestTier[];
  selected: IcefestTier;
  activeTier: IcefestTier | null;
  now: number;
  disabled: boolean;
  onChange: (tier: IcefestTier) => void;
};

export function IcefestTicketOptions({ tiers, selected, activeTier, now, disabled, onChange }: Props) {
  const deposit = icefestDepositForQuantity(1);
  const options = tiers.filter((t) => t.is_active && (t.id === ICEFEST_DEPOSIT_TIER_ID || t.id === activeTier?.id || t.display_order > (activeTier?.display_order ?? -1)))
    .sort((a, b) => a.id === ICEFEST_DEPOSIT_TIER_ID ? -1 : b.id === ICEFEST_DEPOSIT_TIER_ID ? 1 : a.display_order - b.display_order);

  return <fieldset className="min-w-0 space-y-3" disabled={disabled}>
    <legend className="text-sm font-semibold mb-3">Selecciona cómo pagar tu entrada</legend>
    <RadioGroup value={selected.id} disabled={disabled} onValueChange={(id) => {
      const next = options.find((t) => t.id === id);
      if (next) onChange(next);
    }} className="gap-3" aria-label="Modalidad de entrada">
      {options.map((option) => {
        const isDeposit = option.id === ICEFEST_DEPOSIT_TIER_ID;
        const remaining = option.stock === null ? null : Math.max(0, option.stock - option.stock_sold);
        const soldOut = remaining === 0;
        const expired = Boolean(option.valid_until && new Date(option.valid_until).getTime() <= now);
        const future = Boolean(option.valid_from && new Date(option.valid_from).getTime() > now);
        const available = !soldOut && !expired && !future && (isDeposit || option.id === activeTier?.id);
        const chosen = selected.id === option.id;
        const startDate = option.valid_from ? new Date(option.valid_from).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "long" }) : null;
        return <Label key={option.id} htmlFor={`icefest-option-${option.id}`} className={`flex items-start gap-3 rounded-lg border p-4 font-normal leading-normal transition-colors ${chosen ? "border-primary bg-primary/10" : "border-border bg-background"} ${available && !disabled ? "cursor-pointer hover:border-primary" : "cursor-default"}`}>
          <RadioGroupItem id={`icefest-option-${option.id}`} value={option.id} disabled={!available} className="mt-1 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
              <span className={`font-semibold ${available ? "text-foreground" : "text-muted-foreground"}`}>{isDeposit ? "Abono · Reserva tu cupo" : available ? `Pago completo · ${option.name}` : `Precio normal · ${option.name}`}</span>
              <span className={`font-bold whitespace-nowrap ${available ? "text-primary" : "text-muted-foreground"}`}>{icefestMoney(option.price)} <span className="text-xs font-normal">CLP</span></span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{isDeposit
              ? `Asegura tu entrada hoy con ${icefestMoney(option.price)}. El saldo de ${icefestMoney(deposit.balance_due)} se paga durante la semana del evento o en la puerta, antes de ingresar. Valor total: ${icefestMoney(deposit.full_price)} por persona.`
              : available ? "Paga el total ahora y llega con tu entrada pagada." : soldOut ? "Cupos agotados." : expired ? "Esta etapa ya finalizó." : `Sube al agotar la preventa${startDate ? ` o desde el ${startDate}` : ""}.`}</p>
            {available && remaining !== null && <p className="text-xs font-semibold text-secondary">{isDeposit ? `${remaining} cupos disponibles para abonar` : `Quedan ${remaining} cupos a este precio`}</p>}
            {!available && !soldOut && !expired && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><LockKeyhole className="h-3 w-3 shrink-0" />Próximamente</p>}
          </div>
        </Label>;
      })}
    </RadioGroup>
  </fieldset>;
}