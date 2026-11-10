import Icon from '../desktop/icons';
import { event, sponsors } from '../../content';

const BASE = process.env.NEXT_PUBLIC_BASE;

function Folder({ name, items, empty, render }) {
  return (
    <section className="folder">
      <h3><Icon name="sponsors" size={16} /> {name}</h3>
      <div className="sunken explorer">
        {items.length ? <ul className="grid">{items.map(render)}</ul> : <p className="empty">{empty}</p>}
      </div>
      <p className="statusline">{items.length} object(s)</p>
    </section>
  );
}

export default function Sponsors() {
  const contact = event.contactEmail
    ? <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
    : <span className="tba">contact TBA</span>;

  return (
    <div className="sponsors">
      <Folder name="Sponsors" items={sponsors}
        empty={<>This folder is empty. Sponsors are announced soon. Want your company here? Reach the organizers: {contact}.</>}
        render={(s) => (
          <li key={s.name}><a href={s.url} target="_blank" rel="noopener noreferrer">
            <img src={`${BASE}${s.logo}`} alt="" width="64" height="64" /><span>{s.name}</span>
          </a></li>
        )} />
    </div>
  );
}
