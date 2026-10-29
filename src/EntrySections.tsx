import { useState } from 'react';
import { Button, Header, Icon, SearchField } from './design-system/components';
import { ItemCard } from './design-system/components/ItemCard';
import { items } from './data';
import type { Item } from './data';
export function Login({ onContinue }: {
    onContinue: () => void;
}) {
    const [contact, setContact] = useState('');
    return <main className="login" data-screen="1">
    <div className="login-hero">
    <img src="/assets/06e9d.png" alt="Levi’s denim collection"/>
    </div>
    <img className="login-brand" src="/assets/12015.png" alt="Levi’s"/>
    <form className="login-panel" onSubmit={e => {
            e.preventDefault();
            if (contact.trim())
                onContinue();
        }}>
    <h1 className="title-page">Let’s find your order</h1>
    <label className="contact-field">
    <span className="label-strong">Email or Phone number</span>
    <input value={contact} onChange={e => setContact(e.target.value)} required placeholder="Janedoe@gmail.com" aria-label="Email or Phone number" autoComplete="email"/>
    </label>
    <div className="gift-link">
    <Icon name="gift"/>
    <span>Returning a gift?</span>
    </div>
    <div className="login-actions">
    <div className="language">
    <span>
    <Icon name="globe"/>English</span>
    <Icon name="down"/>
    </div>
    <Button variant="outline" aria-disabled="true">Find your order another way</Button>
    <button className="button button-primary" type="submit">Look up order</button>
    </div>
    <p className="privacy">By continuing, you acknowledge you have had an opportunity to read Levi’s <span>Privacy Policy</span>
    </p>
    </form>
    </main>;
}
export function ItemList({ onBack, onSelect, returningIds = [] }: {
    onBack: () => void;
    onSelect: (item: Item) => void;
    returningIds?: string[];
}) {
    const [search, setSearch] = useState('');
    const matches = items.filter(item => `${item.name} ${item.color}`.toLowerCase().includes(search.toLowerCase()));
    const returning = matches.filter(item => returningIds.includes(item.id));
    const available = matches.filter(item => item.days > 0 && !returningIds.includes(item.id));
    const unavailable = matches.filter(item => !item.days);
    return <main className="item-list" data-screen={returningIds.length ? '2.1' : '2'}>
    <Header onBack={onBack} right={<div className="policy-pill">Policy<Icon name="policy"/>
        </div>}/>
    <div className="list-content">
    <h1 className="title-page">What would you like to return?</h1>
    <SearchField value={search} onChange={setSearch}/>{returning.length > 0 && <section className="list-group">
        <h2 className="heading-section">Returning</h2>{returning.map(item => <ItemCard key={item.id} item={item} returning/>)}</section>}{available.length > 0 && <section className="list-group">
        <h2 className="heading-section">Returnable</h2>{available.map(item => <ItemCard key={item.id} item={item} onClick={() => onSelect(item)}/>)}</section>}{unavailable.length > 0 && <section className="list-group">
        <h2 className="heading-section">Not Returnable</h2>{unavailable.map(item => <ItemCard key={item.id} item={item}/>)}</section>}</div>
    </main>;
}
