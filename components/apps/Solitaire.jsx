'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from '../desktop/icons';
import { unlock } from '../../lib/achieve.mjs';
import { deal, draw, move, toFoundation, bestMove, won, red } from '../../lib/klondike.mjs';

const SUITS = ['spade', 'heart', 'diamond', 'club'];
const SUIT_NAME = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANK = [null, 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_NAME = [null, 'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const label = (c) => `${RANK_NAME[c.r]} of ${SUIT_NAME[c.s]}`;

function Card({ c, selected, onClick, onDoubleClick, onPointerDown, style }) {
  if (!c.up) return <div className="card card-back" style={style} aria-hidden="true" />;
  return (
    <button type="button" className={`card${red(c) ? ' is-red' : ''}${selected ? ' is-selected' : ''}`} style={style}
      onClick={onClick} onDoubleClick={onDoubleClick} onPointerDown={onPointerDown} aria-label={label(c)} aria-pressed={selected}>
      <span className="card-corner">{RANK[c.r]}<Icon name={SUITS[c.s]} size={10} /></span>
      <Icon name={SUITS[c.s]} size={26} className="card-pip" />
    </button>
  );
}

export default function Solitaire() {
  const [st, setSt] = useState(() => deal());
  const [sel, setSel] = useState(null); // a source: { pile, i, idx }
  const done = won(st);
  useEffect(() => { if (done) unlock('solitaire'); }, [done]);

  const apply = (next) => { if (next) setSt(next); setSel(null); return !!next; };
  const dragged = useRef(false); // true right after a drop, so the click that follows is ignored

  // Drag and drop: move the picked-up cards with CSS translate; on release, drop onto the
  // pile under the pointer ([data-drop]). A press that moves less than 6px stays a click.
  const grab = (src) => (e) => {
    if (e.button !== 0) return;
    const holder = e.currentTarget.parentElement;
    const kids = [...holder.children].filter((el) => el.classList.contains('card'));
    const els = src.pile === 'tab' ? kids.slice(src.idx) : [e.currentTarget];
    const start = { x: e.clientX, y: e.clientY };
    let moving = false, over = null;
    const target = (ev) => document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-drop]');
    const onMove = (ev) => {
      const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
      if (!moving && Math.hypot(dx, dy) < 6) return;
      if (!moving) { moving = true; setSel(null); els.forEach((el) => el.classList.add('is-dragging')); }
      els.forEach((el) => { el.style.translate = `${dx}px ${dy}px`; });
      const t = target(ev);
      if (t !== over) { over?.classList.remove('is-over'); t?.classList.add('is-over'); over = t; }
    };
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (!moving) return;
      els.forEach((el) => { el.style.translate = ''; el.classList.remove('is-dragging'); });
      over?.classList.remove('is-over');
      dragged.current = true;
      setTimeout(() => { dragged.current = false; }, 0);
      const t = target(ev);
      if (!t) return;
      const [pile, i] = t.dataset.drop.split('-');
      apply(move(st, src, { pile, i: +i }));
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Click a card: it jumps to its best legal spot. If it has none, it is selected,
  // so the next click on a pile chooses where it goes.
  const clickSource = (src) => {
    if (dragged.current) return;
    if (!sel) {
      if (apply(bestMove(st, src))) return;
      return setSel(src);
    }
    if (sel.pile === src.pile && sel.i === src.i && sel.idx === src.idx) return setSel(null);
    const to = src.pile === 'found' ? { pile: 'found', i: src.i } : src.pile === 'tab' ? { pile: 'tab', i: src.i } : null;
    if (!to || !apply(move(st, sel, to))) setSel(src);
  };
  const clickEmpty = (to) => { if (sel) apply(move(st, sel, to)); };
  const auto = (src) => apply(toFoundation(st, src));
  const isSel = (p, i, idx) => sel && sel.pile === p && sel.i === i && (p !== 'tab' || idx >= sel.idx);

  return (
    <div className="game solitaire">
      <div className="game-hud">
        <span>Moves <b>{st.moves}</b></span>
        <span className="sol-hint">Drag cards, or click one to send it to the best spot.</span>
        <button type="button" className="btn" onClick={() => { setSt(deal()); setSel(null); }}>New game</button>
      </div>
      <div className="felt">
        <div className="sol-top">
          <button type="button" className={`card ${st.stock.length ? 'card-back' : 'card-slot'}`} onClick={() => apply(draw(st))}
            aria-label={st.stock.length ? `Draw a card, ${st.stock.length} left` : 'Recycle the waste pile'} />
          <div className="sol-waste">
            {st.waste.length
              ? <Card c={st.waste[st.waste.length - 1]} selected={isSel('waste')} onClick={() => clickSource({ pile: 'waste' })} onDoubleClick={() => auto({ pile: 'waste' })} onPointerDown={grab({ pile: 'waste' })} />
              : <div className="card card-slot" aria-hidden="true" />}
          </div>
          <span className="sol-gap" />
          {st.found.map((p, i) => (
            <div key={i} className="sol-found" data-drop={`found-${i}`}>
              {p.length
                ? <Card c={p[p.length - 1]} selected={isSel('found', i)} onClick={() => clickSource({ pile: 'found', i })} onPointerDown={grab({ pile: 'found', i })} />
                : <button type="button" className="card card-slot" aria-label={`Empty foundation ${i + 1}`} onClick={() => clickEmpty({ pile: 'found', i })} />}
            </div>
          ))}
        </div>
        <div className="sol-tab">
          {st.tab.map((pile, i) => {
            let y = 0;
            return (
              <div key={i} className="sol-col" data-drop={`tab-${i}`}>
                {!pile.length && <button type="button" className="card card-slot" aria-label={`Empty column ${i + 1}`} onClick={() => clickEmpty({ pile: 'tab', i })} />}
                {pile.map((c, idx) => {
                  const top = y;
                  y += c.up ? 26 : 10;
                  return <Card key={`${c.s}-${c.r}`} c={c} style={{ top }} selected={isSel('tab', i, idx)}
                    onClick={() => clickSource({ pile: 'tab', i, idx })} onPointerDown={c.up ? grab({ pile: 'tab', i, idx }) : undefined}
                    onDoubleClick={() => idx === pile.length - 1 && auto({ pile: 'tab', i })} />;
                })}
              </div>
            );
          })}
        </div>
        {done && (
          <div className="game-card sol-win">
            <h3>Solved in {st.moves} moves.</h3>
            <button type="button" className="btn btn-primary" onClick={() => setSt(deal())}>Deal again</button>
          </div>
        )}
      </div>
    </div>
  );
}
