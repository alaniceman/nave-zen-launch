import { describe, expect, it } from 'vitest';
import { icefestDepositForQuantity } from '../../supabase/functions/_shared/icefestDeposit';

describe('Icefest deposit pilot', () => {
  it('charges a 25000 CLP deposit per person', () => {
    expect(icefestDepositForQuantity(1).deposit_per_person).toBe(25000);
  });
  it('keeps the complete ticket price at 77000 CLP', () => {
    expect(icefestDepositForQuantity(1).full_price).toBe(77000);
  });
  it('leaves 52000 CLP per person unpaid until staff records it', () => {
    expect(icefestDepositForQuantity(2).balance_due).toBe(104000);
    expect(icefestDepositForQuantity(2).balance_paid).toBe(false);
  });
});