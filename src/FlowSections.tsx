import { Swatches } from './design-system/components/Swatches';
import { useRef, useState } from 'react';
import { Button, Icon, SizeGrid } from './design-system/components';
import { fitReasons, reasons } from './data';
import type { Draft } from './model';
import { sizeColor } from './model';
import { Sheet } from './design-system/components/ReturnSheet';
export function ReasonSection({ draft, onBack, onReason, onFit, fit = false }: {
    draft: Draft;
    onBack: () => void;
    onReason: (reason: string) => void;
    onFit: (reason: string) => void;
    fit?: boolean;
}) {
    const collapsed = fit;
    const selected = draft.reason;
    return <Sheet draft={draft} onBack={onBack} progress={fit ? 33 : 25} className="reason-sheet">
        <div className={`reason-menu ${collapsed ? 'collapsed' : ''}`}>
            <div className="reason-menu-heading" aria-hidden={collapsed}><div><h1 className="heading-section question">Why are you returning this item?</h1></div></div>
            <div className="reason-menu-options">{reasons.map(reason => {
                const chosen = selected === reason;
                return <div key={reason} inert={collapsed && !chosen} className={`reason-menu-row ${chosen ? 'chosen' : ''}`}><div>
                    <button className={collapsed && chosen ? 'reason-option reason-summary' : 'reason-option'}
                        aria-expanded={collapsed && chosen ? false : undefined}
                        onClick={() => collapsed ? onBack() : onReason(reason)}>
                        {reason}{collapsed && chosen && <Icon name="down"/>}
                    </button>
                </div></div>;
            })}</div>
        </div>
        <div className={`fit-followup ${fit ? 'visible' : ''}`} inert={!fit} aria-hidden={!fit}><div>
            <h1 className="heading-section question">Why didn’t the item fit as expected?</h1>
            <div className="reason-options">{fitReasons.map(reason => <button key={reason} className="reason-option" onClick={() => onFit(reason)}>{reason}</button>)}</div>
        </div></div>
    </Sheet>;
}

