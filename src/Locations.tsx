import { useEffect, useRef, useState } from 'react';
import { Button, Header, Icon } from './design-system/components';
import { locations, money } from './data';
import type { Location } from './data';
export function Requirements({ location, long = false }: {
    location: Location;
    long?: boolean;
}) {
    return <div className="requirements">
    <span>
    <Icon name={location.box ? 'box' : 'noBox'}/>{location.box ? (long ? 'Box required' : 'Box') : 'No Box'}</span>
    <span>
    <Icon name={location.label ? 'label' : 'noLabel'}/>{location.label ? (long ? 'Label required' : 'Label') : 'No Label'}</span>
    </div>;
}
export function LocationSection({ initial, onBack, onSelect, feeFor }: {
    initial: Location | null;
    onBack: () => void;
    onSelect: (location: Location) => void;
    feeFor: (location: Location) => number;
}) {
    const [expanded, setExpanded] = useState(initial?.id || '');
    const [slot, setSlot] = useState(initial?.slot || '');
    const [noBox, setNoBox] = useState(false);
    const [noLabel, setNoLabel] = useState(false);
    const root = useRef<HTMLElement>(null);
    useEffect(() => {
        if (!expanded) return;
        const page = root.current;
        const card = page?.querySelector<HTMLElement>('.location-card.expanded');
        const scroller = page?.closest<HTMLElement>('.screen-scroll');
        const content = page?.querySelector<HTMLElement>('.location-content');
        if (!card || !scroller || !content) return;
        const headerHeight = page?.querySelector('.header')?.getBoundingClientRect().height || 0;
        const startScroll = scroller.scrollTop;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const started = performance.now();
        let frame = 0;
        // Scroll alongside expansion, tracking the anchor as other cards collapse.
        function align(now: number) {
            if (!card || !scroller || !content) return;
            const progress = reducedMotion ? 1 : Math.min(1, (now - started) / 340);
            const eased = 1 - Math.pow(1 - progress, 3);
            const target = Math.max(0, scroller.scrollTop + card.getBoundingClientRect().top - scroller.getBoundingClientRect().top - headerHeight - 16);
            const padding = parseFloat(content.style.paddingBottom) || 40;
            const extra = target - (scroller.scrollHeight - scroller.clientHeight);
            content.style.paddingBottom = `${Math.max(40, padding + extra)}px`;
            scroller.scrollTo({ top: startScroll + (target - startScroll) * eased, behavior: 'instant' });
            if (progress < 1) frame = requestAnimationFrame(align);
        }
        frame = requestAnimationFrame(align);
        return () => cancelAnimationFrame(frame);
    }, [expanded, noBox, noLabel]);
    function card(provider: Location) {
        const location = { ...provider, fee: feeFor(provider) };
        const open = expanded === location.id;
        return <div key={location.id} className={`location-card ${open ? 'expanded' : ''}`}>
        <button className="location-card-head" aria-expanded={open} aria-controls={`location-details-${location.id}`} aria-label={`Select ${location.name}`} onClick={() => {
                setExpanded(open ? '' : location.id);
                if (location.id !== expanded)
                    setSlot('');
            }}>
        <div className="carrier-logo">
        <img src={`/assets/${location.logo}`} alt=""/>
        </div>
        <div className="location-copy">
        <strong className="label-strong">{location.id === 'ups-store' && !open ? 'Ups' : location.name}</strong>
        <Requirements location={location}/>
        <p>{location.pickup ? 'Choose a pickup time' : location.distance}</p>
        </div>
        <strong className="location-price">{location.fee ? money(location.fee) : 'Free'}</strong>
        </button><div id={`location-details-${location.id}`} className="location-expansion" aria-hidden={!open} inert={!open}><div className="location-expansion-inner"><div className="location-details">{location.pickup ? <>
                <div className="pickup-slots">{['Today', 'Tomorrow'].map(day => <div key={day}>
                    <h3 className="label-strong">{day}</h3>
                    <div className="slot-row">{['11 AM - 1 PM', '1 PM - 3 PM', '3 PM - 5 PM'].map(time => <button key={time} aria-pressed={slot === `${day}, ${time}`} onClick={() => setSlot(`${day}, ${time}`)}>{time}</button>)}</div>
                    </div>)}</div>
                <p className="more-times">See more times</p>
                </> : <>
                <div className="location-map">
                <img src="/assets/dec08.png" alt="Sample map: 223 West Cougar Blvd, Provo"/>
                <div className="map-address">
                <p>{location.name}, 223 West Cougar Blvd, P...</p>
                <img src="/assets/dd81f.svg" alt=""/>
                </div>
                </div>
                <div className="location-disclosure">
                <Icon name="hours"/>
                <div>
                <strong className="open-now">Open Now</strong>
                <p>Accepting returns until 6:30 PM</p>
                </div>
                <Icon name="down"/>
                </div>
                </>}<div className="location-disclosure">
            <Icon name="instructions"/>
            <div>
            <strong>Return Instructions</strong>
            <p>Bring return and QR code to counter</p>
            </div>
            <Icon name="down"/>
            </div><Button disabled={location.pickup && !slot} onClick={() => onSelect({ ...location, slot: location.pickup ? slot : undefined })}>Select Location</Button>
            </div></div></div></div>;
    }
    return <main ref={root} className="locations" data-screen="7">
    <Header onBack={onBack} right={<div className="zip-pill">84604<Icon name="pin"/>
        </div>}/>
    <div className="location-content">
    <h1 className="title-page">Where will you make the return?</h1>
    <section className="location-group">
    <h2 className="heading-section">Return from your doorstep</h2>{locations.filter(l => l.pickup).map(card)}</section>
    <section className="location-group dropoff">
    <h2 className="heading-section">Drop-off Locations</h2>
    <div className="filter-chips">
    <button aria-pressed={noLabel} onClick={() => setNoLabel(!noLabel)}>No Label</button>
    <button aria-pressed={noBox} onClick={() => setNoBox(!noBox)}>No Box</button>
    </div>{locations.filter(l => !l.pickup && (!noBox || !l.box) && (!noLabel || !l.label)).map(card)}</section>
    </div>
    </main>;
}
