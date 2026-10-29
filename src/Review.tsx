import { Button, Header, Icon, StatusBar } from './design-system/components';
import { cents, money } from './data';
import type { Location } from './data';
import type { Draft } from './model';
import { sizeColor, productColor } from './model';
import { ItemImage } from './design-system/components/ItemCard';
import { ProductPhoto } from './Shopping';
import { Requirements } from './Locations';
import { calculate } from './calculation';
export function Review({ records, location, onBack, onAdd, onLocation, onConfirm }: {
    records: Draft[];
    location: Location | null;
    onBack: () => void;
    onAdd: () => void;
    onLocation: () => void;
    onConfirm: () => void;
}) {
    const total = calculate(records, location);
    const physical = records.filter(d => d.outcome !== 'keep');
    const keeping = records.filter(d => d.outcome === 'keep');
    const receiving = records.filter(d => d.outcome === 'size' || d.outcome === 'shop');
    const onlyKeep = physical.length === 0;
    return <main className="review" data-screen="8">
    <Header onBack={onBack}/>
    <div className="review-content">
    <h1 className="title-page">Review your return</h1>
    <p className="body-regular refund-description">{total.total > 0 ? `You’ll receive ${money(total.total)} back` : total.total === 0 ? 'Your exchange is free' : `Balance due: ${money(-total.total)}`}</p>
    <div className="review-detail-card refund-method">
    <strong>Refund to card: Visa ···· 3176</strong>
    <Icon name="chevron"/>
    </div>
 {physical.length > 0 && <section className="review-group">
        <h2 className="heading-section">Returning</h2>{physical.map(d => <div className="review-item" key={d.item.id}>{d.front ? <div className="review-return-photo">
                <img src="/assets/e73ad.png" alt={d.item.name}/>
                </div> : <ItemImage item={d.item}/>}<div>
            <h3 className="label-strong">{d.item.name}</h3>
            <p>{d.item.color} · 26/30</p>
            </div>
            <span>{d.outcome === 'refund' ? 'Refund' : 'Exchange'}</span>
            </div>)}</section>}
 {keeping.length > 0 && <section className="review-group">
        <h2 className="heading-section">Keeping</h2>{keeping.map(d => <div className="review-item" key={d.item.id}>
            <ItemImage item={d.item}/>
            <div>
            <h3 className="label-strong">{d.item.name}</h3>
            <p>Keep item · {money(cents(d.item.price * .2))} refund</p>
            </div>
            </div>)}</section>}
 <Button className="return-another" onClick={onAdd} disabled={records.length >= 3}>
    <span>
    <Icon name="plus"/>Return another item</span>
    </Button>
 {receiving.length > 0 && <section className="review-group receiving">
        <h2 className="heading-section">Receiving</h2>{receiving.map(d => <div className="review-item" key={d.item.id}>{d.outcome === 'size' ? <ItemImage item={d.item}/> : d.replacement && <ProductPhoto product={d.replacement.product}/>}<div>
            <h3 className="label-strong">{d.outcome === 'size' ? d.item.name : d.replacement?.product.name}</h3>
            <p>{d.outcome === 'size' ? sizeColor(d.item, d.color) : d.replacement && productColor(d.replacement.product, d.replacement.color)} · {d.outcome === 'size' ? `${d.waist}/${d.inseam}` : `${d.replacement?.waist}/${d.replacement?.inseam}`}</p>
            <p className="delivery-note">
            <Icon name="delivery"/>Delivery Jul 2–5</p>
            </div>
            <span>{d.outcome === 'size' ? 'Exchange' : money(d.replacement?.product.price || 0)}</span>
            </div>)}</section>}
 {receiving.length > 0 && <section className="review-group delivery-group">
        <h2 className="heading-section">Exchange delivery</h2>
        <div className="review-detail-card">
        <div>
        <strong className="label-strong">Ships free to</strong>
        <p>1847 Address here Ln, 86613, Finley Park...</p>
        <p>Expected Delivery: Jul 1 - 3</p>
        </div>
        <Icon name="chevron"/>
        </div>
        </section>}
 {!onlyKeep && location && <section className="review-group return-location">
        <h2 className="heading-section">Return location</h2>
        <button className="review-detail-card" onClick={onLocation}>
        <img className="review-carrier" src={`/assets/${location.logo}`} alt=""/>
        <div>
        <strong className="label-strong">{location.name}</strong>
        <Requirements location={location} long/>
        <p>{location.pickup ? `${total.fee ? money(total.fee) : 'Free'} Pickup ${location.slot}` : location.distance}</p>
        </div>
        <Icon name="chevron"/>
        </button>
        </section>}
 <div className="review-totals">
    <div className="receipt-divider">
    <img src="/assets/9dd02.svg" alt=""/>
    </div>
    <div className="total-row">
    <span>{onlyKeep ? 'Partial refund' : 'Return credit'}</span>
    <span>+ {money(total.credit)}</span>
    </div>{total.bonus > 0 && <div className="total-row">
        <span>Exchange bonus <Icon name="info"/>
        </span>
        <span>+ {money(total.bonus)}</span>
        </div>}{total.tax > 0 && <div className="total-row">
        <span>Tax refund <Icon name="info"/>
        </span>
        <span>+ {money(total.tax)}</span>
        </div>}{total.newTotal > 0 && <div className="total-row">
        <span>New item total</span>
        <span>- {money(total.newTotal)}</span>
        </div>}{total.fee > 0 && <div className="total-row">
        <span>Pickup fee</span>
        <span>- {money(total.fee)}</span>
        </div>}<div className="total-row grand-total">
    <strong>Total Refund</strong>
    <span>USD <strong>{money(total.total)}</strong>
    </span>
    </div>
    </div>
    <Button className="confirm-return" onClick={onConfirm}>{onlyKeep ? 'Confirm Refund' : receiving.length ? 'Confirm Return & Exchange' : 'Confirm Return'}</Button>
    </div>
    </main>;
}
// New screen explicitly requested by the user; reuses the extracted typography/colors.
export function ThankYou() {
    return <main className="thank-you" data-screen="thanks">
    <StatusBar />
    <img className="thanks-brand" src="/assets/12015.png" alt="Levi’s"/>
    <div className="confetti" aria-hidden="true">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, background: ['var(--text-brand)', 'var(--text-success)', 'var(--surface-black)', 'var(--surface-dark)'][i % 4], animationDelay: `${-(i % 9) * .3}s`, transform: `rotate(${i * 29}deg)` }}/>)}</div>
    <div className="thanks-copy">
    <Icon name="success"/>
    <h1 className="title-page">Thank you!</h1>
    <p className="body-regular">Your return has been confirmed.</p>
    </div>
    </main>;
}
