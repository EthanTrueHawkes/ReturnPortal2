import { cents } from './data.ts';
import type { Location } from './data.ts';
import type { Draft } from './model.ts';
/** Agreed demo math; all amounts are simulated and rounded to cents. */
export function calculate(records: Draft[], location: Location | null) {
    const credit = cents(records.reduce((sum, d) => sum + (d.outcome === 'keep' ? cents(d.item.price * .2) : d.item.price), 0));
    const bonus = cents(records.reduce((sum, d) => sum + (d.outcome === 'shop' ? cents(d.item.price * .1) : 0), 0));
    const tax = cents(records.filter(d => d.outcome === 'refund' || d.outcome === 'shop').length * 3.52);
    const newTotal = cents(records.reduce((sum, d) => sum + (d.outcome === 'size' ? d.item.price : d.outcome === 'shop' && d.replacement ? d.replacement.product.price : 0), 0));
    const requestedFee = records.some(d => d.outcome !== 'keep') ? (location?.fee || 0) : 0;
    // Waive the entire pickup fee when it would create a balance due in the prototype.
    const fee = requestedFee > cents(credit + bonus + tax - newTotal) ? 0 : requestedFee;
    return { credit, bonus, tax, newTotal, fee, total: cents(credit + bonus + tax - newTotal - fee) };
}
