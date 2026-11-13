import { describe, expect, it } from 'vitest';
import { icefestConversion, icefestVisitSession } from './icefestConversion';
describe('Icefest conversion', () => {
  it('calculates sales divided by visits as a percentage', () => {
    expect(icefestConversion(5, 100)).toBe(5);
    expect(icefestConversion(2, 50)).toBe(4);
  });
  it('has no rate without visits', () => expect(icefestConversion(0, 0)).toBeNull());
  it('deduplicates refreshes and expires sessions after 30 minutes', () => {
    expect(icefestVisitSession({ id: 'a', lastSeen: 0 }, 1000, 'b').id).toBe('a');
    expect(icefestVisitSession({ id: 'a', lastSeen: 0 }, 1800000, 'b').id).toBe('b');
  });
});
