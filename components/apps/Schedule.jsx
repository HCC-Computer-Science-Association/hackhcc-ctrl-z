'use client';
import { useEffect, useState } from 'react';
import { event, schedule } from '../../content';
import { currentSlot } from '../../lib/time.mjs';

const fmtHour = (h) => `H+${h}`;

export default function Schedule() {
  const [live, setLive] = useState(-1);
  useEffect(() => {
    const tick = () => setLive(currentSlot(event.start, schedule));
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="schedule">
      <p className="notice">
        Sample schedule, not final. H+2 means two hours after kickoff. The real schedule comes once the date ({event.dateLabel || 'TBA'}) is set.
      </p>
      <div className="sunken">
        <table>
          <caption className="sr-only">Sample event schedule, by hours after kickoff</caption>
          <thead><tr><th scope="col">Hour</th><th scope="col">What</th></tr></thead>
          <tbody>
            {schedule.map((s, i) => (
              <tr key={s.hour} className={i === live ? 'is-live' : undefined} aria-current={i === live ? 'time' : undefined}>
                <td className="num">{fmtHour(s.hour)}</td>
                <td>
                  <strong>{s.title}</strong>{i === live && <span className="live-tag">Now</span>}
                  {s.detail && <span className="detail">{s.detail}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
