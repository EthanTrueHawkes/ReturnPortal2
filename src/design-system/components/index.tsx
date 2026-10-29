import type { ButtonHTMLAttributes, ReactNode } from 'react';
// Original SVGs are rendered at their intrinsic root dimensions.
const icons = { back: '9d94b.svg', sheetBack: '9afa9.svg', search: 'b950e.svg', clock: '8819b.svg', globe: 'd5975.svg', down: '47afd.svg', gift: 'b8220.svg', policy: '0760f.svg', box: '4eb6a.svg', label: '2e280.svg', noBox: '6fd9f.svg', noLabel: 'aa278.svg', pin: 'd2ccb.svg', camera: '78ba6.svg', capture: 'b7507.svg', flash: '33460.svg', flip: 'c39c9.svg', leaf: '461d5.svg', bolt: '21c9b.svg', success: '52c54.svg', bag: 'bd6bd.svg', chevron: '0afe1.svg', delivery: '1c483.svg', info: 'f7f99.svg', plus: '648f2.svg', instructions: '45e98.svg', hours: '1f2ec.svg', shipping: '05a08.svg' } as const;
export type IconName = keyof typeof icons;
export function Icon({ name }: {
    name: IconName;
}) { return <img className="icon" src={`/assets/${icons[name]}`} alt="" aria-hidden="true"/>; }
export function Button({ variant = 'primary', children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'outline' | 'ghost';
    children: ReactNode;
}) { return <button type="button" className={`button button-${variant} ${className}`} {...props}>{children}</button>; }
export function BackButton({ onClick, sheet = false }: {
    onClick: () => void;
    sheet?: boolean;
}) {
    return <button type="button" className="round-button" aria-label="Back" onClick={onClick}>
    <Icon name={sheet ? 'sheetBack' : 'back'}/>
    </button>;
}
export function StatusBar() {
    return <div className="status-bar" aria-hidden="true">
    <span>9:41</span>
    <div className="status-levels">
    <img src="/assets/43048.svg" alt=""/>
    <img src="/assets/fdb56.svg" alt=""/>
    <img src="/assets/34fb9.svg" alt=""/>
    </div>
    </div>;
}
export function Header({ onBack, right, exchangeValue, count = 0 }: {
    onBack: () => void;
    right?: ReactNode;
    exchangeValue?: string;
    count?: number;
}) {
    return <header className="header">
    <StatusBar />
    <div className="nav-bar">
    <BackButton onClick={onBack}/>{exchangeValue ? <div className="exchange-value">
        <p>Exchange Value</p>
        <strong>{exchangeValue}<img src="/assets/bb300.svg" alt=""/>
        </strong>
        </div> : <img className="brand" src="/assets/12015.png" alt="Levi’s"/>}{exchangeValue ? <div className="round-button cart-indicator" aria-label={`Exchange cart: ${count} items`}>
        <Icon name="bag"/>{count > 0 && <span className="cart-count">{count}</span>}</div> : right || <div className="nav-spacer"/>}</div>
    </header>;
}
export function SearchField({ value, onChange, placeholder = 'Search items' }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return <label className="search-field">
    <Icon name="search"/>
    <input aria-label={placeholder} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
    </label>;
}
export function SizeGrid({ label, values, value, onChange, current, columns = 5 }: {
    label: string;
    values: number[];
    value: number | null;
    onChange: (value: number) => void;
    current?: number;
    columns?: number;
}) {
    return <fieldset className="size-field">
    <legend className="label-strong">{label}</legend>
    <div className="size-grid" style={{ gridTemplateColumns: `repeat(${columns},minmax(0,1fr))` }}>{values.map(n => <div className="size-choice" key={n}>
        <button type="button" aria-pressed={value === n} aria-label={`${label} ${n}`} onClick={() => onChange(n)} className={`size-button ${value === n ? 'selected' : ''}`}>{n}</button>{n === current && <span className="current-tag">Current</span>}</div>)}</div>
    </fieldset>;
}
