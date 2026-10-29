import { Swatches } from './design-system/components/Swatches';
import { useState } from 'react';
import { Button, Header, Icon, SearchField, SizeGrid } from './design-system/components';
import { cents, money, products } from './data';
import type { Product } from './data';
import type { Draft } from './model';
import { productColor } from './model';
// Nested crop values reproduce each original Figma image-fill transform.
export function ProductPhoto({ product, detail = false }: {
    product: Product;
    detail?: boolean;
}) {
    const [w, h, left, top] = product.crop;
    return <div className={`product-photo ${detail ? 'detail-photo' : ''}`}>
    <div className="product-photo-inner">
    <img src={`/assets/${product.image}`} alt={product.name} style={{ width: `${w}%`, height: `${h}%`, left: `${left}%`, top: `${top}%` }}/>
    </div>
    </div>;
}
export function Shopping({ draft, onBack, onProduct, onRefund, onExchange }: {
    draft: Draft;
    onBack: () => void;
    onProduct: (product: Product) => void;
    onRefund: () => void;
    onExchange: () => void;
}) {
    const [search, setSearch] = useState('');
    const bonus = cents(draft.item.price * .1);
    return <main className="shopping" data-screen={draft.replacement ? '6.2' : '6'}>
    <Header onBack={onBack} exchangeValue={money(cents(draft.item.price + bonus))} count={draft.replacement ? 1 : 0}/>
    <div className="shop-content">
    <div className="benefit-chips">
    <span>
    <Icon name="shipping"/>Free Shipping</span>
    <span>{money(bonus)} exchange bonus</span>
    </div>
    <h1 className="title-page">Want something different?</h1>
    <p className="body-regular shop-description">Find a new item with {money(bonus)} extra on us, or continue with your return to get a full refund.</p>
    <SearchField value={search} onChange={setSearch} placeholder="Search Levi’s..."/>{(['More Pants', 'Popular Picks'] as const).map(category => {
            const shown = products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase()));
            return shown.length > 0 && <section className="catalog-group" key={category}>
            <h2 className="heading-section">{category}</h2>
            <div className="horizontal-gallery catalog-row">{shown.map(product => <button key={product.id} className="catalog-card" onClick={() => onProduct(product)} aria-label={`View ${product.name}`}>
                <ProductPhoto product={product}/>
                <h3 className="label-strong">{product.name}</h3>
                <strong>{money(product.price)}</strong>
                <p>Exchange covers</p>
                </button>)}</div>
            </section>;
        })}</div>
    <div className="shopping-actions">{draft.replacement && <Button onClick={onExchange}>Continue with Exchange</Button>}<Button variant={draft.replacement ? 'ghost' : 'primary'} onClick={onRefund}>Continue with Refund</Button>
    </div>
    </main>;
}
export function ProductDetail({ draft, product, onBack, onAdd }: {
    draft: Draft;
    product: Product;
    onBack: () => void;
    onAdd: (waist: number, inseam: number, color: number) => void;
}) {
    const [waist, setWaist] = useState<number | null>(null);
    const [inseam, setInseam] = useState<number | null>(null);
    const [color, setColor] = useState(0);
    return <main className="product-detail" data-screen="6.1">
    <Header onBack={onBack} exchangeValue={money(cents(draft.item.price * 1.1))} count={draft.replacement ? 1 : 0}/>
    <div className="horizontal-gallery detail-gallery">{[0, 1].map(n => <div className="detail-slide" key={n}>
        <ProductPhoto product={product} detail/>
        <div className="gallery-dots">
        <i />
        <i />
        <i />
        <i />
        <i />
        </div>
        </div>)}</div>
    <div className="detail-content">
    <h1>{product.name}</h1>
    <div className="rating">
    <img src="/assets/56a4e.svg" alt="4.5 out of 5 stars"/>
    <span>496</span>
    </div>
    <p className="detail-price">
    <strong>{money(product.price)}</strong>
    <span>{money(Math.max(0, cents(product.price - draft.item.price * 1.1)))} after credit</span>
    </p>
    <div className="detail-color">
    <p>
    <strong>Color: </strong>{productColor(product, color)}</p>
    <Swatches value={color} onChange={setColor}/>
    </div>
    <SizeGrid label="Waist Size" values={[23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]} value={waist} onChange={setWaist}/>
    <SizeGrid label="Inseam Length" columns={5} values={[30, 32]} value={inseam} onChange={setInseam}/>
    </div>
    <div className="product-actions">
    <Button disabled={!waist || !inseam} onClick={() => {
            if (waist && inseam)
                onAdd(waist, inseam, color);
        }}>Add to Exchange Cart</Button>
    </div>
    </main>;
}
export function KeepOffer({ draft, onBack, onKeep, onReturn }: {
    draft: Draft;
    onBack: () => void;
    onKeep: () => void;
    onReturn: () => void;
}) {
    const amount = money(cents(draft.item.price * .2));
    return <main className="keep-offer" data-screen="6alt">
    <Header onBack={onBack} right={<div className="round-button">
        <img src="/assets/c3a17.svg" alt=""/>
        </div>}/>
    <div className="keep-content">
    <h1 className="title-page">Keep the item, get <em>{amount}</em> back</h1>
    <p className="body-regular">Get {amount} back to your original payment method, without returning the item</p>
    <div className={`keep-image ${draft.item.crop || ''}`}>
    <img src={`/assets/${draft.item.image}`} alt={draft.item.name}/>
    </div>
    <h2 className="label-strong">{draft.item.name}</h2>
    <p>{draft.item.color} · 26/30</p>
    <strong>{money(draft.item.price)}</strong>
    </div>
    <div className="keep-actions">
    <Button onClick={onKeep}>Keep item, {amount} refund</Button>
    <Button variant="ghost" onClick={onReturn}>Continue with return, full refund</Button>
    </div>
    </main>;
}
