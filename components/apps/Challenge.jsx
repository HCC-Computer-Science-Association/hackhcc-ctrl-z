'use client';
import { useState } from 'react';
import { challenge } from '../../content';

const pick = (list, not) => {
  let v;
  do { v = list[Math.floor(Math.random() * list.length)]; } while (list.length > 1 && v === not);
  return v;
};

// "Can it run Doom?": a side challenge, with an idea roller that deals a random host and twist.
export default function Challenge({ onOpen }) {
  const [idea, setIdea] = useState({ target: challenge.targets[0], twist: challenge.twists[0] });
  const [spin, setSpin] = useState(0);

  const roll = () => {
    setIdea((cur) => ({ target: pick(challenge.targets, cur.target), twist: pick(challenge.twists, cur.twist) }));
    setSpin((n) => n + 1);
  };

  return (
    <div className="challenge">
      <header className="ch-head">
        <h3>Can it run Doom?</h3>
        <p className="prose">{challenge.pitch}</p>
      </header>

      <section className="ch-roller" aria-labelledby="ch-roll-title">
        <h4 id="ch-roll-title">Need an idea?</h4>
        <p className="ch-idea" key={spin} aria-live="polite">
          Run Doom on <strong>{idea.target}</strong>, <em>{idea.twist}</em>.
        </p>
        <div className="ch-actions">
          <button type="button" className="btn btn-primary" onClick={roll}>Roll another idea</button>
          <button type="button" className="btn" onClick={() => onOpen('doom')}>Warm up: play Freedoom here</button>
        </div>
      </section>

      <section aria-labelledby="ch-done-title">
        <h4 id="ch-done-title">Already done by other people</h4>
        <p className="ch-note">Beat these. Each one is a real attempt from the wider Doom-porting scene.</p>
        <ul className="ch-done">
          {challenge.doneBefore.map((d) => (
            <li key={d.where}><span className={`ch-tag ch-${d.kind}`}>{d.kind}</span>{d.where}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ch-rules-title">
        <h4 id="ch-rules-title">Rules <span className="tba">Draft</span></h4>
        <ol className="rules prose">
          {challenge.rules.map((r) => <li key={r}>{r}</li>)}
        </ol>
      </section>
    </div>
  );
}
