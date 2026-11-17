// The official MLH Trust Badge for an MLH member event. Hotlinked from MLH's asset host and linking
// to mlh.io: never copy, redraw or recolour it. Bump SEASON once a year, then check the asset loads:
//   curl -sI https://s3.amazonaws.com/logged-assets/trust-badge/2027/mlh-trust-badge-2027-white.svg | head -1
// White is the colourway with the most contrast on the royal-blue desktop.
const SEASON = '2027';
const COLOR = 'white';

export default function MlhBadge() {
  return (
    <a className="mlh-badge" target="_blank" rel="noopener noreferrer"
      href={`https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=${SEASON}-season&utm_content=${COLOR}`}>
      <img src={`https://s3.amazonaws.com/logged-assets/trust-badge/${SEASON}/mlh-trust-badge-${SEASON}-${COLOR}.svg`}
        alt={`Major League Hacking ${SEASON} Hackathon Season`} width="393" height="688" />
    </a>
  );
}