export function SizeOffer({ draft, onBack, onChange, onAccept, onDecline }: {
    draft: Draft;
    onBack: () => void;
    onChange: (patch: Partial<Draft>) => void;
    onAccept: () => void;
    onDecline: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const galleryDrag = useRef<{ start: number; scroll: number } | null>(null);
    const adjective = draft.fit === 'It was too big' ? 'smaller' : draft.fit === 'It was too long' ? 'shorter' : draft.fit === 'It was too short' ? 'longer' : 'larger';
    const waistOptions = expanded ? [23, 24, 25, 26, 27, 28, 29, 30, 31, 32] : adjective === 'smaller' ? [24, 25, 26] : [26, 27, 28];
    const inseamOptions = expanded ? [29, 30, 31] : adjective === 'shorter' ? [29, 30] : [30, 31];
    return <Sheet draft={draft} onBack={onBack} progress={45} className="size-sheet" footer={<>
        <Button disabled={draft.waist === 26 && draft.inseam === 30 && draft.color === (draft.item.color === 'Dark Wash' ? 1 : 0)} onClick={onAccept}>Exchange for {adjective} size</Button>
        <Button variant="ghost" onClick={onDecline}>Continue with Refund</Button>
        </>}>
  <h1 className="title-page">Would you like a {adjective} size?</h1>
    <div className="horizontal-gallery size-gallery" tabIndex={0} aria-label="Product photos" onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        galleryDrag.current = { start: event.clientX, scroll: event.currentTarget.scrollLeft };
    }} onPointerMove={event => {
        if (galleryDrag.current) event.currentTarget.scrollLeft = galleryDrag.current.scroll + galleryDrag.current.start - event.clientX;
    }} onPointerUp={() => { galleryDrag.current = null; }} onPointerCancel={() => { galleryDrag.current = null; }}>
    <div className="size-photo first">
    <img draggable={false} src={`/assets/${draft.item.image}`} alt={`${draft.item.name}, front view`}/>
    </div>
    <div className="size-photo side">
    <img draggable={false} src={`/assets/${draft.item.id === 'baggy' ? 'c5358.png' : draft.item.image}`} alt={`${draft.item.name}, side view`}/>
    </div>
    <div className="size-photo third">
    <img draggable={false} src={`/assets/${draft.item.id === 'baggy' ? '8ccd2.png' : draft.item.image}`} alt={`${draft.item.name}, alternate view`}/>
    </div>
    </div>
  <div className="size-product">
    <h2 className="label-strong">{draft.item.name}</h2>
    <p>Free Exchange</p>
    </div>
  {expanded && <div className="color-field">
        <p>
        <strong>Color: </strong>{sizeColor(draft.item, draft.color)}</p>
        <Swatches exchange value={draft.color} onChange={color => onChange({ color })}/>
        </div>}
  <SizeGrid label="Waist Size" values={waistOptions} columns={expanded ? 5 : 3} current={26} value={draft.waist} onChange={waist => onChange({ waist })}/>
    <SizeGrid label="Inseam Length" values={inseamOptions} columns={expanded ? 5 : 3} current={30} value={draft.inseam} onChange={inseam => onChange({ inseam })}/>
  <Button className="expand-sizes" variant="ghost" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer sizes and styles' : 'Show all sizes and styles'}</Button>
 </Sheet>;
}
export function PhotosSection({ draft, onBack, onCapture, onSkip, onContinue, review = false }: {
    draft: Draft;
    onBack: () => void;
    onCapture: (side: 'front' | 'back' | null) => void;
    onSkip: () => void;
    onContinue: () => void;
    review?: boolean;
}) {
    return <Sheet draft={draft} onBack={onBack} progress={review ? 95 : 66} className="photos-sheet" footer={review ? <>
        <div className="photo-benefits">
        <p>
        <Icon name="bolt"/>Instant refund</p>
        <p>
        <Icon name="leaf"/>Helps reduce shipping distances</p>
        </div>
        <Button onClick={onContinue}>Continue with return</Button>
        </> : <>
        <Button variant="ghost" onClick={onSkip}>Continue without photo</Button>
        <Button className="take-photos" onClick={() => onCapture(null)}>Take photos<span>
        <Icon name="bolt"/>Instant refund</span>
        </Button>
        </>}>
 <h1 className="title-page question">{review ? 'Review your photos' : 'Speed up your refund'}</h1>
    <p className="body-regular photo-description">{review ? 'Make sure both sides of your item are clearly visible' : 'Photos of your item help us provide instant refunds by reviewing its condition.'}</p>
    <div className="photo-pair">{(['front', 'back'] as const).map(side => <div key={side} className="photo-side">
        <h2 className="heading-section">{side === 'front' ? 'Front Photo' : 'Back Photo'}</h2>{review ? <div className="photo-preview">
            <img src={`/assets/${side === 'front' ? 'e73ad.png' : '95134.png'}`} alt={`${side} photo of returned item`}/>
            <button className="retake-button" aria-label={`Retake ${side} photo`} onClick={() => onCapture(side)}>
            <Icon name="camera"/>
            </button>
            </div> : <button className="photo-placeholder" aria-label={`Take ${side} photo`} onClick={() => onCapture(null)}>
            <Icon name="capture"/>
            <strong>Take photo</strong>
            </button>}</div>)}</div>
 </Sheet>;
}
export function CameraSection({ draft, onBack, onShutter, side }: {
    draft: Draft;
    onBack: () => void;
    onShutter: () => void;
    side: 'front' | 'back';
}) {
    return <Sheet draft={draft} onBack={onBack} progress={side === 'front' ? 66 : 78} className="camera-sheet" footer={<div className="camera-controls">
        <div className="round-button" aria-label="Flash">
        <Icon name="flash"/>
        </div>
        <button className="shutter" aria-label={`Capture ${side} photo`} onClick={onShutter}/>
        <div className="round-button" aria-label="Switch camera">
        <Icon name="flip"/>
        </div>
        </div>}>
    <h1 className="title-page question">{side === 'front' ? 'Front View' : 'Back View'}</h1>
    <p className="body-regular photo-description">{side === 'front' ? 'Keep item well lit, in view, with tags showing' : 'Keep the whole item visible and well lit.'}</p>
    <div className={`camera-photo ${side}`}>
    <img src={`/assets/${side === 'front' ? 'e73ad.png' : '95134.png'}`} alt={`${side} view of returned jeans`}/>
    </div>
    </Sheet>;
}
