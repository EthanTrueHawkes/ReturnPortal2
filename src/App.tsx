import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Icon } from './design-system/components';
import {ReturnBanner} from './design-system/components/ReturnSheet';
import { ItemList, Login } from './EntrySections';
import { CameraSection, PhotosSection, ReasonSection, SizeOffer } from './FlowSections';
import { KeepOffer, ProductDetail, Shopping } from './Shopping';
import { LocationSection } from './Locations';
import { Review, ThankYou } from './Review';
import { newDraft } from './model';
import { calculate } from './calculation';
import type { Draft, Screen } from './model';
import type { Item, Location, Product } from './data';
import './App.css';
import './flow.css';
import './shopping.css';
import './checkout.css';
/** One draft per return flow. Completed drafts survive Return another item.
 * offerSeen is set on first display, so photos never introduce a second offer.
 */
export default function App() {
    const [screen, setScreen] = useState<Screen>('1');
    const [history, setHistory] = useState<Screen[]>([]);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [records, setRecords] = useState<Draft[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [retake, setRetake] = useState<'front' | 'back' | null>(null);
    const [toast, setToast] = useState('');
    const [sheetOffset, setSheetOffset] = useState(0);
    const [draggingSheet, setDraggingSheet] = useState(false);
    const [closingSheet, setClosingSheet] = useState(false);
    const sheetDrag = useRef<{ pointer: number; start: number; distance: number } | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
    function dismissSheet() {
        if (closeTimer.current) return;
        setClosingSheet(true);
        setToast('');
        closeTimer.current = setTimeout(() => {
            setScreen('2');
            setHistory(h => h.slice(0, Math.max(0, h.lastIndexOf('2'))));
            setDraft(null);
            setRetake(null);
            setSheetOffset(0);
            setClosingSheet(false);
            closeTimer.current = null;
        }, 220);
    }
    function startSheetDrag(event: PointerEvent<HTMLDivElement>) {
        if (closingSheet || event.button !== 0 || !(event.target as HTMLElement).closest('.sheet-handle-area')) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        sheetDrag.current = { pointer: event.pointerId, start: event.clientY, distance: 0 };
        setDraggingSheet(true);
    }
    function moveSheetDrag(event: PointerEvent<HTMLDivElement>) {
        const drag = sheetDrag.current;
        if (!drag || drag.pointer !== event.pointerId) return;
        drag.distance = Math.max(0, event.clientY - drag.start);
        setSheetOffset(drag.distance);
    }
    function endSheetDrag(event: PointerEvent<HTMLDivElement>) {
        const drag = sheetDrag.current;
        if (!drag || drag.pointer !== event.pointerId) return;
        sheetDrag.current = null;
        setDraggingSheet(false);
        if (event.type !== 'pointercancel' && drag.distance >= 100) dismissSheet();
        else setSheetOffset(0);
    }
    const scroll = useRef<HTMLDivElement>(null);
    useEffect(() => { scroll.current?.scrollTo(0, 0); }, [screen]);
    useEffect(() => {
        if (!toast)
            return;
        const timer = setTimeout(() => setToast(''), 3260);
        return () => clearTimeout(timer);
    }, [toast]);
    useEffect(() => {
        if (screen !== 'thanks')
            return;
        const timer = setTimeout(() => { setScreen('1'); setHistory([]); setDraft(null); setRecords([]); setLocation(null); setProduct(null); setRetake(null); setToast(''); }, 5000);
        return () => clearTimeout(timer);
    }, [screen]);
    function go(next: Screen) { setHistory(h => [...h, screen]); setScreen(next); }
    function back() { setScreen(history.at(-1) || '2'); setHistory(h => h.slice(0, -1)); setToast(''); }
    function patch(change: Partial<Draft>) { setDraft(d => d ? { ...d, ...change } : d); }
    function select(item: Item) { setDraft(newDraft(item)); setRetake(null); setProduct(null); go('3'); }
    function afterPhotos() {
        if (!draft)
            return;
        if (draft.offerSeen) {
            go('7');
            return;
        }
        const kind = draft.reason === 'Changed my mind' ? 'keep' : 'shop';
        patch({ offerSeen: kind });
        go(kind === 'keep' ? '6alt' : '6');
    }
    function capture(side: 'front' | 'back' | null) { setRetake(side); go(side === 'back' ? '5-back' : '5-front'); }
    function finish(completed: Draft) { setDraft(completed); setRecords(old => [...old.filter(d => d.item.id !== completed.item.id), completed]); go('8'); }
    function shutter() {
        if (screen === '5-front') {
            patch({ front: true });
            if (retake) {
                go('4.2');
                setToast('Photo looks good, lets review them');
            }
            else {
                go('5-back');
                setToast('Photo looks good, lets move onto the back');
            }
        }
        else {
            patch({ back: true });
            go('4.2');
            setToast('Photo looks good, lets review them');
        }
    }
    const modal = ['3', '3.1', '3.2', '4', '5-front', '5-back', '4.2'].includes(screen);
    return <div className="phone" data-current-screen={screen}>
    <div ref={scroll} className="screen-scroll" inert={modal}>
  {screen === '1' && <Login onContinue={() => go('2')}/>}
  {(screen === '2' || modal) && <ItemList returningIds={records.map(d => d.item.id)} onBack={records.length ? () => go('8') : back} onSelect={select}/>}
  {screen === '6' && draft && <Shopping draft={draft} onBack={back} onProduct={p => { setProduct(p); go('6.1'); }} onRefund={() => { patch({ outcome: 'refund', replacement: undefined }); go('7'); }} onExchange={() => { patch({ outcome: 'shop' }); go('7'); }}/>}
  {screen === '6.1' && draft && product && <ProductDetail key={product.id} draft={draft} product={product} onBack={back} onAdd={(waist, inseam, color) => { patch({ replacement: { product, waist, inseam, color } }); go('6'); }}/>}
  {screen === '6alt' && draft && <KeepOffer draft={draft} onBack={back} onKeep={() => finish({ ...draft, outcome: 'keep', replacement: undefined })} onReturn={() => { patch({ outcome: 'refund' }); go('7'); }}/>}
  {screen === '7' && draft && <LocationSection feeFor={candidate => calculate([...records.filter(d => d.item.id !== draft.item.id), draft], candidate).fee} initial={location} onBack={back} onSelect={selected => { setLocation(selected); finish(draft); }}/>}
  {screen === '8' && <Review records={records} location={location} onBack={back} onAdd={() => go('2')} onLocation={() => go('7')} onConfirm={() => go('thanks')}/>}
  {screen === 'thanks' && <ThankYou />}
 </div>{draft && modal && <div className={`return-flow ${closingSheet ? 'closing' : ''}`} data-screen={screen} onKeyDown={event => { if (event.key === 'Escape') dismissSheet(); }}>
    <div className="sheet-dim" onClick={dismissSheet}/>
    <div className={`return-flow-surface ${draggingSheet ? 'dragging' : ''}`} style={{ transform: closingSheet ? 'translateY(100%)' : `translateY(${sheetOffset}px)` }} onPointerDown={startSheetDrag} onPointerMove={moveSheetDrag} onPointerUp={endSheetDrag} onPointerCancel={endSheetDrag} onClick={event => { if (event.detail === 0 && (event.target as HTMLElement).closest('.sheet-handle-area')) dismissSheet(); }}><div className="stationary-return-banner"><ReturnBanner draft={draft} onBack={back} progress={screen==='3'?25:screen==='3.1'?33:screen==='3.2'?45:screen==='4.2'?95:screen==='5-back'?78:66}/></div>
  {(screen === '3' || screen === '3.1') && <ReasonSection fit={screen === '3.1'} draft={draft} onBack={back} onReason={reason => { patch({ reason }); go(reason === 'Item doesn’t fit as expected' ? '3.1' : '4'); }} onFit={fit => {
                    if (fit === 'Other' || (draft.offerSeen && draft.offerSeen !== 'size')) {
                        patch({ fit });
                        go('4');
                    }
                    else {
                        patch({ fit, offerSeen: 'size', waist: fit === 'It was too big' ? 25 : fit === 'It was too small' ? 27 : 26, inseam: fit === 'It was too long' ? 29 : fit === 'It was too short' ? 31 : 30 });
                        go('3.2');
                    }
                }}/>} 
  {screen === '3.2' && <SizeOffer draft={draft} onBack={back} onChange={patch} onAccept={() => { patch({ outcome: 'size' }); go('7'); }} onDecline={() => { patch({ outcome: 'refund' }); go('4'); }}/>}
  {(screen === '4' || screen === '4.2') && <PhotosSection review={screen === '4.2'} draft={draft} onBack={back} onCapture={capture} onSkip={afterPhotos} onContinue={afterPhotos}/>}
  {(screen === '5-front' || screen === '5-back') && <CameraSection draft={draft} side={screen === '5-front' ? 'front' : 'back'} onBack={back} onShutter={shutter}/>}
 </div></div>}{toast && <div key={toast} className="success-toast" role="status">
        <Icon name="success"/>{toast}</div>}</div>;
}
