import { team } from '../../content';

const BASE = process.env.NEXT_PUBLIC_BASE;

// The organizers, one group box per crew. Photos "download" top to bottom like a 56k modem (CSS).
export default function Team() {
  const count = team.reduce((n, g) => n + g.people.length, 0);
  let n = 0; // running index, staggers the photo reveal across the whole window
  return (
    <div className="team">
      <p className="team-intro">The people putting HackHCC Ctrl Z together. Say hi at check-in.</p>
      {team.map((g, gi) => (
        <section className="crew" key={g.group} aria-labelledby={`crew-${gi}`}>
          <h3 id={`crew-${gi}`}>{g.group}</h3>
          <ul>
            {g.people.map((p) => (
              <li key={p.name} style={{ '--n': n++ }}>
                <span className="crew-photo"><img src={`${BASE}${p.photo}`} alt="" width="240" height="240" loading="lazy" decoding="async" /></span>
                <span className="crew-name">{p.name}</span>
                {p.nick && <small>goes by {p.nick}</small>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="statusline">{count} object(s)</p>
    </div>
  );
}
