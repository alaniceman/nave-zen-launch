import { describe, expect, it } from 'vitest';
import { icefestInstallments } from './icefestInstallments';

describe('Icefest three-installment display', () => {
  it('divides the payable total into three CLP installments', () => {
    expect(icefestInstallments(77000)).toEqual({ count: 3, amount: 25667, approximate: true });
    expect(icefestInstallments(154000)?.amount).toBe(51333);
    expect(icefestInstallments(75000)).toEqual({ count: 3, amount: 25000, approximate: false });
    expect(icefestInstallments(25000)?.amount).toBe(8333);
  });
  it('does not offer installments for a free order', () => {
    expect(icefestInstallments(0)).toBeNull();
  });
});