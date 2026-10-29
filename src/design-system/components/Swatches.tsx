/** Source image layers for the swatches in 3.3 and 6.1. */
export function Swatches({ value, onChange, exchange = false }: {
    value: number;
    onChange: (value: number) => void;
    exchange?: boolean;
}) {
    const backgrounds = exchange ? ['e2040.png', 'b67fb.png', '268b2.png'] : ['e2040.png', 'b67fb.png', '268b2.png', 'c0127.png', '54840.png'];
    const overlays = exchange ? ['657be.png', '0125c.png', 'eb0b8.png'] : ['', '', '77661.png', '', ''];
    return <div className="swatches">{backgrounds.map((src, i) => <button key={src} aria-label={`Color ${i + 1}`} aria-pressed={value === i} className={value === i ? 'selected' : ''} onClick={() => onChange(i)}>
        <span className="swatch-graphic">
        <img src={`/assets/${src}`} alt=""/>{exchange && i === 2 && <img className="swatch-overlay" src="/assets/43058.png" alt=""/>}{overlays[i] && <img className={`swatch-overlay ${exchange && i === 2 ? 'last-layer' : ''}`} src={`/assets/${overlays[i]}`} alt=""/>}</span>
        </button>)}</div>;
}
