import type { ReactNode } from 'react';
import { BackButton } from './index';
import { ItemImage } from './ItemCard';
import type { Draft } from '../../model';
/** The repeated sheet/header is extracted from the 3.x–5.x Figma frames. */
export function Sheet({ progress, children, footer, className = '' }: {
    draft: Draft;
    onBack: () => void;
    progress: number;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}) {
    return <div className="sheet-layer">
    <section className={`sheet ${className}`} aria-label="Return item">
    <button type="button" className="sheet-handle-area" aria-label="Close return sheet"><span className="sheet-handle"/></button>
    <div className="sheet-header-space" aria-hidden="true"/>
    <div key={className === 'reason-sheet' ? 'reasons' : `${className}-${progress}`} className="sheet-body sheet-page-motion">{children}</div>{footer && <div key={`footer-${className}-${progress}`} className="sheet-footer sheet-page-motion">{footer}</div>}</section>
    </div>;
}

/** Mounted once by App so navigation only changes the progress width. */
export function ReturnBanner({draft,onBack,progress}:{draft:Draft;onBack:()=>void;progress:number}) { return (
<div className="return-banner">
    <BackButton onClick={onBack} sheet/>
    <ItemImage item={draft.item}/>
    <div className="return-banner-copy">
    <strong>Returning</strong>
    <p>{draft.item.name}</p>
    <div className="progress-track">
    <div style={{ width: `${progress}%` }}/>
    </div>
    </div>
    </div>
); }
