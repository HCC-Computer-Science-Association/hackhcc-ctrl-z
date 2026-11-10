import { faq, rules } from '../../content';

export default function Faq() {
  return (
    <div className="help">
      <h3>Frequently asked</h3>
      <div className="sunken">
        {faq.map(({ q, a }, i) => (
          <details key={q} open={i === 0}>
            <summary>{q}</summary>
            <p className="prose">{a}</p>
          </details>
        ))}
      </div>
      <h3>Rules <span className="tba">Draft</span></h3>
      <ol className="rules prose">
        {rules.map((r) => <li key={r}>{r}</li>)}
      </ol>
    </div>
  );
}
