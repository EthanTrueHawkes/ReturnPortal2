import { Icon } from './index';
import { money } from '../../data';
import type { Item } from '../../data';
export function ItemImage({ item, className = '' }: {
    item: Item;
    className?: string;
}) {
    return <div className={`item-image ${item.crop || ''} ${className}`}>
    <img src={`/assets/${item.image}`} alt={item.name}/>
    </div>;
}
export function ItemCard({ item, returning = false, onClick }: {
    item: Item;
    returning?: boolean;
    onClick?: () => void;
}) {
    const content = <>
    <ItemImage item={item}/>
    <div className="item-copy">
    <h3 className="label-strong">{item.name}</h3>
    <p>{item.color} · 26/30</p>
    <p className="item-deadline">
    <Icon name="clock"/>{item.days ? `${item.days} days to return` : 'Past return date'}</p>
    </div>
    <strong className="item-price">{money(item.price)}</strong>
    </>;
    return onClick ? <button className={`item-card ${returning ? 'returning' : ''}`} onClick={onClick}>{content}</button> : <div className={`item-card ${returning ? 'returning' : ''} ${!item.days ? 'unavailable' : ''}`}>{content}</div>;
}
